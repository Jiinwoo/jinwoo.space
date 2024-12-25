---
date: '2024-08-05'
title: '파이썬 라이브러리별 이미지 타입 비교'
tags: [ "AI", "Python", "Image Processing" ]
summary: "파이썬의 주요 이미지 처리 라이브러리인 OpenCV, PIL, PyTorch에서 이미지를 다루는 방법과 타입의 차이점을 알아보자."
thumbnail: '../common.png'
---

# 파이썬 라이브러리별 이미지 타입 비교

최근 회사에서 이미지 AI 프로젝트를 진행하면서 이미지 처리에 대해 깊이 있게 공부하고 있다.
이미지 처리를 할 때 다양한 파이썬 라이브러리를 사용하게 되는데,
특히 각 라이브러리에서 사용하는 이미지 타입에 대해 헷갈리는 부분들이 있어 이를 정리해보려고 한다.

## 주요 이미지 처리 라이브러리 비교

Python 에서 널리 사용되는 세 가지 주요 이미지 처리 라이브러리

1. OpenCV (cv2)
2. Pillow (PIL)
3. PyTorch (torchvision)

```python
import cv2
import torchvision.transforms as transforms
from PIL import Image

# PIL 
pil_image = Image.open("./images/like_lenna224.png")

# PIL - 이미지의 크기와 타입을 출력합니다.
print(pil_image.size)  # (224, 224)
print(type(pil_image))  # <class 'PIL.PngImagePlugin.PngImageFile'>

# PIL - 이미지를 PyTorch 텐서로 변환합니다.
pil_image_tensor = transforms.ToTensor()(pil_image)
print(pil_image_tensor.shape)  # torch.Size([3, 224, 224])
print(pil_image_tensor[0][223][223]) # tensor(0.5804)

# OpenCV
image = cv2.imread("./images/like_lenna224.png", cv2.IMREAD_COLOR)

# Pytorch - OpenCV 이미지를 PyTorch 텐서로 변환.
tensor = transforms.ToTensor()(image)
print(tensor.shape) # torch.Size([3, 224, 224])
print(tensor[2][223][223]) # tensor(0.5804)

# Pytorch - 이미지의 크기와 타입 출력
print(image.shape)  # (224, 224, 3)
print(type(image))  # <class 'numpy.ndarray'>

# OpenCV - 이미지 리사이징 (너비 100, 높이 50).
resized = cv2.resize(image, (100, 50))  # width 100 height 50 channel 3
print(resized.shape)  # (50, 100, 3)

# OpenCV - 리사이즈된 이미지의 특정 픽셀 값을 출력합니다.
print(resized[49][99][2]) # 148
print(resized[49:50, 99, 2]) # [148]
```

위 코드는 각 라이브러리를 사용하여 이미지를 열고, 크기를 확인하고, 변환하는 과정이다.

## 라이브러리별 이미지 표현 비교

각 라이브러리의 이미지 표현 방식을 비교해보면 다음과 같다.

| 특성      | PIL     | cv2 (OpenCV) | tensor (PyTorch) |
|---------|---------|--------------|------------------|
| 크기 속성   | .size   | .shape       | .size() / .shape |
| 차원 순서   | (w, h)  | (h, w, c)    | (c, h, w)        |
| 데이터 타입  | uint8   | uint8        | float32          |
| 픽셀 값 범위 | 0 - 255 | 0 - 255      | 0 - 1            |
| 색상 순서   | RGB     | BGR          | RGB              |

## 주요 용어 정리

- 해상도: 이미지가 보유하고 있는 픽셀의 양. 예: 1920 * 1080
    - 설명: 이미지의 상세도를 나타내며, 숫자가 클수록 더 선명한 이미지를 의미
- PPI (Pixels Per Inch): 인치당 픽셀 수
    - 설명: 이미지의 밀도를 나타내며, 주로 출력물의 품질과 관련
- 손실 압축: JPEG와 같이 이미지 품질을 일부 희생하여 파일 크기를 줄이는 압축 방식
    - 설명: 파일 크기를 크게 줄일 수 있지만, 반복적인 압축 시 품질 저하가 누적
- 무손실 압축: PNG와 같이 이미지 품질을 유지하면서 파일 크기를 줄이는 압축 방식
    - 설명: 원본 이미지의 모든 정보를 보존하지만, 압축률이 상대적으로 낮다.
- 선형 필터: 가우시안 필터와 같이 주변 픽셀들의 가중 평균을 사용하는 필터
    - 설명: 노이즈 제거나 이미지 부드럽게 만들기에 효과적
- 비선형 필터: 중앙값 필터와 같이 픽셀 값의 순서에 기반한 필터
    - 설명: 엣지를 보존하면서 노이즈를 제거하는 데 효과적

## 결론

이미지를 읽을 때 RGB, BGR 이 헷갈리는 경우가 있었는데 opencv 만 BGR 로 읽는다는 것을 알게 되었다.
