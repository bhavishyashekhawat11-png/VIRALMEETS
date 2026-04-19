import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, Share2, Settings, Cookie, RefreshCw, Mail } from 'lucide-react';

export const Privacy = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-6 py-24 pb-32"
    >
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
          <Shield className="w-8 h-8 text-rose-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">ViralMeets – Last Updated: April 18, 2026</p>
        </div>
      </div>

      <div className="grid gap-12 text-zinc-300">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Information We Collect</h2>
          </div>
          <div className="space-y-4 text-zinc-400 font-medium leading-relaxed">
            <p>We only collect information that is essential for providing you with the best viral content analysis experience:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-zinc-200">Account Information:</strong> Name, email address, and profile picture provided via Google Authentication.</li>
              <li><strong className="text-zinc-200">Content Data:</strong> The ideas, scripts, and video metadata you submit for analysis.</li>
              <li><strong className="text-zinc-200">Usage Data:</strong> How you interact with our platform, feature usage, and subscription status.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">How We Use Data</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            Your data is used to generate personalized AI insights, improve our scoring algorithms, process your subscription, and provide technical support. We use anonymized, aggregated data to improve the overall performance of the ViralMeets AI.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Authentication</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            We use <strong className="text-zinc-200">Firebase Authentication</strong> for secure sign-in. When you sign in with Google, we receive only the basic profile information permitted by Google's OAuth 2.0 flow. We never access your Google passwords or unrelated account data.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Data Storage</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            All user data and analysis results are stored securely in <strong className="text-zinc-200">Google Cloud Firestore</strong>. We implement industry-standard security measures to protect your information from unauthorized access, alteration, or destruction.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Data Sharing</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            <strong className="text-rose-400">We do not sell your personal data to third parties.</strong> We only share information with service providers (like Firebase or Stripe) essential for our operations, or when required by law to comply with legal processes or protect our rights.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Cookies</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            We use essential cookies for authentication and performance. These "session cookies" allow our system to remember your login state as you navigate the app. You can disable cookies in your browser, but parts of ViralMeets may stop functioning.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Updates</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Contact Us</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or how we handle your data, please reach out to us:
          </p>
          <a href="mailto:support@viralmeets.com" className="text-rose-400 font-black hover:text-rose-300 transition-colors">
            support@viralmeets.com
          </a>
        </section>
      </div>
    </motion.div>
  );
});

Privacy.displayName = 'Privacy';
export default Privacy;
