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
- 이전 섹션에서 살펴봤었떤 Page Router 버전의 레이아웃 설정보다 훨씬 더 쉽게 다양한 케이스의 레이아웃을 설정할 수 있다.
-
