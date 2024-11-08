import { ReactNode } from 'react';
import style from './globalLayout.module.css';
import Link from 'next/link';

export default function GlobalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <Link href={'/'}>ONEBITE CINEMA</Link>
      </header>
      <main className={style.main}>{children}</main>
      <footer className={style.footer}>Made by @redcontroller</footer>
    </div>
  );
}
