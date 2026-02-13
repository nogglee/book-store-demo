

# 📚 Book Store API (Backend)

REST API 기반 도서 쇼핑몰 백엔드 프로젝트입니다.

본 프로젝트는 Express + MariaDB 환경에서 **실제 서비스 구조에 가깝게 API를 설계하고 구현하는 것**을 목표로 합니다.
현재는 백엔드 단독 구현 단계이며, 이후 React 기반 프론트엔드를 연동할 예정입니다.

---

## 프로젝트 목적

이 프로젝트는 아래 항목에 대해 학습·정리하기 위한 실습 프로젝트입니다.

- REST API 설계 감각
- Express 미들웨어 구조 이해
- JWT 기반 인증/인가 흐름
- validation → controller → DB 계층 분리
- 실무에 가까운 요청 처리 파이프라인 구성

---

## Tech Stack

### Backend

- Node.js
- Express
- MariaDB

---

## 전체 구조

```text
book-store-demo
├── bin/www            # 서버 실행 엔트리 (포트, 환경변수 로드)
├── routes/            # 도메인별 라우터
├── controllers/       # 비즈니스 로직
├── middlewares/       # validate, auth 등 공통 미들웨어
├── db/                # DB 접근 계층
├── app.js             # Express 진입점
├── .env               # 환경 변수
└── package.json
```

## 인증 / 인가 구조

JWT 기반 인증 방식을 사용합니다.

### 인증(Authentication)

1. 로그인 요청
2. 서버에서 사용자 검증
3. JWT 발급
4. Authorization Header로 전달

### 인가(Authorization)

이후 모든 요청에서 JWT를 검증하고,
payload 기반으로 접근 권한을 판단합니다.

JWT는 인증 수단이자 인가 판단의 근거 데이터로 사용됩니다.

---

## 현재 구현 범위

- 사용자 가입 / 로그인
- JWT 발급 / 검증 미들웨어
- 도서 CRUD
- validation 구조
- DB 연동

---

## 향후 계획

- React 프론트엔드 연동
- Refresh Token 적용