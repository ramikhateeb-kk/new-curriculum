import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { GoogleGenAI } from '@google/genai';

// Middleware for server-side Gemini queries
function geminiApiPlugin() {
  return {
    name: 'gemini-api-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/gemini', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { prompt, systemInstruction } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              // Return mock pedagogical responses if no API key is set
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                text: null,
                fallback: true,
                message: 'No GEMINI_API_KEY provided in environment'
              }));
              return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
            
            const response = await ai.models.generateContent({
              model,
              contents: prompt,
              config: systemInstruction ? { systemInstruction } : undefined
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ text: response.text }));
          } catch (err: any) {
            console.error('Gemini API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Gemini error' }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    geminiApiPlugin()
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  }
});
