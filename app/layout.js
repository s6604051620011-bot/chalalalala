import { Noto_Sans_Thai } from "next/font/google";
import { SHOP_NAME, SHOP_TAGLINE } from "../lib/shop";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: SHOP_NAME,
  description: SHOP_TAGLINE,
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={notoSansThai.className}>{children}</body>
    </html>
  );
}
