import React, { memo } from 'react';
import { motion } from 'motion/react';
import { FileText, CheckCircle, AlertCircle, UserCheck, ShieldCheck, Scale, History, Mail, XCircle } from 'lucide-react';

export const Terms = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-6 py-24 pb-32"
    >
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
          <FileText className="w-8 h-8 text-rose-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Terms of Service</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">ViralMeets – Last Updated: April 18, 2026</p>
        </div>
      </div>

      <div className="grid gap-12 text-zinc-300">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Acceptance of Terms</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            By accessing or using ViralMeets, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the service. Your continued use of the platform signifies your acceptance of these terms and any future modifications.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Use of the Service</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            ViralMeets provides AI-powered content analysis and predictions for social media platforms. You are granted a non-exclusive, non-transferable right to use the service for personal or business content planning purposes. Any unauthorized scraping, reverse engineering, or disruption of the service is strictly prohibited.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <UserCheck className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">User Responsibilities</h2>
          </div>
          <ul className="list-disc pl-6 space-y-4 text-zinc-400 font-medium leading-relaxed">
            <li>You are responsible for the content you submit and for ensuring it does not violate any laws or third-party rights.</li>
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account and any actions taken under your credentials.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Account Usage</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            ViralMeets is intended for use by individuals aged 13 and older. We reserve the right to suspend or terminate accounts that violate our community standards or engage in fraudulent activities.
          </p>
        </section>

        <section className="bg-rose-500/5 border border-rose-500/10 p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Subscription & Payments</h2>
          </div>
          <div className="space-y-4 text-zinc-400 font-medium leading-relaxed">
            <p>ViralMeets offers a <strong className="text-white text-lg">Pro Plan for ₹299/month</strong>. By subscribing, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automatic recurring billing until cancellation.</li>
              <li>Subscription fees are non-refundable unless required by law.</li>
              <li>We use Stripe for secure payment processing; we do not store your credit card information.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Limitations of Liability</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            ViralMeets is provided "as is." While our AI makes data-driven predictions, <strong className="text-zinc-200">we do not guarantee virality or specific performance metrics</strong>. We are not liable for any incidental, indirect, or consequential damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <History className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Changes to Terms</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed">
            We reserve the right to modify these terms at any time. Significant changes will be announced on our website. Your continued use of the service after such changes constitutes agreement to the new terms.
          </p>
        </section>

        <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-rose-400" />
            <h2 className="text-2xl font-black text-white">Contact Information</h2>
          </div>
          <p className="text-zinc-400 font-medium leading-relaxed mb-4">
            Questions about the Terms of Service should be sent to:
          </p>
          <a href="mailto:legal@viralmeets.com" className="text-rose-400 font-black hover:text-rose-300 transition-colors">
            legal@viralmeets.com
          </a>
        </section>
      </div>
    </motion.div>
  );
});

Terms.displayName = 'Terms';
export default Terms;
