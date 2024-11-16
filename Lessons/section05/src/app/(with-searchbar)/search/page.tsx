import BookItem from '@/components/book-item';
import { BookData } from '@/types';

// 특정 페이지의 유형을 강제로 Static 페이지로 설정
// export const dynamic = 'error'; // force-static

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: 'force-cache' }
  );
  if (!response.ok) {
    return <div>오류가 발생했습니다 ...</div>;
  }

  const books: BookData[] = await response.json();

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}
