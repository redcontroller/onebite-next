# 한입 Next 강의 노트

## Library와 Framework의 차이

- 주도권을 개발자가 가지고 있는가? O: Library, X: Framework
- 편하게 필요한 기능을 제공하는가? O: Framework, X: Library

## 사전 렌더링 (pre-rendering)

  <img width='800px' src='https://github.com/user-attachments/assets/959cd764-b8de-48e8-85e8-36507d3a56d2'>

> 정리된 사전 렌더링 이미지

### React의 렌더링: CSR (Client Side Rendering)

- React.js 앱의 기본적인 렌더링 방식
- 클라이언트(브라우저)에서 직접 화면을 렌더링 하는 방식
 
  <img width='800px' src='https://github.com/user-attachments/assets/be3dc9c7-297d-42b2-aa85-0331506581ac'>

  > React.js의 렌더링 이미지
- 장점: 초기 접속 이후의 페이지 이동이 빠르고 쾌적하다.
- 단점: (치명적) FCP(초기 접속 속도)가 느림
- \*FEC (First Contentful Paint): "요청 시작" 시점으로부터 컨텐츠가 화면에 처음 나타나는데 걸리는 시간
  - 3 sec 이상일 경우: 페이지 이탈률 32% 증가
  - 5 sec 이상일 경우: 페이지 이탈률 90% 증가
  - 6 sec 이상일 경우: 페이지 이탈률 106% 증가
  - 10 sec 이상일 경우: 페이지 이탈률 123% 증가

### React FCP 문제를 해결하는 Next.js 사전 렌더링

- 렌더링의 의미 1 (JS 실행(렌더링)): 서버 측에서 JavaScript 코드 (React 컴포넌트)를 HTML로 변환하는 과정
- 렌더링의 의미 2 (화면에 렌더링): 클라이언트 측에서 HTML 코드를 브라우저가 화면에 그려내는 작업

  <img width='800px' src='https://github.com/user-attachments/assets/33e97f5b-7eab-44c4-81bc-bc11a7ac9a45'>
  <img width='800px' src='https://github.com/user-attachments/assets/d5f04ee4-73d3-44d7-9036-1b17f395dc33'>

  > Next.js의 사전 렌더링
- TTI (Time to interaction): 화면 렌디링 이후 Hydration이 끝나 상호작용이 가능한 시간
- 이후 페이지 이동 요청은 클라이언트 사이트 렌더링 방식으로 처리됨
- 이미지 상의 JS Bundle은 사실상 React App
- Next.js App은 초기 접속 요청에서는 서버 측에서 JS 코드를 미리 렌더링 하는 사전 렌더링을 통해서 React App의 단점을 해소하여 빠른 FCP 달성하면서도, React App의 빠른로 쾌적한 페이지 이동의 장점을 승계함

## 실습용 백엔드 서버 설치

### 필요한 이유

- 최대한 실전과 유사한 환경에서 실습을 진행하기 위함
- Next.js는 API 등의 네트워크 요청을 통해서 서버로부터 데이터를 불러올 때 넥스트 서버와 백엔드 서버 간에 발생하는 네트워크 요청과 응답들을 최적화하고, 캐싱할 수 있는 아주 독특한 여러가지 기능을 제공한다.
- 수강생들이 이러한 다양한 기능들을 최대한 실제 상황과 최대한 유사한 환경에서 실습할 수 있도록 함
- Github에 Node.js (Nest) 기반의 백엔드 서버, [한입 북스(Onebite Books)](https://github.com/winterlood/onebite-books-server)를 올려둠
- 한입 북스는 여러개의 도서와 리뷰 데이터를 저장하고 관리하는 다양한 기능들을 제공함
- 다운로드 받아서 압축을 푼 파일을 문서 폴더에서 실행하는 것을 권장함

  <img width='800px' src='https://github.com/user-attachments/assets/3bf04dd9-d4a2-4efc-af99-e18118d72b21'>

  > 문서 폴더의 한입 서버 파일

### Supabase 사용법

- DB 설치가 까다롭지 않도록 회원가입만 해도 자동으로 그리고 무료로 데이터베이스의 생성부터 설정까지 원클릭으로 진행해주는 [Supabase](https://supabase.com/)라는 클라우드 서비스를 사용함
- 회원가입하고 프로젝트를 생성할 때 비밀번호는 서버와 연결할 때 필요하므로 잊어버리지 않도록 한다.
- 원하는 데이터베이스를 2개까지 만들 수 있음
- Supabase에 회원가입 및 프로젝트를 생성하고, 한입 북스의 백엔드 서버와 연결하기 위해서 커넥션 스트링이라고 불리는 일종의 주소값을 가지고 와야 한다.
- 커넥션 스트링은 Supabase 사이드 네이비게이션의 하단 `Project Setting > Database`에 있다.
- Mode: transaction에서 Session 모드로 변경해준다.

  <img width='800px' src='https://github.com/user-attachments/assets/03b0d4ad-3fd9-410f-a5ed-1f30983bf636'>

  > Mode:Session
- 복사한 커넥션 스트링을 한입 북스 서버에 환경변수 파일(`.env`)를 만들어서 추가해 준다.
- 한입 북스 서버 루트 경로에 환경변수 파일을 만들고 DATABASE_URL="" 형태로 추가해주고, `[PASSWORD]` 부분을 대괄호를 포함해서 지워주고 DB 설정할 때 입력 또는 생성해줬더 비밀번호를 써준다.
- 비밀번호를 잊어버렸다고 하더라도, Project Setting에서 `Reset database Password`를 통해 재설정할 수 있음
- 꼭 주의해야 할 점은, 커넥션 스트링 주소 값은 비밀번호를 포함하고 있기 때문에 절대 온라인 상에 공개되면 안된다.
- 때문에, GitHub나 블로그 등의 온라인 공간에 코들르 올릴 때 패스워드는 가려줘야 한다.

### 한입 북스 서버 사용법

- 비밀번호를 포함한 Supabase 커넥션 스트링을 환경변수에 넣는다.
  
  <img width='800px' src='https://github.com/user-attachments/assets/70442a08-3474-42ad-9741-297788d5b802'>

  > env 파일
- 의존성 패키지를 설치한다. `npm i`
- Supabase DB 초기화 `npx prisma db push`
- Supabase `Table Editor`에 접속해서 DB 생성을 확인

  <img width='800px' src='https://github.com/user-attachments/assets/33f1b34c-95c6-49f0-8d60-e8295b6179e9'>

  > DB가 생성된 후 Supabase Table Editor
- 초기 데이터를 랜덤으로 추가해주기 `npm run seed`

  <img width='800px' src='https://github.com/user-attachments/assets/41bd8ae8-1937-4a01-8477-2c023d9cf43c'>

  > 자동 초기 데이터 생성
- 서버 빌드와 실행 `npm run build && npm run start`
- 서버 접속 `localhost:12345`
- 백엔드 API 문서 접속 `localhost:1234/api`
- 종료 `Ctrl + C`
- 데이터를 쉽게 확인하는 방법. 새로운 터미널에서 `npx prisma studio`
- Prisma studio는 현재 실행 중인 서버가 사용 중인 데이터를 조회할 수 있는 페이지를 실행함 (localhost:5555)

  <img width='800px' src='https://github.com/user-attachments/assets/106980cd-8d72-4414-b3ba-d144a8aa7cbf'>
  
  > Prisma 실행 페이지 (localhost:5555)
- Prisma를 통해서 생성된 Data를 모두 조회해 볼 수 있음
- Supabase 무료 요금제는 1주일 동안 API 요청이 없으면 자동으로 중지 상태(paused)가 됨을 주의
- 혹시 중지가 되더라도, Supabase 대시보드에서 `Restore project` 버튼만 눌러주면 10 ~ 20분 이내 다시 활성화 됨

  <img width='800px' src='https://github.com/user-attachments/assets/cd772427-aecb-475b-89ec-47aae0d8c2b1'>

  > Restore project 버튼
- 복구가 완료 되더라도 몇 분 정도는 API 호출이 정상적으로 이루저지 않을 수 있음. 최대 1시간 정도의 간격을 두고 작업을 진행하는 걸 권장함 (20~30분 안으로 보통 정상화 됨)

## 커리큘럼 설명

- Next.js에서 제공하는 라우터
  - 페이지 라우터: Next 초창기부터 제공되어 오던 구 버전의 라우터
  - 앱 라우터: Next 13버전과 함께 처음으로 공개된 신규 라우터. 다양한 신규 기능이 제공됨.
- 신규 버전인 App Router는 과거 버전인 페이지 라우터의 단점을 개선하기 위해 등장한 기술
- Page Router에 대해서 모르는 상태로 App Router부터 학습하는 것은 어떤 점이 개선되었는지 파악하기 어려움
- 앱 라우터는 아직 과도기를 겪고 있음. Parallel & Intercepting Route 개발 모드일 떄 버그 등등 ...
- `사전 렌더링(pre-rendering)`은 페이지 라우터와 앱 라우터 모두에 공통적으로 적용되는 개념
