import MovieItem from '@/components/movie-Item';
import style from './page.module.css';
import { MovieData } from '@/types';
import { Suspense } from 'react';
import MovieListSkeleton from '@/components/skeleton/movie-list-skeleton';

async function RecoMovies() {
  // 3초 주기로 영화를 변경하기 위해 revalidate 적용
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/movie/random`,
    { next: { revalidate: 3 } }
  );
  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }
  const movies: MovieData[] = await response.json();
  return (
    <Suspense fallback={<MovieListSkeleton count={3} type="reco" />}>
      <div className={style.reco_container}>
        {movies.map((movie) => (
          <MovieItem key={movie.id} {...movie} />
        ))}
      </div>
    </Suspense>
  );
}

async function AddMovies() {
  // 새로운 영화를 추하거나 삭제하지 않으므로 영구 캐싱 적용
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/movie`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }
  const movies: MovieData[] = await response.json();

  return (
    <Suspense fallback={<MovieListSkeleton count={15} type="all" />}>
      <div className={style.all_container}>
        {movies.map((movie) => (
          <MovieItem key={movie.id} {...movie} />
        ))}
      </div>
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 가장 추천하는 영화</h3>
        <RecoMovies />
      </section>
      <section>
        <h3>등록된 모든 영화</h3>
        <AddMovies />
      </section>
    </div>
  );
}
