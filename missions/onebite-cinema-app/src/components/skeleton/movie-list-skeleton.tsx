import MovieSkeleton from './movie-skeleton';
import style from './movie-list-skeleton.module.css';

export default function MovieListSkeleton({
  count,
  type,
}: {
  count: number;
  type: 'reco' | 'all';
}) {
  return (
    <div className={style[type]}>
      {new Array(count).fill(0).map((_, idx) => (
        <MovieSkeleton key={`movie-skeleton-${idx}`} type={type} />
      ))}
    </div>
  );
}
