import style from './movie-skeleton.module.css';

export default function MovieSkeleton({ type }: { type: string }) {
  return <div className={style[type]}></div>;
}
