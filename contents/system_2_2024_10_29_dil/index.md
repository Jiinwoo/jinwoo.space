---
date: '2024-10-29'
title: "대규모 시스템 설계 기초 2 - DIL"
categories: [ 'study', "DIL"]
summary: "근접성 서비스"
#thumbnail: './logo.png'
#draft: true
---

# 시스템 설계 검토사항

## 1. 기본 요구사항
- **GDPR 준수**
  - 인앱광고 연동 관련 검토 필요
  - 추후 상세 검토 예정

## 2. 트래픽 분석
### QPS 계산
- 기본 데이터
  - DAU: 1억명
  - 사업장 수: 2억개
  - 사용자당 일일 검색 횟수: 5회
- 계산식
  - QPS = (1억 * 5회) / (24시간 * 60분 * 60초)
  - 결과: 약 5,000 QPS

### 트래픽 특성
- 특정 시간대 트래픽 집중
- 대응 방안
  - AWS Auto Scaling Group 활용
  - 피크 시간대 사전 Warm-up 고려

## 3. API 설계
### Client API
```
GET /v1/search/nearby
```

### Admin API
```
GET    /v1/business/:id
POST   /v1/business
PUT    /v1/business/:id
DELETE /v1/business/:id
```

## 4. 데이터베이스 검토사항
### 현재 이슈
- 읽기 위주 작업에 RDB 사용의 적절성 검토 필요
- 지리 데이터 처리를 위한 DB 선택
  - PostgreSQL + PostGIS 일반적 사용
  - NoSQL 등 대체 솔루션과 비교 분석 필요

### 아키텍처 방향
- Read/Write 분리 클러스터링
  - 최종 일관성 1일 이내 허용
  - Replication Lag 허용

### 서비스 분리
- Client-Service (사업장 서비스)
- Admin-Service (관리자 서비스)

## 5. 지도 데이터 검색 알고리즘
### 2차원 검색
- MySQL 실행계획 추가 학습 필요

### 지도 데이터 색인 방식
#### 해시 기반
- 균등 격자
- 지오 해시
- 카르테시안 계층

#### 트리 기반
- 쿼드 트리
- 구글 S2
- R 트리

## TODO
- 캐시 전략 수립
