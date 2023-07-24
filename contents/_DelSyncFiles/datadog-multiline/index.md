---
date: '2022-09-22'
title: 'Datadog 멀티라인 로그 설정'
categories: ['kubernetes', 'datadog']
summary: 'Json 포맷 또는 logback encoder 를 사용하지 않고 stdout 스택트레이스를 한줄로 로깅해봅니다.'
thumbnail: '../common.png'
---

## k8s 로깅 아키텍처

k8s에서 로그를 처리하는 방법에는 여러가지가 있다.

* 어플리케이션 레벨에서 바로 로그수집기로 전달하는 구조
* 사이드카에서 로그를 전달하는 구조
* 컨테이너의 std 를 노드에 파일로 저장 후 수집기가 해당 파일을 읽어가는 구조

현재 이 중 3번째에 해당하는 방식으로 로그를 수집하고 있는데 기본 설정으로는 Datadog에서 java 의 스택트레이스를 하나의 로그로 인식하지 않는다. 물론 다른 로그 수집기를 사용하더라도 
별도의 설정을 추가하지 않는 이상 별반 다르지 않다.
이는 스택트레이스를 여러줄로 json 형태로 저장하고 단순히 읽어가기 때문이다.

스택트레이스를 로그하나하나 나누면 비용도 커질뿐만 아니라 로그 보는데이도 불편하기 때문에 하나로 합치는 과정이 필요하다.

다음의 multiline 설정을 deployment에 추가해주면 datadog agent 가 스택트레이스가 하나의 로그로 합쳐서 보여준다
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    annotations:
      ad.datadoghq.com/nginx-service.logs: >-
      [{
        "source": "java",
        "service": "nginx-service",
        "auto_multi_line_detection": true,
        "log_processing_rules": [
          {
            "type": "multi_line",
            "name": "new_log_start_with_date",
            "pattern": "\\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])"
          }
        ]
      }]
~
```