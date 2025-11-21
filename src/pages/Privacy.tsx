"use client";

import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Your privacy matters.
            This policy explains how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <p className="text-white/60 text-sm mb-6">Last Updated: November 2025</p>

          {/* Section 1 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction & Scope</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              This Privacy Policy explains how Virality Kit ("Company," "we," "us," or "our") collects, uses, processes, and protects your personal information and data. This policy applies to:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
              <li>Our website (https://viraitykit.com)</li>
              <li>Our mobile applications</li>
              <li>Our API services</li>
              <li>All related services and platforms</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              By accessing or using Virality Kit, you acknowledge that you have read and understood this Privacy Policy and consent to our data practices as described herein.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">2.1 Information Collected Directly from You</h3>
            <p className="text-white/70 leading-relaxed mb-3">Account Registration Information:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Email address, username and password</li>
              <li>First and last name</li>
              <li>Company name and website (if applicable)</li>
              <li>Phone number (optional)</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">2.2 Information from Connected Social Media Accounts</h3>
            <p className="text-white/70 leading-relaxed mb-3">When you connect your Instagram Business account, we collect:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Instagram Business account ID, username, and handle</li>
              <li>Account follower count and audience demographics</li>
              <li>Media content you create, upload, or schedule</li>
              <li>Captions, hashtags, and metadata</li>
              <li>Engagement metrics (likes, comments, shares, reach)</li>
              <li>Content performance analytics and audience insights</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">2.3 Automatically Collected Information</h3>
            <p className="text-white/70 leading-relaxed mb-3">Technical Data:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>IP address and geographic location</li>
              <li>Device type, operating system, and browser information</li>
              <li>Pages visited, time spent, and user interactions</li>
              <li>Session identifiers and cookies</li>
              <li>API access logs and request logs</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">3.1 Service Provision & Functionality</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Creating and managing your account</li>
              <li>Providing access to platform features and tools</li>
              <li>Processing your requests and transactions</li>
              <li>Delivering content creation and scheduling services</li>
              <li>Facilitating OAuth authentication with Instagram</li>
              <li>Sending scheduled posts to your Instagram account</li>
              <li>Generating analytics and performance reports</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">3.2 Service Improvement & Optimization</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Analyzing usage patterns to improve platform functionality</li>
              <li>Identifying and fixing bugs or technical issues</li>
              <li>Optimizing user interface and experience</li>
              <li>Training and improving AI models (using anonymized data where possible)</li>
              <li>Conducting A/B testing and feature evaluation</li>
              <li>Developing new features and services</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">3.3 Security & Compliance</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Detecting, preventing, and addressing fraud, abuse, or security risks</li>
              <li>Enforcing our Terms of Service and other agreements</li>
              <li>Complying with legal obligations and law enforcement requests</li>
              <li>Protecting our rights, privacy, safety, and property</li>
              <li>Verifying user identity and preventing unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">3.4 Marketing & Communications (with Consent)</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
              <li>Sending promotional emails and offers (only with your opt-in consent)</li>
              <li>Notifying you about new features or services</li>
              <li>Conducting marketing campaigns and outreach</li>
            </ul>
            <p className="text-white/90 font-semibold leading-relaxed">
              Note: You can opt out of marketing communications at any time by adjusting your preferences in your account settings or clicking the unsubscribe link in our emails.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing & Third Parties</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">4.1 Sharing with Instagram/Meta</h3>
            <p className="text-white/70 leading-relaxed mb-3">We share the following data with Instagram and Meta as required by their API:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Your authentication token and account verification status</li>
              <li>Basic account information (username, account ID, follower count)</li>
              <li>Content metadata when publishing or retrieving analytics</li>
              <li>Compliance information related to API usage</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">4.2 Service Providers & Processors</h3>
            <p className="text-white/70 leading-relaxed mb-3">We share limited data with third-party service providers who assist us:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li><span className="font-semibold">Cloud Infrastructure Providers:</span> For secure data storage and processing</li>
              <li><span className="font-semibold">Payment Processors:</span> For billing and transaction processing</li>
              <li><span className="font-semibold">Email Service Providers:</span> For sending transactional communications</li>
              <li><span className="font-semibold">Analytics Services:</span> For aggregated usage analytics</li>
              <li><span className="font-semibold">Security & Monitoring Services:</span> For fraud detection and security monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">4.3 Non-Sale of Personal Data</h3>
            <p className="text-white/90 font-semibold leading-relaxed mb-3">We explicitly commit to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>NOT selling, renting, or trading your personal data for monetary consideration</li>
              <li>NOT sharing your data with unaffiliated third parties for their direct marketing purposes</li>
              <li>NOT monetizing user data for financial gain</li>
              <li>NOT transferring data for behavioral advertising purposes without explicit opt-in consent</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide the Service, maintain account functionality, comply with legal obligations, and resolve disputes.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-white/90">Specific Retention Periods:</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Account information: Duration of account + 30 days after deletion/termination</li>
              <li>Content metadata: Duration of content + 90 days after deletion</li>
              <li>Analytics data: Up to 24 months (aggregated and anonymized after 12 months)</li>
              <li>Payment records: 7 years (as required by tax and financial regulations)</li>
              <li>Support communications: 2 years</li>
              <li>System logs: 90 days</li>
            </ul>

            <p className="text-white/70 leading-relaxed mb-3">Upon your request or account deletion:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Account information is deprovisioned from active systems</li>
              <li>Associated content metadata is archived</li>
              <li>Personal identifiers are removed from analytics</li>
              <li>API tokens are revoked and invalidated</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">6. Your Rights & Privacy Controls</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">6.1 GDPR Rights (EU Residents)</h3>
            <p className="text-white/70 leading-relaxed mb-3">If you are located in the European Union, you have the right to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li><span className="font-semibold">Access:</span> Request a copy of your personal data</li>
              <li><span className="font-semibold">Correction:</span> Request correction of inaccurate or incomplete data</li>
              <li><span className="font-semibold">Deletion:</span> Request deletion of your data (Right to Be Forgotten)</li>
              <li><span className="font-semibold">Portability:</span> Request your data in a portable, machine-readable format</li>
              <li><span className="font-semibold">Restriction:</span> Request restriction of data processing</li>
              <li><span className="font-semibold">Objection:</span> Object to processing of your data</li>
              <li><span className="font-semibold">Withdrawal of Consent:</span> Withdraw consent for data processing at any time</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">6.2 CCPA Rights (California Residents)</h3>
            <p className="text-white/70 leading-relaxed mb-3">If you are a California resident, you have the right to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li><span className="font-semibold">Know:</span> Request what personal information we collect, use, and share</li>
              <li><span className="font-semibold">Access:</span> Request access to your personal information</li>
              <li><span className="font-semibold">Delete:</span> Request deletion of your personal information</li>
              <li><span className="font-semibold">Opt-Out:</span> Opt out of the sale or sharing of your personal information</li>
              <li><span className="font-semibold">Non-Discrimination:</span> Receive the same service and pricing regardless of privacy choices</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">6.3 Exercising Your Rights</h3>
            <p className="text-white/70 leading-relaxed mb-3">To exercise any of the above rights:</p>
            <div className="space-y-2 text-white/70 mb-4">
              <p><span className="font-semibold text-white/90">Email:</span> <span className="text-purple-400">privacy@viraitykit.com</span></p>
              <p><span className="font-semibold text-white/90">Web Portal:</span> https://viraitykit.com/privacy-requests</p>
            </div>
            <p className="text-white/70 leading-relaxed">
              We will respond to verified requests within the timeframes required by applicable law (typically 30-45 days) and without requiring fees, except where permitted by law.
            </p>
          </div>

          {/* Section 7 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">7. Account Settings & Privacy Controls</h2>
            <p className="text-white/70 leading-relaxed mb-4">You can manage your privacy preferences through your account settings:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><span className="font-semibold">Communication Preferences:</span> Control marketing emails, notifications, and updates</li>
              <li><span className="font-semibold">Data Sharing:</span> Manage which data is shared with analytics services</li>
              <li><span className="font-semibold">Connection Permissions:</span> Review and revoke Instagram API access</li>
              <li><span className="font-semibold">Profile Visibility:</span> Control profile visibility and public information</li>
              <li><span className="font-semibold">Cookie Preferences:</span> Manage browser cookies and tracking preferences</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">8. Cookies & Tracking Technologies</h2>

            <h3 className="text-xl font-semibold mb-3 text-white/90">8.1 What Are Cookies?</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Cookies are small text files stored on your device that help us remember you and personalize your experience.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-white/90">8.2 Types of Cookies We Use</h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="font-semibold text-white/90 mb-2">Essential Cookies:</p>
                <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
                  <li>Session management and authentication</li>
                  <li>Security and fraud prevention</li>
                  <li>User preferences and language settings</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white/90 mb-2">Analytics Cookies:</p>
                <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
                  <li>Google Analytics for user behavior analysis</li>
                  <li>Usage patterns and feature engagement tracking</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white/90 mb-2">Marketing Cookies:</p>
                <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
                  <li>Tracking marketing campaign effectiveness</li>
                  <li>Retargeting and interest-based advertising (with consent)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-white/90">8.3 Cookie Consent & Management</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>First-time visitors see a cookie consent banner</li>
              <li>You can accept, reject, or customize cookie preferences</li>
              <li>Rejecting non-essential cookies does not affect core functionality</li>
              <li>Cookie preferences can be changed anytime in your account settings</li>
            </ul>
          </div>

          {/* Section 9 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">9. Security Measures</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We implement industry-standard security practices to protect your data:
            </p>

            <h3 className="text-xl font-semibold mb-3 text-white/90">9.1 Technical Security</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li><span className="font-semibold">Encryption:</span> Data encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
              <li><span className="font-semibold">Secure Servers:</span> Infrastructure hosted on secured, redundant servers</li>
              <li><span className="font-semibold">Access Controls:</span> Role-based access control and principle of least privilege</li>
              <li><span className="font-semibold">Authentication:</span> Multi-factor authentication (MFA) support for sensitive operations</li>
              <li><span className="font-semibold">API Security:</span> OAuth 2.0 for secure third-party integrations</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">9.2 Important Disclaimers</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li><span className="font-semibold">No Guarantee of Security:</span> While we employ strong security measures, no system is completely secure</li>
              <li><span className="font-semibold">Your Responsibility:</span> You are responsible for protecting your password and account credentials</li>
              <li><span className="font-semibold">Transmission Risk:</span> Data transmitted over the internet carries inherent risks</li>
            </ul>
          </div>

          {/* Section 10 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Virality Kit operates servers in multiple jurisdictions. If you are located outside the United States:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Your data may be transferred to and processed in the United States or other countries</li>
              <li>These countries may have different data protection laws than your home country</li>
              <li>By using Virality Kit, you consent to the transfer and processing of your data internationally</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">For EU Residents (GDPR):</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>International data transfers are based on Standard Contractual Clauses or other adequacy mechanisms</li>
              <li>We comply with the GDPR framework for data transfers</li>
              <li>You have the right to request information about our transfer mechanisms</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">11. Children's Privacy</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Virality Kit is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
              <li>We will promptly delete such information</li>
              <li>We will terminate the child's account</li>
              <li>We will not use the information for any purpose</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              If you believe we have collected information from a minor, please contact us immediately at <span className="text-purple-400">privacy@viraitykit.com</span>.
            </p>
          </div>

          {/* Section 12 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">12. Policy Updates & Notifications</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We may update this Privacy Policy periodically to reflect:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
              <li>Changes in our data practices</li>
              <li>New features or services</li>
              <li>Legal or regulatory requirements</li>
              <li>Security improvements</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-white/90">Notification of Changes:</h3>
            <ul className="list-disc list-inside text-white/70 space-y-2">
              <li>Material changes will be communicated via email or prominent website notification</li>
              <li>The "Last Updated" date at the top of this policy indicates the most recent revision</li>
              <li>Your continued use after changes constitutes acceptance of the updated policy</li>
            </ul>
          </div>

          {/* Section 13 */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">13. Contact Us & Privacy Requests</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              For questions about this Privacy Policy or to exercise your privacy rights:
            </p>

            <h3 className="text-xl font-semibold mb-3 text-white/90">Privacy Inquiries:</h3>
            <div className="space-y-2 text-white/70 mb-6">
              <p><span className="font-semibold text-white/90">Email:</span> <span className="text-purple-400">privacy@viraitykit.com</span></p>
              <p><span className="font-semibold text-white/90">Web Form:</span> https://viraitykit.com/contact-privacy</p>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-white/90">Data Subject Access Requests (GDPR/CCPA):</h3>
            <div className="space-y-2 text-white/70 mb-6">
              <p><span className="font-semibold text-white/90">Email:</span> <span className="text-purple-400">privacy-requests@viraitykit.com</span></p>
              <p><span className="font-semibold text-white/90">Web Portal:</span> https://viraitykit.com/privacy-requests</p>
              <p><span className="font-semibold text-white/90">Processing Time:</span> 30-45 days</p>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-white/90">EU Data Protection Authorities:</h3>
            <p className="text-white/70 leading-relaxed">
              EU residents may lodge complaints with their local data protection authority
            </p>
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

export default Privacy;
