import MovieItem from '@/components/movie-item';
import SearchBarLayout from '@/components/searchBarLayout';
import { ReactNode, useEffect, useState } from 'react';
import style from './index.module.css';
import fetchMovies from '@/lib/fetch-movies';
import { useRouter } from 'next/router';
import { MovieData } from '@/types';

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
    <div className={style.container}>
      {movies.map((movie) => (
        <MovieItem key={`search-${movie.id}`} {...movie} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchBarLayout>{page}</SearchBarLayout>;
};
