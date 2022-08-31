---
date: '2022-09-01'
title: 'Raycast 생산성 향상 플러그인 정리'
categories: ['tools']
summary: '개발하는데 도움이되는 도구들을 소개합니다.'
thumbnail: '../common.png'
---

# Raycast 

Mac OS에서 사용할 수 있는 Launcher 로 alfred 의 스크립트 자동화 등의 유료기능을 무료로 사용할 수 있습니다.

Raycast 는 다양한 기능들을 Store 에서 플러그인 형태로 제공하고 있습니다. 사용자가 플러그인을 만들어 배포 할 수도 있고 기본으로 제공하는 플러그인도 많습니다.
## 설치 방법

```shell
brew install --cask raycast
```

## 활용 방법

### 프로젝트 빠르게 열기
프로젝트를 하나만 실행할 때는 문제가 되지 않으나 여러가지 마이크로서비스로 나누어 개발하거나 프론트와 백엔드를 동시에 개발하는 경우
Jetbrains 의 Toolbox 를 이용해 프로젝트를 일일이 마우스로 해당 프로젝트를 찾아서 클릭하는 것은 매우 귀찮고 시간이 오래걸립니다.

https://www.raycast.com/gdsmith/jetbrains

해당 플러그인을 설치한 후 Toolbox 의 Shell scripts location 과 Toolbox location 을 지정해주면 

![Setting_HotKey](./raycast-1.png)

![Raycast_Jetbrains_Result](./raycast-2.png)

다음과 같이 바로 실행 할 수 있습니다.

추가로 Toolbox의 쉘 스크립트 생성 및 위치 지정하는 방법은 Toolbox 의 해당 설정 페이지에서 설정할 수 있습니다.

![Toolbox_ShellScript_location](./raycast-3.png)

### Gmail 보다 빠르게 열기

Raycast는 Shell script도 실행하도록 할 수 있습니다. 우선 Gmail을 바로 실행 할 수 있는 쉘스크립트를 
따로 저장합니다.
```shell
cd ~/Documents
mkdir raycast-scripts
cd raycast-scripts
vim google-gmail.sh
```
```
#!/bin/bash

# @raycast.title Gmail
# @raycast.author Michael Aigner
# @raycast.authorURL https://github.com/tonka3000
# @raycast.description Open gmail.com in the default browser

# @raycast.icon images/google-gmail-logo.png
# @raycast.mode silent
# @raycast.packageName Google
# @raycast.schemaVersion 1

open https://gmail.com
``` 
위 스크립트는 https://github.com/lajlev/raycast-my-scripts/blob/master/google-gmail.sh 에서 복사하였습니다.

이후 다음 설정창에서 방금전에 만든 디렉토리를 포함시켜줍니다.


![Shell-script](./raycast-4.png)

이후 Cmd + space를 통해 gmail을 빨리 실행할 수 있습니다.

![Gmail-Example](./raycast-5.png)


