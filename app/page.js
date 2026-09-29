import Link from "next/link";
import { SHOP_NAME, SHOP_TAGLINE } from "../lib/shop";

export default function HomePage() {
  return (
    <main className="home">
      <div>
        <h1>{SHOP_NAME}</h1>
        <p>{SHOP_TAGLINE}</p>
      </div>

      <nav className="links" aria-label="เมนูหลัก">
        <Link href="/generate-qr" className="link-button primary">
          สร้าง QR ประจำโต๊ะ
          <small>สำหรับพนักงาน เปิดโต๊ะใหม่</small>
        </Link>
        <Link href="/kitchen" className="link-button">
          หน้าจอครัว
          <small>ดูออเดอร์ที่ลูกค้าส่งเข้ามา</small>
        </Link>
      </nav>
    </main>
  );
}
