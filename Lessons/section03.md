# App Router

## App Router 시작하기

- Next.js 13번에 새롭게 추가된 라우터이며 기존의 Page Router를 완전히 대체함
- 크게 변경되지 않는 사항
  - 네비게이팅 (Navigating)
  - 프리페칭 (Pre-Fetching)
  - 사전 렌더링 (Pre-Rendering)
- 변경되거나 추가되는항사항
  - React 18 신규 기능 추가 (React Server Component, Streaming)
  - 데이터 페칭 방식 변경
  - 레이아웃 설정 방식 변경
  - 페이지 라우팅 설정 방식 변경
- Next 15버전 프로젝트 생성

  - TurboPack은 24.10.25일 기준으로 아직은 조금 실험적인 단계에 있으므로 No

    <img width='800px' src='https://github.com/user-attachments/assets/adaa9eda-4ee7-4212-b939-95157d11c03c' />

    > Next App 최신버전 설치 옵션

```bash
npx create-next-app@latest section03
```

## 페이지 라우팅 설정하기 (App Ver)

- Page Router 버전의 페이지 라우팅은 pages 폴더 하위에 생성해둔 파일의 이름이 곧 경로가 되었다.

  <img width='800px' src='https://github.com/user-attachments/assets/d3461cb6-84fe-4504-a267-1e99bdee433c' />

  > Page Router 버전의 페이지 라우팅 설정

- App Router 버전의 페이지 라우팅은 app 폴더 하위에 `page.tsx`라는 이름을 갖는 파일만 페이지 컴포넌트 파일로 취급된다.

  <img width='800px' src='https://github.com/user-attachments/assets/7dce03e1-91d5-4915-871e-f4453d87190b' />
  <img width='800px' src='https://github.com/user-attachments/assets/b519c731-c3ef-4245-8769-efb3b17ff5ec' />

  > App Router 버전의 페이지 라우팅 설정

- App Router 버전의 Next App에서도 앱 폴더 밑에 구조를 기반으로 페이지 라우팅이 자동 설정된다는 점은 Page Router 버전과 동일하지만 대신에 App Router에서는 `page.tsx`라는 이름을 갖는 파일만 페이지 파일로써 설정된다.
- Next App에서는 쿼리스트링이나 URL 파라미터와 같은 경로상에 포함되는 값들은 페이지 컴포넌트에게 모두 props로써 전달된다.
- 브라우저에서 URI를 `localhost:3000/search?q=파묘`를 사용해서 접근하고, 컴포넌트에 전달된 props를 출력해보면 아래와 같이 쿼리스트링과 URL 파라미터를 포함하는 `searchParams`와 `params` Promise 객체를 확인할 수 있다.

  <img width='400px' src='https://github.com/user-attachments/assets/028b17a7-6489-4f21-9c65-04f392d71b87' />
  <img width='400px' src='https://github.com/user-attachments/assets/a3d89ff8-be3d-42c7-8827-7d0cb3778d0c' />

  > props에 포함된 params, searchParams 객체

- search 페이지에서 함수형 컴포넌트에 async 키워드를 불일 수 있는 이유는 React의 서버 컴포넌트이기 때문이다.
- 서버 컴포넌트의 경우에는 서버 측에서 사전 렌더링을 위해서 딱 한 번 실행이 되기 때문에 비동기적으로 실행이 되어도 전혀 문제가 발생하지 않는다.
- App Router에서 쿼리스트링을 사용하는 Search 페이지 설정

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  return <div>Search Page : {q}</div>;
}
```

- App Router에서 동적 페이지와 URL 파라미터를 사용하는 book 페이지 설정 (Optional catch all segment)
- /book/[id] 폴더의 경우 바로 하위 경로까지만 포함 (ex. /book/1, /book/100)
- /book/[...id] 폴더의 경우 하위 모든 경로를 포함 (ex. /book/1/1, /book/1/100/1000)
- /book/[[...id]] 폴더의 경우 URL 파라미터가 아예 존재하지 않는 경로까지 모두 포함 (ex. /book, /book/1, /book/1/2)

```tsx
// /src/app/book/[[...id]]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div>book/[id] 페이지 : {id}</div>;
}
```

- URL 파라미터(params)나 쿼리스티링(searchParams) 값은 반드시 Promise 객체로부터 꺼내 써야 한다는 것을 주의하자!

## 레이아웃 설정하기

- 레이아웃 파일은 폴더 안에 있는 모든 페이지 컴포넌트에 다 똑같이 적용이 되는 레이아웃을 정의하게 된다.

  <img width='800px' src='https://github.com/user-attachments/assets/ff2630d8-33fc-4e11-ad14-3363d09008ea' />

  > 레이아웃 설정

- `layout.tsx` 파일 위로 경로에 새로운 `layout.tsx` 파일이 하나 추가되면, 레이아웃이 자동으로 중첩되어 적용된다.
- App Router 에서는 레이아웃 파일을 적절한 위치에 배치시켜주는 것만으로도 쉽게 중첩된 레이아웃을 구현할 수 있다.

  <img width='800px' src='https://github.com/user-attachments/assets/7b5d8759-66bf-4547-b4f7-b37d29f94351' />

  > 충접되어 적용되는 layout 컴포넌트

- Root 레이아웃 컴포넌트의 역할은 모든 페이지에 동일하게 적용되는 가장 기본적인 레이아웃으로써 HTML 페이지의 기초 틀을 잡아주는 필수적으로 Next.js App에 존재해야 한다.
- 그렇기 때문에 Root 경로의 layout.tsx 파일은 절대 없어지면 안되며, Next.js App을 생성할 떄 자동으로 생성되는 것이다.
- 만약 루트 경로의 `layout.tsx` 파일을 삭제하면 Next.js가 서비스를 가동할 수 없기 때문에 자동으로 루트 레이아웃 파일을 다시 생성한다.
- 레이아웃 컴포넌트를 우리가 직접 구성을 할 때에는 반드시 children이라는 props를 통해서 페이지 컴포넌트를 전달 받아서 return 안에 어디에 렌더링 할 것인지 배치를 해주어야만 페이지까지 잘 렌더링이 된다.

### Route Group

- 특정 페이지에서만 적용되는 공통 레이아웃 설정은 App Router 버전의 새로운 기능인 `Route Group`이라는 것을 이용하면 된다.
- 폴더명을 소괄호로 감싸주게 되면 이 폴더는 `Route Group`이라고 해서 더 이상 경로에 어떠한 영향도 미치지 않는 폴더가 된다.
- 그렇기 때문에 루트 경로의 `page.tsx` 파일과 search 폴더를 통째로 `Route Group` 폴더에 넣어도 아무런 문제가 발생하지 않는다.
- 정리하면, `Route Group`은 경로상에는 아무런 영향도 주지 않으면서 동시에 각기 다른 경로를 갖는 페이지 파일들을 하나의 폴더 안에 묶어둘 수 있는 기능이다. 이 기능을 통해서 동일한 레이아웃을 적용해줄 수 있다.
- 이전 섹션에서 살펴봤었던 Page Router 버전의 레이아웃 설정보다 훨씬 더 쉽게 다양한 케이스의 레이아웃을 설정할 수 있다.

### 리액트 서버 컴포넌트

- App Router의 핵심 개념 중 하나인 리액트 서버 컴포넌트에 대해 다뤄본다.
- React Server Component는 React v18부터 새롭게 추가된 새로운 유형의 컴포넌트이다.
- 서버측에서만 실행되는 컴포넌트로 브라우저에서 실행되지 않는다.
- Q. (등장배경) Page Router 버전의 Next.js에는 어떤 문제가 있었을까?
- 하이드레이션을 꼭 해야만 하는 상호작용이 필요한 초록색으로 표시해둔 컴폰너트들도 있지만, React Hooks나 이벤트 핸들러가 없어서 상호작용 기능이 없기 때문에 하이드레이션이 필요하지 않는 빨간색으로 표시해둔 정적인 컴포넌트들도 같이 존재한다.
- 그렇기 때문에 브라우저에 전송되는 JS Bundle에 포함되어야 하는 컴포넌트들은 초록색으로 표시해둔 상호작용이 필요한 컴포넌트 뿐이다.

  <img width='800px' src='https://github.com/user-attachments/assets/6c442022-10b4-4446-9f64-47ad53b41490' />

  > 상호작용이 있거나 컴포넌트와 없는 컴포넌트

- 상호작용이 없는 컴포넌트는 굳이 브라우저 측에서 한 번 더 실행(하이드레이션)될 이유가 없다.
- 페이지 라우터는 이런 부분을 신경 쓰지 않기 때문에 어떠한 컴포넌트든 페이지에 포함되어 있기만 하면 JS Bundle로 한꺼번에 다 묶은 다음에 그대로 브라우저에게 전달해 버린다. 어쩔 수 없이 불필요하게 많은 컴포넌트들이 JS Bundle에 포함이 될 수 밖에 없으며, 결국 JS Bundle 용량이 너무 쓸데없이 커지게 되어 버렸다. 그로인해 bundle을 불러오는 데 걸리는 시간도 오래 걸리며, 하이드레이션을 진행하는 시간도 늘어나버리기 때문에 결국 TTI(Time to Interaction)까지 늦어져 버리게 된다는 문제점이 있었다.

  <img width='800px' src='https://github.com/user-attachments/assets/09501078-6111-46a0-847a-9f2dc7a34d6d' />

  > Page Router의 문제점

- 이런 Page Router의 문제점을 해결하는 방법은 JS Bundle에 포함될 필요가 없었던 빨간색 컴포넌트들이 번들에 포함되지 않으면 된다.
- 그렇게 되면 JS bundle의 용량이 크게 줄어들기 때문에 하이드레이션에 걸리는 시간도 줄어들게 되고 TTI까지 걸리는 시간도 줄어든다.

  <img width='800px' src='https://github.com/user-attachments/assets/14dac69e-e418-4bae-b1b4-e645435e0c40' />

  > JS Bundle을 최소화하여 Page Router의 문제점을 해결

- 상호작용이 없는 빨간색 컴포넌트들을 클라이언트 측에 전달되지 않도록 다른 유형으로 분류할 필요가 있다. 그리고 분류된 컴포넌트들은 Next 서버 측에서 사전 렌더링을 진행할 때 UI를 렌더링하기 위해서 딱 한번만 실행되어야 한다.
- 이렇게 Next 서버측에서 사전 렌더링을 진행할 때만 동작하도만 설계된 컴포넌트가 `React Server Component`이다.
- 정리하면 일반적인 컴포넌트들과 달리 상호작용이 없어서 서버 측에서 딱 한번만 실행되는 컴포넌트들은 `React Server Component`로 분류하고, 반대로 상호작용이 있어서 하이드레이션이 필요하기 떄문에 서버와 브라우저에서 모두 다 한번씩 똑같이 실행이 되는 기존에 우리가 써오고 있던 클래식한 컴포넌트는 서버의 반대말 격인 `React Client Component`라고 분류한다.

  <img width='800px' src='https://github.com/user-attachments/assets/8426a491-213a-4c93-9e89-5018b0b52c3e' />
  <img width='800px' src='https://github.com/user-attachments/assets/87bbe673-9d83-4ddc-a23b-05ee89fb761d' />

  > Page Router의 문제점으로 작용하는 TTI 시간 단축을 위한 컴포넌트의 분류

- 이제 Next 서버가 브라우저로부터 접속 요청을 받아서 사전 렌더링을 진행하는 과정에서는 HTML 페이지를 한번 생성해야 되기 때문에 서버 컴포넌트이건 클라이언트 컴포넌트이건 모두 동일하게 한번은 실행이 되겠지만 그 이후에 `Hydration`을 위해서 컴포넌트들을 모아 JS bundle로 전달하는 과정에서 `Server Component`들은 제외되게 된다. 그래서 `Client Component`들만 JS bundle에 포함되어서 브라우저에 전달이 되기 때문에 초록색인 `Client Component`들만 브라우저, 즉 클라이언트 측에서 한 번 더 따로 실행되게 된다.
- 이제 서버에서만 실행되는 컴포넌트들을 `React Server Component`라고 따로 분류를 할 것이기 때문에 그렇게 분류되지 못한 나머지 일반적인 컴포넌트들은 `React Client Component`라고 부른다.
- Next.js 공식 문서에서는 페이지 대부분을 `React Server Component`로 구성하고, `React Client Component`는 꼭 필요한 경우에만 사용할 것을 권장한다.
- 왜냐하면 페이지 내부에 클라이언트 컴포넌트의 개수가 줄어들면 줄어들수록 결국 넥스트 서버가 브라우저에게 전달하게 되는 JS bundle의 용량과 이어지는 TTI 시간도 줄어들기 때문이다.
- 클라이언트 컴포넌트보다는 페이지의 대부분을 서버 컴포넌트로 구성하도록 하자.
- 서버 컴포넌트는 따로 만들어줄 필요가 없다. App Router에서는 기본적으로 모든 컴포넌트가 다 서버 컴포넌트가 서버 컴포넌트로 작동하기 떄문이다.
- 서버 컴포넌트는 서버 측에서만 실행되기 때문에 `secretKey`와 같은 값을 서버 컴포넌트 내부에서 사용한다고 하더라도 클라이언트 측에서는 이 `secretKey`라는 코드가 전달조차 되지 않기 때문에 아무런 보안적인 문제도 발생하지 않는다.
- 또한 서버 컴포넌트 안에서 직접 데이터 fetching 하도록 설정할 수도 있다. 이 의미는 이전 Page Router 버전의 Next App에서 `GetServerSideProps` 나 `GetStaticProps`가 했었던 역할을 App Router의 서버 컴포넌트에서 그대로 설정할 수 있다.
- 서버 컴포넌트에서는 원래 서버에서 할 수 있었던 보안에 민감한 작업이나, 데이터를 패칭해오는 그런 기능 등의 다양한 작업들을 진행할 수 있게 된다. 그것과는 반대로 브라우저에서만 할 수 있는 일들은 서버 컴포넌트 내부에서는 수행할 수 없다.
- 예를들면 `useEffect` 같은 브라우저 측에서만 실행이 가능한 React Hooks를 호출할 수 없다. (호출하면 오류가 발생함)

  <img width='800px' src='https://github.com/user-attachments/assets/596fcf36-88b8-4e37-a577-8f644c3ef5e5' />

  > 사전 렌더링 과정에서 서버 측과 하이드레이션 과정에서 브라우저 측에서 총 2번 실행되는 클라이언트 컴포넌트

- `useEffect`처럼 브라우저에서만 사용할 수 있는 React Hooks를 사용하려면 `use client`라는 디렉티브(지시자)를 파일 안에 명시해서 파일 안에 있는 모든 컴포넌트들을 다 클라이언트 컴포넌트로서 직접 설정해주어야 한다.
- 어떤 컴포넌트가 `Client Component`가 되어야 하고 또 어떤 컴포넌트가 `Server Component`가 되어야 하는가?
  아주 간단하다! 상호작용이 있어야 하면 클라이언트 컴포넌트로 만들고, 만약에 그렇지 않다면 전부 서버 컴포넌트로 만들어주면 된다.
- Link 태그와 같이 HTML 고유의 기능을 사용하는 것은 JS 기능을 활용하는 상호작용에는 해당하지 않는다.
- 한입북스의 메인 페이지에서는 Search bar 컴포넌트만 클라이언트 컴포넌트로 만들어주면 된다. 왜냐하면 이 컴포넌트는 실시간으로 사용자가 입력하는 Input 값을 state에 보관하고 있고, 게다가 엔터를 누르면 onKeyDown 이벤트 핸들러가 작동해서 페이지를 프로그래메틱하게 이동시켜 준다.
- 현재 임시 서치바는 layout.tsx 파일에 위치하고 있다. 보통 될 수 있으면 클라이언트 컴포넌트의 양은 줄여야 하기 때문에 이런 경우에는 보통 layout 전체를 클라이언트 컴포넌트로 만들기 보다는 서치바만 따로 클라이언트 컴포넌트로 만들어서 배치를 한다.
- 추가로 App 폴더 하위에 페이지나 레이아웃을 위한 파일이 아닌 컴포넌트를 위한 파일도 존재한다. 이렇듯이 App Router에서는 파일의 이름이 `page`나 `layout`이 아니면 그냥 일반적인 JavaScript 또는 일반적인 TypeScript 파일로 간주하기 때문에 컴포넌트를 위한 파일도 App 폴더 안에 만들어 두어도 괜찮다. 이런 특징을 `Co-location`이라고 부르는데, 이 점을 잘 활용하면 페이지마다 필요한 컴포넌넌트들을 페이지 파일과 함께 모아둘 수 있다는 장점이 있다.

## React Server Component 4가지 주의사항

### 1. 서버 컴포넌트에는 브라우저에서 실행될 코드가 포함되면 안된다.

- React Hooks, Event Handler, 브라우저에서 실행되는 기능을 담고 있는 라이브러리

### 2. 클라이언트 컴포넌트는 클라이언트에서뿐만 아니라 서버 측 모두 실행된다. (총 2번)

### 3. 클라이언트 컴포넌트에서 서버 컴포넌트를 import 할 수 없다.

- 위반할 경우 오류가 발생하거나 의도치 않은 동작이 발생한다.
- 이유는 클라이언트 컴포넌트는 서버와 브라우저에서 모두 다 한번씩 실행이 되지만,import되는 서버 컴포넌트는 서버 측에서만 실행이 된다. 그렇기 때문에 서버 측에서 실행될 때에는 두 컴포넌트의 코드가 다 존재하지만, 반대로 하이드레이션을 위해서 한 번 더 실행이 될 때에는 클라이언트 컴포넌트만 존재하게 된다. 결국 하이드레이션 중에 존재 하지 않는 코드(클라이언트 측에서 실행하지 않는 서버 컴포넌트 코드)를 import 하려고 하니 오류가 발생하는 것이다.
- 하이드레이션 중에 서브 컴포넌트가 존재하지 않는 이유는 JS bundle 용량을 줄이기 위해 JS bundle로부터 제외되기 떄문이다. 그래서 서버 컴포넌트의 코드들은 브라우저에게 전달조차 되지 않는다.

  <img width='800px' src='https://github.com/user-attachments/assets/1df127dc-6b59-4c8f-8146-5c31d249233c' />

  > 클라이언트 컴포넌트에서 서버 컴포넌트를 import 할 수 없는 이유

- 아주 복잡한 Next App을 개발하다 보면 컴포넌트 개수가 굉장히 많아지기 때문에 이런 import 실수가 발생하게 될 수 있다. 이럴 때마다 중간중간에 런타임 에러가 발생하면 개발 진행 도중에 굉장히 불편할 수 있기 때문에 Next.js는 이럴 때 오류를 발생시키는 대신에 그냥 서버 컴포넌트를 클라이언트 컴포넌트로 바꿔버린다.
- 클라이언트 컴포넌트에서 서버 컴포넌트를 실수로 import 하게 되면 Next.js는 자동으로 서버 컴포넌트를 클라이언트 컴포넌트로 변경한다. 다시말해, 서버 컴포넌트 파일이 `use client` 같은 디렉티브(지시자)가 없어도 `자동으로 클라이언트 컴포넌트로 변경`한다. 그러므로써 개발 도중에 잦은 오류를 만나는 일을 조금 방지해 주게 된다.
- 오류는 안나더라도 클라이언트 컴포넌트가 늘어날 수록 브라우저에 전돨되는 JS bundle 용량도 커지기 때문에 하이레이션까지 걸리는 시간이 오래걸리므로 App Router 버전에서 클라이언트 컴포넌트의 자식으로 서버 컴포넌트를 배치(렌더링)하는 것은 웬만하면 피하라!
- 그런데 정말 어쩔 수 없이 클라이언트 컴포넌트가 서버 컴포넌트를 반드시 자식으로 두어야 하는 경우가 된다면 아래와 같이 서버 컴포넌트를 클라이언트에서 **바로 `import 해서 쓰지 않고`, 클라이언트 컴포넌트에서 `children props`로 받아서 서버 컴포넌트를 넘겨주는 구조로 코드를 작성**할 수 있다.
- **Next.js에서는 이렇게 children으로 전달된 서버 컴포넌트는 클라이언트 컴포넌트로 변경하지 않는다.** 왜냐하면 children props를 받는 클라이언트 컴포넌트는 해당 서버 컴포넌트를 직접 실행할 필요 없이, 오직 서버 컴포넌트의 결과물(값)만 props로 전달받도록 구조가 변경이 되었기 때문이다. 그래서 결국 클라이언트 측에서는 children props로 값으로 받으면서 렌더링만 하면 되기 때문에 서버 컴포넌트를 실행조차 할 필요가 없어진다.

  ```typescript
  // client-component
  'use client';

  export default function ClientComponent({
    children,
  }: {
    children: ReactNode;
  }) {
    console.log('클라이언트 컴포넌트!');
    return <div>{children}</div>;
  }

  // page.tsx
  ...
  export default function Home() {
    return (
      <div className={style.page}>
        인덱스 페이지
        <ClientComponent>
          <ServerComponent />
        </ClientComponent>
      </div>
    );
  }
  ```

  - 정리하자면 클라이언트 컴포넌트에서 서버 컴포넌트를 직접 import하여 사용하게 되면 import된 서버 컴포넌트는 클라이언트 컴포넌트로 변환이 되기 때문에 되도록이면 children props로 서버 컴포넌트를 전달해서 서버 컴포넌트가 클라이언트 컴포넌트로 변환이 되지 않도록 막아주자!

### 4. 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화 되지 않는 Props는 전달 불가하다.

- 이런 주의사항들을 위반하게 되었을 경우에는 의도치 않은 동작이 발생하거나 오류가 발생할 수 있다.
- `직렬화 되지 않는 Props`란
- `직렬화`(serialization)이란 객체, 배열, 클래스 등의 복잡한 구조의 데이터를 네트워크 상으로 전송하기 위해 아주 단순한 형태(문자열, Byte)로 변환하는 것

  <img width='800px' src='https://github.com/user-attachments/assets/c3bfcc29-3ae1-466c-8955-d15ba7fdb94e' />

  > 직렬화 (serialization)

- 참고로 `JavaScript 함수는 아주 특별하게 직렬화가 불가능하다.` JavaScript의 함수는 코드 블럭들을 포함하고 있는 특수한 형태를 가지고 있기도 하고, 클로저나 렉시컬 스코프 등의 다양한 환경에 의존해 있는 경우가 많기 때문에 그러한 모든 정보들을 다 단순한 문자열이나 바이트의 형태로 표현할 수가 없기 때문이다.
- 서버 컴포넌트와 클라이언트 컴포넌트가 아래와 같이 계층 구조를 가지고 있을 때, 함수라는 값은 직렬화 될 수 없기 때문에 props로써 전달될 수 없다.

  <img width='800px' src='https://github.com/user-attachments/assets/7ea4774e-aa6c-4d94-8eb1-aa85fcd205db' />

  > 서버 컴포넌트에서 클라이언트 컴포넌트에게 함수는 Props는 전달 불가하다.

- 이러한 이유는 구체적으로 서버 컴포넌트가 Next 서버에서 어떻게 실행되는지 먼저 살펴보면 훨씬 더 쉽게 이해할 수 있다.

### Next App에서 서버 컴포넌트의 동작 방식

- 서버 컴포넌트는 앞서 살펴봐온 바와 같이 사전 렌더링이 이루어질 때 클라이언트 컴포넌트와 함께 실행되어 완성된 HTML 페이지를 생성한다. 그런데 이 설명은 간력화된 버전이다. 모든 과정을 다 나열해보면, 먼저 페이지를 구성하는 모든 컴포넌트들 중에서 서버 컴포넌트들 먼저 실행이 되고 난 이후에 클라이언트 컴포넌트들이 뒤이어 실행이된다.

  <img width='800px' src='https://github.com/user-attachments/assets/d7d892e6-60e1-4f77-adca-e1733e12a370' />

  > 서버 컴포넌트의 동작 방식

- 추가로 알아두어야 할 점은 서버 컴포넌트들만 따로 실행을 시키게 되면 그 결과로 HTML 태그가 바로 생성되는 것이 아니라, `RSC Payload`라는 JSON과 비슷한 형태의 직렬화된 문자열이 생성된다는 점이다.
- `RSC Payload`란 React Server Component를 직렬화하여 전송되는 순수한 데이터이다.
- RSC Payload에는 서버 컴포넌트의 모든 정보가 포함된다.

  - 서버 컴포넌트의 렌더링 결과
  - import로 연결된 클라이언트 컴포넌트의 위치
  - 클라이언트 컴포넌트에게 전달하는 Props 값

  <img width='800px' src='https://github.com/user-attachments/assets/29ff8e08-f5a4-45e2-929a-c3d3a5cd902f' />

  > RSC Payload 예시

- 서버 컴포넌트들을 먼저 실행해서 RSC Payload라는 형태로 직렬화하는 과정에서 자신의 자식인 클라이언트 컴포넌트에게 함수 형태의 값을 Props로 전달하고 있다면 그 함수 또한 직렬화가 되어서 RSC Payload에 함께 포함이 되어야 한다. 하지만 JavaScript 함수라는 값은 직렬화가 불가능한 값이기 때문에 안 된다.

## Navigating (페이지 이동)

- 페이지 이동은 Client Side Rendering 방식으로 처리됨 (Page Router 버전과 동일한 방식)
- App Router 버전에서는 Server Component가 추가되어 방식이 아주 작지만 중요한 차이점이 하나 발생하게 된다.
- App Router 버전의 Next.js 앱에서도 Page Router 버전과 마찬가지로 초기 접속 요청 이후에 발생하게 되는 페이지 이동들은 모두 기본적으로는 클라이언트 사이드 렌더링 방식으로 처리를 하게 된다.
- 이때 페이지 이동을 위해서는 브라우저가 이동할 페이지에 대한 데이터가 필요하기 때문에 클라이언트 컴포넌트들의 정보를 포함하는 `JS bundle`과 동시에 서버 컴포넌트들의 정보를 포함하는 `RSC Payload`를 함께 전달해 주게 된다. 브라우저에서는 이렇게 받은 JS bundle을 실행해서 RSC Payload와 합쳐서 페이지를 적절히 교체하게 된다.
![2024-11-12 07 21 14](https://github.com/user-attachments/assets/490aaa61-06f6-47d6-825b-b1040a350047)

  <img width='800px' src='' />
  
  > App Router 버전의 페이지 이동 작동 방식

- Next App일 실행하고 네트워크 텝에서 `Fetch/XHR`이라는 요청만 필터링되게 한 후에, `/search` 페이지로 이동해보면 서치 페이지로 이동을 잘 하면서 `search?_rsc` 라고 해서 현재 페이지에 대한 `RSC Payload`를 잘 불러온 것을 확인할 수 있다.
- `RSC Payload`를 Preview 탭에서 보면 굉장히 복잡한 직렬화된 텍스트가 전달된 것을 확인할 수 있다.

  <img width='800px' src='https://github.com/user-attachments/assets/c32fa6d8-f4b7-42a5-9483-3701b4e89881' />
  
  > 서치 페이지로 이동하면서 불러온 RSC Payload

- RSC Payload가 정상적으로 나오지 않는 경우는 오류가 아니라 캐싱 됐기 때문이다. 이때는 브라우저의 새로고침 아이콘을 마우스 우클릭으로 `캐시 비우기 및 강력 새로고침`을 하거나 단축키 `Ctrl + Shift + R`을 통해 캐시를 지운 다음 인덱스 페이지에서 서치 페이지로 이동을 다시 해보면 된다.
- 서치 페이지로 이동한 다음에 보니 RSC 페이로드만 전달을 받고 있다. 이렇게 되는 이유는 우리가 현재 이동한 서치 페이지가 서버 컴포넌트로만 이루어져 있기 때문이다. 이런 경우에는 페이지 이동 시에 JS bundle로 전달될 클라이언트 컴포넌트가 없어서 RSC Payload만 전달되는 것이다.
- 이전에 실험용으로 만들어둔 ClientComponent를 서치 페이지 하위에 렌더링 되도록 배치하고, JS bundle도 확인하기 위해서 네트워크 탭을 `All`로 변경한 뒤 인덱스 페이지에서 서치 페이지로 이동을 해보면 RSC Payload와 page.js로 되어 있는 JS bundle 파일을 함께 확인할 수 있다.

  <img width='800px' src='https://github.com/user-attachments/assets/48286317-519a-42f3-8b80-0576aea2c079' />
  
  > 네트워크 텝에서 확인할 수 있는 RSC Payload와 JS bundle

- App Router 버전의 페이지 이동은 기본적으로는 Page Router 버전의 페이지 이동과 거의 동일하게 이루어지지만 서버 컴포넌트의 추가로 인해서, 서버 컴포넌트는 `RSC Payload`로 그리고 클라이언트 컴포넌트는 그 다음에 다운로드 되는 `JS bundle`로 전달이 되는 차이점이 생기게 되었다.
- 프로그래메틱한 페이지 이동: Link 태그가 아닌 이벤트 핸들러를 통한 페이지 이동
- 꼭 기억해야 할 점은 이제 App Router 버전의 패키지인 `next/navigation`으로부터 `useRouter`를 불러와 사용해야 한다. 그렇지 않고 Page Router 버전의 패키지인 `next/router`를 불러오면 런타임 에러가 발생하게 된다.

### App Router의 프리페칭

- `Pre-petching` 이란 현재 페이지에서 링크들이 존재해서 이동할 가능성이 있는 모든 페이지의 데이터를 미리 다 불러와 놓는 동작을 프리패칭이라고 말한다.
- 프리패칭은 개발모드에서는 잘 동작하지 않기 때문에, 프로덕션 모드로 실행하여 프리패칭 동작을 확인할 수 있다.

  <img width='800px' src='https://github.com/user-attachments/assets/30d878df-4911-4de2-a9b9-fb2750fc0fd3' />
  
  > 네트워크 텝에서 프리패칭 결과 확인
  >
  > > **항목의 Request URL** <br>
  > > ?\_rsc=pi80z | http://localhost:3000/?\_rsc=pi80z <br>
  > > 1?\_rsc=pi80z | http://localhost:3000/book/1?\_rsc=pi80z <br>
  > > page-1c022e5295ebc014.js | http://localhost:3000/\_next/static/chunks/app/(with-searchbar)/page-1c022e5295ebc014.js <br>

- 인덱스 페이지는 JS bundle와 RSC Payload까지 받고 있는 반면 book/1 경우에는 JS bundle 없이 RSC Payload만 딸랑 받아오고 있다.
- 인덱스 페이지의 경우 정적인 페이지이기 때문에 JS bundle까지 미리 가져오는 것이고, `/book/1` 페이지의 경우 동적 페이지로써 자동 설정이 되어 있기 때문에 JS bundle은 생략하고 RSC Payload만 불러오도록 설정이 된 것이다.
- 빌드 결과를 보면 App Router 버전에서 존재하는 모든 페이지는 기본적으로 스태틱하거나 또는 다이나믹한 페이지로 나뉘게 되는데, `Static Page`는 Page Router로 치면 `SSG 방식으로 빌드 타임에 미리 생성된 정적인 페이지`라고 생각하면 된다. 반대로 `Dynamic Page`는 Page Router로 치면 `SSR 방식으로 브라우저의 요청을 받을 때 마다 생성되는 페이지`라고 생각하면 된다.
- 페이지를 나누게 되는 기준은, 기본적으로 모든 페이지가 `Static page`가 되지만 먄약 페이지 내부에서 쿼리 스트링을 꺼내 온다던가 또는 URL 파라미터를 꺼내서 쓴다던가 빌드타임에 생성하기 어려운 동작을 수행하는 경우에는 자동으로 `Dynamic Page`로 설정이 된다.
- 북 페이지의 경우에는 요청이 들어왔을 때 URL 파라미터를 꺼내다가 써야 하기 때문에 동적인 페이지로 설정이 되었고, 서치 페이지의 경우에도 쿼리 스트링에 따라서 다르게 동작하기 때문에 동적인 페이지로 설정되었다. 그 외 인덱스 페이지나 Not Found 페이지의 경우에는 아무것도 설정을 따로 해준 게 없기 때문에 기본적으로 정적 페잊로 설정이 된 것을 확인할 수 있다.

  <img width='800px' src='https://github.com/user-attachments/assets/a2d86a17-ac5a-470a-87b4-a369e0a8af12' />

  > 빌드 결과

- App Router에서는 모든 페이지가 `Static page`이거나 `Dynamic page` 둘 중 하나로 설정되는데, 이때 이렇게 설정된 페이지의 유형에 따라서 프리패칭의 동작까지도 달라지게 된다. `Static page`의 경우에는 데이터의 업데이트가 추가로 필요하지 않기 때문에 프리패칭으로 RSC payload와 JS bundle을 둘 다 불러오게 되고, 반대로 `Dynamic page`의 경우에는 데이터의 업데이트가 필요하기 때문에 프리패칭으로 RSC Payload만 불러오게 되고 JS bundle의 경우에는 향후에 실제 페이지 이동이 발생했을 때에만 불러오도록 설정이 되어 있다.
- 혹시 인덱스 페이지에서 JS bundle에 프리패칭 안되고 있다면, 가져올 클라이언트 컴포넌트의 JS bundle이 없는 경우이다. 나도 JS bundle이 안보이길래 return문에 클라이언트 컴포넌트를 하아 넣어주었더니 JS bundle을 프리패칭 해온 것을 확인할 수 있었다.

## 한입북스 UI 구현하기

- App Router부터는 Router 객체에 query property가 제공이 되지 않기 때문에 App Router에서는 이런 Query String을 불러오려면 반드시 `useSearchParams`라는 추가적인 Next가 제공(`next/navigation`)하는 Hook을 이용해야 된다.
-
