"use client";

import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Please read these Terms carefully before using viralitykit.
            By accessing or using our platform, you agree to these terms.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <p className="text-white/60 text-sm mb-6">Last Updated: November 2025</p>

          {/* Section 1 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement entered into between you, whether individually or on behalf of an entity ("User," "you," or "your"), and Virality Kit ("Company," "we," "us," or "our").
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              By accessing, browsing, or using the Virality Kit website, mobile application, API services, or any related services (collectively, the "Service"), you acknowledge that you have read, understood, and agree to be bound by all provisions of these Terms. You also agree to comply with all applicable laws and regulations.
            </p>
            <p className="text-white/90 font-semibold leading-relaxed">
              If you do not agree to these Terms, you must immediately cease use of the Service and discontinue all access.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">2. User Eligibility & Account Requirements</h2>
            <p className="text-white/70 leading-relaxed mb-4">By using Virality Kit, you represent and warrant that:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
              <li>You are at least 18 years of age or the age of majority in your jurisdiction</li>
              <li>You have the legal authority to enter into these Terms</li>
              <li>You are not restricted, prohibited, or suspended by Instagram, Facebook, Meta, or any third-party social media platform</li>
              <li>You will not use Virality Kit for any unlawful, fraudulent, or deceptive purposes</li>
              <li>You own or control the Instagram Business or Creator accounts you connect to the Service</li>
              <li>You have obtained all necessary permissions and consents to connect such accounts to our Service</li>
            </ul>
            <p className="text-white/90 font-semibold leading-relaxed">
              Note on Account Types: Instagram's official APIs require Business or Creator accounts. Personal Instagram accounts cannot be authorized for programmatic posting through Virality Kit.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">3. Service Description</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Virality Kit is an AI-powered content creation and social media scheduling platform that enables users to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
              <li>Generate AI-created images, videos, and multimedia content</li>
              <li>Create, edit, and optimize social media posts and captions</li>
              <li>Schedule content for automatic posting to connected social media platforms</li>
              <li>Manage multiple social media accounts from a unified dashboard</li>
              <li>Analyze content performance and engagement metrics</li>
              <li>Use artificial intelligence tools to enhance content virality and reach</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              The Service is designed for content creators, digital marketers, small business owners, agencies, and social media professionals.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">4. User Permissions & Instagram API Integration</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">4.1 Granted Permissions</h3>
            <p className="text-white/70 leading-relaxed mb-3">When you connect your Instagram Business account to Virality Kit, you authorize us to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Access your Instagram Business account profile information</li>
              <li>Retrieve account insights and performance metrics</li>
              <li>Publish content (images, videos, carousels, stories, and reels) to your Instagram account</li>
              <li>Schedule posts for automated publishing at specified dates and times</li>
              <li>Manage and retrieve insights on published content</li>
              <li>Access basic metadata about your followers and audience engagement</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">4.2 Restricted Data Use</h3>
            <p className="text-white/70 leading-relaxed mb-3">You acknowledge and agree that:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>We will ONLY use your Instagram data for the purposes explicitly stated above</li>
              <li>We will NOT sell, rent, trade, or monetize your data or the data of your followers</li>
              <li>We will NOT use your data to build surveillance tools, profiling systems, or unauthorized tracking mechanisms</li>
              <li>We will NOT share your data with third parties except as required by law or with your explicit written consent</li>
              <li>We maintain strict data segregation and comply fully with Instagram's Platform Policy</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">4.3 Token & Credential Security</h3>
            <p className="text-white/70 leading-relaxed mb-3">You are fully responsible for:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Maintaining the confidentiality of your Instagram login credentials and API access tokens</li>
              <li>Any and all activities that occur under your account</li>
              <li>Immediately notifying us if your account credentials are compromised</li>
              <li>Revoking our API access through your Instagram Business account settings at any time</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">5. Prohibited Uses</h2>
            <p className="text-white/70 leading-relaxed mb-4">You agree that you will NOT use Virality Kit to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
              <li>Post, publish, or share content that violates Instagram's Community Guidelines</li>
              <li>Create, distribute, or facilitate spam, mass marketing, or unsolicited promotional content</li>
              <li>Engage in coordinated inauthentic behavior or artificial engagement manipulation</li>
              <li>Create false, misleading, or deceptive content designed to deceive or harm others</li>
              <li>Harass, threaten, bully, or defame any individual or organization</li>
              <li>Infringe upon intellectual property rights, copyrights, trademarks, or proprietary rights</li>
              <li>Post content containing hate speech, discrimination, violence, or illegal activity</li>
              <li>Create synthetic or deepfake content designed to deceive or impersonate others without proper disclosure</li>
              <li>Circumvent, bypass, or disable any security measures or access controls</li>
              <li>Reverse-engineer, decompile, or attempt to derive the source code of our Service</li>
              <li>Use the Service for surveillance, doxing, or unauthorized data collection</li>
              <li>Scrape, crawl, or automatically extract data from the Service or connected platforms without authorization</li>
              <li>Use the Service in violation of any applicable laws or regulations</li>
              <li>Resell, redistribute, or commercially exploit the Service without written permission</li>
            </ul>
            <p className="text-white/90 font-semibold leading-relaxed">
              Violation of these prohibited uses may result in immediate account suspension, API access revocation, and potential legal action.
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">6. Instagram & Meta Platform Compliance</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Virality Kit is built on and integrates with Instagram's official Graph API and is fully compliant with:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
              <li>Meta's Platform Terms</li>
              <li>Instagram's Platform Policy</li>
              <li>Instagram's Terms of Use</li>
              <li>Instagram's Community Guidelines</li>
              <li>Meta's Developer Policies</li>
            </ul>
            <p className="text-white/70 leading-relaxed mb-4">
              By using Virality Kit with Instagram, you implicitly agree to comply with all Meta and Instagram policies in addition to these Terms.
            </p>
            <p className="text-white/90 font-semibold leading-relaxed">
              Important: Meta may, at its sole discretion, suspend, revoke, or restrict API access to Virality Kit or to your account if either Virality Kit or your usage violates Meta's policies. We are not responsible for service interruptions resulting from Meta's enforcement actions.
            </p>
          </div>

          {/* Section 7 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">7. Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">7.1 Our Intellectual Property</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>All content, software, code, design, graphics, logos, and materials comprising Virality Kit are the exclusive property of the Company or our licensors</li>
              <li>These materials are protected by copyright, trademark, and other intellectual property laws</li>
              <li>You are granted a limited, non-exclusive, non-transferable license to use the Service solely for personal or business use in compliance with these Terms</li>
              <li>You may not modify, copy, reproduce, publish, transmit, display, or distribute our materials without prior written consent</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">7.2 User-Generated Content</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>You retain ownership of all content you create, upload, or generate through Virality Kit</li>
              <li>By using Virality Kit, you grant us a worldwide, non-exclusive, royalty-free license to use your content to provide, improve, and optimize the Service</li>
              <li>You represent and warrant that you own or have obtained all necessary rights to all User Content you generate or upload</li>
              <li>You are responsible for ensuring that your User Content does not infringe upon third-party rights</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">7.3 AI-Generated Content</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>AI-generated content created through Virality Kit remains your intellectual property</li>
              <li>You are responsible for ensuring that AI-generated content complies with applicable laws and does not infringe upon third-party rights</li>
              <li>You are solely responsible for verifying and fact-checking AI-generated content before publication</li>
              <li>We are not liable for any inaccuracies, errors, or legal violations in AI-generated content</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability & Disclaimers</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">8.1 "AS-IS" Service Provision</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              The Service is provided on an "AS-IS" and "AS-AVAILABLE" basis without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of the Service</li>
              <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
              <li>Warranties regarding third-party services, including Instagram and Meta</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">8.2 Limitation of Damages</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              To the maximum extent permitted by law, in no event shall the Company be liable for:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Direct, indirect, incidental, special, consequential, or punitive damages</li>
              <li>Lost profits, lost revenue, lost data, or business interruption</li>
              <li>Damages resulting from account suspension or data loss</li>
              <li>Damages resulting from unauthorized access or security breaches (except where directly caused by our negligence)</li>
              <li>Any damages exceeding the amount you paid for the Service in the past 12 months</li>
            </ul>
          </div>

          {/* Section 9 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless Virality Kit, its owners, officers, employees, agents, and licensors from any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising from or related to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms or applicable laws</li>
              <li>Your violation of Instagram's or Meta's policies</li>
              <li>Your User Content or AI-generated content</li>
              <li>Your violation of third-party rights</li>
              <li>Any actions or omissions by you in connection with the Service</li>
            </ul>
          </div>

          {/* Section 10 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">10. Account Termination & Suspension</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We reserve the right to terminate, suspend, or restrict your account and access to the Service if:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>You violate these Terms or applicable laws</li>
              <li>You violate Instagram's, Facebook's, or Meta's policies</li>
              <li>Your account is flagged for suspicious or fraudulent activity</li>
              <li>You use the Service for prohibited purposes</li>
              <li>We determine that your use poses a security or legal risk</li>
              <li>Your associated Instagram account is suspended or restricted by Meta</li>
            </ul>
            <p className="text-white/70 leading-relaxed mb-3">Upon termination:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Your access to the Service is immediately revoked</li>
              <li>Any API access tokens are invalidated</li>
              <li>We are not obligated to provide notice or refund any fees</li>
              <li>You remain liable for any content published through your account</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">11. Modifications to Terms & Service</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We reserve the right to modify these Terms, our Service offerings, fees, and functionality at any time without prior notice. Your continued use of the Service following modifications constitutes acceptance of the updated Terms.
            </p>
            <p className="text-white/70 leading-relaxed">
              Critical changes will be announced via email or prominent notification on our website. For significant changes, we will provide reasonable notice.
            </p>
          </div>

          {/* Section 12 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">12. Payment & Refunds</h2>
            <h3 className="text-xl font-semibold mb-3 text-white/90">12.1 Fees & Billing</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Pricing and billing terms are displayed on our website and in your account settings</li>
              <li>Fees are charged at the frequency specified in your selected plan</li>
              <li>All fees are exclusive of applicable taxes unless stated otherwise</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">12.2 Refund Policy</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Refunds are provided in accordance with our stated refund policy</li>
              <li>You may cancel your subscription at any time through your account settings</li>
              <li>Upon cancellation, API access is immediately revoked and content scheduling is halted</li>
            </ul>
          </div>

          {/* Section 13 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">13. Privacy & Data Protection</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Your use of Virality Kit is also governed by our Privacy Policy. By using the Service, you consent to our collection, use, and processing of personal data as described in the Privacy Policy.
            </p>
            <p className="text-white/70 leading-relaxed">
              We comply with applicable data protection laws including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other privacy regulations.
            </p>
          </div>

          {/* Section 14 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">14. Contact Information & Governing Law</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">14.1 Governing Law</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              These Terms are governed by and construed in accordance with applicable laws, without regard to conflict of laws provisions.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-white/90">14.2 Dispute Resolution</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Any disputes arising from these Terms shall be resolved through binding arbitration rather than litigation, except where prohibited by law.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-white/90">14.3 Contact Information</h3>
            <p className="text-white/70 leading-relaxed mb-3">
              For questions regarding these Terms or to report violations:
            </p>
            <div className="space-y-2 text-white/70">
              <p><span className="font-semibold text-white/90">Email:</span> <span className="text-purple-400">support@viraitykit.com</span></p>
              <p><span className="font-semibold text-white/90">Website:</span> https://viraitykit.com</p>
              <p><span className="font-semibold text-white/90">Support Portal:</span> https://viraitykit.com/support</p>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Acknowledgment</h2>
            <p className="text-white/70 leading-relaxed mb-4">By using Virality Kit, you acknowledge that:</p>
            <ul className="space-y-2 text-white/70">
              <li>✓ You have read and understood both the Terms of Service and Privacy Policy</li>
              <li>✓ You consent to the data practices described in this Privacy Policy</li>
              <li>✓ You comply with all applicable laws and Meta's policies when using the Service</li>
              <li>✓ You are responsible for all content posted through your account</li>
              <li>✓ You hold Virality Kit harmless from violations of Instagram's Community Guidelines</li>
            </ul>
          </div>

          <p className="text-white/50 text-sm text-center">
            Effective Date: November 2025 | Last Updated: November 13, 2025 | Version: 1.0
          </p>
        </div>
      </section>
    </div>
  );
};

export default Terms;
