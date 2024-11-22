## Parallel Route [병렬 라우트](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)

### 페럴렐 라우트의 기본적인 내용

- Parallel Router (병렬 라우트)란 Next.js에서 제공하는 고급 라우팅 패턴 중에 하나로, 화면 안에 여러개의 페이지를 병렬로 함께 렌더링 시켜주는 패턴이다.
- 여기서 말하는 페이지란 컴포넌트가 아닌 page.tsx 파일에 작성이 되는 컴포넌트를 의미한다.

  <img width="600px" src="">

  > 하나 화면에 여러개의 페이지를 병렬로 렌더링 해주는 Parallel Route

- 위 그림과 같이 병렬 라우트란 여러개의 페이지 컴포넌트들을 한꺼번에 렌더링하는 라우팅 패턴이다.
- 병렬 라우트는 보통 쇼셜 미디어 서비스나 관리자의 대시보드처러 굉장히 복잡한 구조로 이루어져 있는 서비스들을 구축하는 데 상당히 유용하게 활용될 수 있다.
- 지금 프로젝트에서는 그다지 페럴렐 라우트를 적용할 만한 곳이 없다. 이렇기 때문에 이번 실습에서만 사용되는 임시 페이지를 하나 추가한 다음에 실습을 따로 진행한다.
- 패럴렐 라우트를 만드려면 우선 `slot`을 만들어줘야 한다. `Slot`(슬롯)이란 패럴렐 폴더 아래 새로운 폴더로 `@Sidebar` 같이 골뱅이 기호가 붙은 폴더를 슬롯이라고 부른다.
- `Slot`(슬롯)이 하는 역할은 병렬로 렌더링이 될 하나의 페이지 컴포넌트를 보관하는 역할을 하는 폴더이다. 그렇기 떄문에 Slot 안에는 새로운 파일로 page.tsx 같은 페이지 컴포넌트를 만들면, sidebar라는 슬롯 안에 보관된 페이지 컴포넌트는 자신의 부모 레이아웃 컴포넌트인 `layout.tsx` 컴포넌트에게 props로써 자동으로 전달이 된다. 그리고 그때 props의 이름은 슬롯의 이름인 sidebar가 된다.
- 그러면 `@sidebar` 슬롯에 보관된 페이지 컴포넌트를 `layout.tsx`가 props로 children과 함께 추가적으로 전달을 받게 된다.
- 이제 페럴렐 레이아웃 컴포넌트는 기본 페이지 컴포넌트와 함께 sidebar 컴포넌트를 병렬로 렌더링하도록 설정해줄 수 있다.

  ```typescript
  import { ReactNode } from 'react';

  export default function Layout({
    children,
    sidebar,
  }: {
    children: ReactNode;
    sidebar: ReactNode;
  }) {
    return (
      <div>
        {children}
        {sidebar}
      </div>
    );
  }
  ```

- 패럴렐 라우트를 적용하고 나서 브라우저에서 Next.js 버그로 인해서 패럴렐 라우트가 적용이 안된다거나 404 페이지가 나올 수 있다. 이런 경우에는 개발 모드를 중단한 다음 .next 폴더를 제거하고 `npm run dev`로 프로젝트를 다시 가동하면 패럴렐 라우트가 잘 적용된다.

  <img width="700px" src="">

  > 간단하게 구현한 페럴렐 라우트 페이지

- 다시 한번 패럴렐 라우트 개념을 정리하면, Next.js 패럴렐 라우트는 하나의 화면에 여러개의 페이지 컴포넌트를 병렬로 렌더링 시켜주는 기능이다. 이 기능을 이용하려면 골뱅이(`@`)로 시작하는 `slot`이라 불리는 특수한 폴더를 생성하고 해당 폴더 내부에 `page.tsx` 파일을 만들어주면 페이지 컴포넌트는 자신을 감사고 있는 부모 레이아웃 컴포넌트에게 자신이 속한 슬롯의 이름으로 props로 전달이 된다. 그렇기 때문에 레이아웃 컴포넌트에서 기본 페이지 컴포넌트인 children과 함께 슬롯의 페이지 컴포넌트인 sidebar를 함께 병렬로 같이 렌더링 할 수 있게 된다.
- 그리고 골뱅이 기호가 붙어서 슬롯이라고 불리는 폴더는 `(with-searchbar)` 폴더와 같은 라우트 그룹(Route Group)처럼 URL의 경로에는 아무런 영향을 미치지 않는다.
- 그렇기 때문에 `@sidebar`라는 슬롯 안에 페이지 컴포넌트를 만들어 뒀다고 해서 브라우저에서 `/localhost:3000/parallel/@sidebar` 주소로 접속할 수 있는 것은 아니다.
- `@sidebar` 같은 슬롯은 현재 자신의 부모 레이아웃 컴포넌트에 추가적으로 제공되는 `page.tsx`를 보관하기 위한 폴더라고 생각하면 된다.
- 여담으로 레이아우 컴포넌트에 children props로 전달되는 기본적인 페이지 컴포넌트 또한 `@children`이라는 슬롯안에 보관이된 페이지 컴포넌트라고 봐도 무방하다. 편의상 레이아웃 컴포넌트와 동일한 경로에 있는 페이지 컴포넌트는 매번 `@children`이라는 슬롯을 따로 만들면 귀찮기 때문에 슬롯이 아닌 일반적인 페이지 컴포넌트를 만들어 두면 자동으로 children이라는 슬롯으로 포함이 되기 때문에 children이라는 이름의 props로 전달이 되는 것이다.

### 페럴렐 라우트의 추가적인 내용

- 슬롯에는 개수 제한이 없다.
- page.tsx를 포함하는 `@feed` 슬롯을 만들고 부모 레이아웃 컴포넌트에 props로 넣어서 렌더링 해줄 수 있다.
- 앞에서 언급했지만 Next.js의 버그가 있어서 페럴렐 라우트를 적용하면 넥스트 앱이 고장나는 경우가 있다. 이때는 개발모드를 종료하고 `.next` 폴더를 제거한 뒤에 다시 개발모드로 실행하면 정상 동작하게 된다.
- 그래서 패럴랠 라우트를 설정할 때는 아직 Next.js의 개발모드가 많이 불안정하기 때문에 버그로 동작이 잘되지 않는 경우가 꽤 있다. 때문에 혼자 실습을 진행할 때 내가 의도하지 않은 방식대로 동작을 하게 된다면 너무 머리 쓰지 말고, 앞서 진행한 방식으로 개발모드 중단 후 `.next` 폴더를 삭제하고 다시 가동해보는 것이 정신 건강상 이로울 수 있다.
- 페럴렐 라우트의 슬롯 개수에는 제한이 존재하지 않기 때문에 원하는대로 얼마든지 자유롭게 새롭게 추가할 수 있다.

### 슬롯에 새로운 페이지 추가

- 슬롯의 경로 하위로 새로운 페이지를 추가할 수도 있다.
- `@feed/setting/page.tsx`를 만들어 주게 되면 세팅 페이지가 별도의 페이지로 따로 렌더링이 되는 것이 아니라 레이아웃 컴포넌트에 함께 포함되어서 `@feed` 슬롯 안에서 페이지가 렌더링이 이루어지게 된다.
- 아래와 같이 레이아웃 컴포넌트를 구성하고, 세팅 링크를 클릭해서 이동을 해보면 `@sidebar` 슬롯과 기본 페이지인 `@children` 슬롯은 그대로 유지한 채로 `@feed` 슬롯의 페이지만 `@feed/setting` 페이지로 이동하게 되는 것을 볼 수 있다.

  <img width="600px" src="">

  > @feed 페이지만 setting 페이지로 이동

- `@feed` 슬롯에 해당하는 페이지만 페이지 이동이 이루어진 것처럼 동작하고 있다.
- 이렇게 동작하는 이유는, 레이아웃 컴포넌트 관점에서 보면 쉽게 이해할 수 있다.
- `/parallel` 경로에서는 레이아웃 컴포넌에 각 슬롯의 page.tsx 파일들이 props로 전달될 것이다. 그리고 `/parallel/setting` 경로에서는 `@feed` 슬롯의 경우 setting 폴더 아래 페이지 컴포넌트가 존재하여 props가 잘 전달이 된다. 반면 `@sidebar` 슬롯의 경우 setting 폴더 아래 페이지 컴포넌트가 props로 전달되어야 하는데 `@sidebar` 슬롯 안에는 존재하지 않는다. 이렇게 되면 사실상 없는 페이지이기 때문에 404 Not Found와 동일한 상황이 되는 것이다. 그런데 Next 에서는 이럴 때 슬롯의 값을 그냥 이전의 페이지를 유지하도록 처리한다. 그래서 이전의 페이지의 값이었던 `@sidebar/page.tsx`를 그냥 현재 슬롯의 값으로써 그대로 활용하여 레이아웃 컴포넌트의 props로 전달한다. 마찬가지로 children 또한 setting 폴더가 없기 때문에 이동할 곳이 없어서 이전 페이지 컴포넌트를 그대로 유지한다.
- 정리하면, `@feed` 같은 특정 슬롯 밑에 setting처럼 추가적인 경로의 페이지를 생성하고 브라우저에서 해당 경로로 링크 컴포넌트 등을 이용해서 이동해보면 해당 슬롯의 페이지만 딱 업데이트가 되고 나머지 슬롯의 페이지들은 갈 곳이 없으므로 그냥 그대로 이전의 상태를 유지한다.
- 한 가지 주의할 점은, 각각의 슬롯들이 이전의 페이지를 유지하게 되는 건 오직 링크 컴포넌트를 이용해서 브라우저 측에서 클라이언트 사이드 렌더링 방식으로 페이지를 이동할 때에만 한정된다. 그렇기 때문에 브라우저에서 직접 같은 주소를 입력하고 접속하면 404 페이지로 리다이렉션 되는 것을 확인할 수 있다.

  <img width="600px" src="">

  > Link 태그가 아닌 브라우저 주소창으로 직접 접근하면 동작 안함

- 이러한 현상이 발생하는 이유는 새로고침해서 `localhost:3000/parallel/setting` 경로에 처음 접속하게 되는 경우에는 레이아웃 컴포넌트에서 `@sidebar`나 `@children` 같은 각각은 슬롯의 페이지를 렌더링 할 떄 **이전의 페이지를 모르기 때문**이다. 새로고침했다는 것은 초기 접속을 의미하는 것이기 때문에 이전에 렌더링해뒀던 페이지고 뭐고 없다.
- 그래서 페이지를 새로고침하는 경우에는 해당하는 슬롯의 이전 값을 찾을 수 없기 때문에 404 페이지로 리다이렉션 된다.
- 이런 상황을 방지해주려면 슬롯별로 현재 렌더링할 페이지가 없을 때 대신 렌더링 할 default 페이지를 만들어 주면 된다.
- default 페이지는 `default.tsx`라는 약속된 이름의 파일을 생성하여 제공할 수 있다.

  ```typescript
  // /parallel/default.tsx
  export default function Default() {
    return <div>/parallel/default</div>;
  }
  // /parallel/@sidebar/default.tsx
  export default function Default() {
    return <div>@sidebar/default</div>;
  }
  ```

- 이렇게 특정 슬롯 밑에 특정 페이지를 추가하는 경우에는 404 페이지로 보내지는 문제를 방지하기 위해서 `default.tsx` 페이지를 추가하는 것이 좋다.
- 향후 굉장히 복잡한 구조의 UI를 설계할 때 패럴렐 라우트를 적극적으로 활용해보면 좋을 것 같다.

## [Intercepting Route](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)

- Next.js 고급 라우팅 패턴 중 하나인 Intercepting Route는 사용자가 특정 경로로 접속해서 새로운 페이지를 요청할 때 요청을 가로채서 원래 렌더링 돼야 하는 페이지가 아닌 애플리케이션 설계자가 원하는 어떤 페이지를 대신 렌더링 하도록 설정하는 라우팅 패턴을 말한다.
- \* Intercepting Route: 가로채다, 뺏어가다
- 다시 말하면, 인터셉팅 라우트란 사용자가 동일한 경로에 접속하게 되더라도 특정 조건을 만족하게 되면 그때에는 원래 페이지가 아닌 다른 페이지를 렌더링 하도록 설정하는 그런 기술이다.

  <img width="600px" src="">

  > 인터셉팅 라우트

- 이때 인터셉팅 라우트를 동작시키는 조건은 아쉽게도 우리가 직접 설정할 수 있는 것은 아니고, Next.js에서 고정적으로 정해두었다. Next.js는 초기 접속 요청이 아닐 때에만 인터셉팅 라우트가 동작하도록 설정이 된다.
- 사용자가 클라이언트 사이드 렌더링 방식으로 접속을 하게 되었을 때 즉, 링크 컴포넌트라던가 라우터 객체에게 제공하는 push 메서드 등을 사용해서 해당 경로로 이동하게 되었을 때만 인터셉만 라우트가 동작을 하게 된다. 그리고 이런 조건은 고정적이다.
- 이런 `Intercepting Route`의 대표적인 예시로 가장 많이 거론되고 있는 것이 바로 인스타그램이다.
- 인스타그램에서는 게시글 피드를 탐색하다가 특정 게시글을 클릭하게 되면 내가 보고 있었던 피드 페이지 위로 게시글의 상세 페이지를 별도로 띄워줌으로써 언제든지 뒤로 가기 했을 때 내가 탐색하고 있던 피드로 그대로 다시 돌아오도록 만들어주고 있다. 그런데 게시글의 상세 페이지에서 새로고침을 해서 초기 접속 요청으로 다시 접속하게 되면 그때에는 게시글의 상세 페이지로 완전히 이동하는 것을 볼 수 있다. 이런 방식이 바로 `Intercepting Route`를 이용하면 구현할 수 있는 패턴이다.
- 피드에서 특정 게시물을 클릭해서 클라이언트 사이드 렌더링 방식으로 페이지에 접속하게 되었을 때는 인터셉팅 라우트가 동작해서 화면에 모달 형태로 페이지를 렌더링하게 된다. 그렇지 않고 만약 새로고침을 해서 초기 접속 요청으로 페이지에 접속 요청을 보내게 되면 그때에는 인터셉팅 라우트가 동작하지 않기 때문에 원래 게시글의 상세 페이지가 렌더링 되는 것을 볼 수 있다.

  <img width="600px" src="">
  <img width="600px" src="">

  > 인스타그램의 인터셉팅 라우트와 초기 접속으로 접속한 상세 페이지

- 프로젝트에 인터셉팅 라우트를 이용해서 사용자가 도서 아이템을 클릭해서 북 페이지로 이동하게 될 때 화면의 모달 형태로 피드 위로 나타날 수 있도록 구현한다.
- 인터셉팅 라우트를 구현하기 위해 `app`폴더 밑에 새로운 폴더로 `(.)book/[id]`라는 가로채기 위한 폴더를 만들어준다. 온점 포함하는 소괄호(`(.)`)의 의미는 뒤에 나오는 경로를 이제부터 인터셉트 (가로채라)라는 뜻이된다. 그래서 프로젝트에 원래 존재하던 `book/[id]`라는 경로의 페이지를 가로채는 폴더로 설정이 된다.
- 그리고 소괄호 안에 점이 딱 한 개만 찍혀 있게 된다면 그것은 `상대 경로를 의미`한다. 상대 경로에서 점이 하나 있는 것은 동일한 경로에 있다라는 것을 의미한다. 그렇기 때문에 `(.)book/[id]`의 의미는 동일한 경로 상에 있는 `book/[id]`라는 경로의 페이지를 인터셉팅 하겠다라는 식으로 설정된 것이라고 생각해주면 된다.

  <img width="600px" src="">

  > 페이지 가로채기를 위한 폴더 생성

- 만약 인터셉팅 라우트 폴더가 app 폴더 바로 밑에 있는 것이 아니라 test 폴더 밑에 있다면 `(..)book/[id]`와 같은 식으로 상위 경로에 있는 폴더를 인터셉팅 할 것이다.
- 그래서 현재 인터셉팅 하려는 경로가 만약 동일한 경로에 있지 않고 해당 폴더보다 한 단계 위에 있다면 이때는 소괄호 안에 점을 2개(`(..)`) 찍어주고, 만약 두 단계 위에 있다면 이때는 소괄호를 두 번 열어서 각각의 소괄호에 온점을 다 두 번씩(`(..)(..)`) 찍어주면 된다.
- 마지막으로 소괄호를 열고 온점을 3개 (`(...)`) 찍어 주게되면 app 폴더 바로 밑에 있는 어떤 폴더를 인터셉티 하겠다라는 뜻이다.

  ```
  // 경로에 따른 인터셉팅 라우터 구조 예시
  app
   |-test
     |-(..)book/[id]
        |-(..)(..)book/[id]
            |-(...)book/[id]
   |-book/[id]
  ```

- `(.)/book/[id]` 폴더에 page.tsx 파일을 만들고 가로채기 성공이라고 간단하게 텍스트를 출력하는 페이지 컴포넌트를 만들어 본다.

  ```tsx
  export default function Page() {
    return <div>가로채기 성공!</div>;
  }
  ```

- 개발모드를 중지하고 `.next`폴더를 삭제한 다음, 다시 개발모드로 실행하여 인덱스 페이지에서 도서를 클릭해서 도서 상세 페이지로 이동해보면 가로채기 성공이라는 텍스트가 렌더링이 된 것을 확인할 수 있다.

  <img width="600px" src="">

  > 페이지 가로채기에 성공한 화면

- 이제는 인터셉팅 라우트되어서 렌더링된 페이지가 이제 modal 형태로 기존의 도서 상세 페이지를 렌더링 하도록 설정해본다.
- 도서의 상세 페이지에게 전달되고 있던 페이지의 props들을 똑같이 전달해줘야 하기 때문에 인터셉팅 페이지가 전달받는 페이지 Props를 any 타입으로 받아와서 `BookPage`의 props로 전부 그댈 전달해주도록 한다.
- 이렇게 해주면 일단 인터셉팅된 페이지 컴포넌트에서도 도서의 상세 페이지를 그대로 렌더링하는 작업까지는 일단 완료가 된다.

  ```tsx
  import BookPage from '@/app/book/[id]/page';

  export default function Page(props: any) {
    return (
      <div>
        가로채기 성공!
        <BookPage {...props} />
      </div>
    );
  }
  ```

- 다음으로 렌더링된 상세 페이지를 모달 형태로 띄워주는 작업을 추가한다.
- 아래와 같이 모달 컴포넌트의 코드를 작성해주면 createPortal이라는 메서드를 통해서 브라우저에 존재하는 `modal-root`라는 아이디를 갖는 DOM 요소 아래에 dialog 태그가 렌더링이 될 것이다.
- 그런데 굳이 이렇게까지 하는 이유는, 일단 `modal`이란 건 화면 전체를 다 뒤덮는 UI 요소를 말하는 것이다. 그런 modal 같은 요소를 그냥 일반적인 컴포넌트로 지금까지 해 왔듯이 `return <dialog>...</dialog>` 해주게 되면 렌더링된 요소들은 어쩔 수 없이 modal 컴포넌트를 포함하는 지금의 페이지 컴포넌트 안에 하위 요소로써 렌더링이 될 것이기 때문이다.
- 아무래도 페이지 컴포넌트 하위 요소로 렌더링이 되면 좀 어색하다. 왜냐하면 지금 dialog 태그로 만들어지는 modal 요소는 전체 화면을 다 뒤덮는 `글로벌한 요소들`이 될텐데 특정 페이지 컴포넌트의 하위 div 태그 밑에 들어가 있라고 생각하면 어색하다.
- 그렇기 때문에 코드상에서 `createPortal`이라는 메서드를 통해서 브라우저에 존재하는 DOM 요소 아래에 고정적으로 modal 요소들을 렌더링 하도록 설정한 것이다라고 이해하면 된다.

  ```tsx
  'use client';

  import { ReactNode } from 'react';
  import { createPortal } from 'react-dom';
  import style from './modal.module.css';

  export default function ({ children }: { children: ReactNode }) {
    return createPortal(
      <dialog>{children}</dialog>,
      document.getElementById('modal-root') as HTMLElement
    );
  }
  ```

- 이제 다음으로 `modal-root`라는 id를 갖는 요소를 실제로 브라우저에 배치하여 그 아래에 modal이 등장하도록 한다.
- `modal-root` id를 갖는 요소는 루트 레이아웃 컴포넌트 안에 body 태그 제일 밑에 div 태그를 하나 추가한 뒤에 id로 `modal-root`로 설정해준다.
- 이러한 dialog 태그는 방금 우리가 루트 레이아웃 컴포넌트에 만든 div 태그 아래에 추가가 되는 식으로 동작하게 될 것이다.

  ```tsx
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="ko">
        <body>
          <div className={style.container}>
            <header>
              <Link href="/">📚 ONEBITE BOOKS</Link>
            </header>
            <main>{children}</main>
            <Footer />
            <div id="modal-root"></div>
          </div>
        </body>
      </html>
    );
  }
  ```

- 이제부터는 modal이 화면에 전체를 다 뒤덮도록 설정을 해도 전혀 HTML의 구조상 어색해지지는 않을 것이다.
- 이렇게 만든 모달을 인터셉딩 라우트 폴더의 페이지 컴포넌트 내부에서 도서 상세 페이지 컴포넌트를 감싸도록 설정을 해준다.
- 이제 모달의 스타일과 기능까지만 설정해주면 모달 창 안에 도서 상세 페이지를 띄울 수 있게 된다.

  ```tsx
  // (.)book/[id]/page.tsx
  export default function Page(props: any) {
    return (
      <div>
        가로채기 성공!
        <Modal>
          <BookPage {...props} />
        </Modal>
      </div>
    );
  }
  ```

- 스타일을 추가해주기 전에 `dialog` 태그는 모달의 역할을 하기 때문에 기본적으로 꺼져있는 상태로 렌더링이 된다. 즉, dialog 태그가 처음 렌더링이 됐을 때는 모델이 화면에 보이지 않는 상태로 렌더링이 된다는 말이 된다.
- 그래서 reference 객체를 하나 만들어서 dialog 태그의 ref 속성으로 연결시켜준다. 그리고 useEffect로 컴포넌트가 화면에 처음 마운트가 되었을 때 강제로 모달을 켜지도록하고 스크롤 값을 최상단으로 이동하도록 설정한다.

  ```tsx
  'use client';

  import { ReactNode, useEffect, useRef } from 'react';
  import { createPortal } from 'react-dom';
  import style from './modal.module.css';

  export default function ({ children }: { children: ReactNode }) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal();
        dialogRef.current?.scrollTo({
          top: 0,
        });
      }
    }, []);

    return createPortal(
      <dialog className={style.modal} ref={dialogRef}>
        {children}
      </dialog>,
      document.getElementById('modal-root') as HTMLElement
    );
  }
  ```

- CSS 속성으로 `.modal::backdrop` 설정을 사용하면 배경의 색을 쉽게 지정해 변경할 수 있다.
- 이제 모달의 기능을 추가하면 되는데, 추가할 모달의 기능이란 사용자들이 모달이 열려 이을 때 모달의 바깥 영역, 즉 배경 영역을 클릭하거나 이 상태에서 ESC 버튼을 눌렀을 때 브라우저에서 뒤로가기를 발생시켜서 다시 인덱스 페이로 돌려보냄으로써 modal을 꺼버리는 그런 기능을 말한다.
- 이때 중요한 분기처리로 모달의 배경을 눌렀는지, 내부를 눌렀는기 구분해야 한다. `e.target.nodeName === 'DIALOG'` 조건이 참이라면 배경이 눌린 것으로 인식하게 할 수 있다. 그리고 이때 코드 상에서 발생하는 타입 오류는 아직 타입스크립트가 dialog 태그에 onClick 이벤트가 발생했을 때 nodeName 속성을 지원하지 않기 때문에 발생한다. 이럴 경우에는 `(e.target as any).nodeName`라고 타입 단언을 해서 간단하게 타입 오류를 제거할 수 있다.
- 추가적으로 modal에서 사용자가 ESC 키를 눌러서 modal을 끄게 되었을 때에도 뒤로 가기를 발생시켜 주기 위해서 modal이 꺼지는 이벤트인 onClose 이벤트가 발생했을 때에도 router 객체의 back 메서드를 호출하도록 만들어 준다.

  ```tsx
  export default function ({ children }: { children: ReactNode }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    useEffect(() => {
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal();
        dialogRef.current?.scrollTo({
          top: 0,
        });
      }
    }, []);

    return createPortal(
      <dialog
        onClose={() => router.back()}
        onClick={(e) => {
          // 모달의 배경을 클릭하면 -> 뒤로가기
          if ((e.target as any).nodeName === 'DIALOG') {
            router.back();
          }
        }}
        className={style.modal}
        ref={dialogRef}
      >
        {children}
      </dialog>,
      document.getElementById('modal-root') as HTMLElement
    );
  }
  ```

- 인터셉팅 라우트에서 꼭 기억해 줘야 할 점은 클라이언트 사이드 렌더링 (Link 태그로 이동, router.push 메서드로 이동) 방식으로 페이지가 이동할 때에만 인터셉팅이 일어나기 때문에 페이지를 새로고침해서 초기 접속 요청을 날리게 되면 이때에는 인터셉팅 라우트가 동작하지 않는다는 점이다.

## 패럴렐과 인터셉팅 라우트의 결합

- 도서 상세 페이지를 유저가 클라이언트 사이드에서 방문하게 되었을 때 모달로 표시해주는 기능을 만들었다. 그런데 이때 이 페이지에는 한 가지 하자가 있다. 모달의 뒷배경으로 나오는 페이지가 인덱스 페이지가 아니라 '가로채기 성공!' 글자와 함께 인터셉팅 라우트의 페이지 컴포넌트가 나오고 있다.
- 그래서 사실상 모달로 도서 상세 페이지 컴포넌트를 띄워봤자 뒷배경에 원래 탐색하고 있던 페이지가 병렬로 함께 나와주는 상황이 아니기 때문에 좀 부족한 것 같다라는 느낌이 들고 있다.
- 지금 만들려고 하는 건 `하나의 화면`에 `modal`도 띄우고 기존의 `index` 페이지도 띄우고 싶은 것이다. 다시 말하면 하나의 화면에 여러 개의 페이지를 병렬로 렌더링을 하려고 하는 것이다.
- 그렇기 때문에 이때에는 병렬로 페이지를 렌더링 시키는 기능인 Parallel route를 이용하면 된다.
- 모달 페이지를 `(with-searchbar)` 폴더 안에 들어있는 인덱스 페이지와 함께 렌더링 하기를 원하기 때문에 앱 폴더 밑에 `@modal` 슬롯을 하나 만들어서 인터셉팅 라우트가 동작하고 있는 `(.)book/[id]` 폴더를 이동시켜준다.
- 이렇게 되면 `(.)book/[id]`폴더에 있는 page.tsx는 모달 슬롯에 있는 페이지 컴포넌트가 된다. 그리고 이 페이지 컴포넌트는 `@modal` 슬롯에 부모 레이아웃 컴포넌트인 루트 레이아웃 컴포넌트에게 modal이라는 이름의 props로 전달이 된다.
- 그래서 이제 루트 레이아웃에서는 modal이라는 이름으로 `ReactNode` 타입으로 인터셉팅 되는 페이지 컴포넌트를 병렬로 받아올 수 있게 되는 것이다.
- 이로써 루트 레이아웃 컴포넌트에서 `children`과 함께 병렬로 렌더링 하도록 설정해주면 이제 modal 속의 페이지와 일반적인 페이지들이 병렬로 함께 잘 렌더링이 되도록 설정이 된다.

  <img width='500px' src=''>

  > 도서 상세 페이지 인터셉터 라우트 폴더를 포함하는 modal 슬롯을 생성

  ```tsx
  // app/layout.tsx
  export default function RootLayout({
    children,
    modal,
  }: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
  }>) {
    return (
      <html lang="ko">
        <body>
          <div className={style.container}>
            <header>
              <Link href="/">📚 ONEBITE BOOKS</Link>
            </header>
            <main>{children}</main>
            <Footer />
            {modal}
            <div id="modal-root"></div>
          </div>
        </body>
      </html>
    );
  }
  ```

- 그리고 혹시나 도서 상세 페이지의 모달이 없는 경우도 설정을 해줘야 된다. 왜냐하면 사용자가 프로젝트에 인덱스라는 경로로 요청을 보내게 되면 이때에는 지금 modal 슬롯 안에서 인덱스 경로에 해당하는 페이지가 존재하지 않기 때문에 자동으로 404 페이지로 리디렉션이 된다.
- 그렇게 되면 안되기 때문에 `@modal`이라는 슬롯 안에 `default` 페이지를 만들어주기 위해서 `@modal/default.tsx` 파일을 만들고 null 값을 반환하다록 만들어 준다.

  ```tsx
  export default function Default() {
    return null;
  }
  ```

- 이렇게 default 페이지까지 만들어주게 되면 루트 레이아웃의 children prop인 인덱스 페이지 컴포넌트와 modal prop인 `@modal` 슬롯의 default 페이지가 전달되어 렌더링 되게 된다.
- 인덱스 페이지에서는 `@modal` 슬롯 안에 인덱스 페이지를 위한 컴포넌트는 없기 때문에 default 컴포넌트가 나타나게 된다. 이때 디폴트 컴포넌트는 아무런 값도 반환하지 앟는 그런 컴포넌트이기 때문에 결과적으로 그냥 modal 컴포넌트는 없는 페이지 컴포넌트만 렌더링이 될 것이다.
- 그리고 만약 사용자가 도서 아이템을 클릭해서 `book/1` 페이지로 접속하게 되면
  children으로 원래라면 book 폴더 안에 들어있는 페이지 컴포넌트가 그대로 전달이 되었야 겠지만, 인터셉팅 라우트가 동작해서 경로를 가로채기 때문에 이때는 children은 기존의 index 페이지를 유지하게 되고, modal이라는 값으로 인터셉팅된 `(.)book/[id]` 폴더의 페이의 컴포넌트가 들어오게 되어 병렬로 함께 렌더링이 된다.
- 확인을 위해 서버 실행을 중단하고, `.next` 폴더를 지우고, 다시 Next App을 개발 모드로 가동한 뒤에 브라우저에서 새로고침 한 뒤 인덱스 페이지에서 북 페이지로 접속해보면 모달 형태로 북 페이지가 잘 나타나면서 뒷 배경에 인덱스 페이지까지 그대로 잘 나타나는 것을 확인할 수 있다.

  <img width='600px' src=''>

  > 인터셉팅 라우팅 모달과 인덱스 페이지의 패럴렐 라우팅

- 이런 식으로 패럴렐 라우트와 인터셉팅 라우트를 함께 활용하게 되면 인터셉팅 되어서 모달로 나타나게 되는 도서의 상세 페이지를 병렬로 이전의 페이지와 함께 보여줄 수 있는 기능을 만들 수 있다.
- 향후 프로젝트를 진행할 때에도 이러한 인터셉팅 라우트와 페럴렐 라우트를 함께 결합해서 사용하면서 특정 아이템의 상세 페이지를 모달로써 띄워주는 것도 굉장히 좋은 사용자 경험을 제공할 수 있을 것 같다.
