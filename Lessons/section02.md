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
- `...`은 book이라는 경로 뒤에 여러개의 id가 연달아 들어올 있고 그러한 모든 id에 다 대응하겠다는 것을 의미한다.
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

## 한입북스 UI 구현하기
