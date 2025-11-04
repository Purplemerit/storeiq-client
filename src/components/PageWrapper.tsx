import React from "react";
import Header from "./Header";

interface PageWrapperProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  showHeader = true,
}) => {
  return (
    <>
      {showHeader && (
        <div style={{ position: "relative", zIndex: 100 }}>
          <Header />
        </div>
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </>
  );
};

export default PageWrapper;
