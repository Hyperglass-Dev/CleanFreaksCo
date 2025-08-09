'use server';

import { smartJobAllocation, type SmartJobAllocationInput } from '@/ai/flows/smart-job-allocation';
import { chat, type ChatInput } from '@/ai/flows/assistant-chat-flow';
import { getCleaners, getJobs, getClients, getInvoices, getQuotes, getBills } from '@/lib/data';
import OpenAI from 'openai';

export async function getSmartAllocation(jobDescription: string) {
  try {
    const cleaners = await getCleaners();
    const input: SmartJobAllocationInput = {
      jobDescription,
      availableCleaners: cleaners.map(c => ({
        cleanerId: c.id,
        skills: c.skills,
        location: c.location,
        availability: c.availability,
      })),
      clientPreferences: 'Prefers experienced cleaners. Non-smoker.',
    };

    const result = await smartJobAllocation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get smart allocation.' };
  }
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = 'asst_xBRBPN1kuenXs1NNvtO3e6tw';

export async function getAssistantResponse(message: string) {
    try {
        // Get current business data to provide context
        const [clients, jobs, cleaners, invoices, quotes, bills] = await Promise.all([
            getClients(),
            getJobs(), 
            getCleaners(),
            getInvoices(),
            getQuotes(),
            getBills(),
        ]);

        // Prepare business context for Astra
        const businessContext = {
            totalClients: clients.length,
            activeJobs: jobs.filter(j => j.status === 'Scheduled').length,
            availableCleaners: cleaners.filter(c => c.availability === 'available').length,
            pendingInvoices: invoices.filter(i => i.status === 'Pending').length,
            totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
            recentClients: clients.slice(-5).map(c => ({ name: c.name, email: c.email })),
            todaysJobs: jobs.filter(j => {
                const today = new Date().toDateString();
                return new Date(j.date).toDateString() === today;
            }),
            overdueInvoices: invoices.filter(i => {
                const dueDate = new Date(i.dueDate);
                return i.status === 'Pending' && dueDate < new Date();
            }).length,
        };

        // Create a thread
        const thread = await openai.beta.threads.create();

        // Add the user message with business context
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: `Business Context: ${JSON.stringify(businessContext, null, 2)}

User Question: ${message}

Please respond as Astra, Dijana's proactive business assistant for Clean Freaks Co. Use the business context above to provide specific, actionable insights.`
        });

        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: ASSISTANT_ID,
        });

        // Wait for completion using proper parameter format
        // @ts-ignore - OpenAI types issue
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        
        while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // @ts-ignore - OpenAI types issue
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        if (runStatus.status === 'completed') {
            // Get the assistant's response
            const messages = await openai.beta.threads.messages.list(thread.id);
            const assistantMessage = messages.data[0];
            
            if (assistantMessage.content[0].type === 'text') {
                return { 
                    success: true, 
                    data: { response: assistantMessage.content[0].text.value }
                };
            }
        }

        return { success: false, error: 'Assistant run failed or returned unexpected format.' };
    } catch (error) {
        console.error('Assistant error:', error);
        return { success: false, error: 'Failed to get assistant response. Please check your OpenAI API key.' };
    }
}
