---
date: '2024-08-05'
title: '파이썬 라이브러리별 이미지 타입 비교'
tags: ["AI", "Python", "Image Processing"]
summary: "파이썬의 주요 이미지 처리 라이브러리인 OpenCV, PIL, PyTorch에서 이미지를 다루는 방법과 타입의 차이점을 알아봅니다."
thumbnail: '../common.png'
---

# 파이썬 라이브러리별 이미지 타입 비교

최근 회사에서 이미지 AI 프로젝트를 진행하면서 이미지 처리에 대해 깊이 있게 공부하고 있습니다. 이미지 처리를 할 때 다양한 파이썬 라이브러리를 사용하게 되는데, 특히 각 라이브러리에서 사용하는 이미지 타입에 대해 헷갈리는 부분들이 있어 이를 정리해보고자 합니다.

이미지 처리는 컴퓨터 비전, 머신 러닝, 그리고 다양한 응용 분야에서 중요한 역할을 합니다. 그러나 각 라이브러리마다 이미지를 다루는 방식이 조금씩 다르기 때문에, 이들을 올바르게 이해하고 사용하는 것이 중요합니다.

## 주요 이미지 처리 라이브러리 비교

이 글에서는 Python에서 널리 사용되는 세 가지 주요 이미지 처리 라이브러리를 비교해보겠습니다:
1. OpenCV (cv2)
2. Pillow (PIL)
3. PyTorch (torchvision)

각 라이브러리의 특징과 이미지를 다루는 방식을 코드 예제와 함께 살펴보겠습니다.

```python
# 필요한 라이브러리를 임포트합니다.
import cv2
import torchvision.transforms as transforms
from PIL import Image

# PIL을 사용하여 이미지를 엽니다.
pil_image = Image.open("./images/like_lenna224.png")

# 이미지의 크기와 타입을 출력합니다.
print(pil_image.size)  # (224, 224)
print(type(pil_image))  # <class 'PIL.PngImagePlugin.PngImageFile'>

# PIL 이미지를 PyTorch 텐서로 변환합니다.
pil_image_tensor = transforms.ToTensor()(pil_image)
print(pil_image_tensor.shape)  # torch.Size([3, 224, 224])
print(pil_image_tensor[0][223][223]) # tensor(0.5804)

# OpenCV를 사용하여 이미지를 읽습니다.
image = cv2.imread("./images/like_lenna224.png", cv2.IMREAD_COLOR)

# OpenCV 이미지를 PyTorch 텐서로 변환합니다.
tensor = transforms.ToTensor()(image)
print(tensor.shape) # torch.Size([3, 224, 224])
print(tensor[2][223][223]) # tensor(0.5804)

# OpenCV 이미지의 크기와 타입을 출력합니다.
print(image.shape)  # (224, 224, 3)
print(type(image))  # <class 'numpy.ndarray'>

# 이미지를 리사이징합니다 (너비 100, 높이 50).
resized = cv2.resize(image, (100, 50))  # width 100 height 50 channel 3
print(resized.shape)  # (50, 100, 3)

# 리사이즈된 이미지의 특정 픽셀 값을 출력합니다.
print(resized[49][99][2]) # 148
print(resized[49:50, 99, 2]) # [148]

# 리사이즈된 이미지를 화면에 표시합니다.
cv2.imshow("Resized Image", resized)

# 키 입력을 기다립니다.
cv2.waitKey(0)

# 모든 창을 닫습니다.
cv2.destroyAllWindows()
```

위 코드는 각 라이브러리를 사용하여 이미지를 열고, 크기를 확인하고, 변환하는 과정을 보여줍니다. 특히 주목할 점은 각 라이브러리가 이미지를 다루는 방식의 차이입니다.

## 라이브러리별 이미지 표현 비교

각 라이브러리의 이미지 표현 방식을 비교해보면 다음과 같습니다:

| 특성     | PIL     | cv2 (OpenCV) | tensor (PyTorch)  |
|---------|------------|------------------|------------------|
| 크기 속성   | .size   | .shape    | .size() / .shape |
| 차원 순서  | (w, h)  | (h, w, c) | (c, h, w)       |
| 데이터 타입   | uint8   | uint8      | float32          |
| 픽셀 값 범위 | 0 - 255 | 0 - 255   | 0 - 1           |
| 색상 순서   | RGB     | BGR         | RGB              |

- PIL: 이미지 처리를 위한 파이썬 이미징 라이브러리로, 간단하고 직관적인 API를 제공합니다.
- OpenCV (cv2): 컴퓨터 비전을 위한 강력한 라이브러리로, 많은 이미지 처리 및 분석 기능을 제공합니다.
- PyTorch (tensor): 딥러닝을 위한 라이브러리로, GPU 가속을 지원하며 텐서 형태로 이미지를 다룹니다.

## 주요 용어 정리

이미지 처리를 공부하면서 알아두면 좋을 주요 용어들을 정리해보았습니다:

- 해상도: 이미지가 보유하고 있는 픽셀의 양. 예: 1920 * 1080
    - 설명: 이미지의 상세도를 나타내며, 숫자가 클수록 더 선명한 이미지를 의미합니다.
- PPI (Pixels Per Inch): 인치당 픽셀 수
    - 설명: 이미지의 밀도를 나타내며, 주로 출력물의 품질과 관련이 있습니다.
- 손실 압축: JPEG와 같이 이미지 품질을 일부 희생하여 파일 크기를 줄이는 압축 방식
    - 설명: 파일 크기를 크게 줄일 수 있지만, 반복적인 압축 시 품질 저하가 누적됩니다.
- 무손실 압축: PNG와 같이 이미지 품질을 유지하면서 파일 크기를 줄이는 압축 방식
    - 설명: 원본 이미지의 모든 정보를 보존하지만, 압축률이 상대적으로 낮습니다.
- 선형 필터: 가우시안 필터와 같이 주변 픽셀들의 가중 평균을 사용하는 필터
    - 설명: 노이즈 제거나 이미지 부드럽게 만들기에 효과적입니다.
- 비선형 필터: 중앙값 필터와 같이 픽셀 값의 순서에 기반한 필터
    - 설명: 엣지를 보존하면서 노이즈를 제거하는 데 효과적입니다.

## 결론

이미지 처리에 사용되는 주요 파이썬 라이브러리들은 각각의 특징과 장단점이 있습니다. 
회사 프로젝트 코드를 보면 하나만 사용하는 경우는 잘 없었고 전부 사용하는 경우가 대부분이었습니다.
그래서 각 라이브러리의 특징을 잘 이해하고, 상황에 맞게 적절히 사용하는 것이 중요하다고 생각합니다.
