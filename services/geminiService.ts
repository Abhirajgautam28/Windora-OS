import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const simulatePythonExecution = async (code: string, context: string[]): Promise<string> => {
  const ai = getAI();
  if (!ai) return "Error: API Key missing. Environment variable API_KEY not set.";

  const prompt = `
    You are a Python 3.10 REPL simulator running inside a web-based operating system called Windora OS. 
    
    CONTEXT (Previous lines):
    ${context.slice(-5).join('\n')}
    
    USER INPUT CODE:
    ${code}
    
    INSTRUCTIONS:
    1. Execute the code mentally.
    2. Return ONLY the stdout/stderr output or the return value representation.
    3. Do not include markdown code blocks (no \`\`\`).
    4. If it is a print statement, show the text.
    5. If it is a variable assignment, show nothing (empty string).
    6. If it is an expression (e.g., 2+2), show the result.
    7. If error, show a realistic Python traceback.
    8. Keep it extremely concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    return "Python Runtime Error: Connection failed.";
  }
};

export const getAssistantResponse = async (message: string): Promise<string> => {
  const ai = getAI();
  if (!ai) return "I'm unable to connect to the cloud servers right now.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are WindoraAI, the intelligent assistant built into Windora OS. You are helpful, concise, and knowledgeable about this operating system.",
      },
    });
    return response.text || "I didn't catch that.";
  } catch (error) {
    return "Sorry, I encountered an error processing your request.";
  }
};