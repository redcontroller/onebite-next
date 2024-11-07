import MovieItem from '@/components/movie-item';
import SearchBarLayout from '@/components/searchBarLayout';
import { ReactNode, useEffect, useState } from 'react';
import style from './index.module.css';
import fetchMovies from '@/lib/fetch-movies';
import { useRouter } from 'next/router';
import { MovieData } from '@/types';
import Head from 'next/head';

export default function Page() {
  const router = useRouter();
  const q = router.query.q;
  const [movies, setMovies] = useState<MovieData[]>([]);

  const fetchData = async (q: string) => {
    const response = await fetchMovies(q);
    if (!response) {
      throw new Error();
    }
    setMovies(response);
  };

  useEffect(() => {
    fetchData(q as string);
  }, [q]);

  return (
    <>
      <Head>
        <title>한입 시네마 - 검색결과</title>
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:title" content="합입 시네마 - 검색결과" />
        <meta
          property="og:description"
          content="합입 시네마에 등록된 영화들을 검색해보세요"
        />
      </Head>
      <div className={style.container}>
        {movies.map((movie) => (
          <MovieItem key={`search-${movie.id}`} {...movie} />
        ))}
      </div>
    </>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchBarLayout>{page}</SearchBarLayout>;
};
