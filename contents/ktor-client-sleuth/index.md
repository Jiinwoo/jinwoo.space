---
date: '2022-09-25'
title: 'ktor-client sleuth 적용하기'
categories: ['ktor']
summary: 'ktor client 에서 sleuth 를 적용하는 방법을 알아봅니다.'
thumbnail: '../common.png'
---

## 프로젝트 셋업

우선 테스트 프로젝트가 멀티모듈(client, server) 로 구성되어 있기 때문에 각각의 의존성을 알아서 설정해주면 된다.
추가로 client 쪽에서는 ktor-client dependency를 추가로 포함시켜주자

project-client dependency
```kotlin dsl
dependencies {
    implementation(project(":support:logging"))
    implementation("io.ktor:ktor-client-core:${rootProject.extra["ktorVersion"]}")
    implementation("io.ktor:ktor-client-cio:${rootProject.extra["ktorVersion"]}")
    implementation("org.springframework.boot:spring-boot-starter-web")
}
```

project-server dependency
```kotlin dsl
dependencies {
    implementation(project(":support:logging"))
    implementation("org.springframework.boot:spring-boot-starter-web")
}
```

공통 logging 모듈

```kotlin-dsl
dependencies {
    implementation("org.springframework.cloud:spring-cloud-starter-sleuth")
} 
```

### ktor-client features

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







