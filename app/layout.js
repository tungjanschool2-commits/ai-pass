import './globals.css';

export const metadata = {
  title: 'สร้างอินโฟกราฟิก A4 | โรงเรียนวัดทุ่งจาน',
  description: 'โปรแกรมสร้างอินโฟกราฟิก A4 ด้วย Gemini AI ฟรี',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&family=Kanit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
