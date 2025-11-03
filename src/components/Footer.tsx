import React from "react";

export const FooterBrand: React.FC = () => {
  return (
    <div className="grow pb-[78px] max-md:max-w-full max-md:mt-6">
      <div className="flex w-full flex-col items-stretch max-md:max-w-full">
        <div className="flex items-center gap-2 text-2xl text-white font-semibold whitespace-nowrap leading-none">
          <div className="self-stretch my-auto">
            <div>STORIQ</div>
          </div>
        </div>
        <div className="text-base text-[rgba(202,207,216,1)] font-normal leading-[26px] mt-[19px] pr-7 max-md:max-w-full max-md:pr-5">
          <div className="max-md:max-w-full">
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
      className="flex grow gap-[60px_120px] flex-wrap max-md:max-w-full max-md:mt-6"
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
    <div className="z-10 flex w-full gap-6 text-sm leading-[1.6] flex-wrap justify-between items-center mt-[191px] max-md:max-w-full max-md:mt-10">
      <div className="flex text-[rgba(153,160,174,1)] font-normal flex-wrap max-md:max-w-full">
        <div>
          © 2025 <span className="font-bold">STORIQ</span>
        </div>
        <div className="flex min-h-[23px]" />
      </div>
      <div className="flex items-center gap-6 text-white font-bold flex-wrap">
        <div className="self-stretch my-auto">
          <a
            href="#terms"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <div>Terms & Conditions</div>
          </a>
        </div>
        <div className="self-stretch my-auto">
          <a
            href="#privacy"
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
      className="bg-[rgba(10,0,21,1)] pt-20 pb-12 px-4"
      role="contentinfo"
    >
      <div className="w-full max-w-7xl mx-auto max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-6/12 max-md:w-full max-md:ml-0">
              <FooterBrand />
            </div>
            <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
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
