# React로 NodeBird SNS 만들기(2021 리뉴얼 강좌)

## Things to do later

- [x] antd에 dark mode 전환 있는지 알아보기
  - https://ant.design/components/menu/ 를 보면서 dark mode를 넣는 도중 body 전체에 css를 적용하기 위해 document.querySelector로 body를 가져오려고 했으나 document is not defined 에러 발생
    - next는 SSR로 동작하기 때문에 발생된 문제
      - https://helloinyong.tistory.com/248
      - 웹 페이지를 구성시킬 요소들이 렌더링 및 클라이언트로 로드 되기 전에 document에 접근해서 발생한 문제
        - ComponentDidMount를 이용해서 해결했다고 나옴
          - useEffect를 사용해서 해결함
- [ ] global state로 페이지 전환해도 dark mode 유지하기
  - react context
    - useReducer() : 상태 업데이트 로직을 컴포넌트 밖에 작성할 수 있고, 다른파일에 작성 후 불러와서 사용 할 수 있음
      - https://www.daleseo.com/react-hooks-use-reducer/
      - const [state,dispatch] = useReducer(reducer, initialState);
        - state : 컴포넌트에서 사용 할 수 있는 상태
        - dispatch : 액션을 발생시키는 함수
        - 첫번째 인자(reducer) : reducer 함수
        - 두번째 인자(initialState) : 초기값
  - redux

## 0. Hello, Next.js

### 0-1. 리뉴얼 강좌 소개

<details>
<summary>기존 강좌에 비해 바뀐 점</summary>

- next가 8에서 9로 바뀜 : 훨씬 편리해 짐
- vue의 nuxt가 훨씬 편했던 기능들이 next로 많이 넘어옴
  - typescript 지원
  - 프론트에서 커스텀 서버 -> 동적라우팅 -> 넉스트 처럼 동적 라우팅 가능
- API라우트 => 백엔드도 어느정도 프론트에서 커버 가능해짐
- static optimization : 페이지들을 미리 빌드해놓음
  - 미리 빌드해놓지 않으면 브라우저에서 서버로 요청이 왔을 때 그때 그때 빌드해줘야 되는데 미리 빌드를 해놨기 때문에 응답 속도가 빨라짐(성능적으로도 최적화가 됨)
- 개발할 때 로그도 자세하게 나옴

디자인 라이브러리 : ant design

- ant design도 3에서 4버전으로 바뀜
  - 아이콘, form 부분만 살짝 바뀜

강좌 진행방식의 변경

- 약 400건의 질문을 바탕으로 강좌 순서 및 설명을 조정
- 프론트 입장과 백엔드 입장을 나눠서 프론트라고 가정하면 가상의 백엔드 개발자와 협업을 한다고 생각
  - chapter 4까진 프론트 개발자 입장으로 백엔드 개발자가 api를 알려준다고 가정
  - 또는 백엔드가 안만들어져있으면 프론트 개발자가 더미데이터를 사용해서 개발을 진행함 - 더미데이터로 프론트 화면을 먼저 만들어 볼 에정

[강좌 깃헙](https://github.com/ZeroCho/react-nodebird/tree/master)

</details>

리액트에 next를 추가로 선택한 이유 - 실무와 관련있음

- 리액트를 사용한 프레임 워크가 next
  - 장점 : 실무를 위해서 갖춰진 것들이 많음
  - 단점 : 프레임워크 특성상 정해진 틀 안에서 코딩을 해야돼서 자유도는 떨어짐
  - 가장 큰 장점 : SSR

전통적인 SSR(server side rendering)
![전통적인SSR](images/SSR.PNG)

SPA(CSR) 렌더링 방식 - ex) React, Vue, Angular
![전통적인CSR](images/CSR.PNG)

### 0-2. Next.js 역할 소개

SSR과 CSR의 장단점

CSR
장점

- 일단 로딩되면 모바일 앱같은 부드러운 화면 전환 등 사용자 경험이 좋음

단점

- 로딩속도가 오래걸림
  - 요즘은 3초 이내에 화면이 보이지 않으면 사용자가 떠난다고 함
  - 적어도 로딩창이라도 보이면 인내심이 늘어남
- 검색엔진이 방문을 했을 때 보여지는게 로딩창 밖에 없는 것 처럼 보일 수 있음
  - 검색엔진에서 순위가 뒤로 밀려날 수 있음

next를 이용한 SSR

- 모든페이지를 다 받아오지 않고 코드스플릿팅이란 기술로 방문한 페이지만 보내주게 함
  - 실무에선 반드시 적용해야 함(검색엔진 노출이 대부분의 서비스에서 중요하기 때문)
    - 사용자를 대상으로 하는 페이지는 속도도 빨라야 하므로 코드 스플릿팅도 적용해야 함

next의 SSR의 종류 두 가지

1. pre render
   - 검색엔진일 때만 backend server에서 데이터를 받아와서 HTML을 완성해서 줌
   - 일반 유저일 땐 기존 리액트방식으로 줌
2. server side rendering
   ![First Page SSR](images/firstPageSsr.PNG)
   - 첫 방문만 전통적인 방법대로 하고 그 다음 페이지 전환일 땐 리액트 방식으로(하이브리드 방식)

next는 언제쓰고 언제 쓰지 말아야 할까?

1. 코드스플릿팅, SSR 둘다 필요없는 경우 : admin page
2. 그런데 웬만한 커스터머(B2C) 서비스는 SSR을 지원하는 프레임워크를 고려하는게 좋음
   - next만 되는 것은 아님, 리액트로도 SSR과 코드스플릿팅이 가능함
     - [오픈소스 진행중](https://github.com/reactGo/reactGo)
       - 제로초님의 정부지원받아서 진행 중인 프로젝트

### 0-3. 실전예제와 준비사항

vscode, nodejs, npm

### 0-4. Next.js 실행해보기

<details>
<summary>설치 및 실행(Hello world)</summary>
front 폴더 생성

front폴더에서 npm init

- cd front
- npm init
  - package name만 적고 나머지 엔터

front에서 npm i next

- 강좌와 같이 9버전으로 설치하고 싶으면 npm i next@9
- 여기선 그냥 최신 버전으로 설치했음(^11.0.1)

package.json에 스크립트 추가

- "dev" : "next"

import React from 'react'; 가 next에선 필요 없음

- next에선 pages폴더는 무조건 이름이 pages이어야 함
  - pages안에 있는 파일들을 코드스플릿트된 개별적인 컴포넌트로 만들어줌

npm run dev == npm run next

- react, react-dom not found : react와 react-dom이 없음
  - npm i react react-dom
    - 한번에 두개의 패키지 설치 가능
  - **강좌(9버전)에선 뜨던 에러가 최신버전에선 안뜸**
    - 완전히 next 설치할때 자동으로 같이 설치된 것 같음

gitignore 파일을 설정을 안해서 node_module이 통째로 올라갔는데 이런 븅신같은 짓을 되돌릴 방법(git을 이용해서)을 찾아보기

- git revert <되돌릴 커밋>
  - 리드미에 작성된 내용같은 것들이 전부 날라갈 것 같으므로 그냥 진행
- .next, front/node_module, package-lock.json 삭제 후 push 한다음 재설치 후 다시 push
  - npm i
  - 이번엔 gitignore 덕분에 node_module은 안올라 갈 듯

</details>

- [x] nextjs용 gitignore 파일 작성 방법 알아보기
  - 현재 문의 중 구글에 gitignore nextjs로 검색하면 안나옴
  - 일단 강좌의 ignore파일을 그대로 가져옴
  - .next node_modules .env 세 개 있으면 됨

### 0-5. page와 레이아웃

페이지들 만들고 인식을 못 하면 ctrl+c로 서버 껏다가 다시 시작(npm run dev)

ㅁㅊ 라우터 설정 없이도 그냥 되네? pages폴더안에 만들어 놓기만 하면
와 404 페이지도 자동으로 만들어져있네

pages 폴더 안에 폴더를 만들면 그게 router 2차 경로임 존나 편함

- [x] React로 라우터 손수 지정한 것과 비교
<details>
<summary>세부내용</summary>

next.js는 pages폴더 안에 만들면 자동으로 라우터 설정이 된다.

react는 react-router-dom으로 부터 router를 import하고
그 안에 한땀 한땀 넣어 줘야 한다.

```javascript
import React from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Home from '../Routes/Home';
import TV from '../Routes/TV';
import Header from './Header';
import Search from '../Routes/Search';
import Detail from '../Routes/Detail';

export default () => (
  <Router>
    <>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/tv" component={TV} />
        <Route path="/search" component={Search} />
        <Route path="/movie/:id" component={Detail} />
        <Route path="/show/:id" component={Detail} />
        <Redirect from="*" to="/" />
      </Switch>
    </>
  </Router>
);
```

</details>

pages/about/[name].js (동적 라우팅 기능 - 9버전에서 추가 됨)

- 동적으로 최종경로의 이름을 바꾸고 싶을 때

component들을 쪼갠 것은 components dir안에 파일추가 하면 됨

- pages처럼 components라는 dir이름은 고정된 것은 아님

npm i prop-types

- typescript에선 필요없음

각 페이지 별로 레이아웃을 다르게 적용하고 싶으면
AppLayout 컴포넌트 말고도 OtherLayout같은 것을 만들어서
원하는 페이지에 다른 레이아웃 컴포넌트로 감싸면 됨

git파일이 front밖에 있기 때문에 node-bird로 나와서 commit, push 해줘야 됨

- 안그러면 front안에 있는 것만 업로드 됨

### 0-6. Link와 eslint

npm run dev로 실행할 때 package.json파일이 front에 있기 때문에 cd front해야 서버를 오픈할 수 있음

Link태그

- react의 Link 태그(react-router-dom으로 부터)는 next에선 next/link에서 가져옴

```javascript
<Link href="/">
  <a>노드버드</a>
</Link>
```

- href를 a태그가 아닌 Link태그에 적어야 함
- [x] 여기서 왜 a 태그를 안에 썻을까?
  - 안넣어도 상관이 없다, Link tag안에 children이 string일 경우 자동으로 a태그가 붙기 때문
  - a태그를 넣으면 위 조건이 해당되지 않아서 그냥 넘어가게 된다.
  - [참고 문헌](https://uchanlee.dev/nextjs/Why-using-a-tag-in-nextjs-Link/)

eslint

- 리액트 개발할 때 많이 쓰이는 코드 점검용 툴
- npm i eslint -D
  - -D:개발용으로만 쓰인다는 뜻
- npm i eslint-plugin-import -D
- npm i eslint-plugin-react -D
- npm i eslint-plugin-react-hooks -D
- 여러 사람이 코딩해도 한사람이 한 것 처럼 깔끔하게 보여짐
  - 코드 룰을 정해줌

.eslintrc

- 확장자 없는 파일, linux에선 앞에 .이 붙으면 숨김 파일이 됨

eslint 설치 후 빨간 불 없애기 위해 import React 등 추가 하고 propTypes의 오타도 수정함

### 0-7. Q&A

<details>
<summary>QnA 세부 내용</summary>

material design vs ant design

- 개인 선호도 차이
- 제로초님은 부트스트랩도 사용하고 아무것도 사용하지 않은 CSS만으로도 개발함
- 디자이너가 디자인시스템을 갖춰놨다면 쉽게 개발 가능

dynamic routing

- next 9버전 부터 편해짐(더 이상 커스텀 front-end 서버를 만들 필요가 없어짐)
  - [ ] 커스텀 프론트 엔드 서버란?
- dynamic routing, api routing 기능이 추가 됨
  - [ ] 각각 뭔지 확인

CORS는 신경안써도 되나요?

- 신경써야됩니다.

  - 브라우저 - 백엔드간 요청에 CORS 설정이 필요
  - 백엔드서버와 프론트엔드 서버의 도메인이 다르기 때문에(포트만 달라도 CORS 걸림 - 백엔드 서버에서 CORS 설정 해야 함)
  - 프론트에서도 쿠키보낸거 with credential 같은 거
  - 브라우저와 프론트서버끼리는 CORS가 적용안되는데 프론트서버와 백엔드 서버 간엔 CORS 설정이 필요함
  - node가 두개임(프론트, 백)
    - 지금까지 나는 프론트를 github page나 netlify같은 곳에서만 사용했지만 실제론 서버를 임대해서 node 설치 후 프론트용 서버를 만들어줘야 되는 것 같다.
      - 이 부분은 나중에 배포할때 다시 알아보자

- [x] CORS 관련 공부

<details>
<summary>CORS details</summary>

출처

- https://youtu.be/bW31xiNB8Nc
- https://velog.io/@jesop/SOP%EC%99%80-CORS

SOP : Same-Origin Policy

- 하나의 출처(Origin)에서 로드된 자원(문서나 스크립트)이 호스트나 프로토콜, 포트번호가 일치하지 않는 자원과 상호작용 하지 못 하도록 요청발생을 제한하고, 동일출처에서만 접근이 가능한 정책

CORS : Cross-Origin Resource Sharing

- 다른 출처의 리소스를 불러오려면 그 출처(백엔드쪽)에서 올바른 CORS헤더를 포함한 응답을 반환해야 한다.
- 1. 서버에서 Access-Control-allow-origin 헤더 추가
  - 브라우저가 확인 후 포함되어 있으면 안전한 요청으로 간주
- 2. Proxy sever를 사용한다면 프록시 서버에서 Access-Control-allow-origin: \* 헤더를 담아서 응답
- 3. webpack-dev-server proxy
  - 프론트엔드에서 webpack-dev-server proxy 기능을 사용하면 서버쪽 코드를 수정하지 않고 해결 할 수 있음
- 토큰 등 사용자 식별 정보가 담긴 요청에 대해선 더 엄격함
  - 브라우저에 저장된 쿠키가 나쁘게 사용되지 않기 위함
  - 보내는 측 : credentials 항목을 true로 세팅
  - 받는 쪽 : 아무출처나 다 받는 와일드 카드가 아니라 보내는 쪽의 출처, 웹페이지 주소를 정확히 명시한 다음 Access-Control-Allow-Credentials 항목을 true로 맞춰줘야 함
  </details>

코드 스플리팅

- CSR일 때 브라우저에서 프론트 서버로 갔다가 돌려주는데 그 때 모든화면을 다 담아서 돌려줌
  - 비효율 적
- js파일을 쪼개서 원하는 페이지만 불러오는 것
  - 다른 페이지를 들어가면 그 페이지에 해당하는 부분을 프론트서버에서 받아옴
  - 기존 CSR은 처음에만 프론트에서 받아오고 이후 백엔드와 통신을 하지만 코드스플릿팅을 한 앱의 경우엔 필요할때 마다 프론트서버에서 페이지를 받아오고 데이터는 백엔드에서 받아옴

간단한 웹페이지에 리액트를 굳이 사용할 필요는 없음

- 리액트를 사용하는 주된 목적은 고객 경험이다.
- 리액트를 사용하면 웹사이트가 아니라 모바일같은 웹앱을 사용하는 고객경험을 줄 수 있음

SSR을 할거냐 말거냐는 검색엔진에 나와야 되면 SSR을 해야되고
아니면 리액트만으로도 된다.

mongoDB는 굳이 쓸 필요가 없다. SQL쓰는게 더 낫다.

- 웬만한 서버는 데이터들간 관계가 있음
  - 상품과 성분 같이 N:N(다 대 다) 관계 등 또는 고객과 제품간의 1:N관계 같이 관계가 있으면 SQL쓰는게 정답임
- mongoDB는 관계가 없거나 데이터가 지멋대로 들어올 때
  - 로그 쌓을 때 : 여러가지 케이스들에 대처하기 위해
    - 로그라는 테이블 안에 로그인, 구매날짜, 구매 내역 등

Vue, React 둘다 하기보단 React를 먼저 깊게 파고 나중에 취직 후 Vue를 React 수준으로 끌어 올리는게 좋다.

서버에서 각 페이지나 데이터를 캐싱할 수 있어서 굳이 매번 서버에서 렌더를 해서 주는게 아니라 서버에 갔다가 캐싱되어 있는 페이지를 주면 더 빠름

</details>

## 1. antd 사용해 SNS 화면 만들기

백엔드 개발자가 데이터, API가 준비가 안된 상태라고 가정하고
프론트엔드 개발자 입장에서 더미데이터로 대체해서 트위터랑 비슷하게 디자인

### 1-1. antd와 styled-components

antd

- CSS 프레임워크
- 버튼, 아이콘 등이 미리 만들어져 있음
  - 단점 : 디자인이 획일화 됨
    - 부트스트랩, 시멘틱UI, material UI 등
    - 개성이 없어짐 -> 고객이 있는 서비스에선 잘 안씀

React에 CSS를 사용하는 것은 여러가지 방법이 있다.

- 그냥 css를 쓰는 것
- SASS 또는 SCSS 등 CSS 전처리기를 사용하는 것
- styled component
- Emotion도 괜찮음(styled component와 거의 비슷)

npm trends에서 검색하면 어떤 것이 대중적인지 확인 가능

여기에선 antd와 styled-component를 사용

- npm i antd styled-components @ant-design/icons

실무에서도 admin page는 후순위로 밀리는데 antd나 bootstrap을 써도 됨

메뉴창(AppLayout.js)에 적용 : 공식 문서 보면서 하면 됨, 외울 필요 없음

### 1-2. \_app.js와 Head

antd를 react와 연결하는 방법

- 공식사이트의 Docs에서 설치방법을 봐야 함
- next에 webpack이 들어 있는데 webpack이 CSS를 보면 스타일 태그로 바꿔서 HTML로 넣어줌

  - import 'antd/dist/antd.css';
    - 공통적으로 사용 되므로 pages폴더 안에 \_app.js
      - index.js의 부모 컴포넌트임
      - [x] \_app.js를 next는 자동으로 index보다 더 최상위 컴포넌트로 인식하는건가? 일단 돌아가는거 보면 그렇게 보이긴함
        - 맞다. 제일 최상위에 \_document도 있다.
          - https://geonlee.tistory.com/224

- [x] PropTypes.elementType과 PropTypes.node 차이
  - 거의 같은데 elementType은 React전용 인지 확인하는 것이고 node는 모든 node를 의미 함
    - https://www.npmjs.com/package/prop-types

\_app.js 안에는 공통적인 것들을 모두 적어주면 됨

- 공통메뉴
- Head태그안의 title
  - next에서 Head태그를 제공을 함
  - [x] React에선 헬멧
    - React에선 react-helmet-async을 설치해서 변경한다.
    - [x] react-helmet-async와 react-helmet 차이
      - https://www.npmjs.com/package/react-helmet-async
      - Provider를 사용하여 리액트 트리의 헬멧 상태를 캡슐화해야한다.
      - 뭔가 개선된 것 같음 근데 Helmet.renderStatic(), .rewind()를 사용해보지 않아서 잘 모르겠음
        - https://www.npmjs.com/package/react-helmet#server-usage
        - 서버에서 사용하려면 prerender에서 사용할 헤드 데이터를 가져와야 됨
        - react-helmet-asyncs는 그럴필요 없이 HelmetProvider로 감싸주면 되게 변경 됨
        - 나중에 혹시 사용된 코드를 보면 이해가 될 듯

<details>
<summary>HelmetProvider의 사용 예</summary>

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const app = (
  <HelmetProvider>
    <App>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
  </HelmetProvider>
);
```

</details>

next로 개발할 때 페이지 전환 시 느린 이유는 개발모드일 땐 잠깐 빌드를 해서 느리지만 배포모드일땐 미리 빌드를 해놓기 때문에 걱정안해도 됨

### 1-3. 반응형 그리드 사용하기

<details>
<summary>antd로 검색창 추가</summary>

```javascript
<Menu.Item>
  <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
</Menu.Item>
```

- enterButton 같은 옵션을 줄 수 있음
  - 공식문서에서 확인 가능 : 버튼을 파란색으로 만드는 것
- style={{ verticalAlign: 'middle' }} 같이 CSS옵션을 직접 부여할 수 있음
</details>

반응형, 적응형

- 적응형 : 모바일 페이지, 테블릿, 데스크탑 페이지 따로따로 만드는 것
- 반응형 : 처음엔 모바일 페이지였다가 화면이 늘어남에 따라 컴포넌트들이 재배치 되면서 화면이 바뀜(모바일 -> 테블릿 -> 데스크탑)

antd 반응형 그리드

- import { Menu, Input, **Row, Col** } from 'antd';
- 제로초 스타일
  - 1. 가로로 먼저 나눈 뒤 세로로 나눔
  - 2. 반응형을 할땐 모바일을 먼저 디자인을 해야 한다.(데스크탑 부터 하면 피곤 함)

```javascript
<Row gutter={8}>
  <Col xs={24} md={6}>
    왼쪽 메뉴
  </Col>
  <Col xs={24} md={12}>
    {children}
  </Col>
  <Col xs={24} md={6}>
    <a href="https://www.taehwango.info" target="_blank" rel="noreferrer">
      Made by Tony
    </a>
  </Col>
</Row>
// 모바일에선 Col하나당 한칸씩 배치되서 3줄이던게
// 데스크탑에선 6/24, 12/24, 6/24씩 가로로 한줄에 배치 됨
```

xs : 모바일
sm : 태블릿
md : 작은 데스크탑
gutter : column간 간격

antd는 화면세로줄(Col)이 24칸으로 나눠져 있음

a태그의 rel="noreferrer noopener"

- noreferrer : HTTP레퍼러 헤더를 넘기지 않을 수 있음(요청을 받는 쪽에서 해당 요청이 어디에서 왔는지 알 수 없음)
- noopener : 열린쪽에서 window.opener 속성으로 연쪽의 window객체에 접근 할 수 있는 것을 방지함

### 1-4. 로그인 폼 만들기

서버 없이 로그인 : 더미데이터 사용
상태를 저장 : state

```javascript
const [isLoggedIn, setIsLoggedIn] = useState(false);
```

component

- 화면 보여주는 애들

container

- 데이터 가져오는 애들(data를 가져오거나 다루는 component)
- hooks 이후 container와 component를 구분하지 않는 추세임

코딩하다가 나는 에러들을 블로그로 정리하는 것도 좋음

Form을 수작업으로 만들어도 되지만 Form관련 라이브러리를 쓰면 편함

- [ ] label 태그 알아보기

component에 props로 넘겨주는 함수(onChange 같은 것들)은 useCallback()을 사용하자 그래야 최적화가 된다.

- [ ] useCallback 이란?

반복 되는 함수는들은 custom hook으로 처리 할 수 있음
