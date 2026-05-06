require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API Key found');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // There isn't a direct listModels in the main SDK class usually, 
    // it's part of the admin/info API, but we can try to probe.
    console.log('Testing with gemini-1.5-flash...');
    try {
      const m = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('gemini-1.5-flash is available');
    } catch (e) {
      console.log('gemini-1.5-flash failed');
    }

    console.log('Testing with gemini-pro...');
    try {
      const m = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log('gemini-pro is available');
    } catch (e) {
      console.log('gemini-pro failed');
    }

    // Try to actually call a method to see which one works
    const testModel = async (name) => {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        await model.generateContent('Hi');
        return true;
      } catch (e) {
        console.log(`Model ${name} failed with: ${e.message}`);
        return false;
      }
    };

    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];
    for (const name of models) {
      console.log(`Checking ${name}...`);
      if (await testModel(name)) {
        console.log(`>>> SUCCESS: ${name} works!`);
        break;
      }
    }

  } catch (error) {
    console.error('General Error:', error);
  }
}

listModels();
