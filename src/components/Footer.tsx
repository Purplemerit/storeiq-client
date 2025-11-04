import React from "react";

export const FooterBrand: React.FC = () => {
  return (
    <div className="grow pb-10 sm:pb-12 md:pb-16 lg:pb-[78px] w-full md:w-auto">
      <div className="flex w-full flex-col items-stretch">
        <div className="flex items-center gap-2 text-xl sm:text-2xl text-white font-semibold whitespace-nowrap leading-none">
          <div className="self-stretch my-auto">
            <div>STORIQ</div>
          </div>
        </div>
        <div className="text-sm sm:text-base text-[rgba(202,207,216,1)] font-normal leading-relaxed sm:leading-[26px] mt-4 sm:mt-[19px] pr-0 md:pr-7">
          <div className="w-full">
            The AI workspace for next-gen creators. It helps modern creators
            streamline content creation, planning, and publishing like never
            before.
          </div>
        </div>
      </div>
    </div>
  );
};

export const FooterNavigation: React.FC = () => {
  return (
    <nav
      className="flex grow gap-6 sm:gap-10 md:gap-16 lg:gap-[60px_120px] flex-wrap w-full md:w-auto"
      role="navigation"
      aria-label="Footer navigation"
    >
      <div className="text-sm text-white font-normal leading-[1.6] min-w-[120px]">
        <div className="w-full font-bold whitespace-nowrap pb-3">
          <div className="w-full">
            <div>Home</div>
          </div>
        </div>
        <ul className="list-none p-0 m-0">
          <li className="flex w-full items-center whitespace-nowrap mt-3">
            <a
              href="/#features"
              className="self-stretch my-auto text-[rgba(153,160,174,1)] hover:text-white transition-colors"
            >
              <div>Features</div>
            </a>
          </li>
          <li className="flex w-full items-center mt-3">
            <a
              href="/#steps"
              className="self-stretch my-auto text-[rgba(153,160,174,1)] hover:text-white transition-colors"
            >
              <div>Steps to Edit</div>
            </a>
          </li>
          <li className="flex w-full items-center whitespace-nowrap mt-3">
            <a
              href="/#pricing"
              className="self-stretch my-auto text-[rgba(153,160,174,1)] hover:text-white transition-colors"
            >
              <div>Pricing</div>
            </a>
          </li>
          <li className="flex w-full items-center whitespace-nowrap mt-3">
            <a
              href="/#testimonials"
              className="self-stretch my-auto text-[rgba(153,160,174,1)] hover:text-white transition-colors"
            >
              <div>Testimonials</div>
            </a>
          </li>
        </ul>
      </div>

      <div className="min-w-[120px]">
        <div className="w-full text-sm text-white font-bold whitespace-nowrap leading-[1.6] pb-3">
          <div className="w-full">
            <div>About</div>
          </div>
        </div>
        <ul className="list-none p-0 m-0">
          <li className="flex w-full items-center text-sm font-normal whitespace-nowrap leading-[1.6] mt-3">
            <a
              href="/about#why"
              className="self-stretch my-auto text-[rgba(153,160,174,1)] hover:text-white transition-colors"
            >
              <div>Why</div>
            </a>
          </li>
          <li className="flex w-full items-center text-sm font-normal leading-[1.6] mt-3">
            <a
              href="/about#ethics"
              className="self-stretch my-auto text-[rgba(153,160,174,1)] hover:text-white transition-colors"
            >
              <div>AI With Ethics</div>
            </a>
          </li>
          <li className="flex w-full items-center text-sm font-normal whitespace-nowrap leading-[1.6] mt-3">
            <a
              href="/about#questions"
              className="self-stretch my-auto text-[rgba(153,160,174,1)] hover:text-white transition-colors"
            >
              <div>Questions</div>
            </a>
          </li>
          <li className="flex w-full items-center mt-3">
            <div className="self-stretch flex min-h-[23px] my-auto" />
          </li>
        </ul>
      </div>

      <div className="min-w-[120px]">
        <div className="w-full text-sm text-white font-bold whitespace-nowrap leading-[1.6] pb-3">
          <div className="w-full">
            <div>Tools</div>
          </div>
        </div>
        <ul className="list-none p-0 m-0">
          <li className="flex w-full items-center text-sm font-normal leading-[1.6] mt-3">
            <a
              href="/tools"
              className="self-stretch my-auto text-[rgba(153,160,174,1)] hover:text-white transition-colors"
            >
              <div>All Free Tools</div>
            </a>
          </li>
          <li className="flex w-full items-center mt-3">
            <div className="self-stretch flex min-h-[23px] my-auto" />
          </li>
          <li className="flex w-full items-center mt-3">
            <div className="self-stretch flex min-h-[23px] my-auto" />
          </li>
          <li className="flex w-full items-center mt-3">
            <div className="self-stretch flex min-h-[23px] my-auto" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export const FooterBottom: React.FC = () => {
  return (
    <div className="z-10 flex w-full gap-4 sm:gap-6 text-xs sm:text-sm leading-[1.6] flex-wrap justify-between items-center mt-12 sm:mt-16 md:mt-20 lg:mt-[191px]">
      <div className="flex text-[rgba(153,160,174,1)] font-normal flex-wrap">
        <div>
          © 2025 <span className="font-bold">STORIQ</span>
        </div>
        <div className="flex min-h-[23px]" />
      </div>
      <div className="flex items-center gap-4 sm:gap-6 text-white font-bold flex-wrap">
        <div className="self-stretch my-auto">
          <a
            href="/terms-and-conditions"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <div>Terms & Conditions</div>
          </a>
        </div>
        <div className="self-stretch my-auto">
          <a
            href="/privacy-policy"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <div>Privacy Policy</div>
          </a>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer
      className="bg-[rgba(10,0,21,1)] pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8"
      role="contentinfo"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full">
          <div className="gap-5 flex flex-col md:flex-row">
            <div className="w-full md:w-6/12">
              <FooterBrand />
            </div>
            <div className="w-full md:w-6/12 md:ml-5">
              <FooterNavigation />
            </div>
          </div>
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
