import './globals.css';
import Link from 'next/link';
import style from './layout.module.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={style.container}>
        <header>
          <Link href={'/'}>🎦 ONEBITE CINEMA</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
