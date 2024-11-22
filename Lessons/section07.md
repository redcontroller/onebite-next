## 서버 액션

- 브라우저에서 호출할 수 있는 서버에서 실행되는 비동기 함수
- 서버 액션을 활용하면 별도의 API를 만들 필요 없이 간단한 함수 하나만으로도 브라우저에서 Next.js 서버 측에서 실행되는 함수를 직접 호출할 수 있다.
- 함수 내부에 `"use server"`라는 지시자가 있으면, 이 함수는 이제 Next.js 서버에서만 실행이 되는 서버 액션으로 설정이 된다.
- 서버 액션에서는 특정 함수를 실행시켜서 데이터베이스에 데이터를 직접 저장을 한다거나, 아예 SQL문을 직접 실행해서 데이터를 추가하는 등의 서버에서만 실행할 수 있는 다양한 동작들을 자유롭게 수행할 수 있다.
- Next.js의 서버 액션은 클라이언트인 브라우저에서 특정 `Form`의 제출 이벤트가 발생했을 때 서버에서만 실행되는 함수를 브라우저가 직접 호출하면서 데이터까지 `FormData` 형식으로 전달할 수 있게 해주는 기능이다.
- 기존에 API를 통해서만 진행했어야 하는 브라우저와 서버 간의 데이터 통신을 오직 JavaScript 함수 하나마느로 굉장히 쉽고 간결하게 설정할 수 있기 떄문에 `서버 액션`은 오늘날 상당히 강력하고 훌륭한 기능으로 많은 주목을 받고 있는 상황이다.

  <img width='500px' src='https://github.com/user-attachments/assets/98899d49-bc20-4250-874a-0b4dbda6bc7e' />
  <img width='500px' src='https://github.com/user-attachments/assets/eefe08ec-30fe-4ff0-816c-1bd612ed6d4b' />

  > 서버액션과 서버액션 예시 코드

- 간단하게 아래와 같이 form 태그를 만들고, 간단한 데이터를 입력 후 submit 버튼을 눌러보면 개발자 모드의 네트워크 탭에서 브라우저 요청이 발생한 것을 볼 수 있다.
- 그렇기 때문에 서버 측 콘솔인 VSCode 터미널에 console.log로 출력한 메시지가 출력된 것을 확인할 수 있다.

  <img width='500px' src='https://github.com/user-attachments/assets/ad2eaf40-fb6c-43f9-97fd-a77b09ccebaa' />
  <img width='800px' src='https://github.com/user-attachments/assets/140f2daa-804f-43c3-8017-f8e5b6dd76e2' />

  > 서버 액션으로 발생한 요청

  ```typescript
  function ReviewEditor() {
    async function createReviewAction() {
      'use server';
      console.log('server action called');
    }
    return (
      <section>
        <form action={createReviewAction}>
          <input name="content" placeholder="리뷰 내용" />
          <input name="author" placeholder="작성자" />
          <button type="submit">작성하기</button>
        </form>
      </section>
    );
  }
  ```

- 서버 액션의 요청을 자세히 살펴보면 네트워크 탭에서 요청의 `Headers`를 살펴보면 Next 서버의 주소인 `http://localhost:3000/book/11`으로 `Post` 요청이 전송된 것을 확인할 수 있다.
- 그리고 `Headers`에는 휠을 조금 내려보면 `Request Headers`가 있는데, `Next-Action`이 해시값이 설정되어 있는 것을 확인할 수 있다. 이를 통해 알 수 있는 추가적인 사실은 우리가 코드상에 `"use server"` 지시자를 통해서 서버 액션을 만든 다음, 해당하는 서버 액션을 호출하는 폼을 브라우저 측에서 제출하게 되면 자동으로 서버 액션을 호출하는 HTTP 요청이 서버에 전송되게 된다. 이런 서버 액션들은 컴파일 결과 자동으로 특정한 해시값을 갖는 API로서 설정이 되기 때문에 브라우저 측에서 서버 액션을 호출할 때 `Response Headers`의 `Next-Action`이라는 이름으로 혀재 호출하고자 하는 서버 액션의 해시값까지 함께 명시가 된다.
- 쉽게 설명하면 서버 액션을 만들게 되면 서버 액션 코드를 실행하는 API가 하나 자동으로 생성이 되고, 그 API는 브라우저에서 FormData를 제출했을 때 자동으로 호출이 된다.

  <img width='500px' src='https://github.com/user-attachments/assets/71e9cfa6-390b-415f-937e-d7e2300949b2' />
  <img width='500px' src='https://github.com/user-attachments/assets/5ba6f72e-6337-4cdc-836c-71d8da912715' />

  > 서버 액션으로 발생한 요청 자세히 살펴보기: Headers

- Payload에서는 리퀘스트와 함께 전송된 값들을 확인해볼 수 있다. 전송되는 값들은 최종적으로 FormData라는 포맷으로 묶여서 함께 전달된다.
- 리퀘스트와 함께 전달된 이 FormData는 자동으로 서버 액션 함수에게 매개변수로써 전달이 된다. 그렇기 때문에 서버 액션의 매개변수인 FormData를 JavaScript 내장 타입인 FormData로 정의하고 서버 액션 함수 내부에서 전달 받은 formData를 출력해보면 입력한 값이 그대로 터미널에 출력되는 것을 확인할 수 있다.

  ```typescript
  function ReviewEditor() {
    async function createReviewAction(formData: FormData) {
      'use server';
      const content = formData.get('content');
      const author = formData.get('author');

      console.log(formData);
      console.log(`리뷰 내용: ${content},\n작성자: ${author}`);
    }
    ...
  }
  ```

  <img width='500px' src='https://github.com/user-attachments/assets/1e6f9563-6771-4c4c-8876-29ba0db2859b' />
  <img width='500px' src='https://github.com/user-attachments/assets/c6a5d8c1-f382-4d98-97d6-60521eb6a129' />
  <img width='500px' src='https://github.com/user-attachments/assets/7d5b3db3-7ff2-47f6-9d4b-32f94e97b000' />

  > 서버 액션으로 발생한 요청 자세히 살펴보기: Payload

- 한 가지 주의해야할 점은 위 서버 액션 코드에서 content나 author 변수의 타입이 `formDataEntryValue | null` 타입으로 추론이 되는 것을 확인할 수 있다. `formDataEntryValue` 타입은 string이나 file 타입을 의미하기 때문에 string 값을 전달받고 있는 상황에서는 적절하지 않다. 이럴 때는 해당 값이 있을 때에만 문자열 타입으로 변환하도록 설정하면 된다.

  ```typescript
  function ReviewEditor() {
    async function createReviewAction(formData: FormData) {
      'use server';
      const content = formData.get('content')?.toString(); // 값이 존재하면 문자열 타입으로 변환
      const author = formData.get('author')?.toString(); // 값이 존재하면 문자열 타입으로 변환

      console.log(formData);
      console.log(`리뷰 내용: ${content},\n작성자: ${author}`);
    }
    ...
  }
  ```

### 서버 액션을 사용해야 하는 이유가 뭘까?

- 그냥 간단히 지금과 같은 상황에서는 `ReviewEditor` 컴포넌트를 클라이언트 컴포넌트로 만들어 버리던가, 아니면 별도의 API를 만들어서 호출할 수도 있다.
- Next.js에서 굳이 이런 식을 서버 액션이라는 기능을 활용하는 이유는, 코드가 매우 간결해서 그렇다.
- API를 이용해서 서버 액션의 기능을 만드려면 별도의 파일을 추가하고 경로를 설정하고 예외처리를 더해주고 등등 부가적인 작업들을 수행해야 하기 때문에 굉장히 단순한 기능만 필요한 경우에는 보다 간결하게 함수 하나만으로도 API의 역할을 충실히 할 수 있는 서버 액션을 활용하는 것이 더 좋은 방법일 수 있다.
- 게다가 서버 액션은 오직 서버 측에서만 실행되는 코드이기 때문에 브라우저에서는 호출만 할 수 있을 뿐 이 코드를 전달받지는 않는다. 그렇기 때문에 보안상으로 민감하거나 또는 중요한 데이터를 다룰 때에도 유용하게 활용될 수 있다.
- **결론적으로 서버 액션의 목적은 조금 더 간결하고, 조금 더 편리하게 서버 측에서 실행되는 동작을 정의하는 데 있다.**

## 리뷰 추가 기능 구현하기 (with 서버액션)

- 서버액션 함수로부터 잔달받은 FormData 값을 이용해서 실제로 데이터베이스에 새로운 리뷰를 추가하는 기능을 만들어 본다.
- 서버액션 내부에서 데이터베이스에 직접 데이터를 추가하는 기능을 우리가 만들어 줘야 한다. 그러기 위해서는 몇몇 패키지를 추가로 설치해야 된다거나 또는 설정파일을 조금 손봐야 하는 등 부가적으로 해줘야 하는 일들이 많아지게 된다.
- 사실상 그렇게 하면 주객전도 벌어지기 때문에, 지금 가장 중요한 서버액션 응용법을 살펴보는 것에 집중하기 위해서 데이터베이스를 직접 접근하지 않고 대신에 간단히 백엔드 서버에서 제공하고 있는 리뷰와 관련된 API들을 빠르게 이용하도록 한다.
- 코드에 서버 측 서버액션과 클라이언트 측 HTML 태그에 빈 입력에 대한 방지를 클라이언트 측과 서버 측에 동시에 진행해주는 이유는 서버도 클라리언트를 100% 믿을 수 없고, 똑같이 클라이언트도 서버를 100% 신뢰하면 안되기 때문이다. 그래서 서버와 클라이언트 모두 동시에 예외 처리를 진행해주면 더 좋다.
- `201` 응답코드는 요청이 성공적으로 처리되었으며, 새로운 리소스가 생성되었음을 나낸다.

  <details>
    <summary>HTTP 응답 코드 의미</summary>
    <div markdown='1'>

  HTTP 응답 코드는 클라이언트의 요청에 대한 서버의 응답 상태를 나타내는 숫자 코드 <br>
  HTTP 응답 코드를 종류별로 정리

  #### 1xx: 정보 응답

  - 100 Continue: 서버가 요청의 일부를 받았으며, 계속 진행해도 좋다는 의미입니다.
  - 101 Switching Protocols: 서버가 요청에 따라 프로토콜을 변경하고 있다는 의미입니다.

  #### 2xx: 성공 응답

  - 200 OK: 요청이 성공적으로 처리되었음을 나타냅니다.
  - 201 Created: 요청이 성공적으로 처리되었으며, 새로운 리소스가 생성되었음을 나타냅니다.
  - 204 No Content: 요청은 성공했지만 반환할 내용이 없음을 나타냅니다.
  - 3xx: 리다이렉션 응답
  - 301 Moved Permanently: 요청한 리소스가 새로운 URL로 이동되었음을 나타냅니다. 브라우저는 이 새로운 URL로 자동으로 이동합니다.
  - 302 Found: 요청한 리소스가 일시적으로 다른 URL에 있음을 나타냅니다. 브라우저는 이 URL로 자동으로 이동합니다.
  - 304 Not Modified: 요청한 리소스가 수정되지 않았음을 나타냅니다. 브라우저는 캐시된 버전을 사용합니다.

  #### 4xx: 클라이언트 오류

  - 400 Bad Request: 요청이 잘못되었거나 문법 오류가 있음을 나타냅니다.
  - 401 Unauthorized: 인증이 필요하거나 인증에 실패했음을 나타냅니다.
  - 403 Forbidden: 서버가 요청을 이해했지만, 권한 문제로 요청을 거부했음을 나타냅니다.
  - 404 Not Found: 요청한 리소스를 찾을 수 없음을 나타냅니다.

  #### 5xx: 서버 오류

  - 500 Internal Server Error: 서버 내부에서 오류가 발생했음을 나타냅니다.
  - 502 Bad Gateway: 서버가 게이트웨이 또는 프록시 서버 역할을 하고 있을 때, 상위 서버로부터 유효하지 않은 응답을 받았음을 나타냅니다.
  - 503 Service Unavailable: 서버가 과부하 또는 유지 보수로 인해 일시적으로 요청을 처리할 수 없음을 나타냅니다.

    <div>
  </details>

- 리뷰를 새로 생성해서 DB에 추가했지만, 불러오는 기능을 만들지 않아서 확인할 수가 없다. 일단은 실행하고 있는 백엔드 서버를 실행하고 있는 VSCode 터미널을 하나 더 열고, `npx prisma studio`를 통해 현재 데이터베이스에 저장된 데이터에서 새롭게 추가한 리뷰 데이터를 확인할 수 있다.
- 참고로 ID 값은 일련번호처럼 붙는 것이기 때문에 크게 중요하지 않다.

  <img width='800px' src='https://github.com/user-attachments/assets/e88a12a1-94e6-4ac2-ba99-a7bdfbcfea36' />

  > 서버 액션으로 DB 추가한 리뷰 데이터를 Prisma Studio를 통해 확인

- 서버액션까지 페이지 컴포넌트에 존재하면 파일의 길이가 너무 길어지기 때문에 `/src/actions`라는 폴더를 생하고 `create-review.action.ts`파일을 생성해서 컴포넌트를 분리해준다.
- 새로 생성한 파일로 서버액션 함수를 옮기고 난 뒤에는 `"use server"` 지시자는 이제 파일의 최상단에 작성되도록 옮겨주면 된다.
- 참고로 서버액션을 별도의 파일로 따로 분리해 놓았을 때에는 `"use server"`라는 지시자를 함수 안쪽이 아니라 파일의 최상단에 작성해주는 것이 일반적이다. 왜냐하면 파일 안에 있는 내용들은 모두 어차피 이제 서버액션을 위한 코드일 것이기 때문이다.
- bookId는 이제 컴포넌트의 props로부터 서버 액션이 전달받을 수 없기 때문에 이럴 때에는 어쩔 수 없이 content나 author처럼 bookId도 formData를 통해서 함께 전달받도록 코드를 수정해 주어야 한다.
- 이제 bookId를 form을 통해서 사용자의 입력들과 함께 전달받아야 한다. 하지만 bookId를 사용자에게 직접 입력하라고 하기에는 어색하다. 이럴 때에는 `hidden`이라는 속성을 추가하는 일종의 트릭을 활용할 수 있다.

  ```typescript
  // create-review.action.ts
  'use server';

  export default async function createReviewAction(formData: FormData) {
    const bookId = formData.get('bookId')?.toString();
    const content = formData.get('content')?.toString();
    const author = formData.get('author')?.toString();

    if (!bookId || !content || !author) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
        {
          method: 'POST',
          body: JSON.stringify({ bookId, content, author }),
        }
      );
      console.log(response.status);
    } catch (err) {
      console.error(err);
      return;
    }
  }

  // /book/[id]/page.tsx
  function ReviewEditor({ bookId }: { bookId: string }) {
    return (
      <section>
        <form action={createReviewAction}>
          <input hidden readOnly name="bookId" value={bookId} />
          <input required name="content" placeholder="리뷰 내용" />
          <input required name="author" placeholder="작성자" />
          <button type="submit">작성하기</button>
        </form>
      </section>
    );
  }
  ```

- `hidden`이라는 어트리뷰트는 input 태그를 브라우저로부터 감춰주는 역할을 한다. 즉, 안 보이는 input 태그를 만드는 것이다. 하지만 보이지 않을 뿐, 엄연히 존재하기 때문에 다른 input 태그들과 동일하게 form 이 제출되었을 때 서버 액션에게 bookId라는 설정된 이름으로 값을 전달하게 된다.
- 그런데 input 태그에 `hidden` 속성을 적용하면 에러가 발생하는데, input 태그 값인 value를 제공하고 있지만 onChange 핸들러가 없어서 발생하는 것이다. 이는 Next App이 값만 있고 이벤트 핸들러가 없기 때문에 값만 있고 바꿀 수 있는 있는 방법이 없는 잘못 만든 input 태그가 아니냐는 의미로 에러를 발생시킨 것이다.
- 사실상 프로젝트의 기능에 문제를 끼치거나 악영햐을 미치는 그런 큰 오류는 아니다. 무시해도 괜찮긴 하지만 에러 메시지를 없애고자 한다면 이 경우에는 `readOnly` 속성을 추가해주면 된다. 그렇기 때문에 앞으로 `hidden` 애트리뷰트가 있다면 모두 `readOnly`를 추가하면 된다.

  <img width='700px' src='https://github.com/user-attachments/assets/420485a1-3c40-4052-866e-2a9d37684397' />

  > input 태그를 'hidden'으로 만들면 발생하는 에러

- 정리하면 서버액션은 별도의 파일로 충분히 분리를 해줄 수 있고, 그러면서 bookId처럼 고정적으로 제공되어야 하는 값이 있다면, `hidden와 readOnly` 애트리뷰트가 설정된 input 태그를 이용해서 자동으로 전달되게 만드는 트릭을 활용할 수 있다.

## 리뷰 조회 기능 구현하기 & 스타일링

- 이제 에러 핸들링을 `error.tsx`라는 파일로 별도로 처리하고 있기 때문에 조건문 내부에서 에러를 발생시켜주기만 하면 된다.
  ```typescript
  if (!response.ok) {
    throw new Error(`Review fetch failed : ${response.statusText}`);
  }
  ```
- 서버액션의 결과를 저장하는 변수 response의 타입을 보면 `any`타입으로 추론되는 것을 볼 수 있다. 나중에 타입 오류가 발생할 가능성이 매우 높기 때문에 서버액션의 응답값의 타입을 정의해두는 것이 좋다. 응답값에 어떤 속서들이 있는지 모를 때는 API 문서를 통해서 확인해 볼 수 있다. 이렇게 정의한 타입을 response에 적용해주면 타입 오류에서 보다 안전해질 수 있다.

## 리뷰 재검증 구현하기

- 서버액션을 통해서 새로운 리뷰 데이터가 추가가 되었을 때, 리뷰 데이터를 재검증하여 새로고침 없이도 새로운 리뷰 데이터가 화면에 나타나는 기능을 구현한다.
- 리뷰를 작성하고 사용자가 새로고침을 해야만 등록된 리뷰가 나타나는 것은 완성도 측면에서 미흡하다는 느낌을 준다.
- 작성한 리뷰가 바로 나타나도록 하기 위해서는 `ReviewList` 컴포넌트를 서버 측에서 다시 한번 렌더링을 해서 그 결과를 브라우저에게 보내주기를 원하는 것이다. 그렇게 되면 리뷰 리스트에 새로운 데이터가 포함된 채로 화면이 업데이트가 될 것이다.
- 또는 북 페이지 자체를 다시 한번 렌더링을 해서 클라이언트에게 보내주는 방법도 있을 것이다.
- 간략하게 말하면, 서버액션이 성공적으로 종료되었을 때 실시간으로 서버 측에서 페이지를 다시 렌더링 한다던가 또는 서버 컴포넌트들을 다시 렌더링해서 사용자들이 보고 있는 북 페이지를 재검증하기를 원한다.
- 이럴 경우에는 서버액션 내부에서 Next.js의 `next/cache` 패키지에서 제공하는 `revalidatePath` 메서드를 호출하고 함수의 인수로 경로를 넣어주면 된다.`revalidatePath` 메서드가 하는 역할은 Next 서버 측에 인수로 전달한 경로의 페이지를 다시 생성해 줄 것(재검증)을 요청한다.
- `revalidatePath` 메서드가 호출이 되면 Next.js 서버가 인수로 전달된 경로의 페이지를 자동으로 재검증(다시 재생성)하기 때문에 북 페이지의 페이지 컴포넌트가 다시 렌더링되면서 자식 컴포넌트인 `BookDetail`, `ReviewEditor`, `ReviewList` 컴포넌트 모두 다시 렌더링이 된다. 또한 각 컴포넌트 안에 들어있는 데이터 페칭도 역시 다시 수행된다. 그렇게 다시 생성된 페이지를 클라이언트(브라우저)에게 다시 전달하고 렌더링을 수행해 새로운 리뷰를 바로바로 보여줄 수 있게 된다.
- 결론적으로 서버액션 내부에서 `revalidatePath`라는 메서드를 활용하면 넥스트 서버 측에게 페이지를 다시 생성하도록 요청해서 서버액션의 결과를 바로 화면에 나타나게 할 수 있다.
- 그런데 2 가지 주의해야 할 점이 있다. (1) `revalidatePath` 메서드는 오직 서버 측에서만 호출할 수 있는 메서드이다. 그렇기 때문에 서버액션 내부에서 호출을 하거나 또는 서버 컴포넌트 내부에서만 호출을 할 수 있다. (2) `revalidate` 메서드는 인수로 전달된 경로 페이지를 전부 재검증 시켜버리는 기능이라는 점이다. 페이지를 새로 생성하게 되면 페이지에 포함된 모든 캐시틀까지도 전무 무효화되어 삭제된다. 만약 `ReviewList` 컴포넌트 내에 있는 데이터 페칭의 캐시 설정을 `"force-cache"`로 했다고 하더라도 `RevalidatePath` 메서드가 호출이 되면 무시되고 페이지 전체가 다시 재생성된다.
- 또한 `revalidatePath` 메서드가 호출되면 데이터 캐시뿐만 아니라 페이지 자체를 캐싱하는 `Full Route Cache`까지도 함께 삭제가 된다.
- `Full Route Cache`를 확인하려면 프로젝트를 빌드해서 프로덕션 모드로 가동해야 한다. `Full Route Cache`에 어떤 페이지들이 저장되었는지 확인해보기 위해서 파일 탐색이에서 `.next/server/app/book`에서 확인해보자. 일단 `generateStaticParams` 함수로 설정해뒀던 대로 1 ~ 3번 아이디를 갖는 페이지가 HTML 파일로 잘 저장되어 있다.
- 브라우저에서 북 페이지 1번에서 리뷰를 작성해보고 `Full Route Cache`된 HTML 파일을 비교해보면, 브라우저에서는 내가 작성한 리뷰가 새롭게 렌더링 되어 바로 보이지만 `Full Route Cache`된 `1.html` 파일에서는 추가된 내용이 보이지 않는다.
- 결론적으로 `Full Route Cache`가 제거만 됐을 뿐 새롭게 다시 업데이트 되지는 않았다.

  <img width='700px' src='' />
  <img width='700px' src='' />

  > `revalidatePath`로 새로 작성한 리뷰가 반영 안되는 Full Route Cache (저장된 북 페이지의 리뷰)

- 이러한 현상은 `revalidatePath`라는 메서드는 `Full Route Cache`를 삭제, 즉 무효화하기만 할 뿐만 아니라 새롭게 생성된 페이지를 다시 `Full Route Cache`에 저장해주지는 않기 때문이다.
- 그래서 기존의 `.next/server/app/book/`폴더에 `Full Route Cache`로써 저장되어 있던 페이지는 사실상 무효화된, 삭제된 캐시인 것이다.
- 이제 새로고침해서 다시 한번 북 페이지에 접속해보면, 이떄에는 캐시된 데이터를 사용할 수 없기 때문에 Next.js 서버 측에서 실시간으로 Dynamic Page를 만들듯이 아예 새롭게 페이지를 다시 한번 생성해서 브라우저에게 보내주게 되고 그렇게 생성한 페이지를 `Full Route Cache`로써 새롭게 업데이트 시켜준다.
- `revalidatePath` 메서드를 서버 액션을 이용해서 페이지를 재검증하도록 요청하면, 이후 다시 한번 해당 페이지에 방문하게 될 때 실시간으로 Dynamic Page처럼 생성이 되고, 그때가 되어서야 `Full Route Cache`에도 데이터가 업데이트 된다.
- 그림으로 더 살펴보자면, 넥스트 서버와 백엔드 서버가 존재한다고 가정할 때 리퀘스트 메모이제이션은 일단 생략하고 풀 라우트 캐시와 보라색의 데이터 캐시의 동작으로만 살펴보자.
- `/book/1` 같은 Static Page를 생성하게 되면 필요한 도서 상세 정보의 데이터를 먼저 백엔드 서버로부터 불러와서 데이터 캐시에 보관을 하게되고, 이어서 리뷰 데이터 또한 백엔드 서버로부터 불러와서 데이터 캐시에 똑같이 보관이 된다. 그리고 이렇게 필요한 데이터들을 다 불러와서 렌더링을 마쳤다면 완성된 페이지를 파란색의 `Full Route Cache`에 보관하게 된다.
- (노란색) 빌드타임이 종료 되고 프로젝트가 실제로 가동되었을 때, `revalidatePath` 메서드가 서버 액션으로부터 호출이 되어서 `/book/1` 페이지를 재검증하라는 요청이 들어오면, 이때 Next 서버는 페이지의 `Full Route Cache`와 `데이터 캐시`를 모두 `purge` (제거)해 버리게 된다. 그리고 나서 현재 사용자가 보고 있는 화면을 업데이트 시켜주기 위해서 다시 페이지를 생성하게 된다. 그런데 이때 페이지를 생성하면서 요청한 데이터 페칭은 앞선 revalidate 과정에서 데이터들이 다 `purge` (숙청)된 상태이기 때문에 다시 백엔드 서버로부터 데이터를 불러와서 데이터 캐시에 다시 한번 set(저장)하게 된다. 그리고 새롭게 만든 페이지를 브라우저에게 그대로 응답해 주게 된다.
- 여기서 주의해야 할 점은 revalidate(최신화) 한 직후에는 `Full Route Cache`에는 페이지가 새롭게 업데이트 되지 않는다. 대신에 이 페이지는 모든 과정이 다 종료되고 브라우저로부터 다음번의 접속 요청이 들어오면 그때 실시간으로 다시 한번 페이지를 생성해서 `Full Route Cache`에 저장이 된다. 다음번에 요청이 있을 때에는 다이나믹 페이지처럼 실시간으로 페이지가 만들어져야 돼서 **비교적으로 느린 응답이 이루어질 수 있다는 주의사항**이 있다.
- \* Purge: 숙청하다. 깨끗이 하다. 일소하다.

  <img width='700px' src='' />
  <img width='700px' src='' />

  > `revalidatePath`가 동작하는 정적 페이지의 작동

- 정적 페이지에서 `revalidatePath` 메서드를 통한 재검증 요청이 굳이 이런 방식으로 동작하게 되는 이유는, revalidate 요청 이후에 브라우저에서 해당 페이지에 접속하게 되었을 때 무조건 최신의 데이터를 보장하기 위해서 그렇게 동작한다고 이해할 수 있다.

## 다양한 재검증 방식 살펴보기

- `revalidatePath`라는 메서드는 두번째 인수로 레이아웃과 페이지라는 옵션이 존재하고 있다. 이런 옵션들까지 함께 활용을 해보면 총 5가지 유형으로 페이지를 재검증하도록 요청을 할 수 있다.

  1. 특정 주소의 해당하는 페이지만 재검증
  2. 특정 경로의 모든 동적 페이지를 재검증
  3. 특정 레이아웃을 갖는 모든 페이지 재검증
  4. 모든 데이터 재검증
  5. 태그 기준, 데이터 캐시 재검증 (가장 효율적)

  ```javascript
  // 1. 특정 주소의 해당하는 페이지만 재검증
  revalidatePath(`/book/${bookId}`);

  // 2. 특정 경로의 모든 동적 페이지를 재검증
  revalidatePath('/book/[id]', 'page');

  // 3. 특정 레이아웃을 갖는 모든 페이지 재검증
  revalidatePath('/book/', 'layout');

  // 4. 모든 데이터 재검증
  revalidatePath('/', 'layout');

  // 5. 태그 기준, 데이터 캐시 재검증
  revalidateTag(`review-${bookId}`);
  ```

- 두번째 재검증 방식은 첫번쨰 인수로 전달되는 경로를 실제 브라우저에 나타나는 경로를 명시하는 게 아니라, 해당 페이지 컴포넌트가 작성된 폴더 또는 파일의 경로를 명시해주어야 한다.
- 특정 레이아웃을 기준으로 모든 페이지를 한꺼번에 재검증하고 싶다면 세번째 방법을 이용한다.
- 네번째 재검증 방식은 인덱스 경로에 있는 레이아웃인 루트 레이아웃을 갖는 모든 페이지들이 전부 다 재검증이 이루어지게 된다. 결국엔 프로젝트의 모든 페이지들이 다 한꺼번에 재검증이 되는 것이다.
- 다섯번쨰 재검증 방식은 태그를 이용한 재검증 방식이다.
- 데이터 패칭에 적용되는 데이터 캐시 옵션으로 지금까지 딱 세가지의 옵션만 활용하고 있었다. 첫번째로 `cache: "force-cache"`로 무조건 데이터를 캐싱하도록 만들거나, `cache: "no-store"` 옵션으로 설정해서 아예 캐싱이되지 않도록 만들거나, `next: { revalidate: 3 }`으로 특정 시간을 주기로 데이터를 재검증하도록 설정하는 세 가지 방법에 대해서만 살펴보았었다.
- 데이터 캐싱에는 한 가지 옵션이 더 존재하는데, 그것이 바로 `next: { tags: [] }`옵션으로 데이터 페칭에 특정 태그를 붙이고 나중에 붙은 태그를 통해서 데이터 캐시를 초기화한다거나 재검증 시키도록 설정할 수가 있다.
- revalidateTag 메서드에 fetch 메서드의 태그를 똑같이 명시해주면, revalidate 메서드가 호출이 되면서 인수로 전달되는 태그 값을 갖는 모든 데이터 캐시가 다시 재검증이 된다.

  ```typescript
  // /book/page.tsx
  async function ReviewList({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
    { next: { tags: [`review-${bookId}`] } } // 태그 정의
  );
  ...

  // /actions/create-review.action.ts
      const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: 'POST',
        body: JSON.stringify({ bookId, content, author }),
      }
    );
    revalidateTag(`review-${bookId}`); // 재검증할 태그 지정
  ```

- 다섯번째 태그를 사용한 방식을 사용하면 첫번째 방식보다 훨씬 더 효율적으로 페이지를 재검증할 수 있다. 왜냐하면 첫번째 방법은 revalidatePath에 특정 경로만 전달하여 해당 경로에 해당하는 모든 데이터 캐시를 다 삭제해버리기 때문에 북페이지에 리뷰 데이터뿐만 아니라 도서의 상세 정보 데이터 또한 캐시에서 삭제해버린다. 사실 그렇게까지 할 필요가 없는 것이 리뷰가 추가된다고 해서 도서의 상세 정보가 바뀌는 건 아니기 때문에 불필요한 캐시를 삭제하는 꼴이 되고 있다.
- 반면에 다섯번째 방식인 revalidateTag 메서드는 오직 태크 값을 갖고 있는 fetch 메서드의 데이터 캐시만 삭제를 해주기 떄문에 북 페이지에 도서의 상세 정보를 불러오는 데이터 캐시는 삭제하지 않고 오직 리뷰 데이터를 불러오는 데이터 캐시만 딱 효율적으로 삭제해서 훨씬 더 경제적으로 데이터 캐시를 재검증할 수 있다.
- 즉, 다섯 번째 재검증 방식을 사용하는 것이 가장 경제적이고 효율적이다.

## 클라이언트 컴포넌트에서의 서버액션

- 서버 액션을 서버 컴포넌트가 아닌 클라이언트에서 호출해서 로딩 상태를 설정하거나 에러를 핸들링하는 추가적인 방법들에 대해서 살펴본다.
- 새로운 리뷰를 사용자가 바로 확인할 수 있도록 기능을 구현해 보았는데, `ReviewEditor` 컴포넌트의 완성도적인 측면에서 정말 아쉬운 부분이 있다. 그것은 사용자가 작성하기 버튼을 클릭하였을 때, 서버액션이 실행 중인 동안 버튼이 비활성화 된다던지 아니면 로딩 바가 표시가 된다던지 하는 로딩 상태 UI가 전혀 설정되어 있지 않다는 점이다.
- 만약 2초 정도 딜레이가 발생하는 서버액션이었다면, 2초라는 시간 동안 사용자들에게는 어떠한 피드백도 제공이 되지 않기 때문에 사용자의 입장에서는 조금도 답답하게 느껴질 수 밖에 없다. 더 큰 문제는 2초 동안 멈춰있는 동안에 여러번 작성하기 버튼을 클릭해서 form을 중복으로 제출하는 것에도 전혀 방지가 되어 있지 않기 때문에 중복으로 form 제출이 연달아서 발생한다.
- 이것은 굉장히 큰 문제이다. 지금은 2초 딜레이 동안 버튼을 3 번만 눌렀지만 만약 성질이 급한 사용자가 있었다면 중복 제출을 약 100번정도 수행했을 수도 있다.

  <img width='500px' src='' />

  > 2초 딜레이로 응답이 없어 버튼을 통해 form 중복이 제출된 상황

### React19 신규 Hook인 useActionState 사용법

- 이런 상황을 꼭 방지해주기 위해서 `ReviewEditor`를 클라이언트 컴포넌트로 전환을 하고 react hooks를 이용해서 로딩 상태를 설정하고 중복 제출을 막아본다.
- 이럴 때 사용하면 굉장히 좋은 새로운 react hook인 `useActionState`이 있다. `useActionState` 훅은 React 19버전부터 추가되는 완전 최신의 React 훅으로 form 태그의 상태를 매우 쉽게 핸들링할 수 있도록 도와주는 여러가지 기능을 가지고 있다.
- `useActionState`는 호출하면서 기본적으로 두개의 인수를 전달해줘야 한다. 첫 번째로 전달하는 인수로는 핸들링하려는 form에 액션 함수를 넣어주어야 한다. 두번째 인수로는 form의 상태의 초기 값을 넣어주면 된다.
- `useActionState`는 3개의 값을 반환하는데, 첫번째 값은 form의 state가 반환되고, 두번째 값으로는 form의 action을 의미하는 formAction이라는 함수가 반환이 되고, 마지막으로 세번째 값으로는 현재 이 form의 로딩 상태를 의미하는 isPending이라는 값이 반환된다.
- `useActionState`를 호출해 주었다면 이제 form 태그의 액션을 서버액션으로 직접 설정하는 것이 아니라, 대신에 `useActionState`로부터 반환받은 `formAction`으로 설정을 해준다. 이렇게 되면 form이 제출되어서 formAction 함수가 실행이 되면 알아서 `useActionState` 훅이 인수로 전달한 서버액션 `createReviewAction`을 실행하게 되고 자동으로 서버액션의 상태까지도 `isPending`이나 `state`라는 값으로 관리를 해주게 된다.
- 만약 `createReviewAction`에서 bookId, content, author 중에 하나라도 없어서 undefined를 반환하게 됐다면 리턴값이 `ReviewEditor` 컴포넌트의 `useActionState`의 state에 그대로 보관이 될 것이다. 그렇기 때문에 `createReviewAction`에서 form 정보가 부족하다면 undefined를 반환할 것이 아니라, 특정 조건으로 인해 액션이 실패하게 되었다면 객체로 status라는 프로퍼티로 false라고 설정해서 서버액션이 실패했음을 알려주고 Error라는 프로퍼티로 이 액션이 왜 실패했는지 알려주면 좋다.
- 서버액션이 어떻게 종료가 되든 실패했거나 성공했다는 결과값이 `ReviewEditor` 컴포넌트의 state에 잘 담기게 될 것이다.
- 한 가지 추가적으로 주의해야 할 점은 서버액션으로 자동으로 `useActionState`의 첫 번쨰 인수인 state 값이 전달이 되기 때문에 서버액션에서는 첫번째 파라미터로 `state`를 전달받도록 기존의 파라미터에 추가해주어야 한다. 다시말해 서버액션을 `useActionState`를 통해서 감싸서 사용하게 되면 서버액션에게 첫번째 인수로 state 값이 전달되기 때문에 서버액션에서는 매개변수로 첫번째 값을 state로 받아오도록 추가를 해줘야 한다.

  ```typescript
  export default async function createReviewAction(state, formData: FormData) {
    const bookId = formData.get('bookId')?.toString();
    const content = formData.get('content')?.toString();
    const author = formData.get('author')?.toString();

    if (!bookId || !content || !author) {
      return {
        status: false,
        error: '리뷰 내용과 작성자를 입력해주세요.',
      };
    }
    try {
      ...

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      revalidateTag(`review-${bookId}`);
      return {
        status: true,
        error: '',
      };
    } catch (err) {
      return {
        status: false,
        error: `리뷰 저장에 실패했습니다 : ${err}`,
      };
    }
  }
  ```

- 그런데 현재 서버액션 `createReviewAction`에서는 굳이 state 값까지는 활용하지 않기 때문에 이런 경우에는 보통 any 타입으로 정의해 놓고 변수 이름을 underscore (또는 underbar, '\_')라ㅗ 설정해서 이 변수는 사용하지 않겠다라는 식으로 설정해 놓기도 한다.

  ```typescript
  export default async function createReviewAction(_: any, formData: FormData) {
  ```

- state값과 isPending이라는 `useActionState`의 반환값을 통해서 로딩 상태를 처리해본다.
- 일단 `isPending`이라는 값을 이용해서 로딩 상태를 설정하고, 중복으로 폼이 제출되는 상황을 방지해 본다.
- `isPending`은 `useActionState`가 관리하는 서버 액션이 실행 중인지 아닌지를 의미하는 값이다. 그렇기 때문에 `isPending`이라는 값이 만약 true라면 이때는 서버액션이 아직 종료가 되지 않았다는 것이기 때문에 로딩 UI를 표시해주면 된다.
- 일단 버튼 태그에서 `disabled` 속성을 `isPending`으로 설정해서 true라면 서버 액션이 현재 실행 중이라는 의미이므로, 이때는 버튼을 다시는 중복으로 누르지 못하도록 막아준다. 또한 버튼의 텍스트 또한 `isPending`의 값에 따라서 변화를 주면 좋다. 마찬가지로 textarea와 input 태그에서 disabled 속성을 추가해 준다.

  ```javascript
  return (
    <section>
      <form className={style.form_container} action={formAction}>
        <input hidden readOnly name="bookId" value={bookId} />
        <textarea
          disabled={isPending}
          required
          name="content"
          placeholder="리뷰 내용"
        />
        <div className={style.submit_container}>
          <input
            disabled={isPending}
            required
            name="author"
            placeholder="작성자"
          />
          <button disabled={isPending} type="submit">
            {isPending ? '...' : '작성하기'}
          </button>
        </div>
      </form>
    </section>
  );
  ```

- hidden으로 설정된 input 태그의 경우 그저 bookId를 formData로 전달하기 위해서 존재하는 인풋 태그였기 때문에 어차피 보이지 않는다. 그래서 disabled 속성을 굳이 설정하지 않아도 된다.
- 다시 작성하기 버튼을 눌러 2초의 delay 함수가 적용되어 있는 서버액션을 실행하면 로딩 상태에 버튼과 textarea, input 태그의 상태가 비활성화 되는 것을 확인할 수 있다. 또한 비활성화 상태로 인해서 여러 번 클릭한다고 하더라도 중복 제출이 방지되어 서버에 딱 하나의 서버 액션만 호출이 된다.

  <img width='500px' src='' />

  > 로딩 상태를 적용한 ReviewEditor 컴포넌트 UI

- 다음으로는 만약 서버액션 `createReviewAction`이 실패하게 됐을 경우의 에러 핸들링을 처리해본다.
- 앞서 서버액션이 실패할 경우 `status: false`이고 에러 메시지가 설정된 형태의 객체를 state의 값으로 반환하돌고 설정을 해주었다.

  ```typescript
  export default function ReviewEditor({ bookId }: { bookId: string }) {
    const [state, formAction, isPending] = useActionState(
      createReviewAction,
      null
    );

    useEffect(() => {
      if (state && !state.status) {
        alert(state.error);
      }
    }, [state]);

    ...
  ```

- 앞으로 프로젝트를 진행할 때 form 태그를 사용할 경우에는 중복 제출을 방지한다던가 아니면 에러 핸들링을 해야 한다던가 이러한 요구사항들이 항상 따라다닐 수 밖에 없기 때문에 되도록이면 클라이언트 컴포넌트로 만들어주고, `useActionState`를 적극적으로 이용하는 것을 권장한다.

## 리뷰 삭제 기능 구현하기

- 지금까지 배운 모든 내용들을 총 동원해서 리뷰 아이템을 삭제하는 기능까지 만들어 본다.
- 삭제하기 버튼을 클릭했을 때 하나의 리뷰 데이털르 데이터베이스로부터 삭제하는 기능이다. 이러한 기능 역시 서버액션을 통해서 구현할 수 있다.
- `ReviewItem` 컴포넌트를 form 태그로 감싸주고 "use client" 지시자를 추가해 클라이언트 컴포넌트로 변경해줘도 상관없지만, `ReviewItem`의 author, content, createAt은 사용자와 상호작용하는 요소는 아니기 때문에 굳이 컴포넌트 전체를 다 클라이언트 컴포넌트로 전환할 필요는 없다.
- 그렇기 때문에 컴포넌트 전체를 다 클라이언트 컴포넌트로 전환하지 않고, 지금 구현하려고 하는 기능은 삭제하기 버튼 하나의 기능만 만들면 되기 때문에 '삭제하기'만 클라이언트 컴포넌트로 분리해주는 식으로 구현해본다.
- 아래와 같이 클라이언트 컴포넌트로 만든 삭제하기 버튼은 지금 div 태그가 클릭이 되었을 때 form 태그가 제출이 되도록 만들어 주어야 하는데, 이 div 태그는 버튼이 아니기 때문에 타입은 submit 속성을 붙인다고 해서 div 태그를 클릭되었을 때 form이 제출된다거나 그렇게 되지는 않는다.

  ```typescript
  'use client';

  export default function ReviewItemDeleteButton() {
    return (
      <form>
        <div>삭제하기</div>
      </form>
    );
  }
  ```

- 이럴 때에는 Programmatic하게 form을 제출하도록 만들어주면 된다. 아래와 코드에서 submit이라는 메서드가 아니라 `requestSubmit`이라는 특수한 메서드를 쓰고 있는 이유는, `submit` 메서드는 유효성 검사나 이벤트 핸들러 등을 다 무시하고 그냥 무조건 강제로 form을 제출하는 위험한 메서드이기 때문에 주의해서 사용할 필요가 있다. 반면에 `requestSubmit` 메서드는 실제로 사용자가 submit 버튼을 클릭한 것과 똑같이 동작을 하기 때문에 비교적 의도한 대로 안전하게 동작할 가능성이 훨씬 높다. 그래서 리액트에서는 form 태그의 submit 메서드보다는 `requestSubmit` 메서드를 사용하는 것을 더 권장하고 있다.
- 앞으로도 form 태그를 만들 때, 가끔 button 태그 대신 div 태그나 a 태그 같은 요소들을 통해서도 form을 제출해야 되는 상황이 충분히 발생할 수 있다. 디자이너의 요구사항이나 기획자의 요구사항을 반영하기 위해서 그런 경우가 충분히 발생할 수 있기 때문에 그럴 때에는 아래와 같은 방식으로 reference 객체를 활용하면 그런 상황을 쉽게 극복할 수 있다.
- `ReviewItemDeleteButton` 컴포넌트는 사실 어색하지만 위 내용을 설명하기 위해서 div 태그로 만들어둔 것이다.
- 이제 `state`와 `idPending` 값을 통해서 에러 핸들링과 form 중복 제출 방지를 해준다.

  ```typescript
  export default function ReviewItemDeleteButton({
    reviewId,
    bookId,
  }: {
    reviewId: number;
    bookId: number;
  }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction, isPending] = useActionState(
      deleteReviewAction, // 서버액션
      null // state 초기값
    );

    // 에러 핸들링
    useEffect(() => {
      if (state && !state.status) {
        alert(state.error);
      }
    }, [state]);

    return (
      <form ref={formRef} action={formAction}>
        <input type="number" value={reviewId} hidden />
        <input type="text" value={bookId} hidden />
        {isPending ? ( // 중복 제출 방지
          <div>...</div>
        ) : (
          <div onClick={() => formRef.current?.requestSubmit()}>삭제하기</div>
        )}
      </form>
    );
  }
  ```

- '삭제하기'를 클릭해보면 로딩이 진행되고 리뷰 아이템이 정상적으로 삭제가 되는 것을 볼 수 있다. 또 동시에 페이지가 재검증 되는 것까지 바로 확인할 수 있다.
- 앞으로 Next.js를 이용해서 프로젝트를 진행할 때 데이터를 수정해야 되는 일이 있다라고 하면 서버 액션을 이용해서 다양한 기능을 많이 만들어 보면 좋을 것 같다.
