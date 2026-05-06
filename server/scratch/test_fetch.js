require('dotenv').config();

async function testFetch() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('Filtered models:');
      data.models
        .map(m => m.name)
        .filter(name => name.includes('flash') || name.includes('pro'))
        .forEach(name => console.log(name));
    } else {
      console.error('Error status:', response.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFetch();
