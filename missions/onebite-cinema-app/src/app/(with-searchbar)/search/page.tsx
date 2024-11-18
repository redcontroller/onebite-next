import MovieItem from '@/components/movie-Item';
import style from './page.module.css';
import { MovieData } from '@/types';
import delay from '@/util/delay';
import { Suspense } from 'react';
import MovieListSkeleton from '@/components/skeleton/movie-list-skeleton';

async function SearchResult({ q }: { q: string }) {
  await delay(300);
  // 동일한 검색어에 대해 다시 데이터를 불러오지 않도록 force-cache 적용
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/movie/search?q=${q}`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }
  const movies: MovieData[] = await response.json();
  console.log(movies);

  return (
    <>
      {movies.length === 0 ? (
        <div className={style.no_result}>검색 결과가 없습니다.</div>
      ) : (
        <div className={style.container}>
          {movies.map((movie) => (
            <MovieItem key={movie.id} {...movie} />
          ))}
        </div>
      )}
    </>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  return (
    <Suspense key={q} fallback={<MovieListSkeleton count={6} type="reco" />}>
      <SearchResult q={q} />
    </Suspense>
  );
}
