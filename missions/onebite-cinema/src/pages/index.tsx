import SearchBarLayout from '@/components/searchBarLayout';
import { ReactNode } from 'react';
import style from './index.module.css';
import MovieItem from '@/components/movie-item';
import { InferGetStaticPropsType } from 'next';
import fetchMovies from '@/lib/fetch-movies';
import fetchRandomMovies from '@/lib/fetch-random-movies';

export const getStaticProps = async () => {
  const [allMovies, recoMovies] = await Promise.all([
    fetchMovies(),
    fetchRandomMovies(),
  ]);

  return {
    props: {
      allMovies,
      recoMovies,
    },
  };
};

export default function Home({
  allMovies,
  recoMovies,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 가장 추천하는 영화</h3>
        <div className={style.reco_container}>
          {recoMovies.map((movie) => (
            <MovieItem key={`recomovie-${movie.id}`} {...movie} />
          ))}
        </div>
      </section>
      <section>
        <h3>등록된 모든 영화</h3>
        <div className={style.all_container}>
          {allMovies.map((movie) => (
            <MovieItem key={`recomovie-${movie.id}`} {...movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

Home.getLayout = (page: ReactNode) => {
  return <SearchBarLayout>{page}</SearchBarLayout>;
};
