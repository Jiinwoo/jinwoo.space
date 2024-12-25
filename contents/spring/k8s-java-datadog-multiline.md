---
date: '2022-09-22'
title: 'Kubernetes 환경에서 Datadog 로 로그를 수집할 때 Java 멀티라인 설정'
tags: [ 'Kubernetes', 'Datadog', 'Logging', "Spring" ]
summary: 'Kubernetes 환경에서 Datadog을 사용해서 로그를 수집할 때, 
어플리케이션 로그 설정을 수정하지 않고 멀티라인 설정하는 방법을 알아봅니다.'
thumbnail: '../common.png'
---

# Kubernetes 에서 Datadog을 사용한 멀티라인 로그 설정

Kubernetes 환경에서 어플리케이션 로그를 처리하는 방법에는 여러 가지가 있다.

- 애플리케이션 레벨에서 직접 로그 수집기로 전달하는 구조
- 사이드카에서 로그를 전달하는 구조
- 컨테이너의 stdout/stderr을 노드의 파일로 저장한 후, 수집기가 해당 파일을 읽어가는 구조

마지막 방법을 사용할 때 Datadog 로 로그를 수집할 때 스택트레이스 같은 경우는 하나의 로그로 인식되지 않고
여러 줄로 인식되어 로그가 분리되어 수집된다. 이런 경우 로그 분석이 어렵고 비용이 증가할 수 있다.

## 멀티라인 로그 설정

Datadog에서 스택 트레이스를 하나의 로그로 인식하도록 하려면,
다음과 같이 Deployment의 Pod 템플릿에 애너테이션을 추가해야 한다.

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
```

이렇게 설정하면 Datadog 에이전트는 Java 애플리케이션에서 출력되는 스택 트레이스를 하나의 로그로 인식하고 처리할 수 있다.
