const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generate email content based on campaign details
 */
exports.generateEmailContent = async (name, subject) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return `<h1>${subject}</h1><p>This is a placeholder for ${name}. Please set a valid GEMINI_API_KEY in your .env file to generate real content.</p>`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a professional marketing copywriter. Create a beautiful, engaging HTML email content for a campaign named "${name}" with the subject "${subject}". 
    The content should be in clean HTML (inline styles are okay, but use Tailwind-like structure). 
    Keep it professional, persuasive, and include placeholders for client names as {{name}}.
    Do not include <html> or <body> tags, just the content div.
    Make it look like a premium marketing email.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if any
    text = text.replace(/```html/g, '').replace(/```/g, '').trim();
    
    return text;
  } catch (error) {
    console.warn('Gemini Error, using fallback:', error.message);
    return `
      <!-- FALLBACK_MARKER -->
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">${subject}</h1>
          <p style="opacity: 0.9; margin-top: 10px;">Exclusive Update for ${name}</p>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #374151;">
          <p>Hi {{name}},</p>
          <p>We're excited to share some big news regarding our latest <strong>${name}</strong> initiative. Our team has been working tirelessly to bring you the best experience possible.</p>
          <div style="background: #f9fafb; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><em>"Our goal is to provide unparalleled value through innovation and dedication."</em></p>
          </div>
          <p>Click the button below to explore what's new and how it can benefit you today.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #6366f1; color: white; padding: 12px 30px; border-radius: 9999px; text-decoration: none; font-weight: bold; display: inline-block;">Explore Now</a>
          </div>
          <p>Best regards,<br>The Team</p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
          &copy; 2026 ${name}. All rights reserved. <br>
          You are receiving this because you're a valued member of our community.
        </div>
      </div>
    `;
  }
};
