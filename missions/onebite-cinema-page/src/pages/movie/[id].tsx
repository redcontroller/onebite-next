/* eslint-disable @next/next/no-img-element */
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import style from './[id].module.css';
import { useRouter } from 'next/router';
import fetchOneMovie from '@/lib/fetch-one-movie';
import fetchMovies from '@/lib/fetch-movies';
import Head from 'next/head';

export const getStaticPaths = async () => {
  const movies = await fetchMovies();
  return {
    // 모든 영화 페이지를 미리 생성하도록 설정
    paths: movies.map(({ id }) => ({
      params: { id: id.toString() },
    })),
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id;
  const movie = await fetchOneMovie(Number(id));

  if (!movie) {
    return {
      notFound: true,
    };
  }

  return {
    props: { movie },
  };
};

export default function Page({
  movie,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback)
    return (
      <>
        <Head>
          <title>한입 시네마</title>
          <meta property="og:image" content="/thumbnail.png" />
          <meta property="og:title" content="합입 시네마" />
          <meta
            property="og:description"
            content="합입 시네마에 등록된 영화들을 만나보세요"
          />
        </Head>
        <div>로딩 중입니다.</div>
      </>
    );
  if (!movie) return '문제가 발생했습니다. 다시 시도하세요.';
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    title,
    subTitle,
    company,
    runtime,
    description,
    posterImgUrl,
    releaseDate,
    genres,
  } = movie;

  return (
    <div className={style.container}>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={posterImgUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${posterImgUrl}')` }}
      >
        <img src={posterImgUrl} alt="영화 포스터" />
      </div>

      <div className={style.info_container}>
        <div>
          <h2>{title}</h2>
          <div>
            {releaseDate} / {genres.join(', ')} / {runtime}분
          </div>
          <div>{company}</div>
        </div>

        <div>
          <div className={style.subTitle}>{subTitle}</div>
          <div className={style.description}>{description}</div>
        </div>
      </div>
    </div>
  );
}
