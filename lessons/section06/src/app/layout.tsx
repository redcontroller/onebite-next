import './globals.css';
import Link from 'next/link';
import style from './layout.module.css';
// import { BookData } from '@/types';

// async function Footer() {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
//     { cache: 'force-cache' }
//   );
//   if (!response.ok) {
//     return <footer>Made By @redcontroller</footer>;
//   }
//   const books: BookData[] = await response.json();
//   const bookCount = books.length;

//   return (
//     <footer>
//       <div>Made By @redcontroller</div>
//       <div>{bookCount}개의 도서가 등록되어 있습니다.</div>
//     </footer>
//   );
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className={style.container}>
          <header>
            <Link href="/">📚 ONEBITE BOOKS</Link>
          </header>
          <main>{children}</main>
          {/* <footer>Made By @redcontroller</footer> */}
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
}
