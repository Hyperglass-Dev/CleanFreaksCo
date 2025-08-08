// src/ai/flows/smart-job-allocation.ts
'use server';

/**
 * @fileOverview AI-powered smart job allocation flow.
 *
 * This flow suggests the optimal cleaner for a job based on skills, location, availability,
 * and client preferences.  It takes into account cleaner availability, skills, location,
 * and client preferences for optimal job assignment, highlighting any conflicts or inefficiencies.
 *
 * @param {SmartJobAllocationInput} input - The input data for the job allocation.
 * @returns {Promise<SmartJobAllocationOutput>} - A promise that resolves to the optimal job allocation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartJobAllocationInputSchema = z.object({
  jobDescription: z.string().describe('Description of the job including details like tasks, location, and timing.'),
  availableCleaners: z.array(
    z.object({
      cleanerId: z.string().describe('Unique identifier for the cleaner.'),
      skills: z.array(z.string()).describe('List of skills the cleaner possesses.'),
      location: z.string().describe('The current location of the cleaner.'),
      availability: z.string().describe('The availability schedule of the cleaner.'),
      clientPreferences: z.string().optional().describe('Any client preferences or notes about the cleaner.'),
    })
  ).describe('List of available cleaners with their skills, location and availability'),
  clientPreferences: z.string().optional().describe('Preferences of the client for the job.'),
});

export type SmartJobAllocationInput = z.infer<typeof SmartJobAllocationInputSchema>;

const SmartJobAllocationOutputSchema = z.object({
  optimalCleaner: z.string().describe('The ID of the optimal cleaner for the job.'),
  reasoning: z.string().describe('Explanation of why this cleaner was chosen.'),
  potentialConflicts: z.string().optional().describe('Any potential scheduling conflicts or inefficiencies.'),
});

export type SmartJobAllocationOutput = z.infer<typeof SmartJobAllocationOutputSchema>;

export async function smartJobAllocation(input: SmartJobAllocationInput): Promise<SmartJobAllocationOutput> {
  return smartJobAllocationFlow(input);
}

const smartJobAllocationPrompt = ai.definePrompt({
  name: 'smartJobAllocationPrompt',
  input: {schema: SmartJobAllocationInputSchema},
  output: {schema: SmartJobAllocationOutputSchema},
  prompt: `You are an AI assistant specialized in optimally assigning cleaning jobs to available cleaners.  Consider cleaner skills, location, availability, client preferences and job requirements to allocate the best cleaner for the job.

Job Description: {{{jobDescription}}}
Client Preferences: {{{clientPreferences}}}

Available Cleaners:
{{#each availableCleaners}}
  Cleaner ID: {{{cleanerId}}}
  Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Location: {{{location}}}
  Availability: {{{availability}}}
  Client Preferences: {{{clientPreferences}}}
{{/each}}

Based on the information above, determine the optimal cleaner for the job and explain your reasoning.  Highlight any potential scheduling conflicts or inefficiencies.
`, 
});

const smartJobAllocationFlow = ai.defineFlow(
  {
    name: 'smartJobAllocationFlow',
    inputSchema: SmartJobAllocationInputSchema,
    outputSchema: SmartJobAllocationOutputSchema,
  },
  async input => {
    const {output} = await smartJobAllocationPrompt(input);
    return output!;
  }
);
