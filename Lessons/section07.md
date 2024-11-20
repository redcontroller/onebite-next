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

- 서버액션을 통해서 새로운 리뷰 데이터가 추가가 되었을 때, 리뷰 데이터를 재검증 시켜서 새로고침 없이도 새로운 리뷰 데이터가 화면에 나타나는 기능을 구현한다.
