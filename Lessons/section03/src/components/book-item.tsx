import Link from 'next/link';
import style from './book-item.module.css';
import { BookData } from '../app/types';

export default function BookItem({
  id,
  title,
  subTitle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description,
  author,
  publisher,
  coverImgUrl,
}: BookData) {
  return (
    <Link href={`/book/${id}`} className={style.container}>
      <img src={coverImgUrl} alt="커버" />
      <div>
        <div className={style.title}>{title}</div>
        <div className={style.title}>{subTitle}</div>
        <br />
        <div className={style.author}>
          {author} | {publisher}
        </div>
      </div>
    </Link>
  );
}
