// components/layouts/PublicLayout.js
import React from "react";
import PublicHeader from "./public-header";
import Footer from "./footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      {children}
      <Footer />
    </div>
  );
}
