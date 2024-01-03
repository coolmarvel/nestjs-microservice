# Step-1

## Monolith vs Microservice

### Monolith

- 전체적인 앱이 단일 프로세스로 동작
- 더 적은 기술과 설계 방법이 필요
- 새로운 앱을 만들 때 좋은 시작점. 마이크로서비스 앱에 필요한 기술적 투자를 하기 전 빠르게 비즈니스 검증
- 비즈니스와 서비스가 확장될수록 유지 보수가 어려워짐

### Microservice

- 앱의 주요 기능들을 수행하기 위해서 협업하는 작은 서비스로 구성된 일종의 분산 프로그램
- 각각의 서비스는 실제로 분리된 서버에 위치. 서비스를 종합적으로 관리할 수 있는 오케스트레이션 플랫폼이 거의 필수
- 각각의 서비스별로 유연하고 다양한 환경에 적합하게 구성할 수 있음

### Microservice 장점

- 다른 환경에 격리된 서비스들을 다른 서비스에 영향을 주지 않으면서 유지보수, 확장이 가능함
  - 개별 배포
  - 독립적인 기술 스택 선택

### Microservice 단점

- 초기 세팅하는 데 상대적으로 많은 기술 습득과 노하우가 필요
- 하지만 최근 많은 도구들이 발전하면서 비용이 낮아지는 추세

# Step-2

## NestJS 모노레포 - Microservice 구성

```bash
$ npm install -g @nestjs/cli
$ nest new microservice
$ cd microservice
$ npm run start:dev
$ yarn start:dev
$ nest generate app api-gateway

$ rm -rf microservice

$ nest generate app user
$ nest generate app video
$ nest generate app analytics

$ yarn start user
$ yarn start video
$ yarn start analytics
```

## Docker

- 각 마이크로서비스별로 도커 파일 작성
- 완전히 분리된 환경에서 각각의 마이크로서비스를 띄울 수 있음

```bash
$ cd /apps/api-gateway
$ docker build -t api-gateway
$ docker run -p 3000:3000 --name api-gateway api-gateway
```

# Step-3

## Docker Compose

- 여러 마이크로서비스 도커 컨테이너를 로컬에서 관리하는 것이 가능

### 마이크로서비스를 컨테이너로 실행

- docker-compose.yml

```bash
$ yarn run microservice
```

### Postgres

- postgres.yml

```bash
$ yarn run postgres
```

- 유저, DB 생성

```bash
# 도커 컨테이너의 bash 실행
$ docker exec -it postgres /bin/bash

# 유저 생성
$ createuser -d -P -U postgres -h localhost -p 5432 api-gateway
$ createuser -d -P -U postgres -h localhost -p 5432 user-service
$ createuser -d -P -U postgres -h localhost -p 5432 video-service
$ createuser -d -P -U postgres -h localhost -p 5432 analytics-service

# Enter password for new role: 생성할 유저의 비밀번호 입력
# Enter it again: 생성할 유저의 비밀번호 입력
# Password: 마스터 계정의 비밀번호 입력

# DB 생성
$ createdb -U api-gateway -h localhost -p 5432 -E UTF8 api-gateway
$ createdb -U user-service -h localhost -p 5432 -E UTF8 user-service
$ createdb -U video-service -h localhost -p 5432 -E UTF8 video-service
$ createdb -U analytics-service -h localhost -p 5432 -E UTF8 analytics-service
# Password: 해당 유저의 비밀번호 입력
```

# Step-4

## Sync vs Async

- 동기 요청과 비동기 요청의 차이는 결국 요청의 응답을 기다리느냐 여부

## NestJS에서 메아크로서비스간의 통신

- transporter라고 하는 built-in transport 레이어를 활용하여 데이터를 주고 받음
- 동기 방식인 request-response, 비동기 방식인 event-based
- TCP transporter를 활용하여 동기 방식 구현, kafka transporter를 활용하여 비동기 방식 구현

# Step-5

## Kafka

- 메시지 브로커
- 도커 컴포즈로 실행

```bash
$ yarn run kafka
```
