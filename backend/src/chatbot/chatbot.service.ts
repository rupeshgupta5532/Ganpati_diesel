import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly geminiApiKey: string;
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.geminiApiKey =
      this.configService.get<string>('GEMINI_API_KEY') ||
      process.env.GEMINI_API_KEY ||
      '';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${this.geminiApiKey}`;
  }

  async generateResponse(userMessage: string, history: Array<{ role: string; text: string }> = []) {
    const systemPrompt = `You are Ganpati AI Assistant, an elite futuristic cyber-mechanic AI assistant for "New Shree Ganpati Diesel Service"—a premier diesel injection and automotive workshop.

Your core capabilities and domain knowledge:
- Workshop Specialization: Common Rail Diesel Injection (CRDI) calibration, High Pressure Pumps (Bosch, Delphi, Denso, Continental VDO), Electronic Injector testing & ultrasonic nozzle cleaning on our computerized Bosch EPS 205 test bench, Turbochargers, and ECU diagnostics.
- Supported Vehicles: Mahindra Scorpio, Thar, Bolero, Toyota Innova, Fortuner, Maruti Swift/Dzire diesel, Tata Safari, commercial diesel trucks, JCB, heavy machinery, generators.
- Symptoms & Diagnostics:
  * Black smoke: Fuel-air ratio imbalance, worn/dripping injector nozzles, turbo boost leak, clogged air filter, stuck EGR valve.
  * White smoke: Cold cylinder, delayed injection timing, coolant leak, glow plug malfunction, raw unburned diesel mist.
  * Blue smoke: Lube oil ingestion, turbocharger shaft oil seal failure, worn piston rings.
  * Hard starting / Extended cranking: Insufficient cranking rail pressure (< 250 Bar), back-leakage in injectors, faulty suction control valve (SCV/IMV).
  * Knocking / Chattering: Injector needle chattering, pressure pulsation, incorrect pilot injection.
- Workshop details:
  * Name: New Shree Ganpati Diesel Service
  * Location: Industrial Area Workshop
  * Phone/Dispatch: +91 98765 43210
  * Hours: Monday - Saturday 9:00 AM - 8:30 PM (Emergency on-call available)
  * Booking Portal: Available at /book-service

Tone & Persona:
- Futuristic, sci-fi cyber-mechanic style ([DIAGNOSTIC ENGAGED], [TELEMETRY ANALYSIS]).
- Authoritative, precise, technically sound yet friendly and practical.
- Keep formatting clean with bullet points and bold highlights.
- Recommend booking a computerized scan or injector test at New Shree Ganpati Diesel Service when appropriate.`;

    if (!this.geminiApiKey) {
      return this.getFallbackResponse(userMessage);
    }

    const contents: any[] = [];

    // Add prior conversation history if provided
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-6).forEach((h) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      });
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Gemini API error: ${response.status} ${errorText}`);
        return this.getFallbackResponse(userMessage);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        return this.getFallbackResponse(userMessage);
      }

      return {
        success: true,
        reply,
        model: 'gemini-3.5-flash-lite',
      };
    } catch (error) {
      this.logger.error('Failed to communicate with Gemini API', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string) {
    const q = userMessage.toLowerCase();
    let reply = `[DIAGNOSTIC TELEMETRY LOG]\n\nAnalysis for query: "${userMessage}".\n\nOur computerized Bosch EPS 205 test bench can identify microscopic wear in pumps, nozzles, and rail sensors with 99.4% precision. Visit New Shree Ganpati Diesel Service or book an inspection online.`;

    if (q.includes('black smoke') || (q.includes('smoke') && q.includes('black'))) {
      reply = `[DIAGNOSTIC ENGAGED: BLACK SMOKE / COMBUSTION FAULT]\n\nIncomplete diesel combustion detected. High fuel-air ratio caused by:\n• Leaking or worn injector nozzles (75% probability)\n• Turbocharger boost pressure leak or cracked intercooler pipe\n• Clogged intake air filter or stuck-open EGR valve.\n\nRecommended Action: Computerized EPS 205 injector spray calibration at New Shree Ganpati Diesel Service.`;
    } else if (q.includes('price') || q.includes('cost') || q.includes('rate')) {
      reply = `[TELEMETRY: SERVICE PRICING MATRIX]\n\n• CRDI Injector Testing & Digital Calibration: ₹400 - ₹800 / piece\n• Injector Complete Rebuilding: ₹1,500 - ₹3,500 / piece\n• High Pressure CRDI Pump Complete Servicing: ₹3,500 - ₹8,500\n• Turbocharger Core Replacement & Calibration: ₹4,000 - ₹12,000\n\nFinal quote provided after bench diagnostic scan.`;
    }

    return {
      success: true,
      reply,
      model: 'fallback-diesel-core',
    };
  }
}
