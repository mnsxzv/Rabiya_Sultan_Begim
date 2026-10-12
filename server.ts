import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Historical AI Consultant endpoint using Gemini 3.1 Pro with High Thinking
app.post('/api/historical-consultant', async (req: Request, res: Response) => {
  try {
    const { question, topic } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Сұрақ мәтіні енгізілмеді.' });
      return;
    }

    if (!aiClient) {
      // Graceful fallback response when API key is unconfigured
      res.json({
        answer: `[Тарихи анықтама]: Рабия Сұлтан Бегім (1430-1485 жж.) — Ұлықбектің қызы, Әбілқайыр ханның жары. Оның Түркістандағы кесенесі Қожа Ахмет Ясауи кешені аумағында орналасқан және XV ғасырдың сәулет өнерінің жауһары болып табылады. Рабия Сұлтан Бегім көшпелі Дешті Қыпшақ пен отырықшы Мауереннахр арасындағы дипломатиялық және мәдени көпір қызметін атқарды. (Толық терең зерттеу үшін GEMINI_API_KEY орнату қажет).`,
        thinkingLevelUsed: 'offline-academic-mode',
      });
      return;
    }

    const systemInstruction = `Сіз — Қазақстанның ортағасырлық тарихы, Дешті Қыпшақ, Әмір Темір және оның ұрпақтары (әсіресе атақты астроном-ғалым Мұхаммед Тарағай Ұлықбек), Әбілқайыр хандығы және Қазақ хандығының қалыптасу дәуірі бойынша маманданған жетекші тарихшы-ғалым әрі сарапшысыз.

Басты нысан: Рабия Сұлтан Бегім — Ұлы даланың ықпалды ханшайымы, Ұлықбектің қызы, Әбілқайыр ханның жары, Көшкінші мен Сүйінішқожа хандардың анасы.
Оның тарихи рөлі:
1. Мауереннахр мен Дешті Қыпшақ арасындағы саяси, экономикалық және мәдени ынтымақтастықтың кепілі.
2. Әбілқайыр хан дүниеден өткеннен кейін тақ таласын тоқтатып, бейбіт дипломатия арқылы ел бірлігін сақтаушы.
3. Түркістандағы (Ясауи кешенінің шығысындағы) сегіз қырлы сәулетті кесенесі — XV ғасырдағы озық қала құрылысы мен түркілік-темірлік монументалды өнердің көрінісі.

Сұраққа қазақ тілінде терең ғылыми дәйекпен, нақты дереккөздерге («Тарих-и Рашиди», «Михман-наме-йи Бухара», «Фатх-наме») сүйене отырып, жүйелі әрі көркем түрде жауап беріңіз.`;

    const promptText = topic 
      ? `Тақырыптық бөлім: ${topic}\n\nҚолданушы сауалы: ${question}`
      : question;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: promptText,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    res.json({
      answer: response.text,
      thinkingLevelUsed: 'HIGH',
      model: 'gemini-3.1-pro-preview',
    });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({
      error: 'Тарихи сараптаманы өңдеу кезінде қате орын алды.',
      details: error?.message || 'Белгісіз қате',
    });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
