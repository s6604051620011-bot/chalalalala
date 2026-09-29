# ระบบสั่งเครื่องดื่มร้านชา (Next.js + Supabase + Vercel)

ระบบสั่งเครื่องดื่มผ่าน QR ประจำโต๊ะสำหรับร้านขายน้ำชา
หมวดเมนู: ชาไทย, ชาเขียว, ชาไต้หวัน, ชาดำ, ชานมเย็น
ชื่อร้าน "chalalalala" ตั้งไว้ที่ `lib/shop.js` (`SHOP_NAME`) — แก้ที่เดียว

## Stack

- Next.js (App Router) — **JavaScript เท่านั้น ไม่ใช้ TypeScript**
- React 19
- Supabase (`@supabase/supabase-js`) — client อยู่ที่ `lib/supabaseClient.js`
- Deploy บน Vercel

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

ในเครื่องใส่ใน `.env.local` (ห้าม commit) บน Vercel ตั้งใน Project Settings > Environment Variables

## กฎสำคัญของ Next.js เวอร์ชันนี้: `params` เป็น Promise

โปรเจกต์นี้ใช้ Next.js เวอร์ชันล่าสุด **`params` ของ Dynamic Route เป็น Promise**
ห้ามอ่านค่าตรงๆ เช่น `params.tableId` ต้อง unwrap ก่อนเสมอ

หน้าแบบ Client Component (`"use client"`) — ใช้ `use()` จาก React:

```js
"use client";
import { use } from "react";

export default function OrderPage({ params }) {
  const { tableId } = use(params);
  // ...
}
```

หน้าแบบ Server Component (ไม่มี `"use client"`) — ใช้ `await` ในฟังก์ชัน async:

```js
export default async function OrderPage({ params }) {
  const { tableId } = await params;
  // ...
}
```

หน้าสั่งอาหารของลูกค้า (ขั้นตอนถัดไป) ให้ใช้รูปแบบ `use(params)` เสมอ
เพราะต้องมี state และ event handler

## โครงสร้างฐานข้อมูล (Supabase มีตารางอยู่แล้ว — ไม่ต้องสร้างใหม่)

### sessions — รอบการนั่งโต๊ะ (เปิดตอนพนักงานสร้าง QR)

| คอลัมน์ | ชนิด | หมายเหตุ |
|---|---|---|
| id | bigint | primary key |
| table_number | int | เลขโต๊ะ |
| adult_count | int | จำนวนผู้ใหญ่ (default 0) |
| child_count | int | จำนวนเด็ก (default 0) |
| status | text | `open` \| `closed` (default `open`) |
| created_at | timestamptz | default now() |

### menu_categories — หมวดหมู่เมนู

| คอลัมน์ | ชนิด | หมายเหตุ |
|---|---|---|
| id | bigint | primary key |
| name | text | ชื่อหมวด |
| sort_order | int | ลำดับแสดงผล |

### menu_items — รายการเมนูย่อย

| คอลัมน์ | ชนิด | หมายเหตุ |
|---|---|---|
| id | bigint | primary key |
| category_id | bigint | อ้างอิง menu_categories(id) |
| name | text | ชื่อเมนู |

### orders — ออเดอร์ที่ลูกค้าส่งเข้าครัว (1 แถวต่อ 1 ครั้งที่กดส่ง)

| คอลัมน์ | ชนิด | หมายเหตุ |
|---|---|---|
| id | bigint | primary key |
| session_id | bigint | อ้างอิง sessions(id) |
| table_number | int | เลขโต๊ะ |
| items | jsonb | เช่น `[{"name":"ชาไทยเย็น","quantity":2}]` |
| status | text | `received` \| `cooking` \| `served` (default `received`) |
| created_at | timestamptz | default now() |

## หน้าที่วางแผนไว้

- `/` — หน้าแรก (ใช้ทดสอบว่า deploy สำเร็จ)
- `/generate-qr` — พนักงานเปิดโต๊ะและสร้าง QR
- `/kitchen` — หน้าจอครัวดูออเดอร์และเปลี่ยนสถานะ
- หน้าสั่งของลูกค้า (Dynamic Route) — ขั้นตอนถัดไป

## หมายเหตุ

- RLS ตอนนี้เปิดให้ทุกคนอ่าน/เขียนได้ (เพื่อการเรียนรู้) ควรปรับก่อนใช้จริง
- สคริปต์: `npm run dev` / `npm run build` / `npm run start`
