import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nargile Kod Rehberi",
  description:
    "Türkiye'deki nargile markalarının ürün kodları ve içerikleri tek sayfada. Koda, içeriğe veya markaya göre arayın.",
};

export const viewport: Viewport = {
  themeColor: "#0e0b16",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={jakarta.variable}>
      <body>
        <div className="bg" aria-hidden>
          <div className="blob b1" />
          <div className="blob b2" />
          <div className="blob b3" />
          <div className="blob b4" />
        </div>
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
        {children}
      </body>
    </html>
  );
}
