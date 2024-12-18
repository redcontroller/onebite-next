## 이미지 최적화

- 이번 섹션에서는 Next에서 제공하는 다양한 최적화 기법들을 살펴보고 프로젝트를 최종적으로 배포하는 과정까지 진행해본다.
- 우리가 사용하는 웹페이지에서 평균적으로 가장 많은 용랴을 차지하는 요소는 `이미지`이다.
- `http archive`라는 연구기관에 따르면 이미지는 평균적으로 웹페이지 용량의 무려 `58%`나 차지하고 있다고 한다. 그래서 사실상 용량의 관점에서만 보자면 웹페이지의 절반 이상이 거의 다 이미지로만 이루어져 있다라고 해도 과언이 아니다.
- 그렇기 때문에 우리와 같은 웹 개발자들에게는 이러한 이미지를 최적화 하는 일은 마치 피할 수 없는 숙명처럼 굉장히 중요한 일이 되었다.
- 그 결과 오늘날 상당히 많은 이미지 최적화 기법들이 생겨나게 되었다.
  > **다양한 이미지 최적화 기법들**
  >
  > - webp, AVIF 등의 차세대 형식으로 변환하기
  > - 디바이스 사이즈에 맞는 이미지 불러오기
  > - 레이지 로딩 적용하기
  > - 블러 이지 활용하기
  > - 기타 등등 ...
- 원래라면 우리도 대표적인 이미지 최적화 기법들을 공부해서 프로젝트에도 적용될 수 있도록 직접 다 구현을 해줬어야 하지만 놀랍게도 Next에서는 이런 대부분의 최적화 기법들이 자체적으로 다 제공이 되고 있다.
- 대표적으로 `Image 컴포넌트`를 활용하면 이미지 최적화 기법들이 다 자동으로 적용이 된다.
- 그렇기 때문에 원래라면 엄청나게 복잡하고 많은 양들의 코드를 통해서 직접 다 구현해 줬어야 하는 다양한 최적화 작업들을 Next.js 에서는 `Image`라는 내장 컴포넌트 하나만 가져다 써도 마치 조미료를 넣은 것처럼 굉장히 쉽게 이미지의 최적화를 제공할 수 있다.
- 한입북스 프로젝트에는 모든 도서 아이템마다 도서의 커버 이미지들이 하나씩 존재하고 있기 때문에 하나의 페이지 내에서 굉장히 많은 이미지들이 렌더링하고 있는 상황이다. 그렇기 때문에 다수의 이미지를 불러오거나 화면에 렌더링하는 과정에서 비효율적인 동작이 발생하게 되면 생각보다 큰 성능의 악화로 이어질 수가 있다. 이런 이미지들을 다 최적화해 보자.
- 우선 현재 이미지를 불러오고 있는데, 어느 정도의 성능이 나오고 있는지부터 먼저 확인을 해보자.
- 인덱스 페이지에서 불러오는 `image requests`들의 성능만 따로 필터링 해주기 위해 개발자 모드 네트워크 탭에서 `img` 필터 버튼을 선택해주고, 브라우저 새로고침을 `캐시 비우기 및 강력 새로고침`을 눌러 페이지가 다시 렌더링 되면서 현재 페이지에서 필요로 하는 모든 이미지들을 다 불러와지는 과정을 확인할 수 있다.
- 현재 아무런 최적화도 이루어지지 않은 지금 상태의 문제점을 먼저 살펴본다.
  - (1) 이미지의 타입을 `jpeg` 형식으로 불러오고 있다는 점
  - (2) 불필요한 이미지 페칭과 렌더링을 하고 있다는 점
  - (3) 이미지의 실제 렌더링 사이즈보다 큰 이미지를 불러오고 있다는 점
- 첫번째 문제점은 `jpeg` 형식도 그렇게 나쁜 것은 아니지만 요즘은 되도록이면 `webp`, `AVIF` 등의 jpeg 보다 훨씬 경량화된 이미지 포맷들을 더 많이 활용하는 추세이다.
- 두번째 문제점은 현재 화면에 렌더링될 필요가 없는 이미지들까지 한꺼번에 불러오고 있다. 현재 화면의 Viewport 상에서는 보여지는 이미지는 5개밖에 없는데 네트워크 탭에 보면 페이지에 포함이 되는 모든 이미지를 다 한번에 불러오고 있다는 점이다. 그렇기 때문에 현재 필요한 이미지들부터 빠르게 불러와 지는 것이 아니라 불필요하게 많은 이미지들을 동시에 불러오게 된다.
- 서번째 문제점은 불러고 오고 있는 이미지들의 사이즈가 실제 화면에 나타날 사이즈보다 훨씬 더 크다는 점이다. 네트워크 탭에서 로딩된 이미지를 클릭하고 `preview` 탭에서 현재 불러온 이미지의 정보를 자세히 살펴볼 수 있다. 오른쪽 하단 부분에 이미지의 용량과 사이즈가 나타나는 것을 볼 수 있다. 이때 이미지 사이즈가 `458x583` 픽셀로 굉장히 거대한 사이즈의 이미지를 불러오고 있다는 걸 알 수 있다. 불러온 이미지의 큰 사이즈에 비해서 실제 브라우저 화면에 렌더링된 이미지의 사이즈인 `80x105` 픽셀 (코드 상에서 CSS로 설정한 값)로 사실상 4배 가까운 사이즈로 이미지를 불러오고 있다. 불러와야 하는 이미지도 사이즈에 비례해서 굉장히 커져 버릴 수 있기 때문에 이런 이미지가 하나둘씩 쌓이다 보면 큰 성능 악화로 이어질 수 있다.

  <img width="700px" src="https://github.com/user-attachments/assets/313f887e-5f3c-4bd7-a33d-74357c79458d">
  <img width="700px" src="https://github.com/user-attachments/assets/043f9e07-a0ba-4e84-81d5-7023ee255426">

  > 개발자 모드 Network 탭 하위 이미지 Preview 화면

- 이러한 문제점을 Next.js의 `Image 컴포넌트`를 이용하면 아주 쉽게 최적화 할 수 있다. Image 컴포넌트는 `next/image` 패키지에서 불러와서 사용하며, 기본적으로 기존의 `img` 태그와 사용법이 동일하다.
- `Image 컴포넌트`는 사이즈를 width와 height props으로 고정적으로 명시 해줘야 한다. 그 이유는 명시된 사이즈를 통해서 필요 이상으로 큰 이미지를 불러오지 않을 수 있도록 설정함으로써 이미지의 용량을 줄여주기 위해서이다.
- 그리고 alternative (대안, 대체)라는 뜻으로 웹 접근성을 위해서 `alt` 속성을 사용하여 사용자의 디바이스가 이미지를 렌더링 할 수 없는 상황이라거나 시각장애인 분들을 위한 스크린 리더를 구동할 때 이미지 대신에 표시되는 텍스트이다. 그래서 alt 속성으로는 되도록이면 해당하는 이미지를 가장 자세히 설명할 수 있는 텍스트를 설정해 주는 것이 가장 좋다.
  ```tsx
  <Image
    src={coverImgUrl}
    width={80}
    height={105}
    alt={`도서 ${title}의 표지 이미지`}
  />
  ```
- 참고로 `alt` 속성은 서비스의 성능에는 직접적으로 영향을 미치진 않는다. 그럼에도 더 많은 사람들을 위한 접근성을 위해서 항상 꼼꼼하게 잘 체크하고 기억해주면 좋겠다.
- `img` 태그 대신에 `Image 컴포넌트`를 사용하여 코드를 수정해줬다면, 이제 대부분의 최적화 기법들을 다 자동으로 적용이 되었을 것이다.
- 그런데 오류가 발생한다. `Invalid src prop`이라고 해서 이미지 컴포넌트에 사용한 src 이미지의 주소를 Next.js 이미지 컴포넌트에서 사용하려면 next.config.js에 몇 가지 설정을 추가해줘야 된다는 메시지를 볼 수 있다.

  <img width="700px" src="https://github.com/user-attachments/assets/05f1db9b-070a-49ea-8809-9c92396bab39">

  > 이미지 컴포넌트를 사용하며 발생한 Invalid src prop 에러

- 이미지 컴포넌트를 이용해서 특정 이미지를 최적화할 때 해당하는 이미지가 현재 Next.js 프로젝트에 저장된 이미지가 아니라 외부 서버에 보관된 이미지 (현재 Naver 쇼핑 API에서 제공하는 이미지)를 사용하는 방식이라면, 이것은 Next.js의 보안 때문에 자동으로 차단이 되어서 오류가 발생하게 되는 것이다. 그래서 에러창에 나오는 이미지 컴포넌트 `src prop`에 사용한 주소에 있는 도서 표지 이미지를 Next 이미지 컴포넌트로는 자동으로 최적화할 수 없다라는 오류가 발생하고 있는 것이다.
- 이럴 때에는 `next.config.js` 또는 `next.config.mjs`라는 Next App의 설정 파일을 수정해서 이미지 컴포넌트 `src prop`으로 제공하는 uri의 `도메인`으로부터 불러오는 이미지들은 `안전하다`라고 설정하면 된다. 그러면 이제부터 Next App은 설정을 추가한 도메인으로부터 제고되는 이미지 파일들을 '안전하다'라고 평가를 하게 되어 최적화을 수행한다.

  ```javascript
  /** @type {import('next').NextConfig} **/
  const nextConfig = {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    images: {
      domains: ['shopping-phinf.pstatic.net'],
    },
  };

  export default nextConfig;
  ```

- 다시 브라우저의 새로고침을 한 뒤 네트워크 탭에서 다시 어떤 점이 달라졌는지 확인해 보면, 우선 불러오고 있는 타입이 더 이상 `jpeg` 형식이 아닌 `webp` 형식으로 변환이 되어서 훨씬 더 경량화된 형태로 이미지가 불러온다. 그리고 이미지들의 사이즈가 가장 큰 것이 4 KB 정도밖에 안될 정도록 굉장히 작은 용량으로 이미지를 불러오고 있는 걸 확인할 수 있다.

  <img width="500px" src="https://github.com/user-attachments/assets/c843f625-4b0f-4d0a-897a-e2651de191f9">
  <img width="500px" src="https://github.com/user-attachments/assets/bafa7d10-ec49-449a-a734-85cd02e346aa">

  > 이미지 컴포넌트를 사용한 뒤 변화된 이미지

- 여기에 추가로 이미지를 뒤늦게 불러오는 기능까지 더했졌을 것이기 때문에 인덱스 페이지에서 드래그를 아래로 내려보면 그제서야 이미지가 뒤늦게 불러오는 것을 볼 수 있다. 그렇게 때문에 이제부터는 아무리 많은 도서의 아이템이 프로젝트에 등록이 된다 하더라도 이미지들을 동시에 너무 많이 불러와서 생기는 문제는 발생하지 않게 된다.
- 그렇기 때문에 향후 프로젝트를 진행할 때에도 되도록이면 `img` 태그 대신에 이미지 컴포넌트를 활용하는 것을 적극 권장한다. 또한 추가로 이미지 컴포넌트에는 더 다양한 기능들이 존재한다.

## 검색엔진 최적화 (SEO)

- Next.js 앱의 검색 엔진 최적화를 설정하는 방법을 살펴본다.
- 검색엔진 최적화란 구글이나 네이버 등의 검색엔진을 가지고 있는 포털 사이트들에서 우리가 제작한 서비스에 어떠한 페이지들이 있고, 페이지에는 어떠한 정보들이 있는지 검색엔진들이 더 잘 수집해갈 수 있도록 설정해서 결과적으로는 우리 서비스가 검색 결과에 더 잘 노출이 되도록 설정하는 기술이다.
- `검색엔진 최적화`를 이루는 방법에는 다음과 같이 굉장히 많은 방법들이 존재한다.
  - Sitemap 설정하기
  - RSS 발행하기
  - 시멘틱 태그 설정하기
  - 메타 데이터 설정하기 등
- 한입 Next에서는 페이지별 동적으로 `메타 데이터 설정`하는 방법에 대해서만 다룬다. 그 외에 다른 방법들은 공식 문서나 기타 자료들을 통해서 충분히 따라가며 수행할 수 있기 때문에 비교적 수행할 것이 많은 메타 데이터 설정에 대해서만 배포 준비도 할 겸 다뤄보도록 한다.
- 메타 데이터 설정에 사용할 `favicon.ico`와 2:1 비율의 `thumbnail.png` 이미지를 `public` 폴더 안에 넣어준다.
- 페이지에 메타 데이터를 설정해주려면 페이지 컴포넌트 위에 새로운 `metadata` 변수를 선언해서 내보내주면 된다. 이 `metadata` 변수에 설정된 값은 자동으로 인덱스 페이지의 메타데이터로 설정이 된다. 그래서 마치 우리가 이전에 배웠던 Route Segment Option(`export const dynamic = "force-dynamic"`)과 같다. 그래서 `metadata`라는 약속된 이름의 변수를 선언해서 내보내주면, 변수에 저장된 값이 현재 페이지의 메타데이터로 설정이 된다.
- 메타데이터에는 객체 형태로 `title`, `description`, `openGraph`를 넣어줄 수 있는데 `openGraph`의 `images` 속성에는 현재 페이지의 썸네일 이미지로 배열 형태로 이미지를 설정해 줄 수 있다. 참고로 슬래시 뒤에 어떠한 정적인 이미 파일명을 적어주면 앞에 있는 슬래시(`/`)가 public 디렉토리 아래 경로를 가리키게 된다. 그래서 `/thumbnail.png`라고 경로를 명시해주면 결과적으로 프로젝트의 public 디렉토리 안에 있는 thumbnail.png 파일을 가리키게 된다.

  ```tsx
  // (with-searchbar)/page.tsx
  import { Metadata } from 'next';

  export const metadata: Metadata = {
    title: '한입 북스',
    description: '한입 북스에 등록된 도서를 만나보세요',
    openGraph: {
      title: '한입 북스',
      description: '한입 북스에 등록된 도서를 만나보세요',
      images: ['/thumbnail.png'],
    },
  };

  export default function Home() {
    return (
  ```

  <img width="700px" src="https://github.com/user-attachments/assets/075309a4-95b8-427f-ad44-15db43fdc4f7">

  > 인덱스 페이지를 개발자 모드 Elements 탭에서 head 태그 속의 메타데이터 확인

- 앞서 인덱스 페이지에 `metadata`라는 변수로 설정해둔 것처럼 인덱스 페이지의 title이나 description 또는 오픈 그래프 속성들이 정상적으로 잘 설정된 것을 볼 수 있다. 게다가 `twitter:card` 또는 `twitter:image` 식으로 트위터만을 윈한 메타 태그들도 자동으로 알아서 코드에서 `metadata`에 입력한 값을 기반으로 설정된 것을 확인할 수 있다. 이러한 기능들을 Next App 라우터 버전에서는 `metadata`라는 변수를 페이지 컴포넌트 또는 레이아웃 컴포넌트에서 내보내 줌으로써 자동으로 설정할 수 있다.
- `/search/page.tsx` 파일에 검색 페이지의 메타데이터를 등록하려고 보니 문제점이 하나 있다. 그것은 검색어에 접근할 수 없다는 것이다. 구체적으로 페이지 컴포넌트에게 props로 전달되는 검색어(`searchParams`)를 페이지 컴포넌트 바깥에 있는 `metadata` 변수에서는 접근할 수가 없다. 그렇기 때문에 결론적으로 페이지의 title이나 description 또는 openGraph에 이러한 검색어를 사용할 수가 없다는 것이다.
- 그래서 동적인 값을 통해서 `metadata`를 설정해야 하는 이런 상황에서는 `metadata`라는 변수를 통해서 정적으로 현재 페이지에 메타데이터를 내보내는 방법을 이용할 수는 없고, 동적인 값으로 메타 데이터를 설정할 수 있는 `generateMetadata`라는 약속된 이름의 함수를 만들어서 함수에게 리턴으로 객체 형태의 `metadata`를 내보내주면 된다.
- `generateMetadata`라는 함수는 현재 페이지의 메타데이터를 동적으로 생성하는 역할을 한다. 그렇기 때문에 이 함수는 놀랍게도 페이지 컴포넌특 전달받는 페이지의 매개변수, 즉 `searchParams`를 그대로 전달 받을 수 있다.
- search 페이지 처럼 동적인 메타 태그를 설정해야 하는 일이 있다면 `generateMetadata` 함수를 `metadata` 변수 대신에 활용하면 된다.
- 이렇게 사용한 `generateMetadata` 함수의 반환값 타입을 적용해준다면 `async`를 사용하고 있기 때문에 `Promise<Metadata>` 타입을 사용할 수 있다. 그 의미를 자세히 살펴보면 반환하는 값의 타입은 비동기적으로 `Metadata`라는 객체값을 반환하겠다라고 정의한 것이다.

  ```typescript
  import { Metadata } from 'next';

  // 현재 페이지 메타데이터를 동적으로 생성하는 역할하는 약속된 이름의 함수
  export async function generateMetadata({
    searchParams,
  }: {
    searchParams: Promise<{ q?: string }>;
  }): Promise<Metadata> {
    const { q } = await searchParams;
    return {
      title: `${q} : 한입북스 검색`,
      description: `${q}의 검색 결과입니다`,
      openGraph: {
        title: `${q}: 한입북스 검색`,
        description: `${q}의 검색 결과입니다`,
        images: ['/thumbnail.png'],
      },
    };
  }
  ```

- 북 페이지 역시 마찬간지로 현재 `params`라는 URL 파라미터라는 동적인 경로를 포함하고 있기 때문에 이번 북 페이지 역시 `generateMetadata` 함수를 사용해서 설정을 한다. 북 페이지의 경우 현재 조회하고 있는 도서 데이터가 메타데이터 안에 포함이 되면 조금 그림이 좋을 것 같다. 그렇게 할 수 있다면 현재 북페이지의 메타데이터에 도서의 상세정보를 description에 적용하거나 썸네일 이미지를 도서의 커버 이미지로 설정하는 등의 기능을 만들 수 있다. 그래서 추가로 필요한 것은 `generateMetadata` 함수 내에서 현재 접속한 페이지의 도서 정보를 불러올 수 있어야 한다. 이렇게 하면 현재 도서의 정보를 기반으로 페이지의 메타 데이터가 설정이 된다.

  ```typescript
  export async function generateMetadata({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`,
      { cache: 'force-cache' }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const book: BookData = await response.json();

    return {
      tittle: `${book.title} - 한입북스`,
      description: `${book.description}`,
      openGraph: {
        tittle: `${book.title} - 한입북스`,
        description: `${book.description}`,
        images: [book.coverImgUrl],
      },
    };
  }
  ```

  <img width="700px" src="https://github.com/user-attachments/assets/1a68f036-9fd6-4b0f-9bb4-9f7be0212fb3">

  > 북 페이지를 개발자 모드 Elements 탭에서 head 태그 속의 메타데이터 확인

- 그런데 혹시나 `generateMetadata` 함수에서 현재 도서의 정보를 불러오는 API를 호출하고, 마찬가지로 `BookDetail` 컴포넌트에서도 중복으로 두 번이나 동일한 API를 호추하게 되면 문제가 발생할 수 있는 것이 아닌지 의문을 가질 수 있다. 하지만 전혀 문제가 없다. 왜냐하면 `Request Memoization`이라는 기능을 통해 하나의 페이지를 렌더링하는 도중에 중복된 API 호출을 한번 만 호출할 수 있도록 자동으로 캐싱이 된다.
- 이제 브라우저 탭의 아이콘인 `favicon`을 성정하는 방법을 알아본다. `favicon`을 설정하는 방법이 굉장히 쉬운데, app 폴더 바로 밑에 favicon.ico 파일이 있는데 이 파일이 현재 프로젝트의 파비콘을 담다아고 이슨 파일이다. 그래서 원하는 `favicon`으로 파일을 바꿔주면 파비콘은 쉽게 바꿀 수 있다. 그래서 기존의 favicon.ico 파일은 제거해주고, 앞서 public 폴더에 옮겨뒀던 우리 프로젝트의 파비콘을 app 폴더로 이동해주면 된다.
- 그리고 웹 브라우저를 새로고침해서 보면 `favicon`이 정상적으로 적용된 것을 알 수 있다.

## Vercel에 배포하기

- 실제로 웹 상에 배포하는 방법을 살펴본다.
- `Vercel`은 클라우드 서비스로서 다양한 프론트엔드, 백엔드 애플리케이션들을 아주 편리하게 배포하 수 있도록 도와주는 도구이다. 그리고 배포 기능 뿐만 아니라 `Analytics`나 가벼운 데이터베이스 등등의 굉장히 다양한 기능을 지원하고 있다.
- 게다가 Nextjs 라는 프레임워크를 개발해서 오픈소스로 운영하고 있는 회사이기도 하다. 그래서 Next.js로 만든 서비스를 배포하기에도 굉장히 간단하고 쉽기 때문에 많은 사람들이 자신이 만든 토이 프로젝트나 개인 프로젝트를 배포하고 있는 상황이다.
- 회원가입을 완료 했다면 터미널 (CLI) 환경에서 Vercel에 우리의 프로젝트를 배포하기 위한 일종의 도구를 글로벌 옵션으로 설치하고 로그인을 진행하면 된다.

  ```bash
  # vercel 글로벌로 설치
  npm i -g vercel
  # vercel 로그인 (가입한 수단으로 선택적 로그인)
  vercel login
  ```

- 만약 Windows OS 유저의 경우 `permission denied`가 발생하면 VSCode나 PC에 있는 명령 프롬프트, `Power Shell`을 관리자 권한으로 실행한 다음 명령어를 다시 수행해보길 권한다. 참고로 명령어를 수행하는 경로는 상관이 없기 때문에 아무런 위치에서 진행을 해주어도 된다.
- 로그인까지 완료가 되면 프로젝트를 배포할 준비가 된 것이다.
- 백엔드 서버의 경우 Page Router 버전에서 배포했던 onebite-books-server를 그대로 사용한다.
- `Vercel`에 프로젝트를 배포하면 빌드 로그를 확인할 수 있다. 그리고 배포가 완료되면 Status & Ready라고 해서 프로덕션 모드로 배포가 완료되었다고 표시해주는 것을 확인할 수 있다. 그리고 현재 배포된 프로젝트의 배포 주소까지 알려준다.

  <img width="700px" src="https://github.com/user-attachments/assets/ff90ca65-12cc-458f-985c-9581d3d101c0">

  > 배포된 백엔드 프로젝트의 vercel 페이지

- 백엔드 서버 배포가 완료 되었다면 Next App에도 Vercel 명령어를 입력해서 Vercel에 프로젝트를 배포한다.

  - ? Set up and deploy? Y
  - ? Which scope do you want to deploy to? (기본값)
  - ? Link to exiting project? N
  - ? watch's your project's name? onebite-books-app
  - ? In which directory is your code located? ./
  - ? Want to modify these settings? N

  <img width="700px" src="https://github.com/user-attachments/assets/e66d4315-da27-4f7f-9202-c842b3778cd6">
  <img width="600px" src="https://github.com/user-attachments/assets/a5d8c644-6c79-4925-addc-94d7545a52be">

  > 터미널 상의 배포 옵션과 빌드 에러

- 빌드 에러가 발생하더라도 당황하지 말고 에러 메시지를 천천히 읽어보면 충분히 해결할 수 있다. 에러 코드를 보면 정적 페이지를 만드는 과정에서 데이터 페칭에 실패했다는 부분을 알 수 있다. 그리고 정적 페이지로 설정된 곳은 북 페이지이다.
- 북 페이지는 `generateStaticParams`함수를 통해서 페이지가 어떻게 설계가 되었든 간에 무조건 정적 페이지를 생성하도록 설정을 해뒀다. 그래서 북 페이지는 빌드 타임에 생성이 되면서 fetch 메서드를 통해서 백엔드 서버로부터 현재 도서의 정보를 불러오게 된다.
- 그런데 백엔드 서버는 접근할 수 없는 상황이다. 왜냐하면 지금은 빌드의 과정이 PC가 아닌 `Vercel` 서버에서 이루어지고 있기 때문에 정상적으로 데이터를 불러올 수 없다. 코드상에 `process.env.NEXT_PUBLIC_API_SERVER_URL` 환경변수를 통해서 접근되도록 설정한 백엔드 서버의 주소는 `http://localhost:12345`로 설정이 되어 있다. 이 주소는 우리 자신의 PC를 의미하는 것으로 실습 때는 잘 접근하 수 있었지만 `Vercel`의 서버에서 빌드를 할 때에는 백엔드 서버에 접근을 할 수 없다. 그렇기 때문에 `Vercel` 상에서 빌드를 할 때에는 실제로 배포해둔 백엔드 서버의 주소를 활용을 해야 된다.
- 앞서 배포해둔 백엔드 서버의 배포 URL을 환경 변수로 추가로 등록해준다. 이때 Vercel에서 복사해야 할 배포 URL은 `Deployment` 밑에 있는 주소가 아닌 `Domains` 밑에 있는 주소이다.
- 그리고 배포된 `onebite-books-app` 프로젝트의 Vercel 페이지에서 `setting` 탭에 들어가보면 `Environment Variables`라고 해서 환경 변수를 설정하는 섹션이 있는 것을 볼 수 있다.
- 해당 섹션에서 새로운 환경 변수를 추가해주면 된다. `.env` 파일에서와 같은 `NEXT_PUBLIC_API_SERVER_URL`을 key로 하고 value를 `https://`를 포한하여 공백없이 배포한 백엔드 API 서버 URL을 붙여넣어주면 된다.

  <img width="700px" src="https://github.com/user-attachments/assets/d98cd851-130b-4362-886e-e6a78babceb9">

  > Vercel 환경변수 설정

- 환경변수도 다시 설정해주고, `Deployments` 탭에서 빌드에 실패했던 항복의 더보기 메뉴에서 `redeploy`를 선택해서 다시한번 빌드를 실행하고 재배포 결과를 확인해볼 수 있다. `Redeploy`를 누르면 모달창이 하나 뜨는데 그냥 `Redeploy` 버튼을 클릭해주면 된다.

  <img width="700px" src="https://github.com/user-attachments/assets/4096fa8a-a97c-4c1d-a925-2c8440758f76">
  <img width="700px" src="https://github.com/user-attachments/assets/20ac113b-ca3a-461b-b885-03a5482f90df">

  > Vercel deployments 탭에서 Redeploy

- 프로젝트 배포가 성공하면 Domains 밑의 URL을 통해서 배포한 프로젝트에 접속할 수 있다. 그리로 배포 ULR을 카카오톡 같은 SNS에 서비스의 주소를 붙여넣어 보면 조금 로딩이 걸릴 순 있지만 한입북스 썸네일 이미지와 함께 openGraph 태그까지 잘 적용이 된 것을 확인할 수 있다.

  <img width="400px" src="https://github.com/user-attachments/assets/6994ae42-fe53-48d8-81d2-1157e7a57058">

  > 카카오톡과 같은 SNS에서 보여지는 openGraph

## 배포 후 최적화

- Next.js 앱을 개선한 뒤에 다시 배포하는 작업을 진행한다.
- `Vercel`에 배포한 서비스에 들어와 보면 기능들은 문제없이 잘 작동하고 있지만, 페잊를 새로고침을 해본다던가 하나의 도서 아이템을 클릭해서 도서의 상세 페이지로 이동해 보면 생각보다 느리게 동작한다는 것을 발견할 수 있다. 이렇게 되는 이유는 물론 `Vercel`을 무료 플랜으로 사용하고 있기 때문에 그런 것도 있지만 코드 상에 실습을 목적으로 스트리밍이나 서버액션 등을 설정할 할 때 `delay`를 걸어뒀다던가, 굳이 `dynamic page`로 제공할 필요가 없는 페이지도 강제로 설정을 해뒀기 때문에 조금 느리게 동작할 수 있다.
- 그래서 대부분의 페이지를 `Static page`로 제공하고, 스켈레톤 동작을 확인하기 위해 적용해뒀던 지연함수를 전부 제거하는 식으로 프로젝트 성능을 전반적으로 개선한 뒤 재배포하도록 한다.
- 인덱스 페이지에서는 불필요한 import와 delay 함수를 제거하고, 강제로 dynamic page로 설정한 `Router Segment Option`로 제거하면서 `Suspense` 컴포너트도 제거해준다. 이렇게 해주면 인덱스 페이지는 `Static Page`로 설정이 되어서 조금 더 빠르게 사용자들에게 제공될 수 있다.
- 서치 페이지도 강제 지연 설정인 delay 함수를 제거해준다.
- 북 페이지는 `generateStaticParams` 함수를 통해서 1 ~ 3번까지의 도서 페이지만 정적으로 생성하고 있는 코드를 존재하는 모든 도서 페이지들을 전부 정적으로 빌드타임에 만들어 두도록 하여 훨씬 빠르게 사용자들에게 페이지를 제공할 수 있도록 한다.
  ```typescript
  export async function generateStaticParams() {
    const response = await fetch(`${SERVER}/book`, {
      cache: 'force-cache',
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const books: BookData[] = await response.json();
    return books.map((book) => ({ id: book.id.toString() }));
  }
  ```
- 서버액션에서도 불필요한 import와 delay 함수를 모두 제거해준다.
- 이렇게 작업을 완료해주었다면 프로젝트를 다시 배포한다. 이번에는 `--prod` 옵션 붙여서 프로덕션 모드로 프로젝트를 배포하라는 의미로 터미널에 입력해준다.

  ```bash
  # 프로덕션 모드로 배포
  vercel --prod
  ```

- 배포 결과를 페이비벼로 확인해보면 이제 인덱스 페이지는 `Static Page`로 잘 제공이되고 있고, `/book/[id]`의 도서 상세 페이지의 경우 12개의 등록된 모든 도서 페이지가 전부 정적으로 빌드 타임에 미리 생성이 된 것을 볼 수 있다. 배포 서비스를 새로고침만 해보아도 개선 전과 달리 매우 빠른 페이지 응답성을 보임을 확인할 수 있다.

  <img width="700px" src="https://github.com/user-attachments/assets/9b5304c1-9b51-4724-b86b-809b1a512995">

  > 개선 후 페이지별 배포 결과 확인

- 사실 `Vercel`을 통해서 프로젝트를 배포한 상황이라면 코드 상에서 할 수 있는 최적화 말고도 Vercel 플랫폼에서 진행할 수 있는 추가적인 최적화 방법이 존재한다.
- 배포한 프로젝트 페이지에서 환경변수를 설정했었던 `Setting` 탭에 들어가면 `functions`라는 섹션이 있다. 최상단에 `Function Region`을 설정할 수 있는 공간이 있는 것을 알 수 있다. `Function Region`이 무엇이냐면 Next App의 페이지들이 어떠한 Region (물리적 장소)에서 제공이 될 것인지 결정하는 섹션이다. 기본값이 `Washington, D.C, USA`이 되어 있는 것을 `Asia pacific`에 `Seoul, South Korea`로 설정해준다. Region을 변경한 후에는 다시 한번 배포를 해줘야 한다. 즉, 프로젝트의 터미널에 `vercel --prod` 명령어를 입력해줘야 한다. 배포가 되면 이제 물리적으로 미국보다 가까운 우리나라 서울에서부터 서비스의 페이지들이 응답이 될 것이다.

  <img width="700px" src="https://github.com/user-attachments/assets/2a37f077-6368-455b-a3a8-33dbf3b32848">
  <img width="700px" src="https://github.com/user-attachments/assets/0340c615-1853-451f-be54-cfb4ea130f43">

  > Vercel의 Function Region 설정의 변경

- 재배포가 완료되면 네트워크 탭을 열고 특정 도서의 페이지로 들어가보면 Next 서버로부터 받은 네트워크 리퀘스트들을 확인할 수 있다. 이때 가장 처음으로 전달받은 응답의 리스폰스를 확인해보면 아래 `Response Headers` 섹션에 `X-Vercel-Id` 값을 확인할 수 있는데 제일 앞에 Region이 명시가 되어 있다. ICN1이라는 Region이 서울을 의미한다. 이렇게 Region까지 바꿔주면 조금이라도 더 사용자들에게 빠르게 페이지를 공급해줄 수 있다.

  <img width="700px" src="https://github.com/user-attachments/assets/72347459-b2b3-4de1-b750-f6eb1266c6e6">
  <img width="700px" src="https://github.com/user-attachments/assets/59773372-25eb-48b4-852b-8be8adcad898">

  > 평균 온라인 강의 완강률과 완강 화면
