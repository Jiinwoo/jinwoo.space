---
date: '2024-11-12'
title: "대규모 시스템 설계 기초 2 DIL"
categories: [ 'study', "DIL" ]
summary: "2장 주변친구"
thumbnail: '../common.png'
---

### 분산 레디스 펍/섭 클러스터

- 메시지를 발행할 사용자 ID 기준으로 샤딩
- 하지만 장애 대비 및 매끄럽게 운영을 위해 서비스 탐색 컴포넌트를 도입 (etcd, zookeeper)

### 서비스 탐색 컴포넌트

서비스 탐색 컴포넌트 중에 다음의 기능 두가지를 사용.

1. 채널을 기준으로 레디스 펍/섭을 찾을 수 있게 해주는 해시링 기능
2. Client로 하여금 레디스 펍/섭 변경사항을 구독할 수 있도록 하는 기능

> 클러스터 내에 레디스 펍/섭 추가, 삭제, 새로 교체하는 경우


웹소켓 서버가 특정 사용자 채널에 위치 정보 변경 내역을 발행하는 과정 OR
구독할 채널이 어디 레디스 펍/섭에 존재하는지

1. 웹소켓 서버는 서비스 탐색 컴포넌트로부터 해시링을 참조하여 레디스 펍/섭을 찾음.
   > 이 때 성능 효율을 위해 캐시를 활용할 수 있으나 서비스 디스커버리에 구독 관계를 설정해서 원본을 항상 유지.
2. 해당 레디스 펍/섭에 발행

### 레디스 펍/섭 서버 클러스터의 규모 확장시 고려사항.

레디스 펍/섭 서버의 기본적인 특성.

1. 전송되는 메시지는 메모리나 디스크에 지속적으로 보관되지 않음. 구독자에게 전송되고나면 바로 삭제.
   구독자가 없는 경우는 그냥 사라짐.
   > 이 관점에서 보면 무상태 서버로 볼 수 있음.
2. 하지만 채널의 구독자 목록은 상태 정보의 핵심적 부분. 특정한 채널을 담당하는 서버가 교체되거나 사라지는 경우
   > 해당 채널의 모든 구독자에게 새로운 서버로 구독을 변경하도록 알려줘야 함.
   > 이런 특징 때문에 유상태 서버임.
   > 

이런 특징 때문에 규모를 늘리거나 줄이는 것은 위험 요소가 있음.
대부분 오버 프로비저닝하는것이 보통.

하지만 불가피하게 규모를 늘리는 경우 다음의 문제가 발생할 수 있음.
- 많은 채널들이 해시 링 위의 다른 여러 서버로 이동하게 됨.
- 서비스 탐색 컴포넌트는 클라이언트에게 해시링이 갱신되었음을 알림.
- 웹 소켓 서버는 많은 재구독 요청을 처리하게 됨.
- 이 때 위치 정보 변경 메시지의 처리가 누락될 가능성이 있음. 하지만 그 정도의 손실을 허용.


### 운영 고려사항.

기존 레디스 펍/섭 서버에 문제가 생겨 교체해야하는 상황.

1. 서비스 탐색 컴포넌트의 해시 링 키에 매달린 값을 갱신. 문제가 발생한 노드와 교체
2. 교체 사실은 모든 웹 소켓서버에 통보.
3. 웹 소켓 서버는 교체된 레디스 펍/섭에 있는 채널들을 새로운 레디스 펍/섭으로 구독.

### 친구 추가/ 삭제

- 친구 추가, 친구 삭제의 콜백을 웹 소켓 서버로 받음.
- 웹 소켓 서버는 해당 친구가 활성화 상태면 최근 위치 및 시각 정보를 보냄.

### 친구가 많은 사용자

- 친구는 양방향 관계라고 가정
- 최대 상한 5000

수천 명의 친구를 구독하는데 필요한 펍/섭 구독 관계는 클러스터 전체에 걸쳐 분산되어 있음.
-> 웹 소켓 서버에 분산되어있음. 
많은 친구를 가진 사용자의 채널이 존재하는 레디스 펍/섭은 조금 더 많은 부하를 받을 수도 있음.


### 주변의 임의 사용자

주변의 동의를 구한 임의 사용자를 보여주는 기능을 추가해보자.

1. 지오해시에 기반한 레디스 펍/섭 채널을 만들어 둠.

### 레디스 펍/섭 대안

얼랭(Erlang) 한번 사용해보자

1. 분산 병렬 어플리케이션을 위한 언어 및 런타임 환경
2. 경량 프로세스
3. 여러 서버로 분산이 쉬움. 
4. 운영 부담이 낮음, 프로덕션에서 발생하는 이슈 추적, 디버깅을 위한 도구가 훌륭

웹소켓 서버를 얼랭, 레디스 펍/섭 클러스터는 분산 얼랭 어플리케이션