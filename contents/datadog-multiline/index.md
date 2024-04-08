---
date: '2022-09-22' 
title: 'Kubernetes에서 Datadog을 사용하여 멀티라인 Java 로그 설정하기' 
categories: ['Kubernetes', 'Datadog', 'Logging'] 
summary: 'Kubernetes 환경에서 Datadog을 사용할 때, JSON 포맷이나 Logback Encoder를 사용하지 않고 stdout으로 출력되는 Java 스택 트레이스를 하나의 로그로 처리하는 방법을 알아봅니다.' 
thumbnail: '../common.png'
---

# Kubernetes에서 Datadog을 사용한 멀티라인 로그 설정
Kubernetes에서 로그를 처리하는 방법에는 여러 가지가 있습니다:

1. 애플리케이션 레벨에서 직접 로그 수집기로 전달하는 구조
1. 사이드카에서 로그를 전달하는 구조
2. 컨테이너의 stdout/stderr을 노드의 파일로 저장한 후, 수집기가 해당 파일을 읽어가는 구조

현재 우리는 세 번째 방식을 사용하여 로그를 수집하고 있습니다. 
하지만 기본 설정으로는 Datadog에서 Java의 스택 트레이스를 하나의 로그로 인식하지 않습니다. 
다른 로그 수집기를 사용하더라도 별도의 설정을 추가하지 않으면 동일한 문제가 발생합니다. 
이는 스택 트레이스가 여러 줄로 출력되고, JSON 형태로 저장되기 때문입니다.

스택 트레이스를 여러 개의 로그로 분리하면 비용이 증가할 뿐만 아니라 로그를 분석하는 데에도 불편함이 따릅니다. 
따라서 스택 트레이스를 하나의 로그로 합치는 과정이 필요합니다.


## 멀티라인 로그 설정
Datadog에서 스택 트레이스를 하나의 로그로 인식하도록 하려면, 다음과 같이 Deployment의 Pod 템플릿에 애너테이션을 추가해야 합니다

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

위 설정에서 주목할 부분은 다음과 같습니다

- `auto_multi_line_detection`을 true로 설정하여 Datadog 에이전트가 멀티라인 로그를 자동으로 감지하도록 합니다.
- `log_processing_rules`에서 multi_line 규칙을 정의합니다. 이 규칙은 새로운 로그의 시작을 날짜 패턴으로 식별합니다.

이렇게 설정하면 Datadog 에이전트는 Java 애플리케이션에서 출력되는 스택 트레이스를 하나의 로그로 인식하고 처리할 수 있습니다.

## 마무리
Kubernetes 환경에서 Datadog을 사용할 때, 멀티라인 로그 설정을 추가하면 Java 애플리케이션의 스택 트레이스를 효과적으로 처리할 수 있습니다. 이를 통해 로그 분석을 간편하게 수행할 수 있고, 불필요한 비용 증가를 방지할 수 있습니다. 로그 수집 및 분석은 애플리케이션 운영에 있어 매우 중요한 부분이므로, 적절한 설정을 통해 효율적으로 관리해야 합니다.