import { MovieData } from '@/types';
import style from './page.module.css';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/movie`
  );
  if (!response.ok) {
    throw new Error('Fetch failed: ~/movie');
  }
  const movies: MovieData[] = await response.json();
  // 각 movie 객체 데이터에서 구조분해할당으로 id만 추출해서 사용
  return movies.map(({ id }) => ({ id: id.toString() }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // 상세 페이지의 정보가 변경되지 않을 것이므로 force-cache 적용
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}/movie/${id}`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    return <div>오류가 발생했습니다...</div>;
  }
  const movie: MovieData = await response.json();

  const {
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
            {releaseDate} | {genres.join(', ')} | {runtime}분
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
