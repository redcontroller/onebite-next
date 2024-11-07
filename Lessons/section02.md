# Page Router
## Page Router 소개

- 현재 많은 기업에서 사용되고 있는 안정적인 라우터
- React Router 처럼 페이지 라우팅 기능을 제공함
- Page Router는 이름에 걸맞게 pages 폴더의 구조를 기반으로 페이지를 라우팅함
- Pages 폴더 아래에 들어있는 파일명과 폴더명을 기반의 페이지 라우팅
- 이번 시간에 우리는 Next.js의 페이지 라우터에서 제공하는 다양한 기능을 사용하여 정적, 동적, 범용적인 경로 그리고 없는 경로에까지 대응하는 페이지를 만들어 본다.
- 동적 경로 (Dynamic Routes): 경로 상에 변할 수 있는 가변적인 값을 포함하고 있는 경로

  <img width='800px' src='https://github.com/user-attachments/assets/ef6b8b54-a000-40f3-b7d9-6c80b011f059'>

  > Page Router 이미지

- import alias: 절대 경로로 모듈을 import 할 수 있도록 도와주는 기능. 경로가 복잡해지더라도 해당 구문을 사용하면 더 간결할하게 작성할 수 있다.

## Page Router 실습

- pages 폴더 아래 \_app.tsx, \_documents.tsx 의 역할은 Pages 폴더 밑에 있긴 하지만 페이지의 역할을 하는 파일은 아니다. 대신에 넥스트 앱의 모든 페이지에 공통적으로 적용될 로직이나 레이아웃 또는 데이터를 다루기 위해서 필요한 파일들이다.

### \_app.tsx 컴포넌트

- Next.js의 \_app.tsx 컴포넌트의 경우에는 모든 페이지 역할을 하는 컴포넌트들의 부모 컴포넌트가 된다.
- \_app.tsx 컴포넌트는 페이지와 페이지의 컴포넌트를 받아 뿌려주고 있다.

### \_document.tsx 컴포넌트

- \_document.tsx 컴포넌트는 모든 페이지에 공통적으로 적용되어야 하는 Next.js 앱의 HTML 코드를 설정한다. 기존 리액트 앱의 index.html과 거의 비슷한 역할을 한다.
- \_document.tsx 컴포넌트에는 모든 페이지에 적용되어야 하는 메타 태그를 설정한다거나, 폰트를 불러온다거나, 캐릭터 셋을 설정한다거나, 구글 애널리틱스 같은 서드 파티 스크립트를 넣는다는 등등의 HTML 태그를 관리하는 작업을 한다.

### next.config.mjs

- 넥스트 앱의 설정을 관리하는 파일
- reactStrictMode는 true에서 false로 꺼둔다. 이유는 개발모드로 실행했을 때 컴포넌트를 두 번이나 실행하기 때문에 디버깅에 불편함이 있기 때문이다.

### search 페이지: 쿼리스트링 (useRouter)

- 쿼리스트링의 경우에는 페이지의 경로에는 영향을 주지 않는다. 쿼리스트링을 읽어오기 위해서 페이지 경로에 따로 설정해줄 필요는 없다. 대신에 컴포넌트 내부에 useRouter 훅을 불러와서 라우터의 쿼리라는 프로퍼티를 통해서 불러온다.
- 쿼리 스트링을 읽어오기 위해 2번 실행된다. 첫번째 실행에서는 쿼리값이 없고, 두번째 실행에서 쿼리값일 있음을 확인해볼 수 있다.

### books 페이지: URL 파라미터

- 동적 경로를 갖는 페이지를 생성하는데 사용된다.
- Next.js가 대괄호가 포함된 파일명을 보고 /book/[id] 라는 가변적인 URL 파라미터를 갖는 동적 경로에 대응하는 파일이라는 것을 인식한다.
- URL 파라미터도 query 스트링과 같은 방식으로 라우터 객체에 저장된다.
- 파라미터가 id를 key로 하여 저장되어 있는 이유는 앞서 Page에 대응하는 이름을 정할 때 [id].tsx 라는 이름으로 만들어 두었기 때문이다.
- 현재는 `/book/123` 이런 식의 바로 아래 경로에만 대응하지만 그 하위로 `/book/1/12/213/23/13` 식의 경로에도 대응하려면 [...id].tsx 형태로 변경해주면 된다.
- `...`은 book이라는 경로 뒤에 여러개의 id가 연달아 들어올 수 있고 그러한 모든 id에 다 대응하겠다는 것을 의미한다.
- Next.js에서는 특별히 이런 식으로 설정되어 있는 경로를 모든 경로를 다 잡아채겠다는 의미로, Catch All Segment (구간)라고 부른다.
- `Catch All Segment` 형태로 설정되어 있는 URL 파라미터들은 컴포넌트의 라우터 객체에 배열식으로 저장이 된다.

  <img width='800px' src='https://github.com/user-attachments/assets/ad349075-0928-4195-b932-8d073010cf5a'>

  > 배열형태로 저장되는 URL 파라미터들

- Catch All Segment로도 대응할 수 없는 경로가 있다. 그것은 URL 파라미터가 아무것도 없는 상태의 경로이다 (/book 으로 끝나는 경우).
- 이러한 경우 두가지 방식으로 대응할 수 있는데 같은 book 경로에 index.tsx 파일을 생서해주던지, 범용적으로 book 이후 어떤 경로가 나오든 안 나오든 대응이 가능한 방법을 사용하는 것이다.
- index.tsx 역할까지 겸용하는 완전히 범용적인 페이지로 이후 모든 경로를 포한하는 경우에는 [[...id]].tsx 처럼 폴더 명에 대괄호를 한번 더 씌워주면 된다. 이렇게 설정된 페이지를 `Optional Catch All Segment`라고 부른다.

### 404 페이지

- 없는 경로에 대응할 수 있다.
- Pages 폴더 밑에 404.tsx 파일을 만들면 된다.

## 네비게이션

- \<a\> 태그는 클라이언트 사이드 렌더링 방식으로 페이지를 이동시키는 것이 아닌, 일반적인 방식으로 즉 서버에서 새로운 페이지를 매번 다시 요청하는 방식으로 페이지를 이동시켜 주기 떄문에 비교적 느린 방식이다.
- 그렇기 때문에 Next.js에서는 자체적으로 제공하는 내장 컴포넌트인 Link 컴포넌트를 이용하는 게 훨씬 좋다.
- Link 컴포넌트는 기본적으로 a 태그와 사용법이 동일하다.
- 프로그래매틱한 페이지 이동 (Programmatic Navigation) : 사용자가 링크를 직접 클릭했을 때 페이지를 이동시키는 방식이 아니라 특정 버튼이 클릭이 되었거나, 특정 조건이 만족했을 경우 함수 내부에서 페이지를 이동시키는 방식

### 프리페칭 (Pre-fetching)

- 페이지를 사전에 또는 미리 불러온다라는 뜻을 가지고 있다.
- 현재 사용자가 보고 있는 페이지 내에서 이동할 가능성이 있는 모든 페이지를 사전에 미리 불러놓는 기능이다.
- Next.js가 이런 기능을 기본적으로 제공하는 이유는 사용자들이 다른 페이지로 이동하기 위해 웹페이지 내부의 링크를 클릭하기 전에 현재 페이지에서 이동이 가능한 모든 페이지들에 필요한 데이터를 미리 다 불러와 놓음으로써 페이지 이동을 매우 빠른 속도로 지체없이 처리해주기 위해서이다.
- 즉, 프리페칭은 빠른 페이지 이동을 위해 제공되는 기능이다.

  <img width='800px' src='https://github.com/user-attachments/assets/7f68b5a9-b667-4e04-aade-671b4096f103'>

  > 이동할 가능성이 있는 모든 페이지를 Pre-fetching

- 앞서 배운 서버 사이드 렌더링 방식에 따르면 페이지를 이동시키게 되더라도 사실상 브라우저가 서버에게 어떤 추가적인 리소스를 요청할 필요가 없는 걸로 알고 있다. 그런데 왜 이런 프리패칭 같은 추가적인 데이터를 불러오는 기능이 필요한 걸까?
- Next.js는 우리가 작성한 리액트 컴포넌트들을 자동으로 페이지별로 분리해서 저장을 미리 해두기 때문이다.

  <img width='800px' src='https://github.com/user-attachments/assets/0e8b3909-c3a5-4011-8aaf-24640568a395'>

  > JS 코드를 페이지별로 분리해서 저장

- 그래서 Next.js에 /search 페이지로 접속 요청을 보냈다면, 전달이 되는 JS Bundle 파일에는 search 페이지에 해당하는 코드들만 전달이 되는 것이다.
- 이렇게 동작하는 이유는 이 과정에서 전달되는 JS 코드의 양을 줄이기 위해서이다.
- 만약 모든 페이지의 번들파일을 전달할 경우 한 번에 전달되는 파일의 용량이 너무 커지게 되며 하이드레이션이 늦어진다. JS Bundle의 용량이 커질 수록 브라우저의 다운로드 속도도 느려진다.
- 결과적으로 앱에 상호작용할 수 있게 되는 시간인 TTI가 최종적으로 늦어지게 되는 문제가 발생한다.
- Next.js는 좀 더 경제적으로 이 문제를 해결하기 위해서 사용자가 접속을 요청한 페이지에 해당하는 JS 코드들만 따로 보내주게 된다.
- 그런데 다시 페이지를 이동하려고 하면 이동하려는 페이지에 필요한 JS 코드를 추가로 또 불러와야 되는 과정이 필요하게 된다.
- 페이지별로 JS 코드를 분리해서 작은 용량의 JS 번들을 가져오는 것이 하이드레이션은 빨라질 수 있겠지만 오히려 페이지 이동은 조금 느려지고 비효율적으로 바뀌게 된다. 이러한 문제를 방지하기 위해 Pre-Fetching이라는 기능이 추가로 작용하고 있는 것이다.
- 프리패칭이 발생하면 현재 페이지에서 이동할 수 있는 모든 페이지들을 JS 코드를 사전에 불러와 놓기 때문에 페이지를 이동할 떄에는 결국 추가적인 데이터를 서버에게 요청할 필요가 없어져서 기존 클라언트 사이드 렌더링 방식의 장점대로 굉장히 빠른 속도로 페이지를 이동시킬 수 있게 된다.
- 앞선 강의에서 설명했던 사전 렌더링은 사실 초기 접속 요청 시에 모든 페이지에 대한 JS Bundle 파일이 다 전달되는 것이 아니었고, 현재 접속 요청이 발생한 페이지에 해당하는 JS Bundle 파일만 전달된다. 그 이후 페이지 이동을 빠르게 제공하기 위해서 프리패칭이라는 기능을 통해서 현재 페이지에서 이동할 수 있는 모든 페이지들에 대한 JS 코드를 사전에 불러와 놓게 된다.

  <img width='800px' src='https://github.com/user-attachments/assets/c72428bb-6025-47f3-97af-274e2689adfa'>

  <img width='800px' src='https://github.com/user-attachments/assets/6fd4c962-877e-4cca-91e7-ed47952cb403'>

  > 페이지 이동 시에 발생하는 Next.js 프리패칭

- 최종적으로 초기 접속 요청 시에 하이드레이션을 더 빠르게 처리할 수 있도록 만들어 주면서도 동시에 프리패칭을 통해서 초기 접속 요청 이후에 페이지 이동까지 빠르게 처리할 수 있는 두마리 토기를 다 잡는 방식으로 동작한다.
- `npm run dev`와 같이 개발 모드로 가동해 놓고 있을 때에는 프리패치이 동작하지 않는다.
- 프리패칭을 확인하려면 `npm run build` 명령어로 빌드 후, `npm run start` 명령어로 프로덕션 모드로 실행해야 한다.

  <img width='800px' src='https://github.com/user-attachments/assets/ccd81b3f-31d6-4d1e-946c-fd1c1111eb47'>

  > 빌드를 실행하면 페이지별 분리된 JS Bundle 용량 확인 가능

- 프로덕션 모드로 실행한 뒤 index 경로에 두면, Link 태그를 통해서 프리패칭된 굉장히 많은 네트워크 요청을 확인할 수 있다.
- 프리패칭이 이루어진 페이지는 해당 페이지로 이동한다고 하더라도 네트워크 탭에는 아무런 요청도 추가적으로 발생하지 않는다.
- 간혹 페이지에 대한 JS 코드를 다시 불러오는 네트워크 로그을 확인할 수 있다. 그것은 캐시가 만료되었기 때문에 다시 불러온 것라서 기본적인 프리패칭은 그대로 이루어진다라고 생각하면 된다.

  <img width='800px' src='https://github.com/user-attachments/assets/d36d0032-eee7-4d75-abe1-9ce0f36fc9ff'>

  > 브라우저 네트워크 탭에서 프리패칭 확인

- 기본적으로 Link 컴포넌트로 명시된 경로가 아니라면 프리패칭이 이루어지지 않는다.
- 프로그래메틱한 useRouter 훅을 사용한 경우 프리패칭이 이루어지지 않는데, 라우터 객체의 prefetch 메서드를 통해서 직접 프리패칭하도록 작성할 수 있다.

```javascript
const onClickButton = () => {
  router.push('/test'); // Programmatic page routing
};

useEffect(() => {
  router.prefetch('/test');
}, []);
```

- Link 컴포넌트의 프리패칭을 강제적으로 해제하는 방법

```jsx
<Link href={'/search'} prefetch={false}>
  search
</Link>
```

## API Routes

- Next.js에서 API를 구축할 수 있게 해주는 기능
- 마치 백엔드 API 서버가 하는 일과 동일하게 간단한 API를 구축해서 클라이언트, 즉 브라우저로부터 요청을 받아 DB에서 데이터를 꺼내온다던가 다른 서드파티에 데이터를 불러와서 전달을 해준다던지 하는 일련의 동작들을 직접 만들어 볼 수 있다.

  <img width='800px' src='https://github.com/user-attachments/assets/1ac80021-fd3f-4842-a5a5-c673d05c44b0'>

  > API Routes란?

- Next.js 프로젝트를 처음 생성하면 API 예시가 기본적으로 작성되어 있다.

```javascript
// src/pages/api/hello.ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string,
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' });
}
```

- Next. 앱에서는 Pages 아래 `/api/hello` 처럼 파일을 만들어서 배치해주면 해당 파일은 웹페이지가 아닌 API routes로써 즉, API 응답을 정의하는 파일로써 자동으로 설정이된다.
- API의 경로는 해당 폴더 구조에 맞춰서 경로를 갖게 된다.
- 본 강의에서는 API Routes를 크게 다루지 않으며, 특별한 상황에 놓이지 않았다면 자주 사용되는 기능도 아니기 떄문에 이런게 있구나 하고 가볍게 알고 넘어가면 된다.

## Next.js 스타일링 설정

- Next.js 앱의 스타일링은 사실상 리액트의 컴포넌트 스타일을 설정하는 과정과 동일하다.
- Next.js에서는 app 컴포넌트가 아닌 다른 컴포넌트 파일에서 import 문을 통해 CSS 파일을 그대로 불러오는 것을 제한하고 있다.
- 제한하고 있는 이유는 별도의 페이지 파일에서 CSS 그대로 불러와서 import 하는 경우에는 다른 페이지에 작성된 CSS 코드와 충돌을 일으킬 수 있기 때문이다.
- 만약 A 페이지에 접속했다가 B페이지로 이동하게 되었을 경우에 A.css 파일과 B.css 파일이 브라우저에 함께 로딩되기 떄문에 이러한 클래스 네임들이 서로 충돌되는 문제가 발생하게 된다.
- Next.js에서는 이러한 문제를 애초에 원천 차단하기 위해서 별도의 페이지 파일이나 컴포넌트 파일에서 별도로 CSS 파일을 그대로 import 하는 것을 막고 있다.
- 예외적으로 app 컴포넌트에서는 모든 페이지에서 적용되는 부모 컴포넌트 역할을 하기 때문에 글로벌 CSS 파일을 불러올 수 있다.
- 우리는 `CSS Module`를 사용하면 된다. CSS 파일에 작성해둔 클래스 네임들이 다른 CSS 파일과 중복되지 않도록 클래스 네임들을 자동으로 유니크한 이름으로 파일마다 변환을 시켜주는 기능이다.

```jsx
// index.tsx
import style from './index.module.css';

export default function Home() {
  return (
    <>
      <h1 className={style.h1}>인덱스</h1>
      <h2 className={style.h2}>H2</h2>
    </>
  );
}
```

- CSS 모듈을 활용하면 페이지별로 className이 겹쳐서 발생할 수 있는 문제를 자동으로 유니크한 이름으로 변환해 줌으로써 해결할 수 있다.
- Next.js에서는 페이지별로 CSS의 className이 겹치는 문제를 원천 차단하기 위해서 App 컴포넌트를 제외하고는 글로벌 CSS 파일을 그대로 import 하는 것을 방지하고 있기 때문에 반드시 CSS Module이라는 문법을 활용해 주어야 한다.

  <img width='800px' src='https://github.com/user-attachments/assets/65dc8593-46b9-4bfa-95c2-68694a91aa07'>

  > CSS Module을 사용해 변환된 유니크한 className

## 글로벌 레이아웃 설정하기

- 모든 페이지에 적용되는 글로벌 레이아웃을 적용할 때에는 root 컴포넌트인 App 컴포넌트에 페이지를 감싸는 형태로 적용해주면 된다.
- 레이아웃을 구성하는 코드가 너무 길어지게 되면 코드 가독성이 안좋아지기 때문에 보통은 글로벌 레이아웃을 위한 컴포넌트를 통해 코드를 분리한다.

## 페이지별 레이아웃 설정하기

- 컴포넌트 메서드 .getLayout를 페이지를 매개변수로 받아서 별도의 Layout 컴포넌트로 감싸서 return 해주는 형태를 가지도록 정의한다.
- JavaScript의 [모든 함수는 객체](https://reactjs.winterlood.com/0f33b159-6b19-433b-8db4-68d6b4a122e0)이기 때문에 메서드를 추가할 수 있다.
- 페이지 역할을 하는 컴포넌트에 별도의 메서드를 추가해두면 App 컴포넌트에서 전달을 받았을 때 꺼내서 사용할 수 있다.
- 이렇게 페이지 별로 개별 Layout을 적용하고 싶다면, Layout을 적용하는 메서드를 컴포넌트에 추가해서 App 컴포넌트에 넘겨주면 된다.
- 문제점은 하위 페이지에 대해서는 getLayout 메서드가 정의되어 있지 않기 때문에 아래와 같은 에러가 발생한다.

```bash
TypeError: getLayout is not a function
```

- 문제점을 해결하기 위해 예외처리와 함께 타입 문제를 해결한 코드는 아래와 같다.

```typescript
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return <GlobalLayout>{getLayout(<Component {...pageProps} />)}</GlobalLayout>;
}
```

# 사전 렌더링과 데이터 페칭

## (복습) React App 에서의 데이터 페칭

1. 불러온 데이터를 보관할 State 생성
2. 데이터 페칭 함수 생성
3. 컴포넌트 마운트 시점에 fetchData 호출
4. 데이터 로딩중일때의 예외처리

```jsx
export default function Page() {
  const [state, setState] = useState();

  const fetchData = async () => {
    const response = await fetch('...');
    const data = await response.json();

    setState(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!state) return 'Loading...';

  return <div>...</div>;
}
```

- 이 방식의 단점: 초기 접속 요청부터 데이터 로딩까지 오랜 시간이 걸림
- 백엔드 서버에 데이터 요청을 보내는 시점이 3번 시점인 컴포넌트가 마운트 되는 시점에 발생하기 때문이다. 에초에 데이터 요청 자체가 늦게 시작하는 것.

  <img width='800px' src='https://github.com/user-attachments/assets/45d27e0b-c0cb-45f3-b880-52666cc8d98e' />
  <img width='800px' src='https://github.com/user-attachments/assets/15afc70c-789f-48c5-bc37-7e5ae713e9e8' />

  > React App에서의 데이터 페칭

- Next.js 에서는 사전 렌더링을 인해 위와 같은 단점을 해결한다.

  <img width="800px" src='https://github.com/user-attachments/assets/829473b6-12bc-4d80-a0c6-027c6055bbf5' />

  > Next App에서의 데이터 페칭

- 추가로 사전 렌더링을 진행하는 과정에서 백엔드에서 현재 페이지에 필요한 데이터를 미리 불러오도록 설정까지 가능하다. 그렇기 때문에 앞서 살펴봤었던 리액트 앱에서의 데이터 페이칭보다 훨씬 빠른 타이밍에 서버로부터 데이터를 요청하고 불러올 수 있게 된다.
- 그로인해 서버가 브라우저에게 전달하는 '렌더링 된 HTML' 파일에는 이미 백엔드 서버로부터 불러온 데이터들이 다 포함되어 있을테니, 결국 사용자에게 데이터 패칭이 이미 완료된 페이지를 추가적인 로딩 없이 바로 보여줄 수 있다.

  <img width="800px" src='https://github.com/user-attachments/assets/a77d7586-c96f-4510-9cb6-0752e2eb2e38' />

  > React와 Next App의 데이터 페칭 요약 정리

## Next.js의 다양한 사전 렌더링

- 의문점: Next App 에서 서버 요청의 지연으로 사전 렌더링이 오래 걸리는 경우에는 차라리 React App에서 처럼 로딩 바라도 보여주는 게 좋지 않을까?
- 그러한 경우는 특별히 해당 페이지의 경우에만 빌드 타입에 미리 사전 렌더링을 미리 다 끝내도록 설정한다던가 등의 다양한 사전 렌더링 방식을 제공하고 있다.

  <img width="800px" src='https://github.com/user-attachments/assets/b83a76d7-3725-4d63-b962-74deca582101'/>
  <img width="800px" src='https://github.com/user-attachments/assets/a6572952-1883-449e-9332-1f91612f58f1'/>

  > 데이터 페칭이 오래 걸리는 경우 대처법 (빌드타임에서의 사전 렌더링)

1. **서버사이드 렌더링 (SSR)**
   - 가장 기본적인 사전 렌더링 방식
   - 요청일 들어올 때마다 사전 렌더링을 진행함
2. **정적 사이트 생성 (SSG)**
   - 빌드 타임에 미리 페이지를 사전 렌더링 해 둠
3. **증분 정적 재생성 (ISR)**
   - 향후에 다룰 사전 렌더링 방식

## SSR 서버 사이드 렌더링

- SSR (Server Side Rendering)은 가장 기본적인 사전 렌더링 방식
- 요청이 들어올 때 마다 사전 렌더링을 진행함

## getServerSideProps 함수

```typescript
export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
```

- 역할: (1) 브라우저를 통해 페이지 경로로 요청이 들어오게 되어 Next 서버가 사전 렌더링을 하게 될 때, (3) 컴포넌트보다 (2) 먼저 실행이 되어서 인덱스 페이지 컴포넌트에 필요한 데이터를 또 다른 백엔드 서버로부터 불러온다던가 하는 기능을 하게 되는 함수
- 즉, 컴포넌트보다 먼저 실행되어서, 컴포넌트에 필요한 데이터를 불러오는 함수
- 반드시 getServerSideProps 함수의 `리턴값은 props`라는 객체 프로퍼티를 포함하는 단 하나의 객체여야 한다.
- 그래야만 Next App이 Props 객체를 읽어와서 페이지 역할을 하는 컴포넌트에게 전달해 줄 수 있기 때문이다.
- 일종의 프레임워크의 강제적인 문법이라고 생각하면 된다.
- 주의할 점은, getServerSideProps 함수는 사전 렌더링을 하는 그 과정에서 딱 한 번만 실행될 것이기 때문에 오직 서버 측에서만 실행되는 함수이다.
- 컴포넌트는 총 두 번 실행이 된다.
  - (1) 브라우저로부터 접속 요청ㅇ르 받았을 때 사전 렌더링을 위해서 먼저 서버 측에서 한번 컴포넌트가 실행
  - (2) JS Bundle 형태로 전달되어 브라우저 측에서 하이드레이션 과정이 진행이 될 때 한 번 더 실행
- 그렇기 때문에 페이지를 보여주는 컴포넌트에 console.log를 찍어보면 터미널에서 한 번, 브라우저 콘솔 창에서 한 번으로 총 두 번 출력된다.
- 요점은 컴포넌트들 또한 서버에서 한 번은 실행되므로 당연히 페이지 컴포넌트 안에서도 어떠한 조건도 없이 `window` 객체를 호출할 수 없다. (오류 발생)
- 서버에서 실행될 때는 `window` 객체는 `undefined`가 된다.

## 브라우저 측에서만 실행되는 코드 작성

- 여러가지 방법이 있지만, 가장 쉬운 방법은 `useEffect`를 사용하는 것이다.
- 이렇게 하면 서버에서는 실해되지 않는다. 왜냐하면 조건 자체가 애초에 컴포넌트가 마운트된 이후, 다시말해 화면에 나타난 이후에 실행되는 함수를 만드는 곳이기 때문에 서버 측에서는 실행되지 않고 오직 브라우저에서만 실행된다.

## getServerSideProps 함수로 전달받은 타입의 정의

- 대부분의 타입 정의들은 사실 Next.js에서 제공하는 것들만 이용해서도 거의 다 가능하다.
- InferGetServerSidePropsType: getServerSideProps 함수의 반환값 타입을 자동으로 추론해주는 기능을 하는 내장 타입. 제네릭으로 함수 이름을 넣어주면 된다.

```tsx
export const getServerSideProps = () => {
  // 컴포넌트보다 먼저 실행되어서, 컴포넌트에 필요한 데이터를 불러오는 함수
  const data = 'hello';

  return {
    props: {
      data,
    },
  };
};

export default function Home(
  props: InferGetStaticPropsType<typeof getServerSideProps>
) {
  console.log(props);

  return ( ... );
}
```

## 병렬로 비동기 함수를 fetch 하기

- (수정 전) 직렬로 동작하는 비동기 함수 2개

  ```typescript
  export const getServerSideProps = async () => {
    const allBooks = await fetchBooks();
    const recoBooks = await fetchRandomBooks();
    ...
  };
  ```

- (수정 후) 병렬로 동작하는 비동기 함수
- 병렬로 API Request가 동시에 발동이 되기 때문에 더 빠르게 페이지가 렌더링된다.

  ```typescript
  export const getServerSideProps = async () => {
    // 인수로 전달한 배열 안에 들어있는 모든 비동기 함수들을 동시에 실행을 시켜주는 함수
    const [allBooks, recoBooks] = await Promise.all([
      fetchBooks(),
      fetchRandomBooks(),
    ]);
    ...
  };
  ```

## 쿼리스트링 값을 읽어오기

- 브라우저 주소창에 있는 쿼리 매개변수를 읽기 위해서 `getServerSideProps` 함수에서 context 객체를 사욯할 수 있다.
- context라는 매개변수에는 현재 브라우저로부터 받은 요청에 대한 모든 정보가 들어 있다.
- 콘솔에 찍어보면 많은 정보 가운데서 하단에 query 객체를 가지고 있음을 확인할 수 있다.

  ```typescript
  export const getServerSideProps = async (
    context: GetServerSidePropsContext
  ) => {
    const q = context.query.q;
    const books = await fetchBooks(q as string);
    return {
      props: { books },
    };
  };
  ```

  <img width="800px" src='https://github.com/user-attachments/assets/07ad97d9-82c3-4f89-903e-8f64f64c0048' />

  > context 객체에 들어있는 query 객체

## URI Params 값 읽어오기

- 브라우저 주소창의 파라미터를 읽어오기 위해서 쿼리스트링을 읽어왔던 방식과 같이 `getServerSideProps`함수를 사용한다.
- URI Parameter 정보는 context 객체의 params 객체 안에 담겨있다.

  ```typescript
  export const getServerSideProps = async (
    context: GetServerSidePropsContext
  ) => {
    const id = context.params!.id;
    const book = await fetchOneBook(Number(id));

    return {
      props: { book },
    };
  };
  ```

## 두 번째 사전 렌더링 방식: SSG 정적 사이트 생성

- SSR(서버사이드렌더링)은 매번 새롭게 사전 렌더링을 진행하기 때문에 데이터도 매번 새롭게 다시 불러와서 페이지 내부의 데이터를 항상 최신으로 유지할 수 있다는 큰 장점이 있음
- 반면에 데이터 요청이 늦어지게 될 경우에 사용자의 요청에 응답하는 속도가 함께 느려진다는 치명적인 단점도 존재

  <img width="800px" src='https://github.com/user-attachments/assets/c687c6c1-bae9-41f9-8df7-f2287411206d' />
  <img width="800px" src='https://github.com/user-attachments/assets/f83d6eb4-b0a0-45d2-adda-c2c9c5028e3e' />
  
  > SSR 방식의 장단점

- SSG(Static Site Generation, 정적 사이트 생성)는 SSR의 치명적인 단점을 해결하는 새로운 사전 렌더링 방식
- 빌드 타임에 페이지를 미리 사전 렌더링 해 둠
- 브라우저가 접속 요청을 보내게 되면 Next.js 서버는 빌드 타입에 미리 만들어 두었던 페이지(미리 사전 렌더링을 마친 페이지)를 지체없이 매우 빠른 속도록 바로 응답하게 된다.

  <img width="800px" src='https://github.com/user-attachments/assets/3811ad30-3e95-4f98-9db4-9f507972c370' />
  <img width="800px" src='https://github.com/user-attachments/assets/24e6cffb-2253-410f-9e6f-3e01b7716b9a' />
  
  > SSG 동작 방식

- SSG는 이런 방식으로 동작하기 때문에 빌드 타입에 일어나는 사전 렌더링 과정에서 백엔드 서버에게 데이터를 불러와야 하는 과정이 추가로 필요하다고 하더라도, 또 그 과정이 특정 상황으로 인해서 또 매우 오래 걸리게 된다고 하더라도 사용자의 경험에는 아무런 영향을 미치지 않는다.
- 왜냐하면 모든 상황들은 서버가 가동되기 이전인 빌드 타입에만 일어나는 상황이기 때문이다.
- SSG의 단점은 다시는 페이지를 새롭게 (사전 렌더링) 생성 하지 않기 때문에 우리가 접속 요청을 보내게 되더라도 매번 똑같은 페이지만 응답한다. 결국 최신 데이터를 반영하기는 어렵다.
- 그래서 SSG 방식은 최신 데이터가 빠르게 반영되어야 하는 페이지들 보다는 데이터가 자주 업데이트 되지 않는 정적 페이지들에 훨씬 적합한 사전 렌더링 방식이다.

  <img width="800px" src='https://github.com/user-attachments/assets/306aa901-f20b-4479-a74d-2e621f9fc988' />
  <img width="800px" src='https://github.com/user-attachments/assets/0352fa0a-0dc2-4141-a453-7560398dbcf5' />
  
  > SSG의 장단점

## SSG 정적 경로에 적용하기

- 페이지 파일 안에 getServerSideProps 함수를 만들어서 export 해주면, 해당 파일이 담당하는 페이지는 SSR 방식으로 동작하게 된다.
- 특정 페이지를 SSG 방식으로 작동시키는 방법도 비슷하다. `getServerSideProps`를 `getStaticProps`로 바꿔주기만 하면 된다.
- `getStaticProps`는 `getServerSideProps` 함수와 동일하게 사전 렌더링 과정에서 필요한 데이터를 불러오고, props라는 프로퍼티를 포함하는 객체를 내보내 컴포넌트에게 전달하는 역할을 해줄 수 있다.
- 타입도 `getStaticProps`에 맞춰서 바꿔주면 된다.

```tsx
export const getStaticProps = async () => {
  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks(),
  ]);

  return {
    props: {
      allBooks,
      recoBooks,
    },
  };
};

export default function Home({
  allBooks,
  recoBooks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return ( ... );
}
```

- 그런데 SSG 방식으로 변경한 뒤에 페이지를 새고로침 해보면 SSR 방식처럼 요청이 들어올 때마다 새롭게 사전 렌더링이 진행되고 있다. 이유는 현재 Next App을 개발 모드로 실행하고 있기 때문이다. Next App의 개발 모드는 더 편리한 개발을 위해서 개발자들이 코드를 수정했을 때 수정 결과가 설정해둔 사전 렌더링 방식이 SSG던 아니면 SSR이던 뭐든지 바로바로 반영할 수 있도록 해두었다.
- 진짜 SSG 방식의 동작을 확인하려면 프로젝트를 개발 모드를 중단한 다음 빌드해서 프로덕션 모드로 실행하면 된다.
- Next App을 빌드했을 터미널에 출력되는 기호의 의미를 살펴보면 아래와 같다.

  - 흰색 동그라미: 페이지가 SSG로 동작하고, HTML로 사전 렌더링 된 페이지다.
  - function 기호: 다이나믹 페이지임을 의미한다. 주문형 (on demand)의 의미는 브라우저에게 요청을 맏을 때마다 다이나믹하게 페이지가 계속해서 사전 렌더링된다는 것.
  - 빈 동그라미: 흰색 동그라미와 같이 정적 페이지인데, 해당 페이지에는 `getStaticProps`를 설정해 두지 않았기 때문에 기본 값으로서 설정이 된 정적 페이지(SSG)라는 것.

  <img width="800px" src='https://github.com/user-attachments/assets/7d2d2afd-441e-4fd0-b6e4-dd7a78949f0e' />
  
  > 빌드 결과

- `getStaticProps` 함수를 사용한 인덱스 페이지에만 흰색 동그라미 기호(SSG)가 붙어 있음을 확인할 수 있다.
- API Routes에도 다이나믹 페이지 기호(SSG)가 붙어 있는 것을 확인할 수 있는데, Next.js가 기본적으로 API Routes들을 다이나믹하게 작동하도록 설정해 두었기 때문이다.
- `/404`, `/test`와 같은 페이지는 따로 아무런 설정을 해주지 않았음에도 기본값으로 정적인 페이지로 빌드타임에 미리 사전 렌더링하도록 설정한다. 그래서 기본 값은 SSG와 동일하게 동작한다고 이해하면 된다.
- 이를 통해 알 수 있는 점은 SSG를 설정하는 getStaticProps도 없고, SSR을 설정하는 getServerSideProps도 없다면 기본적으로 SSG 페이지로 설정된다고 이해하면 된다. (**Default 사전 렌더링 방식 - SSG**)
- 프로덕트 환경에서 실행은 `npm run start`이다.
- SSG 방식을 동작하는 페이지는 굉장히 빠른 속도로 화면에 렌더링이 됨을 확인할 수 있으며, 아무리 새로고침을 눌러서 브라우저에서 서버로 계속해서 요청을 보낸다고 하더라도 인덱스 페이지 (SSG 방식으로 빌드 이후에는 다시 생성되지 않도록 설정)에서 서버측 로그에는 아무런 메시지도 출력되지 않는다. (console.log 찍어둔게 있어도)

## SSG 페이지에서 query

- `getStaticProps` 함수에게 전달되는 `GetStaticPropsContext` 타입의 context라는 매개변수에는 쿼리 스트링을 포함하고 있는 쿼리 프로퍼티가 존재하지 않는다.
- 이유는 빌드 타입에 딱 한 번만 실행되는 SSG 페이지에서는 쿼리스트리링을 알 수 없다.
- 쿼리스트링이라는 건 사용자가 입력한 검색어라던가 아니면 리스트의 정렬 기준이라던가 그런 것들이 전달되는 공간이기 때문에 결론적으로 이 쿼리스트링에 어떠한 값이 들어올지는 빌드 타임에 이 `GetStaticProps` 함수 안에서 알아낼 방법은 없다.
- 그렇기 때문에 빌드 타입에 딱 한 번만 실행되는 이 GetStaticProps 함수에서는 context 객체에서 쿼리스트링을 꺼내올 수 없다.

   <img width="800px" src='https://github.com/user-attachments/assets/33ce75a0-81c3-4093-b004-9c464da809b2' />
   
  > query 프로퍼티가 존재하지 않는 GetStaticPropsContext 타입

- 결과적으로 검색 페이지는 SSG 방식으로 동작시킬 수 없다. 엄밀히 말해 쿼리스트링을 꺼내올 수 없기 떄문에 SSG 방식으로는 검색 결과를 서버로부터 불러오는 동작은 수행할 없다.
- 제약사항들이 있음에도 Search 페이지를 SSG 방식으로 동작시키길 원한다면, 쿼리스트링을 꺼내와서 해당 값을 기준으로 검색 결과 데이터를 불러오는 과정을 사전 렌더링 과정 이후에 페이지 역할을 하는 컴포넌트(클라이언트 측)에서 직접 진행하는 방식으로 구현하면 된다. 즉, React 앱에서 했던 방식대로 데이터 패칭을 진행한다.
- Search 페이지는 이제 getStaticProps와 getServerSideProps 함수가 모두 없어졌기 때문에 기본적으로 SSG 방식으로 동작하게 된다. SSG 방식으로 동작하게 되지만 쿼리스트링으로 전달되는 검색어를 빌드 타입에는 알 수 없기 때문에 사전 렌더링 과정에서는 결국 이 페이지의 div 태그의 레이아웃 정도만 렌더링하게 되고 난 뒤 컴포넌트가 마운트된 이후에 클라이언트 사이드 측, 즉 브라우저에서 컴포넌트가 실행되면서 직접 쿼리스트링 검색어를 불러와서 검색 결과 데이터를 클라이언트 사이드 측에서 렌더링하게 되는 방식으로 동작한다.
- `npm run build`를 해보면 이제 동그라미로 설정이 되면서 SSG 방식으로 동작하도록 설정이 된 것을 볼 수 있다.

  <img width="800px" src='https://github.com/user-attachments/assets/deb78eb5-20e8-4690-b28e-e8ed7aa2160f' />
  
  > SSG로 바뀐 Search 페이지

- 프로덕션 모드로 실행하고 난 뒤 브라우저 검색 페이지의 네트워크 탭에서 새로고침을 한번 해주면 넥스트 서버 측에서 보내주는 파일을 확인할 수 있는데, 그 중에 가장 처음으로 보내주게 되는 사전 렌더링 결과인 HTML 파일을 클릭해서 열어보면 검색 결과 데이터는 제외하고 나머지 부분만 렌더링해서 브라우저에게 보내주는 걸 볼 수 있다.

  <img width="800px" src='https://github.com/user-attachments/assets/448a9527-658f-4249-972f-65238ac1f7de' />
  
  > 사전 렌더링된 빈 HTML 파일

- 정리하면, 인덱스 페이지처럼 사전 렌더링을 할 때 빌드 타임에 데이터를 불러오게 하고면싶다면 `getStaticProps` 함수를 사욯하면 된다. 만약에 서치 페이지처럼 쿼리스트리링을 사용하기 때문에 빌드 타임에는 데이터를 미리 불러올 수 없는 페이지라면 해당 데이터를 리액트 앱에서 (클라이언트 사이드 측에서) 직접 패칭해서 불러오도록 설정하는 것도 가능하다.

## SSG 동적 경로에 적용하기

- 아래와 같이 getStaticProps 속성을 주어 동적 페이지를 SSR에서 SSG로 변경할 수 있다.

```typescript
// /book/[id].tsx
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id;
  const book = await fetchOneBook(Number(id));

  return {
    props: { book },
  };
};

export default function Page({
  book,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  ...
};
```

- 동적인 페이지에서는 getStaticPaths가 필요하다.

  <img width="800px" src='https://github.com/user-attachments/assets/6d751b1f-556d-46ec-aa92-a85ca134750b' />
  
  > Server Error 메시지

- Next 앱의 북페이지처럼 동적 경로를 갖도록 설정된 페이지에 SSG를 적용하기 위해서는 사전 렌더링 이전에 해당 페이지에 있는 모든 경로들을 직접 설정하는 작업을 선수로 진행 해주어야 한다. 빌드타임에 어떤 경로들이 존재할 수 있는지 설정하는 작업이 꼭 필요하기 때문이다.
- 이 과정에서 백엔드 서버로부터 현재 DB에 등록된 도서들의 아이디 목록을 받아온다던지, 아니면 우리가 임의로 몇 개의 아이디를 설정하게 되면 그 다음 과정인 사전 렌더링 과정에서는 이러한 경로들에 해당하는 모든 페이지들을 각각 다 생성하게 된다.
- 그리고 나서 빌드가 종료된 이후에 브라우저가 `/book/1` 페이지로 접속을 요청하면 앞서 만들어 두었었던 `/book/1` 페이지를 전달해주는 것이다.
- 경로를 설정하는 함수가 앞서 Error 메시지에 살펴봤던 getStaticPaths라는 함수이다.

  <img width="800px" src='https://github.com/user-attachments/assets/a1909895-4ea5-408b-b461-3d3a1c80a08b' />
  <img width="800px" src='https://github.com/user-attachments/assets/1271ce39-8df3-496c-aab0-e6441098930a' />
  
  > 동적 경로의 SSG 작동 방식

- 정리하면, `getStaticPaths`라는 함수를 호출해서 연재 이 페이지에 존재할 수 있는 경로들을 먼저 설정한 다음에 해당 페이지들을 `getStaticProps` 함수를 일일이 한 번씩 다 호출해서 사전에 여러 개의 페이지를 렌더링하는 방식으로 동작시켜야 된다.
- 참고로 `getStaticPaths` 함수의 return 값인 paths 객체의 URL 파라미터의 값은 반드시 문자열로만 명시를 해주어야 Next가 정상적으로 경로들을 읽어올 수 있다. (프레임워크의 문법)

```typescript
export const getStaticPaths = () => {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
      { params: { id: '3' } },
    ],
    fallback: false,
  };
};
```

- `npm run build`로 빌드를 해보면 `.next/server/book`폴더 아래 정적으로 미리 생성된 HTML파일과 JS 번들을 확인할 수 있다. HTML을 열어보면 내용까지 모두 HTML 사전 렌더링이 완료되어 있는 것을 확인할 수 있다.
- 브라우저가 만약 `/book/1` 주소로 요청을 하게 되면 Next 서버는 지체없이 1.html 파일을 보내주게 되기 때문에 굉장히 빠르게 동작한다.

  <img width="800px" src='https://github.com/user-attachments/assets/e0aeaf75-8b60-42b2-9723-6c47ac901eac' />
  <img width="400px" src='https://github.com/user-attachments/assets/b79254b1-d7c7-440d-9724-14af94a41c6a' />
  
  > 정적 페이지로 만들어진 /book/1 ~ 3 페이지

## SSG 폴백옵션 설정하기

- 추가적인 옵션으로 `fallback` (대체, 대비책, 보험) 이 있다.
- `fallback 옵션`은 존재하지 않는 URL로 접속 요청을 보내게 되었을 때 어떻게 할 것인지 대비책을 설정하는 역할
- fallback에는 총 3가지의 대비책 옵션이 존재한다.
- 가장 기본적인 옵션은 `fallback: false`로 설정해주면 묻지도 따지지도 않고 그냥 존재하지 않는 경로의 요청은 그냥 `404 Not Found` 페이지를 반환하는 식으로 동작한다.
- 도서를 추가 등록하여 페이지가 새롭게 추가될 필요가 있을 떄에도 `fallback 옵션`에 따라서 앞서 설정한 URL 파라미터들 외에는 모두 Not Found 페이지를 반환하게 될 것이기 때문에 정상적으로 모든 도서의 페이지를 사용자에게 제공하기 어렵게 될 것이다.
- 이럴 때에는 `fallback 옵션`을 다른 값으로 설정해서 조금 더 유연하게 대처하도록 만들 수 있다.

> **Fallback 옵션 설정 (없는 경로로 요청시)**
>
> - false: 404 Not Found 반환
> - "blocking": 즉시 생성 (Like SSR)
> - true: 즉시 생성 + 페이지만 미리 반환

  <img width="800px" src='https://github.com/user-attachments/assets/266ee83c-d846-46ff-be2a-4cab928c04dc' />
  
  > `fallback: false 옵션` 작동 방식

  <img width="800px" src='https://github.com/user-attachments/assets/2d7da4e9-59f0-4063-8dde-1b5a4b575ecf' />
  
  > `fallback: "blocking" 옵션` 작동 방식

- `blocking 옵션`은 없는 경로로 요청이 들어왔을 때 해당하는 페이지를 마치 SSR 방식처럼 Next 서버 측에서 즉시 사전 렌더링을 거쳐서 생성해서 반환해 주게 된다.
- `blocking 옵션`을 이용하면 빌드 타입에 사전에 생성해 두지 않았었던 페이지까지 사용자에게 제공해 줄 수 있다는 장점을 갖는다.
- 참고로 `getStaticPaths`에 등록하지 않았지만 `fallback: "blocking"`옵션으로 설정하고 프로덕션 모드로 실행한 상태에서 새롭게 SSR 방식으로 생성된 페이지는 마치 빌드 타임에 생성해둔 페이지와 비슷하게 Next 서버에 자동(`/.next/server/book`)으로 저장이 된다.

  <img width="400px" src='https://github.com/user-attachments/assets/265d2d39-4be5-4ee1-947b-1e078367f573' />
  
  > 새롭게 생성된 뒤 Next 서버에 저장된 `/book/4` 페이지

- 빌드 타임 이후에 생성된 페이지들은 처음 요청할 때에는 즉각적으로 생성 되어야 하기 때문에 SSR 방식으로 동작해서 비교적 느리게 페이지가 렌더링 될 수 있지만 한 번만 만들어 두면 자동으로 Next 서버에 저장이 되기 때문에 이후 동일 경로의 요청에는 페이지를 새롭게 생성할 필요가 없다. 그렇기 때문에 새로고침을 해도 이때에는 기존의 SSG 페이지처럼 매우 빠른 속도로 화면에 렌더링 된다.
- 이런 방식은 마치 SSR과 SSG가 결합된 형태처럼 동작한다.
- 동적 페이지를 구현할 때 빌드타임에 모든 도서의 아이디를 불러오기가 좀 어려운 상황이라면 그럴 때에는 `fallback: "blocking"` 옵션을 이용해서 초기 요청에는 SSR 방식으로 페이지를 새롭게 생성해서 신규 데이터를 반영하도록 하고 그 이후의 요청에 대해서는 SSG 방식으로 저장된 페이지를 매우 빠르게 반환하도록 만들 수 있다.
- `fallback: "blocking"` 옵션에 주의해야 할 점은, 만약 백엔드 서버에게 추가적인 데이터를 요청해야 해서 사전 렌더링 시간이 길어지게 될 경우에는 이 시간 동안에는 브라우저에게 Next 서버가 아무런 응답도 할 수 없기 때문에 어쩔 수 없이 로딩이 발생하게 된다. 그래서 페이지의 크기에 따라서 꽤 오랜 시간을 기다려야 하는 경우가 생길 수도 있다.

  <img width="800px" src='https://github.com/user-attachments/assets/4cf6f89e-2a38-4fe2-a1fc-fee9ed7baa1c' />
  
  > `fallback: "blocking"` 옵션의 주의할 점: 렌더링 지연

- `fallback: "blocking"` 옵션의 렌더링 지연 문제를 해결하고 싶다면 fallback의 세 번째 옵션 true을 활용할 수 있다.
- 해당 옵션은 브라우저로부터 존재하지 않는 페이지를 요청 받았을 때, props가 없는 버전의 페이지를 빠르게 생성해서 즉시 브라우저에게 지체 없이 반환해 주게 된다. (이때, props는 `getStaticProps` 함수가 페이지 컴포넌트에게 전달해주는 페이지에 필요한 데이터를 의미한다.)
- (Props가 없는 페이지: `getStaticProps`로 부터 받은 데이터가 없는 페이지)
- 그래서 데이터를 백엔드 서버로부터 불러오는 복잡하고 오래 걸리는 과정은 생략하고, 일단 컴포넌트가 렌더링하는 레이아웃 정도만 props가 없는 페이지만 사전 렌더링해서 반환한다. 그런 다음에 페이지에 필요한 데이터인 props만 따로 계산을 해서 완료되면 브라우저에게 후속으로 따로 props 데이터를 반환한다.

  <img width="800px" src='https://github.com/user-attachments/assets/30d3bd86-3388-4474-a18c-eea4c71a5c69' />
  
  > `fallback: true` 옵션의 작동 방식

- `fallback: true` 옵션으로 설정해 주면 빌드 타임에 생성해 놓지 않은 페이지를 앞서 살펴본 `fallback: "blocking"` 옵션처럼 사전 렌더링을 제공할 수 있으면서도 동시에 사용자에게 긴 로딩 시간 대신에 데이터가 없는 버전의 페이지라도 먼저 보여줄 수 있다는 장점이 존재한다. (이때는 로딩바를 보여주면 된다.)
- 옵션을 변경한 후에 다시 프로덕션 모드로 실행해서 미리 `getStaticPaths` 함수에 설정하지 않은 페이지에 들어가면 `fallback 상태`에서 데이터가 없기 때문에 페이지가 없어서 문제가 발생했다는 조건문에 있는 문구를 반환한 이후에 UI를 먼저 반환하고 데이터가 채워진다.
- `fallback: true` 옵션 또한 한번 생성한 페이지는 서버에 저장된다.
- \* fallback 상태: 페이지 컴포넌트가 아직 서버로부터 데이터를 전달받지 못한 상태
- 너무 빨라서 잘 안보일 때는 network 탭에서 `throttling` 이라는 도구를 이용해서 브라우저의 네트워크 요청을 강제로 느리게 만들어 볼 수 있다.

  <img width="800px" src='https://github.com/user-attachments/assets/81a9845a-048e-480d-a373-d398ce6569f2' />
  
  > Network 탭의 스로틀링 도구

- 데이터가 `fallback 상태`에 빠졌을 때는 '로딩 중입니다'가 나오도록 하고, 데이터가 진짜 없을 때에는 '문제가 발생했습니다'를 구분 짓기 위해서는 아래와 같이 `isFallback` 이라는 프로퍼티를 이용하여 작성해볼 수 있다.

```typescript
const router = useRouter();

if (router.isFallback) return '로딩 중입니다.';
if (!book) return '문제가 발생했습니다. 다시 시도하세요.';
```

- 이제 없는 도서 id를 조회할 경우에는 fallback이 끝났는데도 book 데이터가 없으니 '문제가 발생했습니다'라는 텍스트가 렌더링이 된다.
- 또는 아래와 같이 getStaticProps에 `notFound: true`를 반환해서 404 페이지를 렌더링해줄 수도 있다.

```typescript
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id;
  const book = await fetchOneBook(Number(id));

  if (!book) {
    return { notFound: true };
  }

  return {
    props: { book },
  };
};
```

## ISR

- ISR(Incremental Static Regeneration, 증분 정적 재생성): 단순히 SSG 방식으로 생성된 페이지를 일정 시간을 주기로 다시 생성하는 기술
- SSG는 빌드 타임에 미리 정적으로 생성한 이후에는 다시는 생성이 되지 않기 때문에 매 요청마다 똑같은 페이지만 계속 반환한다. 그래서 속도는 빠르지만 최신 데이터를 반영하기에는 많이 어렵다.

  <img width="800px" src='https://github.com/user-attachments/assets/fd33d6d6-1fa9-466d-8e43-d0593d0dee6e' />
  <img width="800px" src='https://github.com/user-attachments/assets/825fb905-4922-494f-9644-d649111665dc' />
  
  > SSG 방식에 유통기한을 포함한 개념인 ISR

- SSG 방식으로 빌드 타임에 생성된 정적 페이지에 일정 시간을 주기로 페이지를 다시 생성하도록 설정할 수 있음
- ISG 방식은 시간을 타이머로 맞춰서 칼같이 업데이트하는 것은 아니다. 60초로 시간을 설정했다면, 60초 전까지는 SSG 방식으로 생성한 페이지 v1을 반환하다가 60초 이후에 접속 요청일 발생하게 되면 v1을 일단 반환하고 서버에서 v2를 다시 생성한다. 그리고 이후 요청에 대해서 새로운 데이터가 반영된 재생성된 v2 페이지를 반환한다.

  <img width="800px" src='https://github.com/user-attachments/assets/4e3557ac-4869-44a2-9a75-5a8eaed8a477' />
  <img width="800px" src='https://github.com/user-attachments/assets/8d38125a-c5c6-4ab0-a65f-67ba2eda5541' />
  
  > ISR 작동 방식

- ISR은 굉장히 빠른 속도록 브라우저에게 정적 페이지 응답이 가능하다는 기존의 SSG 방식의 장점과 주기적으로 페이지를 업데이트 해줄 수 있기 때문에 최신 데이터를 반영할 수 있다는 SSR 방식의 장점까지 함께 가지고 있는 렌더링 전략이다.
- Revalidate: 재검증하다, 재생성하다.
- 아래와 같이 설정해주면 인덱스 페이지를 3초 주기로 재검증 하겠다는 의미이다.

```typescript
export const getStaticProps = async () => {
  console.log('인덱스 페이지');

  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks(),
  ]);

  return {
    props: {
      allBooks,
      recoBooks,
    },
    revalidate: 3,
  };
};
```

  <img width="800px" src='https://github.com/user-attachments/assets/35393fa6-6aab-427e-82bc-10a0e93178f8' />
  
  > 빌드 결과 표시되는 ISR (revalidate: 3)

- 빌드된 프로젝트를 프로덕션 모드로 실행해보면 3초 이내에는 같은 화면이지만 이후에는 랜던 추천 도서가 바뀐 새로운 페이지가 렌더링 된다.
- (강사) Next.js 프로젝트를 할 때에도 되도록이면 ISR 기법을 이용해서 페이지를 구성하는 것을 가장 추천한다.

## ISR 주문형 재 검증(On-Demand-ISR)

- 앞서 추천한 시간 기반의 ISR 방식을 적용하기 어려운 경우의 페이지가 존재한다.
- 해당 페이지는 시간과는 관계없이 사용자의 행동을 기반으로 데이터가 업데이트 되는 페이지이다.
- 예를들면 커뮤니티 사이트의 게시글 페이지가 그러한데, 게시글 수정이나 삭제는 페이지 데이터를 업데이트 또는 제거한 뒤 새로운 페이지를 렌더링 해줘야 한다.
- 즉, ISR의 단점은 설정한 시간 전에는 최신 데이터를 즉각적으로 반영하기 어렵다는 점이다.
- 또한 사용자의 행동(게시글 수정)이 24시간 이후에 발생한다면 그 이전에 설정한 시간마다 불필요한 페이지의 재생성이 발생한다.

  <img width="800px" src='https://github.com/user-attachments/assets/8c2b5e5e-23be-4cfb-9315-db8941e62aa8' />
  <img width="800px" src='https://github.com/user-attachments/assets/8692153b-8406-4ed7-a1e6-8bf52a217a11' />
  
  > 시간 기반의 ISR의 맹점

  > Q. 그냥 SSR로 처리하면 안되나? <br>
  > SSR의 경우에는 이전에 살펴봤었던 것처럼 브라우저가 요청할 때마다 매번 새롭게 페이지를 사전 렌더링 하기 때문에 응답 시간도 많이 느려지게 되고 동시에 접속자들이 굉장히 많이 모릴게 될 때에는 서버의 부하까지 커지게 된다. 그렇기 때문에 되도록이면 정적인 페이지로써 처리해주는 것이 좋다.

- Next.js는 시간을 기반으로 페이지를 업데이트 하는 기존의 ISR 방식이 아닌 요청을 기반으로도 페이지를 업데이트 할 수 있는 새로운 방식의 ISR도 제공한다.
- 이런 방식의 ISR을 **요청을 받을 때 마다 페이지를 다시 생성하는 ISR 방식**이라고 해서 `On-Demand ISR`이라고 부른다.
- `On-Demand`의 뜻은 요청을 받을 때마다 주문이 들어올 때마다라는 의미를 가진다.
- 쉽게 말하면 이 On-Demand ISR 방식은 페이지의 업데이트를 우리가 직접 트리거링 할 수 있다는 것이다.

  <img width="800px" src='https://github.com/user-attachments/assets/7f8fc755-0e3f-4783-9377-83df17656f71' />
  
  > On-Demand ISR의 작동 방식

- `On-Demand ISR 방식`을 이용하면 페이지를 최신 데이터를 반영하면서도 정적 페이지로써 처리해 줄 수 있다.
- `On-Demand ISR` 사전 렌더링 방식은 아래와 같이 생성한 API Routes를 통해서 요청을 받았을 때 특정 페이지를 다시 생성하도록 만들 수 있다. 이로서 사용자의 행동에 따라 데이터가 업데이트 된다거나 특정 조건에 따라서 데이터가 업데이트 되어야 하는 페이지를 정적 페이지로 유지할 수 있다.
- 이런 ISR 방식은 대부분의 케이스를 커버할 수 있는 굉장히 강력한 사전 렌더링 방식이기 때문에 오늘날 거의 대부분의 Next.js로 구축된 웹서비스들에서는 활발하게 사용이 되고 있다.

```typescript
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await res.revalidate('/');
    return res.json({ revalidate: true });
  } catch (err) {
    res.status(500).send('Revalidation Failed');
  }
}
```

  <img width="400px" src='https://github.com/user-attachments/assets/39a7a9b0-7715-4595-b3b3-90f9ef7f0d73' />
  
  > Revalidate API 주소로 접속

## SEO 설정하기

- Next App에서는 리액트 앱과는 달리 각 페이지별로 메타 태그를 별도로 설정해 줄 수 있다.
- Next App에서는 \<Head\>라는 추가적인 컴포넌트를 이용해서 페이지별로 메타 태그를 설정해줄 수 있다.

```tsx
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={coverImgUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
  ...
```

- 특정 도서의 상세 페이지인 /book 페이지의 경우에는 백엔드 서버에서 불러온 데이터로 메타 태그의 값을 설정해줄 수도 있다.
- **다이나믹한 (동적 경로를 갖는) SSG 페이지에서는 꼭 주의**해야 할 점이 있다.
- `getStaticPaths` 함수에 `fallback: true`로 설정된 상태에서 빌드 타임에 생성되지 않은 경로로 접속 요청을 받았을 때, 네트워크 탭으로 서버로부터 반환되는 HTML 응답을 보면 우리가 설정한 메타 태그는 전부 빠져 있는 것을 볼 수 있다.
- 왜냐하면 코드에서 조건문을 통해서 만약 현재 props의 데이터가 로딩 중이(fallback 상태)라면 일단 '로딩 중입니다'를 페이지 컴포너트에서 반환하다도록 되어 있다. 결국 fallback 상태가 아닐 때 반환될 메타 태그 설정은 적용이 안되는 것이다.
- 메타 태그가 설정되려면 fallback 상태가 끝나고 데이터가 다 들어오고 나서야 페이지에 추가 반영된다.
- 그래서 발생하는 문제는 페이지를 처음 요청했을 때는 메타 태그가 적용되지 않기 때문에 SEO 설정이 안되어 버린다.
- 이럴 때는, 페이지가 `fallback 상태`일 때에도 아주 기본적인 메타태그 설정을 해둘 필요가 있다.
- `/book` 페이지처럼 `fallback 상태`를 사용하는 이런 페이지들에서는 현재 페이지가 fallback 상태에 있을 때에도 기본적인 메타 태그는 리턴해 줄 수 있도록 설정해 두는 것이 좋다.

```tsx
  ...
  if (router.isFallback)
    return (
      <>
        <Head>
          <title>한입북스</title>
          <meta property="og:image" content="/thumbnail.png" />
          <meta property="og:title" content="한입북스" />
          <meta
            property="og:description"
            content="한입 북스에 등록된 도서들을 만나보세요"
          />
        </Head>
        <div>로딩 중입니다.</div>
      </>
    );
  if (!book) return '문제가 발생했습니다. 다시 시도하세요.';

  const { id, title, subTitle, description, author, publisher, coverImgUrl } =
    book;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={coverImgUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div className={style.container}>
  ...
```

## 배포하기

- 보통 프론트엔드 애플리케이션을 배포할때는 클라우드 서비스(firebase, Netlify)를 통해서 배포하게 된다.
- Next.js는 보통 Vercel을 통해서 배포가 이루어진다. Next.js를 만들고 있는 회사가 바로 Vercel 이기 때문에 Vercel 서비스에 배포했을 가장 쉽고 또 빠르게 배포할 수 있다.
- vercel 패키지를 글로벌로 설치하기

```bash
npm install -g vercel
vercel login
vercel
```

  <img width="800px" src='https://github.com/user-attachments/assets/b016dda3-809f-4784-992a-be86b58ee473' />
  
  > vercel 배포 옵션

- 우리가 배포해 놓은 Next App에서는 로컬 PC에서 실행하고 있는 백엔드 서버로부터 데이터를 불러올 수가 없다.
- 백엔드 서버도 배포해준 다음에 배포된 백엔드 서버로부터 데이터를 불러오도록 설정를 해주면 된다.
- 배포한 onebite-books-server 주소를 복사해서 Next.js App에서 이 주소로부터 데이터를 불러오도록 설정을 해준다.
- 변경해줄 파일은 /lib/fetch-\* 파일들의 url을 주소이다.

  <img width="800px" src='https://github.com/user-attachments/assets/fc5cf4b9-f0ae-451d-a728-b3b59abeecac' />
  
  > 배포한 onebite-books-server

- 이제 수정한 코드를 프로덕션 모드로 배포해 본다.

```bash
vercel --prod
```

  <img width="500px" src='https://github.com/user-attachments/assets/37cb2aca-e337-433d-bd52-e5cf8613144c' />
  
  > 카카오톡으로 확인해보는 배포딘 Next App 메타태그
