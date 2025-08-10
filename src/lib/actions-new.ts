'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAssistantResponseNew(userMessage: string): Promise<string> {
  try {
    console.log('Starting assistant response generation...');
    
    // Create a new thread
    console.log('Creating OpenAI thread...');
    const thread = await openai.beta.threads.create();
    console.log('Thread created with ID:', thread.id);
    
    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userMessage,
    });
    
    // Create and run the assistant
    console.log('Creating assistant run...');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_xBRBPN1kuenXs1NNvtO3e6tw',
    });
    console.log('Run created with ID:', run.id);
    
    // Wait for completion - TESTING BOTH PARAMETER ORDERS
    console.log('Testing parameter orders...');
    
    let runStatus;
    // Get the run status
    console.log('Retrieving run status...');
    runStatus = await (openai.beta.threads.runs.retrieve as any)(run.id, thread.id);
    
    // Poll for completion
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      console.log('Run status:', runStatus.status, '- waiting...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await (openai.beta.threads.runs.retrieve as any)(run.id, thread.id);
    }
    
    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data[0];
      
      if (assistantMessage.content[0].type === 'text') {
        return assistantMessage.content[0].text.value;
      }
    }
    
    throw new Error(`Run failed with status: ${runStatus.status}`);
    
  } catch (error) {
    console.error('Assistant error:', error);
    throw error;
  }
}
