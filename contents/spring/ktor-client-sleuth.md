---
date: '2022-09-25'
title: 'ktor-client sleuth 적용하기'
tags: ['ktor']
summary: 'ktor client 에서 sleuth 를 적용하는 방법을 알아보자.'
thumbnail: '../common.png'
---

# ktor-client sleuth 적용하기

sleuth 는 spring cloud 에서 제공하는 분산 추적 시스템이다.
MSA 환경에서 트랜잭션을 추적하고 로깅을 할 때 사용된다.
기본적으로 RestTemplate 이나 WebClient 는 기본적으로 라이브러리를 추가할 시 자동으로 적용되지만 
나머지 HTTP Client 들에는 직접 적용해줄 필요가 있다.

## 프로젝트 셋업

Client
```kotlin dsl
// build.gradle.kts  
dependencies {
    implementation(project(":support:logging"))
    implementation("io.ktor:ktor-client-core:${rootProject.extra["ktorVersion"]}")
    implementation("io.ktor:ktor-client-cio:${rootProject.extra["ktorVersion"]}")
    implementation("org.springframework.boot:spring-boot-starter-web")
    
    implementation("org.springframework.cloud:spring-cloud-starter-sleuth")
}
```

Server
```kotlin dsl
// build.gradle.kts
dependencies {
    implementation(project(":support:logging"))
    implementation("org.springframework.boot:spring-boot-starter-web")
    
    implementation("org.springframework.cloud:spring-cloud-starter-sleuth")
}
```

### ktor-client features

HTTP 요청에 Header 설정을 추가해주면 된다.

```kotlin
class SleuthHeader internal constructor(
    public val tracer: Tracer
) {
    public class Config {
        internal lateinit var tracer: Tracer

        public fun tracer(tracer: Tracer) {
            this.tracer = tracer
        }
    }

    private fun setupRequest(client: HttpClient) {
        client.requestPipeline.intercept(HttpRequestPipeline.State) {
            val span = tracer.currentSpan() ?: tracer.nextSpan()
            context.headers.append("X-B3-TraceId", span.context().traceId())
            context.headers.append("X-B3-SpanId", tracer.nextSpan().context().spanId())
            context.headers.append("X-B3-ParentSpanId", tracer.nextSpan().context().parentId().toString())
        }
    }

    companion object : HttpClientFeature<Config, SleuthHeader> {

        override val key: AttributeKey<SleuthHeader> = AttributeKey("SleuthHeaderPlugin")

        override fun install(feature: SleuthHeader, scope: HttpClient) {
            feature.setupRequest(scope)
        }

        override fun prepare(block: Config.() -> Unit): SleuthHeader {
            val config = Config().apply(block)
            return SleuthHeader(config.tracer)
        }
    }
}
```

```kotlin
@Configuration
class KtorConfiguration {
    @Bean
    @Primary
    fun httpClient(objectMapper: ObjectMapper, tracer: Tracer): HttpClient = HttpClient(CIO) {
        install(SleuthHeader) {
            tracer(tracer)
        }
       
    }
}
```







