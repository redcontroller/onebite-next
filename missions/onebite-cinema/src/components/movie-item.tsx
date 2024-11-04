import Link from 'next/link';
import style from './movie-item.module.css';
import { MovieData } from '@/types';

export default function MovieItem(props: MovieData) {
  return (
    <Link className={style.container} href={`/movie/${props.id}`}>
      <img src={props.posterImgUrl} />
    </Link>
  );
}