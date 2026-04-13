import axios from "axios";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface AnalysisResult {
  score: number;
  niche: string;
  summary: string;
  hooks: string[];
  improvements: string[];
  hashtags: string[];
  predicted_metrics: {
    views: string;
    engagement: string;
    retention: string;
  };
  score_breakdown?: {
    hook_strength: number;
    engagement_potential: number;
    trend_alignment: number;
    clarity: number;
  };
  variations?: string[];
  best_format?: string;
  script?: {
    hook: string;
    body: string;
    ending: string;
  };
  viral_rewrite?: string;
  audience_drop_insights?: {
    point: string;
    reason: string;
  }[];
  first_3s_analysis?: {
    status: 'Strong' | 'Average' | 'Weak';
    issue: string;
    pro_tip: string;
  };
  retention_graph?: number[];
  algorithm_triggers?: {
    curiosity_gap: boolean;
    loop_potential: boolean;
    engagement_triggers: boolean;
    details: string;
  };
  viral_gaps?: string[];
  trend_timing?: {
    status: 'Post Now' | 'Wait' | 'Too Late';
    score: number;
    reasoning: string;
  };
  performance_forecast_detailed?: {
    views: string;
    engagement_rate: string;
    watch_time: string;
    details: string;
  };
  roi_score?: {
    status: 'High Return' | 'Low Return';
    reasoning: string;
  };
  audience_type?: {
    primary: string;
    secondary: string;
    details: string;
  };
  replay_value?: {
    score: 'Low' | 'Medium' | 'High';
    reasoning: string;
  };
  risk_check?: string[];
  virality_confidence?: {
    level: number;
    reasoning: string;
  };
  final_verdict?: {
    status: 'Post Now' | 'Improve Before Posting' | 'Not Ready Yet';
    explanation: string;
    action_steps: string[];
  };
}

const FALLBACK_RESULT: AnalysisResult = {
  score: 5,
  niche: "General",
  summary: "Analysis temporarily unavailable. Please try again.",
  hooks: [],
  improvements: [],
  hashtags: [],
  predicted_metrics: {
    views: "unknown",
    engagement: "unknown",
    retention: "unknown"
  },
  score_breakdown: {
    hook_strength: 5,
    engagement_potential: 5,
    trend_alignment: 5,
    clarity: 5
  },
  variations: [],
  best_format: "General",
  script: {
    hook: "",
    body: "",
    ending: ""
  },
  viral_rewrite: "",
  audience_drop_insights: [],
  first_3s_analysis: {
    status: 'Average',
    issue: "Analysis unavailable",
    pro_tip: "Try again later"
  },
  retention_graph: [100, 90, 80, 70, 60, 50, 45, 40, 35, 30],
  algorithm_triggers: {
    curiosity_gap: false,
    loop_potential: false,
    engagement_triggers: false,
    details: "Analysis unavailable"
  },
  viral_gaps: [],
  trend_timing: {
    status: 'Wait',
    score: 5,
    reasoning: "Analysis unavailable"
  },
  performance_forecast_detailed: {
    views: "0",
    engagement_rate: "0%",
    watch_time: "0s",
    details: "Analysis unavailable"
  },
  roi_score: {
    status: 'Low Return',
    reasoning: "Analysis unavailable"
  },
  audience_type: {
    primary: "General",
    secondary: "General",
    details: "Analysis unavailable"
  },
  replay_value: {
    score: 'Low',
    reasoning: "Analysis unavailable"
  },
  risk_check: [],
  virality_confidence: {
    level: 50,
    reasoning: "Analysis unavailable"
  },
  final_verdict: {
    status: 'Not Ready Yet',
    explanation: "Analysis unavailable",
    action_steps: []
  }
};

function safeParseJSON(text: string): AnalysisResult {
  try {
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    // Find the first '{' and last '}' to handle potential text before/after
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("No JSON found");
    const jsonStr = cleaned.substring(start, end + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Parse Error:", e, "Raw text:", text);
    return FALLBACK_RESULT;
  }
}

export interface UserProfile {
  experience: string;
  followers: string;
  audienceAge: string;
  categories: string[];
  problem: string;
  goal: string;
}

export interface ProfileInsights {
  summary: string;
  insight1: string;
  insight2: string;
  actionableDirection: string;
  emotionalHook: string;
}

export interface VideoIntelligenceResult {
  scrollTestInsight: string;
  predictions: {
    viewsRange: string;
    engagementProbability: string;
    sharePotential: string;
    savePotential: string;
    dropOffPoint: string;
    retentionCurve: number[];
  };
  optimizationPlan: {
    openingImpact: { issue: string; whyItMatters: string; fix: string };
    textOverlayStrategy: { issue: string; whyItMatters: string; fix: string };
    soundSelection: { issue: string; whyItMatters: string; fix: string };
    narrativeFlow: { issue: string; whyItMatters: string; fix: string };
    visualAttentionDesign: { issue: string; whyItMatters: string; fix: string };
    trendCompatibility: { issue: string; whyItMatters: string; fix: string };
    audienceTrigger: { issue: string; whyItMatters: string; fix: string };
  };
  creatorDNA: {
    strengths: string[];
    weaknesses: string[];
    patterns: string[];
  };
}

export async function analyzeIdeaQuick(
  idea: string, 
  platform: string, 
  feedbackStyle: string, 
  niche: string,
  userProfile: UserProfile | null,
  mediaContext?: string,
  mediaFile?: { mimeType: string; data: string }
): Promise<AnalysisResult> {
  const prompt = `
STRICT JSON RESPONSE REQUIRED.
Evaluate this content idea for ${platform} targeting the ${niche} niche.
Idea: "${idea}"
Feedback Style: ${feedbackStyle}

RULES:
- Do NOT include markdown (no ###, **, etc.)
- Do NOT include explanations outside JSON
- Do NOT include text before or after JSON

REQUIRED FORMAT:
{
  "score": number,
  "niche": "string",
  "summary": "string",
  "hooks": ["string"],
  "improvements": ["string"],
  "hashtags": ["string"],
  "predicted_metrics": {
    "views": "low/medium/high",
    "engagement": "low/medium/high",
    "retention": "low/medium/high"
  },
  "score_breakdown": {
    "hook_strength": number (1-10),
    "engagement_potential": number (1-10),
    "trend_alignment": number (1-10),
    "clarity": number (1-10)
  }
}
`;

  const contents: any[] = [prompt];
  if (mediaFile) {
    contents.push({
      inlineData: {
        data: mediaFile.data,
        mimeType: mediaFile.mimeType
      }
    });
  }

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: contents.map(c => typeof c === 'string' ? { text: c } : c) }
  });
  
  return safeParseJSON(response.text);
}

export async function analyzeIdeaDetailed(
  quickResult: AnalysisResult,
  idea: string, 
  platform: string, 
  feedbackStyle: string, 
  niche: string,
  userProfile: UserProfile | null,
  mediaContext?: string,
  mediaFile?: { mimeType: string; data: string }
): Promise<AnalysisResult> {
  // For now, we'll just return the quick result or do a deeper pass if needed.
  // The user wants "Deep analysis uses SAME JSON structure".
  
  const prompt = `
STRICT JSON RESPONSE REQUIRED.
Perform a DEEP analysis and content optimization for this content idea for ${platform} targeting the ${niche} niche.
Idea: "${idea}"
Quick Result: ${JSON.stringify(quickResult)}

RULES:
- Do NOT include markdown (no ###, **, etc.)
- Do NOT include explanations outside JSON
- Do NOT include text before or after JSON

REQUIRED FORMAT:
{
  "score": number,
  "niche": "string",
  "summary": "string",
  "hooks": ["string (generate 5 high-impact hooks)"],
  "improvements": ["string"],
  "hashtags": ["string"],
  "predicted_metrics": {
    "views": "low/medium/high",
    "engagement": "low/medium/high",
    "retention": "low/medium/high"
  },
  "score_breakdown": {
    "hook_strength": number,
    "engagement_potential": number,
    "trend_alignment": number,
    "clarity": number
  },
  "variations": ["string (3-4 different versions of the idea)"],
  "best_format": "string (e.g., Storytelling, Fast cuts, Educational, Relatable)",
  "script": {
    "hook": "string",
    "body": "string",
    "ending": "string"
  },
  "viral_rewrite": "string (full rewritten viral version)",
  "audience_drop_insights": [
    { "point": "string (e.g., first 2 seconds)", "reason": "string" }
  ],
  "first_3s_analysis": {
    "status": "Strong/Average/Weak",
    "issue": "string",
    "pro_tip": "string"
  },
  "retention_graph": [number (10 values representing % retention over time, starting at 100)],
  "algorithm_triggers": {
    "curiosity_gap": boolean,
    "loop_potential": boolean,
    "engagement_triggers": boolean,
    "details": "string"
  },
  "viral_gaps": ["string"],
  "trend_timing": {
    "status": "Post Now/Wait/Too Late",
    "score": number (1-10),
    "reasoning": "string"
  },
  "performance_forecast_detailed": {
    "views": "string",
    "engagement_rate": "string",
    "watch_time": "string",
    "details": "string"
  },
  "roi_score": {
    "status": "High Return/Low Return",
    "reasoning": "string"
  },
  "audience_type": {
    "primary": "string",
    "secondary": "string",
    "details": "string"
  },
  "replay_value": {
    "score": "Low/Medium/High",
    "reasoning": "string"
  },
  "risk_check": ["string"],
  "virality_confidence": {
    "level": number (1-100),
    "reasoning": "string"
  },
  "final_verdict": {
    "status": "Post Now/Improve Before Posting/Not Ready Yet",
    "explanation": "string",
    "action_steps": ["string"]
  }
}
`;

  const contents: any[] = [prompt];
  if (mediaFile) {
    contents.push({
      inlineData: {
        data: mediaFile.data,
        mimeType: mediaFile.mimeType
      }
    });
  }

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: contents.map(c => typeof c === 'string' ? { text: c } : c) }
  });
  
  return safeParseJSON(response.text);
}

export async function generateProfileInsights(profile: Partial<UserProfile>): Promise<ProfileInsights> {
  const prompt = `Analyze this creator's profile and generate highly personalized insights. Followers: ${profile.followers}, Age: ${profile.audienceAge}, Problem: ${profile.problem}, Goal: ${profile.goal}, Experience: ${profile.experience}. Provide JSON: {summary, insight1, insight2, actionableDirection, emotionalHook}`;
  
  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });
  const text = response.text;
  try {
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("No JSON found");
    return JSON.parse(cleaned.substring(start, end + 1));
  } catch (e) {
    return {
      summary: "Profile analysis unavailable",
      insight1: "Focus on consistent posting",
      insight2: "Engage with your audience",
      actionableDirection: "Create more content",
      emotionalHook: "Connect with your viewers"
    };
  }
}

export async function executeQuickAction(
  actionName: string,
  idea: string,
  niche: string,
  platform: string
): Promise<string[]> {
  const prompt = `Improve content idea using action: "${actionName}". Idea: "${idea}", Niche: ${niche}, Platform: ${platform}. Provide JSON array of 2-3 strings.`;
  
  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });
  const text = response.text;
  try {
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error("No JSON found");
    return JSON.parse(cleaned.substring(start, end + 1));
  } catch (e) {
    return ["Try a different approach", "Add more value"];
  }
}

export async function analyzeVideoIntelligence(
  videoData: string,
  mimeType: string,
  pastAnalyses: any[]
): Promise<AnalysisResult> {
  const prompt = `
STRICT JSON RESPONSE REQUIRED.
You are an elite TikTok/Reels viral content strategist.
Analyze the provided video.
Also, here is a summary of the creator's past videos' performance: ${JSON.stringify(pastAnalyses)}

RULES:
- Do NOT include markdown (no ###, **, etc.)
- Do NOT include explanations outside JSON
- Do NOT include text before or after JSON

REQUIRED FORMAT:
{
  "score": number,
  "niche": "string",
  "summary": "string",
  "hooks": ["string"],
  "improvements": ["string"],
  "hashtags": ["string"],
  "predicted_metrics": {
    "views": "low/medium/high",
    "engagement": "low/medium/high",
    "retention": "low/medium/high"
  },
  "score_breakdown": {
    "hook_strength": number,
    "engagement_potential": number,
    "trend_alignment": number,
    "clarity": number
  },
  "first_3s_analysis": {
    "status": "Strong/Average/Weak",
    "issue": "string",
    "pro_tip": "string"
  },
  "retention_graph": [number (10 values representing % retention over time, starting at 100)],
  "algorithm_triggers": {
    "curiosity_gap": boolean,
    "loop_potential": boolean,
    "engagement_triggers": boolean,
    "details": "string"
  },
  "viral_gaps": ["string"],
  "trend_timing": {
    "status": "Post Now/Wait/Too Late",
    "score": number (1-10),
    "reasoning": "string"
  },
  "performance_forecast_detailed": {
    "views": "string",
    "engagement_rate": "string",
    "watch_time": "string",
    "details": "string"
  },
  "roi_score": {
    "status": "High Return/Low Return",
    "reasoning": "string"
  },
  "audience_type": {
    "primary": "string",
    "secondary": "string",
    "details": "string"
  },
  "replay_value": {
    "score": "Low/Medium/High",
    "reasoning": "string"
  },
  "risk_check": ["string"],
  "virality_confidence": {
    "level": number (1-100),
    "reasoning": "string"
  },
  "final_verdict": {
    "status": "Post Now/Improve Before Posting/Not Ready Yet",
    "explanation": "string",
    "action_steps": ["string"]
  }
}
`;

  const contents: any[] = [prompt];
  if (videoData) {
    contents.push({
      inlineData: {
        data: videoData,
        mimeType: mimeType
      }
    });
  }

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: contents.map(c => typeof c === 'string' ? { text: c } : c) }
  });
  
  return safeParseJSON(response.text);
}
