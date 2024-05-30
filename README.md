# 통계 Service MSA Project ( NestJS 개인 프로젝트 )

## Project Reference Notion Document URL 
https://www.notion.so/Service-MSA-88cf6b17b494414fa5890332ec181046

## 0. MSA란?
------------------------------
- Micro Service Architecture 의 줄임말으로써, **각 서비스를 독립적인 서비스**로 연결한 구조를 의미한다.
- **장점**은, 하나의 프로젝트 내 서비스 전체가 존재했던 **모놀로그식 개발의 단점인 부분 장애가 전체 서비스의 장애로 확대될 수 있는것을 방지**.
- **배포 시간이 오래걸리는 것을 해결**, 한 Framework & Language에 종속적인 반면, **여러 언어로 개발이 가능**하다.
- **재사용성이 용이하다.**
- **단점**은, 모놀로그식 개발보다 **개발의 난이도가 높으며**, 통신의 장애와 서버 부하 등이 있을 경우 **트랜잭션을 어떻게 유지**할지 결정, 구현이 필요함.
- **통합 테스트가 어려우며, 실제 운영환경에 대해 배포하는 것**이 쉽지 않음. (단, 기획 단계부터 MSA로 개발하고자 한다면 배포하는 것에 대한 부담이 적어진다)
- 다른 서비스들과의 연동이 정상적으로 이루어지는지 테스트 과정이 필요함.

## 1. 통계(Statistics) Service MSA 소개
------------------------------
- **API에 대한 문서는 Swagger를 사용하여 작성하였다.**
- NodeJS의 라이브러리인 **Cron(스프링에서는 Batch와 같다.)** 을 통하여 하루가 지나갈 때마다 수집된 정보들을 각 Log Table에 저장함.
- 로그 기록 기간은 **당일 기준 최소 1일 ~ 최대 1년까지의 기록을 볼 수 있다.**
- 기능은 **총 6가지의 기능**이 있다.
- **신규 사용자 가입 횟수, 사용자 탈퇴 횟수, 사용자의 웹 로그인 횟수, 국가별 사용자 통계, 각 기능 기간별 합계, 각 기능 기간별 평균** 총 6가지 기능이 존재한다.

## 2. 통계(Statistics) Service MSA 개발 동기
------------------------------
- **하나의 언어**에 종속적인 단점을 직접 느껴보자 하여 **NestJS라는 NodeJS의 Express에서 파생된 라이브러리**를 사용하여 개발해보고자 하였다.
- **마이크로 서비스 아키텍처(MSA)라는 개념**을 어느정도 이해하고자, **하나의 독립적인 서비스를 하나의 프로젝트**로 개발해보고자 하였다.
- **Docker**를 통하여 배포하는 것은 MSA만큼 적절한 상황이 없다 생각하여 **PR(Pull Request)**이 된 후 Pipeline을 통하여 **Image생성 -> Container** 과정을 겪어보고 싶었다.

## 3. 프로젝트 개발 환경 및 사용 기술
------------------------------
> ### IDE
- Visual Sudio Code

> ### Framework
- NestJS(Version 3.0)

> ### ORM
- TypeORM

> ### DBMS
- MariaDB

> ### Tools
- Docker
- Doppler

## 4. 프로젝트 제작 기간 (2022/11/07 ~ 2022/11/25) 총 3주간 실제 작업기간 : 8일
-------------------------------
> #### 1주차 (2022/11/07 ~ 2022/11/13)
- NestJS 프로젝트 세팅
- NestJS Framework 내 프로젝트 구조 세팅 (Provider 생성 및 Module 생성)
- DB구조 작성(ERD Cloud)
- 신규 사용자 가입 횟수, 사용자 탈퇴 횟수, 사용자의 웹 로그인 횟수 기능 구현

> #### 2주차 (2022/11/14 ~ 2022/11/20)
- 배치(Cron Library) 프로세스 구현 => NestJS에서는 Scheduler라고 명한다.
- 국가별 사용자 통계 기능 추가
- 각 기능 별 합계 & 통계 기능 추가

> #### 3주차 (2022/11/21 ~ 2022/11/28)
- Swagger API 문서 작성
- 합계 & 통계를 하나의 API로 모든 기능들의 결과를 확인할 수 있는 API 작성
- 통합 테스트
- Docker Image Upload

## 5. Entity Relationship Diagram
-------------------------------
- ERD 다이어그램 모델링 툴은 ERDCloud를 사용하였음.
![스크린샷 2022-12-17 17 04 32](https://user-images.githubusercontent.com/54883318/208232237-222d9704-442d-407d-9648-0098f5c407fa.png)

## 6. Package layer
-------------------------------
- MVC 패턴으로 구현.
- 각 Module이 Provider를 사용할 수 있도록 Export처리를 전역적으로 해주었음.
- Module 단위로 Controller와 Provider를 작성하였음. <br>
![스크린샷 2022-12-17 19 18 22](https://user-images.githubusercontent.com/54883318/208237065-f8bf4291-8401-401a-9e39-32677be257f2.png)

## 7. Functional Specification
-------------------------------
### 공통사항

- 기간은 당일 기준 **최소 1일 ~** **최대 1년**까지의 통계를 볼 수 있습니다.
- 데이터는 **저장되어있는 Log를 기준, Batch Process를 사용하여 1일을 주기**로 각 기능의 Batch Table에 **하루동안 쌓인 Log Table의 결과**를 저장합니다.

### 7-1. 신규 사용자 가입 기간별 횟수

- **회원가입 & SNS 첫 로그인 시** 신규 사용자 가입 Log가 DB에 저장됩니다.

### 7-2. 사용자 탈퇴 기간별 횟수

- 해당하는 테이블의 **PK가 삭제되거나 특정 Column의 값이 변경되었을 경우** 사용자 탈퇴 로그가 DB에 저장됩니다. - (삭제 여부나 삭제 시간 체크방법은 ?)
    - ex ) 삭제 여부 컬럼값이 N → Y & 삭제 시간이 존재하는 경우 등

### 7-3. 사용자의 **기간**별 웹 로그인 **횟수**

- 접속 횟수 Log는 **로그인이 성공적으로 수행이 된 후에** Log Table에 저장됩니다.
- 중복 체크는 **하루 기준으로** 하며, **유저 DB의 PK**를 사용하여 중복체크를 합니다.

### 7-4. 1, 2, 3번 기능의 기간별 합계

- 1번 기능 Batch Table에서 **사용자가 설정한 기간만큼 연산을 수행한 후 기간별 합계**를 보여줍니다.
    - 연산 과정은 프로젝트 내 비즈니스 로직에서 수행 예정입니다.

### 7-5. 1, 2, 3번 기능의 기간별 평균

- 4번 기능 명세랑 동일합니다.
    - End-User가 **설정한 기간의 데이터 Count / 시작일~종료일만큼의 날짜**
- 반올림은 없으며, 소수점 한자리수까지 보여줍니다.

### 7-6. 국가별 사용자 통계

- 로그인 시, **IP로 접속 국가를 판단하여** 해당하는 국가를 Log Table에 저장합니다.
- **기간별로 어느 국가에서 접속을 몇번 하였는지** 확인할 수 있습니다.
- 중복체크는 **하루 기준**으로 하며, **유저 DB의 PK**를 사용하여 중복체크를 하도록 합니다.

## 8. Doppler를 통하여 환경변수 관리하기
-------------------------------
### Doppler Tool을 사용한 이유
1. MSA가 여러개일 경우, 환경변수 설정에 있어서 **개발 시간의 손실이 생길 수 있다 생각하여서 하나의 Tool로 관리하자 생각함.**
2. **.env 파일의 보안 이슈**가 있다 하여, Doppler 사용을 하기로 최종 결정.

### 8-1. 프로젝트 내 Doppler Install & app.module.ts 구조
![스크린샷 2022-12-17 17 31 29](https://user-images.githubusercontent.com/54883318/208233315-e7ec7455-acd4-455e-912f-0f98aa896f42.png)

### 8-2. Doppler Secret Key & Package Install Dockerfile에 작성
![스크린샷 2022-12-17 17 32 45](https://user-images.githubusercontent.com/54883318/208233367-4edc3016-52cd-4ddb-8ad8-5527b1f210a6.png)

### 8-3. Doppler Secrets Key dev(개발서버) & prg(프로덕션) & stg(스테이징)마다 다른 환경변수 전달
<img width="1225" alt="스크린샷 2022-12-17 17 34 11" src="https://user-images.githubusercontent.com/54883318/208233413-a4e0529c-f5ee-450b-8422-f0e879ee2a0b.png">
<img width="1197" alt="스크린샷 2022-12-17 17 34 41" src="https://user-images.githubusercontent.com/54883318/208233432-1362b216-3583-4bc1-b8b9-bc4c7846554e.png">

### 8-4. Doppler를 적용하기 위한 CLI Modify
![스크린샷 2022-12-17 17 54 47](https://user-images.githubusercontent.com/54883318/208234179-e41bd771-a97b-4e4c-8fa7-b58c8deb095f.png)

## 9. Docker
-------------------------------

### 9-1. Image를 생성할 Project로 이동<br>
![스크린샷 2022-12-17 18 02 33](https://user-images.githubusercontent.com/54883318/208234427-bbd56b95-4137-40c0-b650-5942f1ac00f0.png)

### 9-2. Dockerfile Build<br>
![스크린샷 2022-12-17 18 08 31](https://user-images.githubusercontent.com/54883318/208234641-1de9ee70-07bc-460c-9286-129b43317b0e.png)

### 9-3. 생성된 Docker Image<br>
![스크린샷 2022-12-17 18 09 12](https://user-images.githubusercontent.com/54883318/208234665-1a677409-aa82-4c2d-b5f2-5507db7c4b5b.png)

### 9-4. 생성된 Image를 docker-compose.yml 파일을 통하여 간결하게 Docker Container 생성<br>
![스크린샷 2022-12-17 18 23 32](https://user-images.githubusercontent.com/54883318/208235184-68c0a441-c26b-4725-b7d3-db649da9d881.png)
<br>(docker-compose.yml파일 코드)

### 9-5. Docker Container 실행 & 실행 결과<br>
![스크린샷 2022-12-17 18 21 53](https://user-images.githubusercontent.com/54883318/208235229-8220f082-2a52-49a8-b525-4e5ed074459e.png)

### 10. Swagger
-------------------------------
![스크린샷 2022-12-17 19 00 17](https://user-images.githubusercontent.com/54883318/208236473-a271b722-b7bd-437d-9768-fe24d80f3167.png)
![스크린샷 2022-12-17 19 02 14](https://user-images.githubusercontent.com/54883318/208236510-e642811d-0591-4631-9957-f2bf0dc9d29b.png)

### 11. Referance
-------------------------------
[마이크로서비스 분산DB 조회 설계](https://waspro.tistory.com/724)

[오늘의집 MSA Phase 1. 서비스 구축과 배포 with Mortar - 오늘의집 블로그](https://www.bucketplace.com/post/2021-12-17-msa-phase-1-%EC%84%9C%EB%B9%84%EC%8A%A4-%EA%B5%AC%EC%B6%95%EA%B3%BC-%EB%B0%B0%ED%8F%AC-with-mortar/)

[Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/techniques/task-scheduling)

[CronMaker](http://www.cronmaker.com/;jsessionid=node01wk30ioeetbsg15oo4c4531aun65736.node0?0)
