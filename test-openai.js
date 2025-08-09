const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testParams() {
  const threadId = 'thread_test123';
  const runId = 'run_test456';
  
  try {
    // Test normal order (threadId, runId)
    console.log('Testing (threadId, runId)...');
    await openai.beta.threads.runs.retrieve(threadId, runId);
  } catch (error) {
    console.log('Normal order error:', error.message);
  }
  
  try {
    // Test reversed order (runId, threadId)
    console.log('Testing (runId, threadId)...');
    await openai.beta.threads.runs.retrieve(runId, threadId);
  } catch (error) {
    console.log('Reversed order error:', error.message);
  }
}

testParams();
