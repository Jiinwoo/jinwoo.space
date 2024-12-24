---
date: '2024-10-30'
title: "대규모 시스템 설계 기초 2 - DIL (2)"
tags: [ 'study', "DIL"]
summary: "지오해시"
thumbnail: '../../common.png'
---

# 지오해시

## 지오해시 상용 솔루션

### Redis Geospatial

Spring Data Redis 를 사용해서 Redis Geospatial 을 사용할 수 있다.
많은 예제가 있어서 나중에 사용한다면 참고하면 좋을 것 같다.

## 특정 지오해시가 주어졌을 때 주변의 지오해시를 계산하는 방법

경계값을 검사하고 재귀적으로 계산하는게 제대로 이해가 안되어서 claude 를 활용해서 코드를 작성하고
print 문으로 일일이 디버깅해서 어떻게 흘러가는지 파악하였다.

```python
def get_neighbor(geohash: str, direction: str) -> str:
    """
    주어진 지오해시의 특정 방향 인접 영역을 계산합니다.

    Args:
        geohash: 기준 지오해시 문자열
        direction: 방향 ('n','s','e','w','ne','nw','se','sw' 중 하나)

    Returns:
        str: 인접한 지오해시 문자열
    """

    # 지오해시 base32 인코딩 문자
    base32 = '0123456789bcdefghjkmnpqrstuvwxyz'

    # 각 문자의 이웃 관계 정의
    neighbors = {
        'n': ['bc01fg45238967deuvhjyznpkmstqrwx', 'p0r21436x8zb9dcf5h7kjnmqesgutwvy'],
        's': ['238967debc01fg45kmstqrwxuvhjyznp', '14365h7k9dcfesgujnmqp0r2twvyx8zb'],
        'e': ['p0r21436x8zb9dcf5h7kjnmqesgutwvy', 'bc01fg45238967deuvhjyznpkmstqrwx'],
        'w': ['14365h7k9dcfesgujnmqp0r2twvyx8zb', '238967debc01fg45kmstqrwxuvhjyznp']
    }

    border = {
        'n': ['bcfguvyz', 'prxz'],
        's': ['0145hjnp', '028b'],
        'e': ['prxz', 'bcfguvyz'],
        'w': ['028b', '0145hjnp']
    }

    # 대각선 방향은 두 방향의 조합
    if len(direction) == 2:
        return get_neighbor(get_neighbor(geohash, direction[0]), direction[1])

    last_ch = geohash[-1]  # 마지막 문자
    parent = geohash[:-1]  # 마지막 문자를 제외한 부분

    type_idx = len(parent) % 2

    # 경계에 있는 경우
    if last_ch in border[direction][type_idx]:
        parent = get_neighbor(parent, direction)

    # 이웃 문자 찾기
    next_idx = neighbors[direction][type_idx].find(last_ch)
    if next_idx < 0:
        next_idx = base32.find(last_ch)
        if next_idx < 0:
            return parent
    return parent + base32[next_idx]


# wydm2의 모든 인접 영역 계산
geohash = 'wydm2'

neighbors = {
    'n': get_neighbor(geohash, 'n'),
    'ne': get_neighbor(geohash, 'ne'),
    'e': get_neighbor(geohash, 'e'),
    'se': get_neighbor(geohash, 'se'),
    's': get_neighbor(geohash, 's'),
    'sw': get_neighbor(geohash, 'sw'),
    'w': get_neighbor(geohash, 'w'),
    'nw': get_neighbor(geohash, 'nw')
}

# 결과 출력
for direction, value in neighbors.items():
    print(f"{direction}: {value}")

```

## 표시할 사업장이 충분하지 않은 경우

나중에 어플리케이션 로직상에서 실제로 구현해보면 좋을 것 같다.

1. 사용자의 지오해시로부터 인접한 지오해시 List 를 반환하고
2. 인접한 지오해시 List 에서 사업장을 찾는다.
3. 사업장이 충분하지 않은 경우 인접한 지오해시로부터 인접한 지오해시를 계속 찾는다.
4. 사업장이 충분해질 때까지 반복한다.
