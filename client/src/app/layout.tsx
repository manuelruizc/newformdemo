import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@newformdemo/client/providers/trcpprovider";
import { AppFlowContextProvider } from "@/providers/appflow";
import { WillBotTourProvider } from "@/providers/willbottour";

const fontSans = Geist({
  variable: "--font-newform-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-newform-mono",
  subsets: ["latin"],
});

const fontDisplay = Fraunces({
  variable: "--font-newform-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewForm",
  description: "The data-driven creative company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable} font-newform-sans antialiased nf`}
      >
        <TRPCProvider>
          <AppFlowContextProvider>
            <WillBotTourProvider>{children}</WillBotTourProvider>
          </AppFlowContextProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
