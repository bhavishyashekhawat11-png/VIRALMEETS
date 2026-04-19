export type Platform = 'TikTok' | 'Reels' | 'Shorts';
export type Step = 'landing' | 'onboarding' | 'home' | 'loading' | 'result' | 'resetting' | 'deep_analysis' | 'manage_subscription' | 'privacy' | 'terms' | 'refund' | 'contact' | 'settings' | 'features' | 'pricing' | 'about';
export type PastIdea = { id: string, idea: string, score: number, timestamp: number };

declare global {
  interface Window {
    Razorpay: any;
  }
}
