import { MovieData } from '@/types';
import Link from 'next/link';
import style from './movie-item.module.css';
import delay from '@/util/delay';

export default async function MovieItem(props: MovieData) {
  await delay(3000);
  return (
    <Link className={style.container} href={`/movie/${props.id}`}>
      <img src={props.posterImgUrl} alt="영화 포스터" />
    </Link>
  );
}
