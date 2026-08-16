import { AIPlanResponse, BrainwaveType, VisualTheme } from '../types/index.ts';

const GEMINI_API_KEY_STORAGE = 'beatflow_gemini_api_key';

export function getStoredApiKey(): string {
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
}

export function saveStoredApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
  }
}

/**
 * Intelligent Rule-Based Fallback Engine
 * Generates context-aware focus regimens when offline or without an API key
 */
function generateFallbackPlan(prompt: string): AIPlanResponse {
  const p = prompt.toLowerCase();

  if (p.includes('dsa') || p.includes('leetcode') || p.includes('algorithm') || p.includes('debug') || p.includes('code')) {
    return {
      sessionName: 'Algorithmic Problem-Solving & High Cognition',
      recommendedDurationMinutes: 45,
      binaural: {
        carrierHz: 216,
        targetWave: 'gamma',
        beatHz: 40,
        volume: 0.45
      },
      soundscape: {
        rain: 0.75,
        thunder: 0.35,
        drone: 0.4,
        fire: 0.0,
        waves: 0.0
      },
      visualTheme: 'cyberpunk',
      focusQuote: 'The best way to inspect a problem is to break it down into atomic subproblems.',
      microGoals: [
        'Understand edge cases and constraint boundaries',
        'Draft brute force vs optimal time complexity',
        'Implement clean, idiomatic solution'
      ]
    };
  }

  if (p.includes('read') || p.includes('book') || p.includes('textbook') || p.includes('theory') || p.includes('exam') || p.includes('paper')) {
    return {
      sessionName: 'Deep Academic Absorption & Reading',
      recommendedDurationMinutes: 50,
      binaural: {
        carrierHz: 200,
        targetWave: 'alpha',
        beatHz: 10,
        volume: 0.35
      },
      soundscape: {
        rain: 0.8,
        thunder: 0.2,
        fire: 0.3,
        drone: 0.0,
        waves: 0.25
      },
      visualTheme: 'cosmic',
      focusQuote: 'Deep comprehension is built through focused, uninterrupted immersion.',
      microGoals: [
        'Review core concept definitions & diagrams',
        'Summarize key theorems in your own words',
        'Solve 2 practice questions without looking at solutions'
      ]
    };
  }

  if (p.includes('creative') || p.includes('design') || p.includes('brainstorm') || p.includes('idea') || p.includes('architecture')) {
    return {
      sessionName: 'Creative System Architecture & Flow',
      recommendedDurationMinutes: 30,
      binaural: {
        carrierHz: 180,
        targetWave: 'theta',
        beatHz: 6,
        volume: 0.4
      },
      soundscape: {
        rain: 0.3,
        thunder: 0.4,
        drone: 0.8,
        fire: 0.0,
        waves: 0.35
      },
      visualTheme: 'mandala',
      focusQuote: 'Great architectures emerge when intuition meets structural clarity.',
      microGoals: [
        'Map out core component responsibilities',
        'Sketch state and data flow diagrams',
        'Identify potential architectural bottlenecks'
      ]
    };
  }

  // Default balanced deep work
  return {
    sessionName: 'Deep Work Sprint & Focus',
    recommendedDurationMinutes: 25,
    binaural: {
      carrierHz: 216,
      targetWave: 'beta',
      beatHz: 18,
      volume: 0.35
    },
    soundscape: {
      rain: 0.6,
      thunder: 0.25,
      drone: 0.25,
      fire: 0.2,
      waves: 0.1
    },
    visualTheme: 'cosmic',
    focusQuote: 'Eliminate all distractions. One task, one goal, uninterrupted momentum.',
    microGoals: [
      'Define the primary deliverable for this sprint',
      'Execute single-task deep focus',
      'Review output and prepare next action'
    ]
  };
}

/**
 * Calls Google Gemini API with strict JSON schema to architect the session
 */
export async function generateFocusPlan(prompt: string, userApiKey?: string): Promise<AIPlanResponse> {
  const apiKey = userApiKey || getStoredApiKey();

  // If no API key is provided, use the smart context-aware fallback engine
  if (!apiKey) {
    // Simulate natural AI thinking delay (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));
    return generateFallbackPlan(prompt);
  }

  const systemInstruction = `You are BeatFlow AI Focus Architect, an expert neuro-acoustics engineer and deep work coach.
Analyze the user's study or work intention and return a strictly structured JSON configuration for an optimal focus session.
Available sound channels: rain (0-1), thunder (0-1), fire (0-1), drone (0-1), waves (0-1).
Available brainwaves: 'delta' (sleep), 'theta' (creative intuition 4-8Hz), 'alpha' (reading focus 8-14Hz), 'beta' (coding/analytical 14-30Hz), 'gamma' (peak intense problem solving/DSA 30-50Hz).
Available visual themes: 'cosmic', 'cyberpunk', 'mandala', 'zen'.
Always return a motivating, non-cliché focus quote tailored to their specific task, and 3 actionable micro-goals.`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `User Intention: "${prompt}". Configure the optimal soundscape, binaural frequency, visual theme, timer sprint, focus quote, and 3 micro-goals.`
          }
        ]
      }
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 0.7,
      response_schema: {
        type: 'OBJECT',
        properties: {
          sessionName: { type: 'STRING' },
          recommendedDurationMinutes: { type: 'INTEGER' },
          binaural: {
            type: 'OBJECT',
            properties: {
              carrierHz: { type: 'NUMBER' },
              targetWave: { type: 'STRING', enum: ['delta', 'theta', 'alpha', 'beta', 'gamma'] },
              beatHz: { type: 'NUMBER' },
              volume: { type: 'NUMBER' }
            },
            required: ['carrierHz', 'targetWave', 'beatHz', 'volume']
          },
          soundscape: {
            type: 'OBJECT',
            properties: {
              rain: { type: 'NUMBER' },
              thunder: { type: 'NUMBER' },
              fire: { type: 'NUMBER' },
              drone: { type: 'NUMBER' },
              waves: { type: 'NUMBER' }
            }
          },
          visualTheme: { type: 'STRING', enum: ['cosmic', 'cyberpunk', 'mandala', 'zen'] },
          focusQuote: { type: 'STRING' },
          microGoals: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          }
        },
        required: ['sessionName', 'recommendedDurationMinutes', 'binaural', 'soundscape', 'visualTheme', 'focusQuote', 'microGoals']
      }
    },
    system_instruction: {
      parts: [{ text: systemInstruction }]
    }
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      console.warn('Gemini API returned error, falling back to local engine:', response.status);
      return generateFallbackPlan(prompt);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return generateFallbackPlan(prompt);
    }

    const parsed: AIPlanResponse = JSON.parse(candidateText);

    // Validate and sanitize types
    return {
      sessionName: parsed.sessionName || 'Custom AI Session',
      recommendedDurationMinutes: Math.min(120, Math.max(5, parsed.recommendedDurationMinutes || 25)),
      binaural: {
        carrierHz: Math.min(350, Math.max(100, parsed.binaural?.carrierHz || 216)),
        targetWave: (parsed.binaural?.targetWave || 'gamma') as BrainwaveType,
        beatHz: Math.min(50, Math.max(0.5, parsed.binaural?.beatHz || 40)),
        volume: Math.min(1, Math.max(0, parsed.binaural?.volume || 0.4))
      },
      soundscape: {
        rain: parsed.soundscape?.rain ?? 0.6,
        thunder: parsed.soundscape?.thunder ?? 0.3,
        fire: parsed.soundscape?.fire ?? 0.0,
        drone: parsed.soundscape?.drone ?? 0.3,
        waves: parsed.soundscape?.waves ?? 0.0
      },
      visualTheme: (parsed.visualTheme || 'cyberpunk') as VisualTheme,
      focusQuote: parsed.focusQuote || 'Lock in and maintain atomic momentum.',
      microGoals: parsed.microGoals && parsed.microGoals.length > 0
        ? parsed.microGoals.slice(0, 3)
        : ['Set initial focus baseline', 'Execute core task', 'Review milestone']
    };
  } catch (error) {
    console.error('Gemini API fetch failed, using fallback plan:', error);
    return generateFallbackPlan(prompt);
  }
}
