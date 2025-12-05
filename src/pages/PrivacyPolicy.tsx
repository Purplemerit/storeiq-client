import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DarkVeil from "@/components/DarkVeil";

const Hero: React.FC = () => {
  return (
    <section className="flex w-full max-w-[1264px] flex-col items-start relative box-border m-0 p-0 mx-auto max-md:max-w-full max-md:px-6 max-md:py-0 max-sm:px-4 max-sm:py-0">
      <div className="flex w-full flex-col items-start relative box-border mb-16 m-0 p-0 max-md:mb-12">
        <div className="flex flex-col items-center w-full relative box-border m-0 p-0 mt-20 max-md:mt-10">
          <div className="flex flex-col justify-center items-center gap-6 relative box-border m-0 p-0 max-md:gap-4">
            <div className="flex flex-col items-start relative box-border m-0 p-0">
              <div className="text-white text-base font-bold leading-4 tracking-[0.16px] uppercase relative box-border m-0 p-0">
                EFFECTIVE DATE: OCTOBER 29, 2025
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 relative box-border m-0 p-0 max-md:gap-4">
              <div className="flex max-w-[928px] flex-col items-center relative box-border m-0 p-0">
                <h1 className="text-center text-[64px] font-semibold leading-[76.8px] tracking-[-2.56px] bg-clip-text relative box-border m-0 p-0 text-white max-md:text-5xl max-md:leading-[58px] max-sm:text-4xl max-sm:leading-[46px]">
                  Privacy Policy
                </h1>
              </div>

              <div className="flex max-w-[636px] flex-col items-start relative box-border m-0 p-0 px-4">
                <div className="flex flex-col items-center relative box-border m-0 p-0">
                  <p className="w-full text-[#CACFD8] text-center text-lg font-normal leading-[27px] tracking-[-0.18px] relative box-border m-0 p-0 max-md:text-base max-md:leading-6">
                    This Privacy Policy explains how we collect, use, disclose,
                    and safeguard your information when you visit our website or
                    use our services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const PolicySection: React.FC<PolicySectionProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <section className={`w-full ${className}`}>
      <div className="flex w-full flex-col items-start relative box-border mb-4 m-0 p-0">
        <h2 className="text-white text-2xl font-semibold leading-[33.6px] tracking-[-0.36px] relative box-border m-0 p-0 max-md:text-xl max-md:leading-7 max-sm:text-lg max-sm:leading-[25px]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
};

interface ListItemProps {
  children: React.ReactNode;
  nested?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ children, nested = false }) => {
  const baseClasses =
    "text-[#CACFD8] text-base font-normal leading-[25.6px] relative box-border m-0 p-0";
  const containerClasses = nested
    ? "flex w-full flex-col items-start relative box-border m-0 p-0"
    : "flex w-full flex-col items-start relative box-border m-0 p-0";

  return (
    <div className={containerClasses}>
      <p className={baseClasses}>{children}</p>
    </div>
  );
};

const PolicyContent: React.FC = () => {
  return (
    <main className="w-full max-w-[757px] relative box-border m-0 p-0 mx-auto max-md:max-w-full max-md:px-6 max-md:py-0 max-sm:px-4 max-sm:py-0">
      <PolicySection title="Attention!">
        <div className="flex w-full flex-col items-start relative box-border mb-[38px] m-0 p-0 max-md:mb-8">
          <p className="w-full text-[#CACFD8] text-base font-normal leading-[25.6px] relative box-border m-0 p-0">
            Please carefully review the following terms before using the Viralitykit
            platform. By accessing or using Viralitykit, you acknowledge that you
            have read, understood, and agree to be bound by these terms. If you
            do not agree with any part of these terms, you are prohibited from
            using the platform.
          </p>
        </div>
      </PolicySection>

      <PolicySection title="Website Access" className="pt-[38px] max-md:pt-8">
        <div className="flex flex-col items-start gap-3 relative box-border mb-[38px] m-0 p-0 max-md:mb-8">
          <ListItem>
            You agree to use this platform in compliance with all applicable
            laws and regulations.
          </ListItem>

          <div className="w-full relative box-border m-0 p-0">
            <div className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative box-border mb-3 m-0 p-0">
              You are prohibited from:
            </div>
            <div className="flex flex-col justify-center items-start gap-3 relative box-border m-0 pl-5 p-0 max-sm:pl-4">
              <ListItem nested>
                Using the platform to distribute malware or engage in any
                malicious activity.
              </ListItem>
              <ListItem nested>
                Circumventing security measures or attempting to access data
                without authorization.
              </ListItem>
            </div>
          </div>
        </div>
      </PolicySection>

      <PolicySection
        title="Proprietary Rights"
        className="pt-[38px] max-md:pt-8"
      >
        <div className="flex w-full flex-col items-start gap-3 relative box-border mb-[38px] m-0 p-0 max-md:mb-8">
          <ListItem>
            All content on this website, including text, images, graphics, and
            logos, is the property of Viralitykit or its licensors and is protected
            by copyright and other intellectual property laws.
          </ListItem>
          <ListItem>
            You may not reproduce, distribute, or create derivative works from
            any content without prior written permission.
          </ListItem>
        </div>
      </PolicySection>

      <PolicySection title="Member Content" className="pt-[38px] max-md:pt-8">
        <div className="flex w-full flex-col items-start gap-3 relative box-border mb-[38px] m-0 p-0 max-md:mb-8">
          <ListItem>
            When you share content on Viralitykit, you grant us permission to use,
            modify, and share it.
          </ListItem>
          <ListItem>
            All submissions must comply with the law and respect the rights of
            others. Do not post anything that is harmful, illegal, or violates
            another's rights.
          </ListItem>
        </div>
      </PolicySection>

      <PolicySection title="Liability Clause" className="pt-[38px] max-md:pt-8">
        <div className="flex w-full flex-col items-start relative box-border mb-4 m-0 p-0">
          <p className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative box-border m-0 p-0">
            To the fullest extent permitted by law:
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-3 relative box-border mb-[38px] m-0 pl-5 p-0 max-md:mb-8 max-sm:pl-4">
          <ListItem>
            Viralitykit assumes no liability for damages incurred while using our
            platform. Use Viralitykit at your own risk.
          </ListItem>
          <ListItem>
            This includes all types of damages, whether foreseeable or not.
          </ListItem>
        </div>
      </PolicySection>

      <PolicySection title="External Links" className="pt-[38px] max-md:pt-8">
        <div className="flex w-full flex-col items-start relative box-border mb-[38px] m-0 p-0 max-md:mb-8">
          <p className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative box-border m-0 p-0">
            Our site may contain links to external websites, but we do not
            control them. We are not responsible for their content or actions.
            Use external links with caution.
          </p>
        </div>
      </PolicySection>

      <PolicySection title="Policy Updates" className="pt-[38px] max-md:pt-8">
        <div className="flex w-full flex-col items-start relative box-border mb-[38px] m-0 p-0 max-md:mb-8">
          <p className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative box-border m-0 p-0">
            We reserve the right to modify these terms at any time. Continued
            use of Viralitykit after changes constitutes acceptance of the new terms.
            Check back regularly for updates.
          </p>
        </div>
      </PolicySection>

      <PolicySection title="Legal Standards" className="pt-[38px] max-md:pt-8">
        <div className="flex w-full flex-col items-start relative box-border mb-[38px] m-0 p-0 max-md:mb-8">
          <p className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative box-border m-0 p-0">
            These Terms are governed by the laws of the Republic of Viridia.
          </p>
        </div>
      </PolicySection>

      <PolicySection title="Reach Out" className="pt-[38px] max-md:pt-8">
        <div className="flex w-full flex-col items-start relative box-border mb-0 m-0 p-0">
          <p className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative box-border m-0 p-0">
            If you have any questions, please contact us at{" "}
            <a
              href="mailto:support@Viralitykit.com"
              className="text-white hover:text-[#8638E5] transition-colors underline"
            >
              support@Viralitykit.com
            </a>
            .
          </p>
        </div>
      </PolicySection>
    </main>
  );
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="w-full bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <DarkVeil />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="py-20 px-4">
          <div className="max-w-[1264px] mx-auto">
            <Hero />
            <PolicyContent />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
export { Hero, PolicyContent, PolicySection, ListItem };
