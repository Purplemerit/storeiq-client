import * as React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DarkVeil from "@/components/DarkVeil";

const Hero: React.FC = () => {
  return (
    <section className="flex w-full max-w-[1264px] flex-col items-start relative mx-auto max-md:max-w-full max-md:px-6 max-md:py-0 max-sm:px-4 max-sm:py-0">
      <div className="flex w-full flex-col items-start relative mb-16 m-0 p-0 max-md:mb-12">
        <div className="flex flex-col items-center w-full relative box-border m-0 p-0 mt-20 max-md:mt-10">
          <div className="flex flex-col justify-center items-center gap-6 relative box-border m-0 p-0 max-md:gap-4">
            <div className="flex flex-col items-start relative box-border m-0 p-0">
              <div className="text-white text-base font-bold leading-4 tracking-[0.16px] uppercase relative box-border m-0 p-0 max-sm:text-sm max-sm:leading-[14px]">
                Effective Date: January 16, 2025
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 relative max-md:gap-4">
              <div className="flex max-w-[929px] flex-col items-center relative">
                <h1 className="text-center text-[64px] font-semibold leading-[76.8px] tracking-[-2.56px] bg-clip-text text-white relative max-md:text-5xl max-md:leading-[57.6px] max-md:tracking-[-1.92px] max-sm:text-4xl max-sm:leading-[43.2px] max-sm:tracking-[-1.44px]">
                  Terms and Conditions
                </h1>
              </div>

              <div className="flex max-w-[636px] flex-col items-start relative px-4">
                <div className="flex flex-col items-center relative">
                  <p className="text-[#CACFD8] text-center text-lg font-normal leading-[27px] tracking-[-0.18px] relative max-md:text-base max-md:leading-6 max-sm:text-sm max-sm:leading-[21px]">
                    By accessing or using our website, you agree to be bound by
                    these Terms and Conditions. Please read them carefully.
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

interface TermsSectionProps {
  title: string;
  children: React.ReactNode;
}

const TermsSection: React.FC<TermsSectionProps> = ({ title, children }) => (
  <div className="flex w-full flex-col gap-5 mb-10 last:mb-0">
    <div className="flex w-full flex-col items-start relative">
      <h2 className="text-white text-2xl font-semibold leading-[33.6px] tracking-[-0.36px] relative max-md:text-xl max-md:leading-7 max-sm:text-lg max-sm:leading-[25px]">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

interface ContentBlockProps {
  children: React.ReactNode;
  className?: string;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  children,
  className = "",
}) => (
  <div className={`flex w-full flex-col items-start relative ${className}`}>
    <div className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative max-sm:text-sm max-sm:leading-[22.4px]">
      {children}
    </div>
  </div>
);

interface ListItemProps {
  children: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({ children }) => (
  <div className="flex w-full flex-col items-start relative">
    <div className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative max-sm:text-sm max-sm:leading-[22.4px]">
      {children}
    </div>
  </div>
);

const TermsContent: React.FC = () => {
  return (
    <main className="w-full max-w-[757px] relative flex flex-col gap-10 mx-auto max-md:max-w-full max-md:px-6 max-md:py-0 max-sm:px-4 max-sm:py-0">
      <TermsSection title="Terms">
        <ContentBlock>
          This agreement is a general template and might not address every
          situation. It is not a substitute for professional legal advice.
          Consult with legal experts to customize it for your specific business
          requirements and the relevant jurisdiction. They can help ensure
          compliance and protect your interests.
        </ContentBlock>
      </TermsSection>

      <TermsSection title="Acceptable Use">
        <div className="flex w-full flex-col items-start gap-4 relative pl-5 max-sm:pl-4">
          <ListItem>
            You agree to use this site only for lawful activities. Any illegal
            or unauthorized use is strictly prohibited and may result in legal
            action. Ensure your actions comply with all applicable laws and
            regulations.
          </ListItem>
          <div className="flex w-full flex-col items-start relative">
            <div className="text-[#CACFD8] text-base font-normal leading-[25.6px] relative max-sm:text-sm max-sm:leading-[22.4px] mb-2">
              You must not:
            </div>
            <div className="flex w-full flex-col items-start gap-3 relative pl-5 max-sm:pl-4">
              <ListItem>
                Do not disrupt the site, its resources, or other users. This
                includes but is not limited to, introducing viruses, overloading
                the server, or interfering with other users' access. Such
                actions may lead to immediate termination of your account.
              </ListItem>
              <ListItem>
                Unauthorized access to data is strictly prohibited. Any attempt
                to access, collect, or use data without permission will result
                in legal consequences.
              </ListItem>
            </div>
          </div>
        </div>
      </TermsSection>

      <TermsSection title="Legal Disclaimer">
        <div className="flex w-full flex-col items-start gap-4 relative pl-5 max-sm:pl-4">
          <ListItem>
            All content on this site is the exclusive property of Storiq and is
            protected by international copyright laws. This includes text,
            graphics, logos, and software. Unauthorized use may violate
            copyright, trademark, and other laws.
          </ListItem>
          <ListItem>
            Reproduction of content is prohibited without express permission. To
            request permission, please contact our legal team.
          </ListItem>
        </div>
      </TermsSection>

      <TermsSection title="Your Uploads">
        <div className="flex w-full flex-col items-start gap-4 relative pl-5 max-sm:pl-4">
          <ListItem>
            You retain all rights to your submitted content. By uploading, you
            grant us a license to use, display, and distribute your content on
            our platform. This license is non-exclusive and revocable.
          </ListItem>
          <ListItem>
            Ensure your submissions are accurate, lawful, and respect
            third-party rights. We are not responsible for the content you
            upload and reserve the right to remove any content that violates
            these terms or is deemed inappropriate.
          </ListItem>
        </div>
      </TermsSection>

      <TermsSection title="Liability Disclaimer">
        <ContentBlock className="mb-3">
          To the maximum extent permitted by law:
        </ContentBlock>
        <div className="flex w-full flex-col items-start gap-4 relative pl-5 max-sm:pl-4">
          <ListItem>
            Storiq is not liable for any damages resulting from your use of this
            site. This includes any errors, omissions, or inaccuracies in the
            content. Use the site at your own risk and discretion.
          </ListItem>
          <ListItem>
            This includes both direct and indirect damages, such as loss of
            profits, data, or business interruption.
          </ListItem>
        </div>
      </TermsSection>

      <TermsSection title="External Links">
        <ContentBlock>
          This website may contain links to third-party websites. We are not
          responsible for the content, services, or practices of those external
          sites. Use external links at your own risk.
        </ContentBlock>
      </TermsSection>

      <TermsSection title="Policy Changes">
        <ContentBlock>
          We reserve the right to modify these terms at any time. Changes will
          be effective immediately upon posting on this page. Your continued use
          of the site constitutes acceptance of the revised terms. Check back
          regularly for updates.
        </ContentBlock>
      </TermsSection>

      <TermsSection title="Applicable Laws">
        <ContentBlock>
          These terms are governed by the laws of Estonia, without regard to its
          conflict of law principles. Any disputes arising under these terms
          will be resolved in the courts of Tallinn, Estonia.
        </ContentBlock>
      </TermsSection>

      <TermsSection title="Get In Touch">
        <ContentBlock>
          Please contact us at{" "}
          <a
            href="mailto:support@storiq.com"
            className="text-white hover:text-[#8638E5] transition-colors underline"
          >
            support@storiq.com
          </a>{" "}
          with any questions or concerns. Our support team is available to
          assist you. We value your feedback and strive to provide excellent
          customer service.
        </ContentBlock>
      </TermsSection>
    </main>
  );
};

const TermsAndConditions: React.FC = () => {
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
            <TermsContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
export { Hero, TermsContent, TermsSection, ContentBlock, ListItem };
