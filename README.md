# React로 NodeBird SNS 만들기(2021 리뉴얼 강좌)

## 1. Hello, Next.js

### 1-1. 리뉴얼 강좌 소개

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

### 1-2. Next.js 역할 소개

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

### 1-3. 실전예제와 준비사항

vscode, nodejs, npm

### 1-4. Next.js 실행해보기

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
