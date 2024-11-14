## 풀 라우트 캐시 (Full Route Cache)

- `Full Route Cache`란 Next 서버측에서 빌드 타임에 특정 페이지의 렌더링 결과를 캐싱하는 기능
- (1) Next 서버의 빌드 타임에 Next App에 존재하는 페이지들을 중에 `/a`라는 주소를 갖는 페이지가 `Full Route Cache`에 저장이 되는 페이지로 설정이 되어 있었다면 A라는 페이지를 빌드 타임에 렌더링을 진행하게 된다. 일단 해당 페이지에 필요한 데이터들을 `Request Memoization`이나 `Data Cache` 등의 캐싱 기능들을 거쳐서 렌더링을 완료하게 되면 렌더링에 완료된 결과를 `Full Route Cache`라는 이름으로 서버측에 저장하게 된다.
- (2) 빌드 타임이 끝난 이후에 Next 서버가 실제로 가동되었을 때 `/a`페이지로 실제 접속 요청이 들어오게 되면 해당 페이지는 앞선 빌드 타임에 미리 렌더링해서 `Full Router Cache`에 미리 다 저장을 해뒀기 때문에 새롭게 렌더링 할 필요가 없어 `Full Route Cache`가 `Hit`되어서 바로 캐시된 페이지가 브라우저에게 전송된다. 그렇기 때문에 굉장히 빠른 속도로 접속 요청이 처리된다.
- `Full Route Cache`는 `Page Router 버전의 SSG (정적 사이트 생성) 방식`과 거의 유사하게 빌드 타임에 정적으로 페이지를 미리 다 만들어 놓고 캐시에 보관한 다음에 브라우저 요청이 들어왔을 때는 캐시에 저장된 페이지를 그대로 응답해주는 캐싱 기능이다.

  <img width="700px" src="https://github.com/user-attachments/assets/3f3dcfc4-1883-481a-9db7-c7136b891333">

  > Full Route Cache 동작 방식

- Next.js App에서 빌드 타임에 미리 생성된 모든 페이지들은 어떤 기능을 사용하느냐에 따라 자동으로 `Static Page`(정적 페이지)와 `Dynamic Page`(동적 페이지)로 나뉜다.
- 이 둘 중에 `Full Route Cache`에 보관되는 페이지는 `Static Page` 뿐이다.
- Next.js App에서 Static 또는 Dynamic으로 분류하는 기준은 각각 다음과 같다.

  - (\*주의: 서버 컴포넌트만 해당되면 클라이언트 컴포넌트는 페이지 유형에 영향을 미치지 않음)
  - `Dynamic Page`: 브라우저로부터 접속 요청을 받을 때 마다 매번 변화가 생기거나, 데이터가 달라질 경우 유동적으로 변화하는 값들에 대응할 수 없기 때문에 자동으로 동적 페이지로 설정됨
    - 1. 데이터 캐시에 캐싱되지 않는 Data Fetching을 사용할 경우
      ```javascript
      async function Comp() {
        const response = await fetch('...', { cache: 'no-store' });
        return <div>...</div>;
      }
      ```
    - 2. 동적 함수(쿠키, 헤더, 쿼리스트링)을 사용하는 컴포넌트가 있을 때
      ```javascript
      // 쿠키를 사용한는 컴포넌트
      async function Comp() {
        const cookieStore = cookies();
        const them = cookieStore.get('theme');
        return <div>...</div>;
      }
      // 헤더를 사용한는 컴포넌트
      import { headers } from 'next/headers';
      async function Comp() {
        const headersList = headers();
        const authorization = headersList.get('authorization');
        return <div>...</div>;
      }
      // 쿼리스트링을 사용한는 컴포넌트
      async function Page({
        searchParams,
      }: {
        searchParams: Promise<{ q: string }>,
      }) {
        const { q } = await searchParams;
        return <div>...</div>;
      }
      ```
  - `Static Page`: 동적 페이지로 설정될 이유가 없으면 무조건 모든 페이지들이 기본적으로 다 정적 페이지로 설정됨

  <img width="700px" src="https://github.com/user-attachments/assets/425dfad6-3ba5-4e20-854d-91fba54edf85">

  > 동적 페이지와 정적 페이지를 분류하는 기준

- `Dynamic page`의 경우 빌드 타임에 미리 생성되지 않아서 `Full Route Cache`에 저장되지 않기 때문에 브라우저 접속 요청이 들어왔을 때 마다 매번 새롭게 페이지를 렌더링 해줘야 해서 `Static Page`보다는 조금은 느린 속도로 응답이 처리된다. 그렇기 때문에 되도록이면 훨씬 더 빠르게 브라우저에게 응답해줄 수 있도록 대부분의 페이지를 `Full Route Cache`가 적용되는 `Static Page`로써 만드는 것이 더 권장된다.

  <img width="700px" src="https://github.com/user-attachments/assets/ae0bfb2c-749d-49ed-9bb0-de33a9aead7e">
  <img width="700px" src="https://github.com/user-attachments/assets/04ad87c3-b3aa-474a-b6a0-58112b97e260">

  > 동적 페이지와 정적 페이지의 동작 방식

- 그렇다고 해서 `Dynamic Page`가 안티패턴이라거나 절대 사용해서는 안 되는 페이지는 아니다. 다이나믹 페이지를 사용해야 되는 경우도 분명히 존재한다. 예를 들어서 현재 사용자의 정보를 확인하기 위해서 쿠키 값을 조회해야 된다거나, 서치 페이지 같은 경우에는 쿼리 스트링을 어쩔 수 없이 사용해야 되기도 하다.
- 게다가 다이나믹 페이지일지라도 `Full Route Cache`만 적용을 못할 뿐이지 그 외에 `Request Memoization`이나 데이터 캐시는 똑같이 적용을 할 수 있다.
- 각각의 캐시들은 다 독립적으로 동작을 하기 때문에 데이터 캐시를 활용해서 한번 불러온 데이터를 데이터 캐시에 보관하도록 설정을 해 두고 다음 요청일 들어왔을 때 캐싱된 데이터를 바로 사용하도록 만들어서 페이지를 비교적 빠르게 공급할 수 있다.
- 되도록이면 스태틱 페이지로 적용하는 것이 좋긴 하겠지만 그렇다고 해서 다이나믹 페이지라고 항상 엄청 느리거나 안좋은 것까지는 아니다.
- `Full Route Cache` 또한 Revalidate (최신화)가 가능하다. 마치 `Page Router 버전의 ISR (증분 정적 재생성) 방식`처럼 이미 빌드타임에 생성해서 보관해둔 페이지를 특정 시간을 주기로 재생성 (갱신)하는 것도 가능한 것이다.
- A라는 스태틱 페이지가 빌드 타임에 생성이 될 때, 3초 마다 revalidate 되어서 데이터 페칭이 이루어져야 한다면 데이터 캐시에 보관이 되어 있는 데이터 페칭의 결과뿐만 아니라 `Full Route Cache`에 저장이 되는 페이지의 렌더링 결과 또한 Revalidate 타입으로 설정된 3초를 주기로 다시 업데이트가 된다.
- 구체적을 살펴보면 빌드 타임에 초기 페칭된 데이터가 revalidate 설정 시간 이후에 데이터 캐시가 보관하고 있는데 데이터 페칭 결과는 상하게 (stale) 되는데, 그러면 데이터만 업데이트하면 되는게 아니라 결국엔 페이지까지 똑같이 업데이트를 해줘야 한다. 그래서 revalidate 설정 시간 이후 페이지 접속 요청일 들어오면 `Full Route Cache`에서 `Stale` (상했음)이라고만 표시를 일단 해두고 빠르게 일단 캐싱된 페이지를 응답 해준 다음 서버 측에서 최신 데이터를 다시 불러(Revalidate Data)와서 일단 데이터 캐시를 먼저 갱신한 뒤 다시 페이지까지 렌더링을 해서 pre-fetch 캐시의 값을 업데이트 함으로써 `Full Route Cache`에 보관된 페이지를 최신화 한다.
- `Full Route Cache`가 최신화된 이후에 발생하는 요청들에 대해서는 풀 라이트 캐시에 새롭게 업데이트가 된 최신의 페이지를 반환하게 된다.

  <img width="700px" src="https://github.com/user-attachments/assets/99f4aa9d-d4d6-48c8-928e-bd1db3716213">
  <img width="700px" src="https://github.com/user-attachments/assets/58180f38-ec63-42de-beda-84c4b96ad4d5">

  > revalidate 시간이 설정된 Full Route Cache 동작 방식

- 정리하면, Next.js App에 존재하는 어떤 페이지가 현재 `Static page`로 설정이 되어 있고 빌드 타임에 미리 생성이 되어 `Full Route Cache`에 저장이 되도록 설정이 되어 있다고 하더라도 이 페이지를 구성하는 컴포넌트들 중에 하나의 데이터 패칭 요청이라도 revalidate 옵션이 붙어 있는 데이터 페칭 요청이 존재한다면, 설정된 revalidate 시간에 따라서 데이터 캐시뿐만 아니라 페이지 캐싱, 즉 `Full Route Cache` 또한 함께 업데이트 된다. 마치 Page Router 버전에서 살펴봤었던 ISG (Incremental Static Regeneration) 증분 정적 재새성 방식과 거의 유사하게 동작하게 된다.

## searchParams 빌드 에러

- useSearchParams는 반드시 suspense 경계에 포함되어야 한다.

  <img width="700px" src="https://github.com/user-attachments/assets/e0a68274-c5ac-407e-90d6-875e88620516" />

  > 터미널에 출력된 useSearchParams 빌드 에러

- 해당 오류는 인덱스 페이지를 정적으로 생성하다가 SearchBar 컴포넌트에서 useSearchParams라는 훅을 호출하기 때문에 오류가 발생한 것이다. `useSearchParams` Hook은 현재 브라우저로부터 요청을 받은 쿼리스트링 값을 꺼내오는 기능을 한다. 하지만 쿼리스트링은 빌드 타입에 존재하지 않는다. 왜냐하면 쿼리스트링이라는 건 우리가 브라우저 URI 경로 뒤에 `http://localhost:3000?q=한입` 형태로 직접 전달해주는 검색어와 같은 값들이기 때문에 절대로 빌드 타임에는 이런 쿼리스트링이 존재할 수 없다. 그런데 빌드 타임에 Next.js 서버가 인덱스 페이지를 만들기 위해서 SearchBar 컴포넌트를 실행해버리면 `useSearchParams`라는 훅이 호출이 되어야 하기 때문에 문제가 발생하고 있는 것이다.
- 다시 정리하면 빌드 타임에 페이지를 생성하기 위해서 서치바 같은 클라이언트 컴포넌트를 실행할 때 `useSearchParams` 같은 빌드 타임에는 절대로 값을 알 수 없는 이러한 쿼리스트링 같은 값을 불러오는 훅을 실행하려고 하면 지금 현재는 이 값을 절대로 알 수가 없기 때문에 빌드 중에 오류가 발생하게 된다.
- 이 오류를 해결하는 방법은 `useSearchParams` 훅을 사용하고 있는 컴포넌트를 오직 클라이언트 측에서만 실행이 되도록 설정하여 사전 렌더링 과정에서는 완전히 배제되도록 하면 된다.
- `useSearchParams` 훅을 사용하는 컴포넌트가 렌더링 되고 있는 상위 컴포넌트로 이동해서 오직 클라이언트 측에서만 실행이 되도록 리액트의 `Suspense`라는 내장 컴포넌트로 감싸주면 된다. (fallback props로 대체 컴포넌트를 넣어주면 좋다.)

```jsx
return (
  <div>
    <Suspense fallback={<div>Loading ...</div>}>
      <Searchbar />
    </Suspense>
    {children}
  </div>
);
```

- Suspense라는 리액트의 내장 컴포넌트로 서치바 같은 클라이언트 컴포넌트를 감싸주게 되면, 이제부터 이 컴포넌트는 사전 렌더링 과정에서는 배제되고 오직 클라이언트 측에서만 렌더링 되는 컴포넌트로 설정이 된다.
- Suspense 컴포넌트는 미결 또는 미완성이라는 뜻을 가지고 있다. Next.js 서버 측에서 사전 렌더링을 진행할 때 Suspense로 묶여있는 컴포넌트들은 일단 "미완성" 상태로 남겨지게 된다. 즉, 곧바로 렌더링하지 않게 된다.
- 대시 fallback이라는 props로 전달한 대체 UI가 로딩 UI로서 대신에 렌더링이 될 것이다. 그런데 언제까지 미완성 상태로 남아 있냐면 Suspense 하위에 미완성 컴포넌트의 비동기 작업이 종료될 때까지 미완성 상태로 남아 있게 된다.
- 서치바 컴포넌트의 경우 쿼리스트링을 불러오기 위해서 작성해 놓았던 useSearchParams 함수의 경우에는 사실 비동기로 동작하는 React Hook이다. 서치바는 쿼리스트링을 실제로 불러왔을 때 비로소 비동기 함수가 종료된다.
- 비동기 작업을 포함하고 있는 컴포넌트를 자식으로 가진 부모 컴포넌트에서 해당 컴포넌트를 Suspense 컴포넌트로 감싸주게 되면, 서치바와 같이 클라이언트 사이드에서 쿼리스트링을 불러오고 브라우저에 마운트가 된 후에야 비로소 종료가 될테니 Suspense 하위에 배치된 미완성 상태의 서치바 컴포넌트는 서버 측 사전 렌더링에서는 완전히 제외되게 된다.
- 그래서 서치바는 클라이언트 측에서 쿼리스트링을 불러왔을 때에만 렌더링이 이루어지게 되는 것이고 그 전까지는 무조건 Suspense fallback props의 'Loading ...' div 태그를 렌더링 하게 될 것이다.
- 결론적으로 Suspense 컴포넌트로 감싸주는 식으로 설정을 해주면 서버측에서 `useSearchParams`를 통해서 쿼리 스트링을 빌드 타임에 불러오려고 하는 문제를 효과적으로 해결해 줄 수 있다.

### index 페이지에 캐시 적용하기 (정적 페이지로 설정하기)

- 프로젝트를 빌드해보면 동적 페이지로 설정이 되어 있기 때문에 사실상 현재 Next App에는 사전 렌더링된 페이지를 캐싱하는 `Full Route Cache`가 전혀 동작하고 있지 않다.

  <img width="700px" src="https://github.com/user-attachments/assets/9b85da85-9fe5-498f-bc3d-0de9d3b67f6f" />

  > 빌드 결과 not-found 페이지말고는 모두 동적 페이지인 상황

- 권장사항으로 되도록이면 대부분의 페이지를 `Static Page`로 설정해서 `Full Route Cache`캐시가 적용이 되도록 설정하는 것이 브라우저의 접속 요청을 빠르게 처리할 수 있다.
- 우선 인덱스 페이지에 해당하는 모든 컴포넌트들을 점검해본다. **가장 먼저 체크해야 될 컴포넌트는 App 폴더 바로 아래 layout.tsx 파일처럼 루트 컴포넌트이다.**
- 왜냐하면 `RootLayout` 컴포넌트 또한 인덱스 페이지에 포함이 된다. 인덱스 페이지를 렌더링 하려면 루트 레이아웃이 당연히 렌더링이 되어야 하기 때문이다. 루트 레이아웃이 포함하고 있는 컴포넌트에 어떠한 `동적 함수(캐싱, 헤더, 쿼리스트링 등)를 사용`하는 데이터 페칭이 존재하는 지 살펴본다.
- 이때 Footer 컴포넌트는 데이터 페칭이 기본 설정으로 이루어지고 있기 때문에 'no-store' 옵션이 설정되어 동적 페이지로 분류된다. Footer 컴포넌트는 루트 레이아웃에 포함이 되는 컴포넌트이기 떄문에 결국 Footer 컴포넌트 하나 때문에 모든 페이지가 다 다이나믹 페이지로 설정이 될 것이다. 그래서 캐시 설정을 데이터 캐시를 사용하도록 변경한다.
- 백엔드 API를 통해 불러오는 도서의 정보 자체는 수정될 일이 현재로서는 아예 없기 때문에 굳이 'no-store' 옵션을 적용하고 있을 필요가 없다. 그렇기 때문에 'no-store' 옵션을 'force-cache'로 변경해준다.
- RecoBooks 컴포넌트에서도 fetch 메서드를 사요하고 있지만 revalidate 옵션을 사용하고 있다. `revalidate` 옵션 자체는 페이지를 다이나믹하게 설정하는 옵션은 아니었기 때문에 그냥 둬도 무방하다.
- 인덱스 페이지에 포함되는 컴포넌트들을 모두 살펴보며 동적 함수도 없고, 캐싱되지 않는 데이터 패칭도 없도록 변경한 뒤 다시 빌드를 수행해본다.

  <img width="700px" src="https://github.com/user-attachments/assets/de25753a-ecd3-4902-bd4d-7dd7f542545e" />

  > 데이터 페칭 옵션 변경 후 빌드 결과

- 이제 인덱스 페이지 앞에 흰색 동그라미 기호가 붙어서 `Static Page`로 설정이 변경되었다. 이제 `Full Route Cache`가 적용될 것이니 빌드 타임에 사전에 생성되어 서버측에 캐시된 `.next/server/app/index.html` 페이지 파일이 존재함을 확인할 수 있다.
- 이제 인덱스 페이지에 접속해보면 캐싱된 HTML 페이지가 곧바로 응답이 되기 때문에 굉장히 빠른 속도록 화면이 나타나는 것을 볼 수 있다. 또한 3초 주기로 `revalidate`까지 되어 최신 RecoBooks 데이터까지 잘 반영된다. 데이터 캐시가 3초마다 revalidate (최신화) 되면서 결국 `Full Route Cache`된 인덱스 페이지까지 revalidate가 되는 것이다.
- 오늘 실습 내용을 정리해보면, 프로젝트를 빌드해보고 어떤 페이지들이 현재 Static 또는 Dynamic 페이지로 설정이 되어 있는지 확인해 보면서 Dynamic 페이지였던 인덱스 페이지를 Static 페이지로 변경해보았다. 그리고 그러한 과정에서 `Full Route Cache`에 저장되는 Static 페이지라고 할지라고 데이터 페칭에 `revalidate` 옵션이 붙어있으면 해당하는 revalidate 타임에 따라서 계속해서 업데이트가 된다는 것까지 직접 확인해 봤다.

### search 페이지에 캐시 적용하기

- 서치 페이지처럼 실시간으로 사용자의 검색어를 기반으로 어떤 데이터를 백엔드 서버로부터 불러와서 렌더링 해줘야 되는 페이지가 있다면 이런 페이지는 `Static`으로 설정할 수는 없기 때문에 어쩔 수 없이 `Full Route Cache`는 포기해야 한다.
- 그럼에도 조금이라도 페이지가 실시간으로 생성이 되는 속도를 빠르게 최적화를 해보자고 하면 데이터 캐시만 따로 적용을 하는 방법도 있다. fetch 메서드의 캐시 옵션을 'force-cache'로 설정하면, 브라우저로부터 접속 요청을 받았을 때 페이지는 계속해서 다시 생성이 되겠지만 결국에 검색 결과는 계속해서 캐싱이 이루어지기 때문에 한 번 검색된 데이터에 대해서는 조금 더 빠르게 페이지를 응답해 줄 수 있게 된다.
- 정리하자면, 서치 페이지는 인덱스 페이지와 다르게 쿼리스트링 같이 동적인 값에 의존을 하고 있기 때문에 어쩔 수 없이 Static Page로 설정할 수 없기 때문에 대신에 데이터 캐시를 최대한 활용하는 쪽으로 최적화를 해줄 수 있다.

### book 페이지에 캐시 적용하기

- 북 페이지는 id라는 URL 파라미터를 갖는 여러 개의 동적 경로에 대응하는 페이지이기 때문에 기본적으로는 동적 페이지로 설정이 된다. 왜냐하면 현재로서는 북 페이지에 어떤 URL 파라미터가 무엇이 올지 모르고 뭔든 올 수 있다고 생각을 해서 기본 값으로는 다이나믹 페이지로 설정된다.
- 이러한 동적 경로를 갖는 페이지를 Static Page로써 빌드 타임에 생성되도록 설정해주려면, 당연히 빌드타임에 우리 Next.js 서버가 북 페이지에 어떠한 URL 파라미터들로 경로들이 존재할 수 있는지 알려줘야 한다. 다시말해 북 페이지에 어떤 도서 데이터들이 빌드 타임에 만들어져야 되는지 먼저 알려주면 된다는 말이다.
- 그렇게 하는 방법은 `generateStaticParams`라는 함수를 하나 만들어서 export 해주면 된다. 이 `generateStaticParams` 함수의 역할은 이름 뜻 그대로 정적인 파라미터를 생성한다. 만약 아래와 같이 정적인 URL 파라미터들을 담은 배열을 `generateStaticParams` 함수로부터 내보내 주면 빌드 타임에 Next.js 서버가 자동으로 해당 정적 파라미터들을 읽어서 파라미터에 해당하는 북 페이지를 생성해준다.

```javascript
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}
```

  <img width="400px" src="https://github.com/user-attachments/assets/41e60d57-ccbd-473d-be3f-a6086163641f" />

  > Static Page로 생성된 페이지들

- `/book/1`, `/book/2`, `/book/3` 페이지가 스태틱 페이지로써 빌드 타임에 미리 생성 완료되어서 서버측에 `Full Route Cache`로써 잘 보관이 되고 있다.
- 스태틱 페이지로 생성된 페이지들은 `.next/server/app/book` 폴더에서 확인 가능하다.
- 북 페이지처럼 동적 경로를 갖는 페이지를 스태틱 페이지로 설저앟려면 `generateStaticParams`라는 약속된 이름의 함수를 통해서 return 으로 어떤 URL 파라미터가 빌드 타임에 해당 페이지에 존재할 수 있는지를 직접 설정해주면 된다.
- 여기에는 두 가지 주의할 점이 있다.
  - 우선 첫번째로 `generateStaticParams`함수에서 URL 파리미터의 값을 명시할 때는 문자열로만 명시를 해야 한다.
  - 두번째로 주의할 점은 `generateStaticParams`라는 함수를 내보내 주면 페이지 컴포넌트 내부에 데이터 페칭이 존재하게 될지라도 무조건 해당하는 페이지가 `Static Page`로 강제로 설정이 된다는 점이다.
- 이 `generateStaticParams` 함수는 Page Router 버전에서 사용해본 `getStaticPaths` 함수의 App Router 버전이며 동일한 역할을 한다.
- Next App을 프로덕션 모드로 실행하면 정적 페이지로 생성된 북 페이지들은 `Full Route Cache`를 통해서 굉장히 빠른 속도로 Static Page가 반환되는 것을 볼 수 있다.
- 그런데 설정해두지 않은 `/book/4`도 빠르게 렌더링이 잘 되는 것을 볼 수 있다. 이렇게 정적으로 만들어 놓지 않은 4번 페이지도 사전 렌더링이 되어 빠르게 렌더링 되는 이유는, 4번 같은 페이지는 서버에 요청이 들어왔을 때 실시간으로 Dynamic Page로 만들어지고 있기 때문이다. `.next/server/app/book` 경로를 보면 `Full Route Cache`로써 잘 저장이 되어 있는 것까지 확인할 수 있다.
- 다음번에 접속할 때에는 처음보다는 훨씬 더 빠른 속도록 페이지가 반환이 된다.
- 확인을 위해서 프로덕션 모드로 실행한 상태에서 브라우저 네트워크 탭을 열고 아직 생성되지 않은 `/book/6` 페이지에 접속해서 북 페이지 6번의 응답 시간을, 새로고침하여 다시 페이지 접속 요청을 보내고 응답된 시간을 비교해볼 수 있다.
- 초기 요청이 25ms 인 것에 반해, 그 다음 요청은 8ms로 매우 빠른 응답 속도를 보임을 확인할 수 있다.

  <img width="700px" src="https://github.com/user-attachments/assets/87f7bcc1-7540-43f5-8514-68290dd8c2d4" />
  <img width="700px" src="https://github.com/user-attachments/assets/e087b018-857d-4d66-9680-3f067cc4b432" />

  > 동적 생성되는 북 페이지의 초기 접속과 재접속 응답속도 차이

### 동적 경로에서 데이터가 없는 경우 404 페이지로 redirect 시키기

- 만약 555번 북 페이지로 접속해보면 오류가 발생했다는 메시지의 페이지로 이동한다. 하지만 아무래도 데이터가 없다면 404페이지로 보내주는 것이 훨씬 더 괜찮은 방법으로 보인다.
- 조건문으로 응답 상태값이 404인 'not found' 코드가 백엔드 서버로부터 돌아왔다면, 도서의 데이터가 현재 없다는 의미이므로 이때는 `notFound`함수를 `next/navigation`으로부터 불러와서 호출해주면 된다.
- `notFound`함수가 호출되면 자동으로 404 페이지로 redirect 된다.
- 이렇게 없는 데이터의 경우 Not Found 페이지로 리다이렉트 시켜주는 동작까지 추가할 수 있다.

```javascript
// /book/[id]/page.tsx
import { notFound } from 'next/navigation';
...
if (!response.ok) {
  if (response.status === 404) {
    notFound();
  }
  return <div>오류가 발생했습니다...</div>;
}
...

// app/not-found.tsx
export default function NotFound() {
  return <div>404: NotFound</div>;
}
```

- 만약 `generateStaticParams`라는 함수에서 정적으로 설정해둔 URL 파라미터 외에는 모두 404 페이지로 보내버리고 싶을 수 있다. 이런 경우에는 `dynamicParams`라는 변수에 `false`로 설정해서 export 해주면 된다.
  ```javascript
  export const dynamicParams = false; // 기본값: true
  ```
- 그러면 Next 서버가 자동으로 해당 페이지를 생성할 때 `dynamicParams` 변수의 값을 확인해서 `false`인 경우, 해당 페이지의 URL 파라미터는 `generateStaticParams`로부터 내보내진 것 외에는 더이상 URL 파라미터가 존재하지 않아야 된다고 해석한다.
- `generateStaticParams`에 URL 파라미터가 1, 2, 3이 존재한 상태에서 북 4번 페이지로 접속 요청이 들어오면 바로 404 페이지로 보내버린다.
- 다시 빌드를 수행하고, 프로덕션 모드로 Next App을 실행하여 4번 북 페이지로 접속해보면 DB에는 데이터가 존재하지만 `generateStaticParams` 함수에 명시하지 않은 URL 파라미터 값을 요청하게 되면 `dynamicParams = false` 설정에 의해서 바로 404 페이지로 redirection 된다.
-
