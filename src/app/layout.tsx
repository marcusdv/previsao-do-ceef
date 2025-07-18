import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import HamburguerMenu from "@/components/HamburguerMenu";

export const metadata: Metadata = {
  title: "CEEFguru",
  description: "Previsão do tempo para o treino de vôlei farmárcia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <HamburguerMenu />
        {children}
        <Footer />
      </body>
    </html>
  );
}