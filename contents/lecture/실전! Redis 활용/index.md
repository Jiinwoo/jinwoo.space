---
date: '2025-01-04'
title: '실전! Redis 활용'
tags: [ 'lecture' ]
summary: '실전! Redis 활용 강의 정리'
thumbnail: '../../common.png'
---

> 강의 내용 중 필요하다고 생각되는 부분과 개인적인 생각을 포함했습니다.


Redis 특징

- In-Memory 모든 데이터를 RAM에 저장. (백업 및 스냅샷 제외)
- Single Threaded
- Cluster Mode
- Redis Database (RDB) + Append only file (AOF) 통해서 영속성 옵션 제공
- Pub/Sub 통해서 채팅, 알림 기능 구현가능.

장점:

- 빠른 속도
- 다양한 데이터타입 지원
- 다양한 클라이언트 라이브러리 지원

주요 사용 사례

- Cache
    - OTP
    - Session
- Rate Limiter
    - Fixed Window
    - Sliding Window
- Message Broker
- 실시간 분석, 계산
    - Rank, Leaderboard
    - Geofencing
    - Visitors count
- Pub/Sub

Persistence

주로 캐시로 사용하지만 데이터 영속성을 위한 옵션을 제공.

RDB(Redis Database): Point-in-time Snapshot -> 재난 복구(Disaster Recovery) 용이, 복제에 사용

- 스냅샷 생성중에 전체적인 레디스 서버 성능저하 발생가능.
- 일부 데이터 유실의 위험가능성 존재

AOF(Append Only File): Redis에 Write 작업을 모두 Log 로 저장.

- RDB 보다 재난 복구에 느림.
- 데이터 유실의 위험이 적음.

### Caching

Cache Aside Pattern: Cache Miss 발생시 Database 에서 데이터를 가져오고, Cache Hit 발생시 Cache 에서 데이터를 가져오는 패턴으로 일반적인 패턴

### Cli check

```bash
$ redis-cli
127.0.0.1:6379> ping
PONG
```

### 데이터 타입

- Strings: 문자열, 숫자, Serialized object(JSON String) 등 저장.
    - SET key value
    - MSET key1 value1 key2 value2
    - MGET key1 key2
    - INCR key # 숫자 증가
    - INCRBY price 10 # 숫자 증가
    - SET jsonkey '{"name": "jake", "age": 20}'
    - SET server:ko:price 200 # 자주 사용되는 레디스 네이밍 컨벤션

- List: String 을 Doubled Linked List 로 저장.
    - 양 끝에 추가 삭제가 O(1) 시간복잡도를 가짐.
    - LPUSH queue job1 job2
    - RPOP queue
    - LPOP queue
    - LRANGE queue 0 -1 # 전체 조회
    - LRANGE queue -2 -1 # 뒤에서 두번째 아이템 부터 끝까지 조회
    - LTRIM queue 0 0 # 첫번째 아이템만 남기고 삭제

- Set: Unique string 을 저장하는 정렬되지 않은 집합.
    - SADD user:1:fruits apple banana orange orange
    - SMEMBERS user:1:fruits # 전체 조회
    - SCARD user:1:fruits # 전체 갯수 cardinality
    - SISMEMBER user:1:fruits apple # 멤버 존재 여부 확인

    - SADD user:2:fruits banana orange kiwi
    - SINTER user:1:fruits user:2:fruits # 교집합
    - SUNION user:1:fruits user:2:fruits # 합집합
    - SDIFF user:1:fruits user:2:fruits # 차집합


- Hash: Key-Value 형태로 저장.
    - HSET key1 field1 value1 field2 value2
    - HGET key1 field1
    - HMGET key1 field1 field2 invalid
        - invalid field 는 nil 로 반환
    - HINCRBY key1 field1 10 # 숫자형에서만 사용가능

- Sorted Set: Set 과 유사하지만 Score 가 추가로 저장되어 정렬이 가능. Score가 같을 경우 사전순으로 정렬.
    - ZADD points 10 TeamA 10 TeamB 50 TeamC
    - ZRANGE points 0 -1 # 순서를 가지기 때문에 List 처럼 조회 가능
    - ZRANGE points 0 -1 REV WITHSCORES # Score 도 함께 조회 + 역순
    - ZRANK points TeamA # 순위 조회

- Stream: Append-only log 에 consumer groups 과 같은 기능을 더한 자료구조
    - Unique ID 를 통해서 하나의 entry 를 읽을 때, 시간 복잡도 O(1)
    - Consumer Group 을 통해서 여러 Consumer 가 하나의 Stream 을 읽을 수 있음.
    - XADD mystream * name jake age 20
    - XRANGE mystream - + # 전체 조회
    - XDEL mystream ID # 삭제

- Geospatials: 좌표를 저장하고, 검색하는 데이터 타입
    - GEOADD seoul:station 126.9784 37.5665 hongdae
    - GEOADD seoul:station 127.0276 37.4979 gangnam
    - GEODIST seoul:station hongdae gangnam km # 거리 계산

- Bitmaps : 실제 데이터 타입은 아니고 String 에 binary operation 을 적용한 것, 최대 42억개 binary 데이터 표현
    - SETBIT user:login:25-01-01 123 1 # 25-01-01 날짜에 123 번째 유저 로그인
    - SETBIT user:login:25-01-01 456 1 # 25-01-01 날짜에 456 번째 유저 로그인
    - SETBIT user:login:25-01-02 123 1 # 25-01-02 날짜에 123 번째 유저 로그인
    - BITCOUNT user:login:25-01-01 123 # 25-01-01 날짜에 123 번째 유저 로그인 여부 확인
    - BITOP AND result user:login:25-01-01 user:login:25-01-02 # 25-01-01, 25-01-02 날짜에 모두 로그인한 유저 확인
        - GETBIT result 123 # 123 번째 유저가 25-01-01, 25-01-02 날짜에 모두 로그인한 유저인지 확인

- HyperLogLog: 집합의 cardinality 를 추정하는 확률적 자료구조, 정확성을 일부 포기하고 메모리를 절약, 평균 에러율은 0.81%
    - Set과 비교하면 Set은 모든 데이터를 저장하지만 HyperLogLog 는 실제값을 저장하지 않는다.
    - 모든 아이템을 출력해야하는 상황에서는 불가능.
    - PFADD fruits apple banana orange kiwi
    - PFCOUNT fruits
    - 메모리 및 에러 비교
      ```bash
      for (( i=1; i<=1000; i++ )); do redis-cli SADD k1 $i; done
      redis-cli 
      MEMORY USAGE k1 -> 40296
      SCARD k1 -> 1000
      
      for (( i=1; i<=1000; i++ )); do redis-cli PFADD k2 $i; done
      redis-cli
      MEMORY USAGE k2 -> 2608
      PFCOUNT k2 -> 1001 #오차 발생
      ```

- BloomFilter: element 가 집합 안에 포함되어있는 있는지 확인할 수 있는 확률형 자료구조
    - 정확성을 일부 포기하는 대신 저장공간을 효율적으로 사용
    - 멤버십 테스트라고 불리는 기능을 구현할 때 자주 사용
    - false positive 가 발생할 수 있음. (값이 없는데 있다고 판단)
    - 값이 존재하는 경우 100% 확실하게 판단 가능
    - BF.MADD fruits apple banana orange kiwi
    - BF.EXISTS fruits apple

### Redis 특수 명령어

- 데이터 만료: 데이터를 특정시간 이후에 만료시키는 기능, 데이터가 만료되자마자 바로 삭제되지는 않고 만료로 표시했다가 백그라운드에서 주기적으로 삭제.
    - EXPIRE key 10 # 10초 후 만료
    - TTL key # 만료까지 남은 시간 조회
    - SETEX key 10 value # 데이터 저장과 10초 후 만료

- NX/XX 옵션: SET 명령어에 사용되는 옵션, SET 이 동작하지 않는 경우 (nil) 반환
    - NX: 해당 Key가 존재하지 않는 경우에만 SET
        ```redis
            SET key value NX
        ```
    - XX: 해당 Key가 존재하는 경우에만 SET
        ```redis
            SET key value XX
        ```

- Pub/Sub
    - 두 시스템간에 비동기적으로 통신
    - VS Stream: Stream 와 달리 Subscribe 하지 않을 때 발행된 메시지는 수신 불가.
  ```redis
    SUBSCRIBE ch:order ch:payment # 채널 구독
    PUBLISH ch:order "order message" # 채널에 메시지 발행
  
  ```

- Pipeline
    - 여러 명령어를 한번에 보내는 기능
    - 네트워크 오버헤드를 줄이고 성능을 향상
    ```redis
        MULTI
        SET key1 value1
        SET key2 value2
        EXEC
    ```
- Transaction
    - 여러 명령어를 하나의 트랜잭션으로 묶어서 실행
    - 트랜잭션 실행 중에는 다른 클라이언트의 명령어가 중간에 실행되지 않음.
    - 롤백이 발생하는 경우 (문법적 에러가 있는 명령어를 큐에 적재하려고 할 때)
      ```redis
      
        MULTI
        SET key1 "value1"
        SADD key1 // SADD 명령어는 인자가 없어서 에러 발생
        EXEC
      ```
    - 롤백이 발생하지 않는 경우
      ```redis
      MULTI
      SET key1 "value1"
      INCR key1 // String "value1" 을 숫자로 증가하려고 하면 에러 발생
      SET key2 "value2"
      EXEC
      ```
      key1="value", key2="value2" 로 저장되고 INCR 이 실패.
- Spring Data Redis
    ```java
    @EnableTransactionManagement
    @Configuration
    public class RedisConfig {
        @Bean
        public StringRedisTemplate redisTemplate() {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setEnableTransactionSupport(true); // 트랜잭션 활성화
        return template;
      }
    }
    ```
    - 실제로 롤백을 지원하지 않고 Exception 발생시 Discard 명령어를 실행.
      ```java
      @Service
      public class UserService {
          @Autowired
          private StringRedisTemplate redisTemplate;
          
          @Transactional
          public void updateUser() {
              redisTemplate.opsForValue().set("user:1:name", "John");
              throw new RuntimeException("Error"); // 예외 발생
          }
      }
      ```

## OTP 구현

## 분산 락

## Rate Limiter

## SNS Activity Feed

## GeoFencing
- GEOADD gang-nam:burgers 127.0276 37.4979 burger1
- GEOADD gang-nam:burgers 127.0276 37.4979 burger2
- GEORAIDUS gang-nam:burgers 127.0276 37.4979 1 km

## 사용자 온라인 상태
사용자의 현재 상태를 표시하는 기능
- 실시간성을 완벽히 보장하지는 않는다. 
- 수시로 변경되는 값
- SETBIT user:1:30 1
- GETBIT user:1:30 -> 1
- GETBIT user:1:31 -> 0

## 방문자 수 계산
HyperLogLog 을 사용하여 방문자 수를 대략적으로 추정하는 경우
 - PFADD today:users user:1:{timestamp} 
 - PFCOUNT today:users

## 중복 이벤트 제거
BloomFilter 를 사용하여 중복 이벤트를 제거하는 경우

"user 1 clicked at 00:00:00" 같은 이벤트를 DB에 저장할 때
DB 체크 로직을 사용하지 않고 BloomFilter 를 사용하여 중복 이벤트를 제거하여서
부하 분산 가능

## 주의사항

대부분의 명령어는 O(1) 시간복잡도를 가지지만, 몇몇 명령어는 O(N) 시간복잡도를 가질 수 있음.

싱글 스레드 기반이라 오래걸리는 O(N) 명령어를 사용할 때 주의해야함.

- KEYS: 패턴과 일치하는 모든 키를 조회하는 명령어, Production 환경에서 절대 사용 금지 -> 필요하다면 SCAN 사용
- SMEMBERS: Set 에서 모든 멤버를 조회하는 명령어, Set 이 커질수록 시간복잡도 증가
- HGETALL: Hash 에서 모든 필드와 값을 조회하는 명령어, Hash 가 커질수록 시간복잡도 증가
- SORT: List, Set, Sorted Set 에서 정렬을 위해 사용하는 명령어, 정렬을 위해 모든 데이터를 읽어야 하기 때문에 시간복잡도 증가

### Thundering Herd Problem

병렬 요청이 공유 자원에 대해서 접근할 때, 급격한 과부하가 발생하는 문제

- 캐시가 만료될 때 발생할 수 있음.
- Cache Aside Pattern: Cache Miss 발생시 Database 에서 부하
- cronjob 으로 주기적으로 캐시가 만료되지 않도록 갱신


### Stale Cache Invalidation

캐시의 유효성이 손실되었거나 변경되었을 때, 캐시를 변경하거나 삭제하는 기술
