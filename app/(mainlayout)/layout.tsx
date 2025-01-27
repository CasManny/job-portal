import Navbar from "@/components/general/navbar";
import React, { PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-7xl mx-auto px-4 md:px-6 lg:px-8">
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
