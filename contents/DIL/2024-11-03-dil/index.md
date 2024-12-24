---
date: '2024-11-02'
title: "Real Mysql dil"
tags: [ 'study', "DIL" ]
summary: "1~3장"
thumbnail: '../../common.png'
draft: false
---

# 설정

Mysql /etc/my.cnf 설정파일

클린 셧다운 

- 트랜잭션이 정상적으로 종료되도 데이터 파일이 변경되지 않고 로그 파일(리두 로그) 에만 기록되어있을 수 있음.
    - Clean Shutdown 
    - SET GLOBAL innodb_fast_shutdown=0;
- Mysql General Availability(GA)
- 시스템 변수
  - ```SHOW GLOBAL VARIABLES```

- SET GLOBAL $key $value
  - 이 경우 설정파일에는 저장되지 않음.
- SET PERSIST $key value
  - 이 경우 설정파일에 저장됨.

책을 다 본다음에 46 페이지의 설정파일을 참고할 것.


# 사용자 계정

- 시스템 계정
- 일반 계정

- 계정 생성 CREATE USER ~
- 권한 부여 GRANT ~ 

- 비밀번호 인증방식
  - Caching SHA-2 Pluggable Authentication
- 이중 패스워드
  - 패스워드 변경이 힘들어서 나온 방식
  - 두가지의 패스워드로 로그인이 가능. 

  
# 권한
- 글로벌 권한
- DB 권한
- 테이블 권한

테이블이나 칼럼 단위로 권한을 잘 지정하지 않는다. -> 하나라도 지정되어있으면 모든 테이블, 모든 칼럼에 대해서 권한체크를 진행하기 떄문에
성능이슈발생 가능 -> 꼭 필요하다면 VIEW를 이용해서 권한을 부여하는 것이 좋다.


# 역할

- 권한을 묶어서 부여할 수 있는 기능
- 사용자 계정과 거의 유사한 형태
