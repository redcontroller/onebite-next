import SearchBarLayout from '@/components/searchBarLayout';
import { ReactNode } from 'react';

export default function Home() {
  return <div>메인 페이지</div>;
}

Home.getLayout = (page: ReactNode) => {
  return <SearchBarLayout>{page}</SearchBarLayout>;
};
