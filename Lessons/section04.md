## App Router의 데이터 페칭

- 기존에는 사전 렌더링의 과정 중에 Next Server 측에서 또 다른 백엔드 서버나 DB로부터 데이터 페칭해 오기 위해서 페이지 역할을 하는 파일 안에 SSR을 의미하는 `getServerSideProps`, SSG 또는 ISR을 의미하는 `getStaticProps`, 동적 경로를 갖는 페이지를 정적으로 생성하기 위한 `getStaticPaths` 등의 오직 서버 측에서만 실행이 되는 함수들을 이용했었다.

  <img width='700px' src='https://github.com/user-attachments/assets/0278255e-e48b-4604-a017-0ab45976ac04' />
  <img width='700px' src='https://github.com/user-attachments/assets/97fc0a43-4cbc-4fa0-a72f-fec2282f9f26' />

  > 기존의 데이터 페칭 방식

- 기존에 특수한 함수들을 통해서 데이터를 직접 페칭해와서 페이지 컴포넌트의 props로 데이터를 넘겨주는 구조로 작업을 진행해왔다.
- 이렇게 해야만 했었던 이유는 Page Router 버전의 Next 앱에서는 서버 컴포넌트의 개념이 없었기 때문에 모든 컴포넌트가 다 클라이언트 컴포넌트로서 동작했기 때문이다. 서버에서 실행이 불필요한 컴포넌트 또한 클라이언트 컴포넌트로서 서버서 클라이언트 모두 동일하게 한 번씩 실행되었다. 따라서 Page Router 버전의 Next App 에서는 우리가 페이지 컴포넌트 안에 데이터 페칭 로직을 직접 작성하게 되면 해당 로직은 서버 측에서만 실행되지 않고 브라우저에서도 하이드레이션 과정에서 한 번 더 실행이 될 것이다. 그래서 서버 측에서만 데이터를 불러오기 위해서는 앞서 설명했던 `getServerSideProps`, `getStaticProps`, `getStaticPaths` 와 같은 특수한 함수를 이용했어야만 했다.

  <img width='700px' src='https://github.com/user-attachments/assets/fd29f0da-0279-44ac-af83-e4d73e97a453' />

  > 기존의 데이터 페칭 방식에 특수한 함수가 필요했던 이유

- 특수한 함수를 통한 데이터 페칭은 서버 측에서 불러온 모든 데이터는 결국 컴포넌트 트리 최상단에 위치하는 페이지 컴포넌트에게만 props로 전달이 될 것이기 때문에 최상단의 페이지 컴포넌트로부터 데이터를 필요로 하는 말단의 모든 컴포넌트들까지 props나 Context API 등을 활용해서 데이터를 넘겨 줘야 한다는 아주 큰 문제점도 있다.

  <img width='700px' src='https://github.com/user-attachments/assets/e50c214a-a4bd-4a0c-a903-ce90fed394e9' />

  > 기존의 데이터 페칭 방식의 가장 큰 문제점

- 서버 컴포넌트가 추가된 App Router 버전의 Next App에서는 더이상 이런 문제를 겪지 않아도 된다.
- `Server component`는 오직 서버에서만 실행되기 때문에 놀랍게도 `async` 키워드를 붙여서 서버 컴포넌트 함수를 비동기 함수로 만든 다음에 해당하는 컴포넌트 내부에서 `await` 키워드와 fetch 메서드를 활용해서 데이터를 직접 불러오도록 하는 데이터 페칭 로직을 페이지 컴포넌트 안에 작성해도 아무런 문제가 발생하지 않는다.

  <img width='700px' src='https://github.com/user-attachments/assets/8347e39f-d2d7-4c65-ad10-540c051f5f55' />
  <img width='700px' src='https://github.com/user-attachments/assets/abd50718-588c-4e63-93e0-61d368aaa36b' />
  <img width='700px' src='https://github.com/user-attachments/assets/e1d2b7c6-2698-4d95-9622-849bf306b1d0' />

  > App Router 버전의 서버 컴포넌트의 놀라운 점

- 이 부분이 놀라운 이유는, 원래 리액트의 컴포넌트 (React client component)에서는 async 키워드를 붙여서 비동기 함수로 설정할 수는 없었다. 그렇게 되는 이유는 대략적으로 **클라이언트 컴포넌트들은 브라우저에서도 똑같이 동작을 해야 되기 때문 (순수함수)**에 `async` 키워드를 붙여서 비동기로 동작하게 설정할 경우에는 props의 전달이나, useMemo나 useCallback 등을 사용하는 memoization 차원에서 여러가지 문제를 일으킬 수 있기 때문이었다.
- 그런데 `React server component`는 브라우저에서는 실행되지 않기 때문에 당연히 서버 컴포넌트에서는 `async` 키워드를 붙여서 비동기 함수로써 사용해도 전혀 문제가 발생하지 않는다. 그렇기 때문에 `await` 키워드와 함께 비동기적으로 컴포넌트 내에서 직접 데이터를 페칭까지 해줄 수 있는 것이다.
- App Router 버전의 데이터 페칭에서는 Page Router에서 사용하던 특수한 함수들은 더 이상 사용하지 않고, 대신에 컴포넌트 내부에서 직접 자신이 필요로 하는 데이터를 불러와서 바로 렌더링에 사용할 수 있도록 데이터를 페칭하는 방식이 굉장히 크게 변경이 되게 된다.
- 이제부터는 더 이상 페이지 컴포넌트로부터 여러 컴포넌트들에게 데이터를 Props나 Context API를 활용해서 힘겹게 넘겨줄 필요가 없어진다. 왜냐하면 데이터가 필요한 컴포넌트가 있다면 해당하는 컴포넌트가 직접 데이터를 페칭해오면 되기 떄문에 우리가 만들어야 되는 페이지의 컴포넌트 구조가 아무리 복잡해진다고 하더라도 무리 없이 데이터 페칭을 구현할 수 있게 된다.
- Next.js의 공식 문서에서도 데이터 페칭의 가장 좋은 방식은 `Fetching Data where it's needed` 라고 해서 이제부터는 데이터가 필요한 곳에서 직접 데이터를 불러오게 하라고 제안하고 있다.
- 정리하면, Next.js App Router 버전에서는 서버 측에서만 실행하는 서버 컴포넌트를 활용할 수 있게 되기 때문에 컴포넌ㅌ 자체를 `async` 키워드를 붙여서 비동기 함수로 만들어 줄 수도 있고, `await` 키워드와 함께 데이터를 불러오는 로직을 컴포넌트 내부에서 작성할 수 있게 되었다.
- 컴포넌트 내부에 다른 데이터를 불러오는 경우 fetch 메서드를 여러번 호출하고 비동기 호출에 따른 예외처리도 추가되어 컴포넌트 내부의 코드가 너무 길어지게 되어서 가독성이 떨어지게 된다. 보통 이런 경우에는 불러와야 하는 데이터에 따라서 컴포넌트를 각각 나눠주어 코드를 가독을 높인다.

### env 파일

- 백엔드 API 서버의 주소가 계속 Fetch 메서드를 호출할 때마다 매번 반복되어서 작성이 되고 있다.
- 만약 나중에 API 서버의 주소가 바뀌게 된다거나 하면 모든 Fetch 메서드를 찾아서 API 서버 주소를 일괄적으로 바꿔줘야 하기 때문에 좀 불편한 상황이 발생할 수 있다.
- 이러한 경우에는 백엔드 API 주소를 환경 변수로써 등록한 다음에 컴포넌트에서는 그냥 불러서 사용할 수 있도록 하는 것이 좋다.

```bash
# /.env
NEXT_PUBLIC_API_SERVER_URL=http://localhost:12345
```

- `NEXT_PUBLIC_` 접두사를 붙여주고 있는 이유는 이 접두사가 붙지 않으면 Next는 자동으로 해당 환경 변수를 서버 측에서만 활용할 수 있게 프라이빗으로 설정한다.
- 만약 `NEXT_PUBLIC_` 접두사를 생략하고 API_SERVER_URL이라는 이름으로만 환경 변수를 등록해 두게 되면 Next가 자동으로 해당하는 환경 변수는 서버 측에서만 접근할 수 있도록 설정하여 클라이언트 컴포넌트 같은 곳에서는 아예 이 환경 변수에 접근할 수 조차 없게 된다는 의미다.
- 그렇기 때문에 개발할 때 클라이언트 컴포넌트에서도 함께 이용을 해야 되는 환경변수가 있다면 `NEXT_PUBLIC`이라는 접두사를 꼭 앞에 붙여 주어야 한다.

```typescript
async function AllBooks() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`
  );
    if (!response.ok) {
    return <div>오류가 발생했습니다 ...</div>;
  }
  const allBooks: BookData[] = await response.json();
  console.log(allBooks);
  ...
}
```

## 데이터 캐시 (Data Cache)

- 데이터 캐시란 fetch 메서드를 활용해 불러온 데이터를 Next 서버에서 보관하는 기능
- 데이터 캐시 기능을 잘 활용하면 영구적으로 데이터를 보관하거나, 특정 시간을 주기로 갱신하는 것도 가능하다.
- 이렇게 하면 향후에 불필요한 데이터 페칭의 요청을 방지한다던가 또는 특정 시간을 주기로 캐싱해둔 데이터를 새롭게 갱신하도록 설정할 수도 있기 때문에 결론적으로 데이터 요청의 수를 줄여서 웹 서비스의 성능을 크게 개선할 수 있다.
- Next App에서는 지금까지 사용해오던 fetch 메서드의 두 번째 인수로 객체 형태의 다양한 추가적인 옵션을 설정해 줌으로써 적용을 할 수 있다.
  > Next.js fetch 메서드의 4가지 cache 옵션들
  >
  > - { cache: "force-cache" } <br>
  > - { cache: "no-store" } <br>
  > - { cache: { revalidate: 10 } } <br>
  > - { cache: { tags: ['a'] } } <br>
- cache: "force-cache"
  - 요청의 결과를 무조건 캐싱함
  - 한번 호출된 이후에는 다시는 호출되지 않고 캐시된 데이터를 계속 꺼내 쓰게 된다.
  ```javascript
  const response = await fetch(`~/api`, { cache: 'force-cache' });
  ```
- 참고로 이러한 데이터 캐시의 옵션들은 fetch 메서드가 아닌 Axios 등의 다른 HTTP request 라이브러리에서는 활용될 수 없다.
- Next에서 위와 같은 데이터 캐시 옵션을 적용하려면 **무조건 fetch 메서드만 사용**해야 한다.
- 그 이유는 Next.js에서 제공되는 이 fetch 메서드는 일반적인 fetch 메서드가 아닌 Next.js가 자체적으로 데이터 캐시와 관련된 여러 기능들을 추가한 일종의 확장판 개념의 메서드이기 때문이다.
- Next.js에서는 이런 식으로 fetch 메서드를 확장해서 추가적인 옵션을 전달하기만 해도 특정 데이터 페칭 요청을 영구적으로 캐싱하거나, 시간 기반으로 캐싱을 하거나, 아예 캐싱하지 않도록 설정할 수 있기 때문에 다양한 사례에 굉장히 효율적으로 대응할 수 있다.

### cache: "no-store" 옵션

- 이 옵션은 데이터 페칭의 결과를 절대 저장하지 않는 옵션이다. 즉, 캐싱을 아예 하지 않도록 설정하는 옵션이다.
- 이렇게 특정 패치 메서드의 캐싱 옵션을 `no-store`라고 설정하고 데이터 페칭 요청이 발생하면, 캐싱된 데이터를 사용하지 않기 때문에 사전 렌더링 과정에서 데이터 캐시 과정은 스킵이 되고 그대로 백엔드 서버에게 데이터를 요청 후 응답받은 데이터로 페이지를 생성해서 브라우저에게 반환하게 된다.

  ```javascript
  const response = await fetch(`~/api`, { cache: 'no-store' });
  ```

  <img width="700px" src="https://github.com/user-attachments/assets/1318e335-5a97-4bcf-808b-9684f1029deb">

  > Next fetch 메서드의 "no-store" 캐시 옵션 동작 방식

- 해당 옵션이 실제로 그런지 확인하기 위해서 Next 서버측에서 이런 데이터 페칭이 발생할 때마다 로그를 출력하도록 설정한다.
- Next Server의 로그 출력을 위해서 Next App 옵션 설정을 하는 `next.config.mjs` 파일에 아래와 같이 logging 객체 속성을 추가하면 이제부터 Next App에서 발생하는 모든 데이터 페칭이 다 로그로써 자동으로 콘솔에 출력이 된다.

```javascript
/** @type {import('next').NextConfig} **/
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
```

  <img width="700px" src="https://github.com/user-attachments/assets/4368cc11-8412-4fc4-9ef2-9fe8fb89a8b9">

> 터미널에 출력되는 서버측 데이터 페칭 로그 (no-store)

- 로그 메시지를 보면 우리가 AllBooks에 설정한 "no-store" 캐시 옵션에 의해서 Cache가 잘 스킵이 된 것을 확인할 수 있다.
- 그런데 우리가 캐시 설정을 하지 않은 RecoBooks에서도 캐시가 스캡되었다고 출력이 되며, `auto no cache`라고 해서 자동으로 캐싱이 되지 않고 있음을 알려주고 있다.
- 이렇게 되는 이유는 fetch 메서드에 아무런 옵션을 넣어주지 않으면, 데이터 캐시의 기본 값으로 캐시되지 않는 요청으로 동작한다. 그래서 사실상 AllBooks 컴포넌트에 적용해 둔 "no-store" 옵션과 동일하게 동작한다.
- Next.js 14버전까지는 데이터 캐싱의 기본 설정값이 15버전과 달리 요청 결과를 무조건 캐싱하는 것으로 설정되어 있었다. 그런데 무조건 캐싱하도록 기본값으로 설정되는 방식에 생각보다 많은 사람들이 불편함을 토로해서 신규 버전인 **15버전부터는 바뀌게 "no-store" 옵션으로 캐싱되지 않는 설정으로 변경**되었다.

## cache: "force-cache" 옵션

- 'no-store' 옵션의 반대 격으로 무조건 요청 결과를 캐싱하여 한번 호출된 이후에는 다시는 호출되지 않는다.

  ```javascript
  const response = await fetch(`~/api`, { cache: 'force-cache' });
  ```

  <img width="700px" src="https://github.com/user-attachments/assets/776679a1-c7ca-4ed6-a252-d8f41c6a0d76">

  > Next fetch 메서드의 "force-cache" 캐시 옵션 동작 방식

- Cache 설정이 "force-cache"로 설정된 데이터 요청이 발생하게 되면 데이터 캐시에서 먼저 저장된 데이터를 찾아보게 된다. 그런데 처음의 fetch 요청에서는 저장된 데이터가 없기 때문에 `Miss` (없음) 판정이 나게 된다. 이런 때에는 일단 백엔드 서버에게 데이터를 요청하고 다음 요청부터는 새롭게 불러오지 않도록 데이터 캐시 안에 `Set`(저장)하게 된다. 불러온 데이터로는 페이지는 생성해서 브라우저에게 반환한다. 추가적인 페이지 접속 요청이 들어오면 일단 똑같이 사전 렌더링을 진행하면서 데이터 패칭도 실행하게 되는데, 이때는 데이터 페칭 요청의 응답을 앞서 데이터 캐시에 캐싱해둔 데이터가 `Hit` (찾아냄) 되고 실제 백엔드 서버에게는 요청을 보낼 필요가 없기 때문에 그대로 데이터 캐시 안에 들어있던 데이터를 활용해서 빠르게 페이지를 생성하여 브라우저에게 반환한다.

  <img width="700px" src="https://github.com/user-attachments/assets/163d8bc7-3f0b-4e53-8062-2b6e64d6f565">

  > 터미널에 출력되는 서버측 데이터 페칭 로그 (force-cache)

- 서버 측 콘솔을 보면 book/random의 데이터 캐시는 초록색으로 `Hit` 되어서 추가적인 요청이 발생하지 않는다는 사실도 알 수 있다.
- 캐싱된 데이터는 json 형태로 Next.js 서버 안에 `.next/cache/fetch-cache` 폴더에 보관이 된다.

## next: { revalidate: 3 } 옵션

- `revalidate` 옵션은 마치 페이지 라우터의 ISR 방식처럼 특정 시간을 주기로 캐시된 데이터를 업데이트 시켜준다.
- 이 옵션은 일단 fetch 요청으로부터 불러온 데이터를 캐싱 하긴 하지만, 그렇게 캐싱한 데이터를 3초 주기로 Next 서버가 자동으로 업데이트하게 된다.

```javascript
const response = await fetch(`~/api`, { next: { revalidate: 3 } });
```

  <img width="700px" src="https://github.com/user-attachments/assets/fc8627b0-4bda-4ba1-8b23-3a5fd00ebbed">
  <img width="700px" src="https://github.com/user-attachments/assets/410ea256-50ee-4b42-8b35-507e2ca1dda5">

> Next fetch 메서드의 "next: { revalidate: 3 }" 캐시 옵션 동작 방식

- 초기 페이지 접속 요청이 들어오면 "force-cache" 옵션과 동일하게 하고, revalidate 값인 3초가 경과하면 브라우저에 접속 요청이 들어왔을 때 페치 요청은 일단 캐시된 데이터를 반환하기 위해서 데이터를 `stale` (상했다) 상태로만 설정을 해두고 일단은 상한 데이터라도 빠르게 캐시된 데이터로 응답하고 HTML 페이지를 생성하게 된다.
- 그리고 나서 상한 데이터를 그대로 둘 수 없기 때문에 서버 측에서 이 데이터를 다시 백엔드 서버로부터 불러와서 최신 데이터로 revalidate (최신화)를 시키게 된다. 그리고 나서 그 이후의 요청에는 캐싱된 revalidate 된 최된 데이터를 응답하여 HTML 페이지를 생성해 반환한다.
- 페이지를 새로고침해서 살펴보면 설정한 3초마다 RecoBooks 데이터가 변경됨을 확인할 수 있다.

## next: { tags: ['a'] } 옵션

- 마지막으로 살펴볼 `next: { tags: ['a'] }`옵션은 요청이 들어왔을 때에만 데이터를 최신화하도록 설정이다.
- 마치 Page Router 버전으로 치면 `On-Demand ISR` 같은 방식의 캐싱 옵션이다.
- 이 옵션은 실습으로 진행해보려면 서버 액션이나 라우트 핸들러 등등의 추가적인 개념을 배우고 나서야 원활하게 진행할 수 있기 때문에 이후 섹션에서 추가적인 개념들을 학습한 후에 진행한다.

## Request Memoization

- `Request Memoization`은 데이터 페칭을 최적화해 주는 기능이다.
- 번역을 하자면 `요청을 기억한다` 정도로 해석할 수 있으며, 페이지를 서버 측에서 렌더링하는 과정에서 레이아웃 컴포넌트나 또는 페이지 컴포넌트처럼 하나의 페이지를 이루고 있는 여러 개의 컴포넌트에서 발생하는 다양한 API 요청들 중에 중복적으로 발생하는 요청들을 캐싱해서 중복된 요청 없이 단 한번만 요청할 수 있도록 자동으로 데이터 페칭을 최적화해주는 기능이다.

  <img width="700px" src="https://github.com/user-attachments/assets/c04d4041-e03f-4e1f-8f47-78b1bc613e2e">
  <img width="700px" src="https://github.com/user-attachments/assets/c30277d1-6fb3-4425-b85e-f7ab2c81b2df">

  > 중복된 요청을 제거하여 데이터 페칭을 최적화 해주는 Request Memoization 기능

- 만약 Next 서버가 브라우저로부터 접속 요청을 받았을 때, 만약 현재 접속 요청을 받은 페이지에서 세 번의 데이터 페칭이 필요하고 이 각각의 데이터 페칭이 동일한 주소로부터 동일한 데이터를 불러오고 있다고 가정을 해보자. 그리고 데이터 페칭 옵션으로는 따로 설정 되어 있지 않아서 기본값인 'no-store' 옵션으로 설정되어 있다고 가정하자. (데이터 캐시에 캐싱 하지 않음)
- 이런 경우 똑같은 요청을 3번이나 연달아서 보내는 비효율적인 상황이 발생한다. 그렇기 때문에 Next.js에서는 이러한 상황을 방지해주기 위해서 `Request Memoization` 기능을 사용해서 중복된 API 요청을 자동으로 하나의 요청으로 합쳐주는 기능을 자체적으로 제공하고 있다.
- Next.js에서는 `Request Memoization` 기능을 통해서 아까 가정한 상황에서 첫 데이터 요청에서는 `Request Memoization` 캐시가 `Miss`(없음)되어 백엔드 서버에게 데이터가 요청 되지만, 요청의 결과가 `Request Memoization`의 `Set` (저장)이 된 이후에는 동일한 요청에 대해서는 보라색의 데이터 캐시를 찾아본다던가 또는 백엔드 서버에게 요청을 보내는 것이 아니라 그 전에 주황색의 `Request Memoization` 안에 캐시된 데이터가 있는지 먼저 확인을 하고 만약에 캐시가 존재해서 `Hit` (캐싱된 데이터 발견) 됐다면 저장된 데이터를 그대로 사용해서 페이지를 렌더링하게 된다.
- 즉, 최초 이후에 똑같은 요청에 대해서는 `Request Memoization`에 저장된 캐시의 데이터를 먼저 확인하게 되기 때문에 데이터 페칭 요청을 아에 발송하지 않게 된다.
- 한 가지 오해하지 말아야 할 부분은 `Request Memoization`은 우리가 이전에 살펴보았던 데이터 캐시와는 엄연히 다르다는 점이다.
- `Request Memoization`은 하나의 페이지를 렌더링 하는 동안에 중복된 API 요청을 캐싱하기 위해 존재하기 때문에 렌더링이 종료되면 모든 캐시가 즉시 소멸된다.
- 그렇기 때문에 렌더링이 종료된 이후 두번째 접속 요청이 들어왔을 때, 동일한 경로의 데이터 요청이 발생한다고 하더라도 캐시가 `Miss`되어서 새롭게 데이터를 요청하게 되고 그렇게 불러온 데이터를 다시 한번 `Request Memoization`에 똑같이 저장하게 된다.
- `Request Memoization`이라는 기능은 이렇게 하나의 페이지를 렌더링하는 동안에만 존재하는 캐시로서 오직 중복된 API 요청을 방지하는데 그 목적을 두고 있다.

  <img width="700px" src="https://github.com/user-attachments/assets/f19044c8-bdd4-4980-b117-70c095e813f5">

  > 오해하지 말아야 할 부분: Request Memoization은 하나의 페이지를 렌더링 하는 동안에만 캐싱함

- 반면에 데이터 캐시는 `Request Memoization`과 목적이 다르다.
- 데이터 캐시는 백엔드 서버로부터 불러온 데이터를 거의 영구적으로 보관하기 위해 사용되기 때문에 서버 가동중에는 영구적으로 보관된다.
- 결론적으로 `Request Memoization`과 데이터 캐시는 전혀 다른 것이다.
- Next.js는 도대체 왜 이런 `Request Memoization`이라는 기능을 자체적으로 제공할까?
  - "그냥 중복 요청을 안보내면 되는거 아닌가?" => 서버 컴포넌트의 도입 때문
  - 그 이유는 `React Server Component`의 도입으로 인해 이제는 데이터를 페칭하는 패턴이 변화했기 때문이다.
- 기존의 Page Router 버전의 Next.js App에서는 서버 측에서 데이터를 패칭해오려면 `getServerSideProps`나 `getStaticProps` 같은 서버 측에서만 실행되는 함수를 통해서 데이터를 불러와서 페이지 컴포넌트에게 넘겨주는 방식을 사용했다. 하지만 서버 컴포넌트가 도입된 App Router 버전의 Next.js 앱에서는 컴포넌트가 각각 자신이 필요한 데이터를 직접 페칭해오는 방식으로 데이터 페칭이 진행된다.
- 이런 방식 덕분에 App Router에서는 컴포넌트의 구조가 아무리 복잡해진다고 하더라도 별 문제 없이 각각 필요한 데이터를 컴포넌트 별로 불러와서 독립적으로 사용할 수 있다. 하지만 이러한 패턴을 사용하다 보니 어쩔 수 없이 서로 다른 컴포넌트에서 동일한 데이터를 필요로 하는 예외적인 경우가 반드시 생길수 밖에 없다.

  <img width="700px" src="https://github.com/user-attachments/assets/52c8b05a-a505-44fe-9a55-58f667588279">
  <img width="700px" src="https://github.com/user-attachments/assets/2bb20d87-0cb2-4fe2-bdfc-1ad5d9390703">

  > Page Router 버전과 App Router 버전의 데이터 페칭의 패턴 변화

- App Router 버전의 Next App에서는 컴포넌트 내부에서 직접 데이터를 페칭해오는 패턴으로 개발을 진행하기 때문에 API 호출이 중복되는 상황들이 생각보다 꽤나 자주 발생하게 된다. 이런 문제점을 해결해주기 위해서 `Request Memoization`이라는 추가적인 캐싱 기능을 자동으로 제공하고 있다. 그리고 `Request Memoization`은 데이터 캐시와 다른 것이기 때문에 해당 페이지의 렌더링이 종료되면 자동으로 캐시된 데이터들이 소멸되어 렌더링이 끝난 페이지를 새로고침 하면 다시 한번 API 요청이 발생하게 된다.
