# YOLOv2 Implementation

https://github.com/pablo-reyes8/yolov2-implementation

![Repo size](https://img.shields.io/github/repo-size/pablo-reyes8/yolov2-implementation)
![Last commit](https://img.shields.io/github/last-commit/pablo-reyes8/yolov2-implementation)
![Open issues](https://img.shields.io/github/issues/pablo-reyes8/yolov2-implementation)
![Contributors](https://img.shields.io/github/contributors/pablo-reyes8/yolov2-implementation)
![Forks](https://img.shields.io/github/forks/pablo-reyes8/yolov2-implementation?style=social)
![Stars](https://img.shields.io/github/stars/pablo-reyes8/yolov2-implementation?style=social)


## Overview
This repository delivers a **comprehensive, modular, and research-friendly implementation of YOLOv2 (You Only Look Once, version 2)** in PyTorch, powered by the **Darknet-19 backbone**.  

YOLOv2 marked a turning point in real-time object detection, balancing speed and accuracy in ways that reshaped the field. With its introduction of anchor boxes, passthrough connections, and a streamlined architecture, YOLOv2 became a foundation upon which later detectors (YOLOv3, YOLOv4, and beyond) were built.  

Our implementation aims to capture not only the original design but also to present it in a **clean, transparent, and fully modular structure**, making it accessible for:
- **Researchers**, who want to experiment with YOLOv2 as a baseline or extend it to new ideas.  
- **Students and educators**, seeking a readable and didactic PyTorch reimplementation to understand the internals of modern detectors.  
- **Practitioners**, who may want to adapt YOLOv2 to custom datasets, test mAP performance, or benchmark lightweight models.  

The repository covers **every stage of the detection pipeline**, from data preparation to evaluation and visualization:  
- Dataset loading and preprocessing with PASCAL VOC 2007/2012 protocols.  
- Letterbox resizing that preserves aspect ratio and adjusts ground truth boxes accordingly.  
- Darknet-19 backbone with bottleneck and passthrough layers for multi-scale features.  
- YOLOv2 detection head with decoding utilities to map raw logits into meaningful bounding boxes.  
- Custom YOLOv2 loss, faithful to the original (coordinate, confidence, class terms).  
- Postprocessing utilities including Non-Maximum Suppression (NMS).  
- Training loop with gradient accumulation, mixed precision (AMP), and checkpointing.  
- Evaluation with VOC-style mAP@0.5 (VOC07 11-point metric and continuous AP).  
- Visualization tools to overlay bounding boxes, class labels, and confidence scores on images.  
- A suite of unit tests ensuring correctness, reproducibility, and reliability.
  

The project is designed for **clarity, modularity, and research reproducibility**. It is a solid reference for understanding the YOLOv2 architecture, training it on VOC, or extending it to new datasets.

---

## Repository Structure
```plaintext

yolov2-implementation/
│
├─ src/
│  ├─ data/        # Datasets, transforms, encoding
│  ├─ models/      # Darknet-19, YOLOv2 body, layers
│  ├─ heads/       # YOLOv2 head, decoding, postprocess
│  ├─ losses/      # YOLOv2 loss function
│  ├─ inference/   # Forward inference + NMS
│  ├─ metrics/     # VOC mAP evaluation
│  ├─ train/       # Training loops and utilities
│  └─ tests/       # Unit tests (pytest)
│
├─ scripts/        # User-facing scripts (train, eval, visualize, demo)
│
├─ Notebooks/      # A full implementation in one jupytern notebook
│
├─ requirements.txt
├─ README.md
├─ LICENSE

```

---

## Model Architecture
YOLOv2 builds on the Darknet-19 backbone and introduces:
- **Darknet-19**: 19 convolutional layers with batch normalization and leaky ReLU.
- **Passthrough layer**: connects higher-resolution features (26x26) to the detection layer via space-to-depth transform.
- **Detection head**: predicts bounding boxes, objectness, and class probabilities directly from feature maps.
- **Anchor boxes**: predefined priors that allow YOLOv2 to generalize to different object shapes.

Input: 416x416 RGB image  
Output: (B, A*(5+C), 13, 13) tensor, where A=anchors, C=classes

---

## Training
The repository includes scripts to train YOLOv2 on the PASCAL VOC datasets (2007+2012 for train/val, 2007 test).  
Check the **train.py** file to see how the training loop is implemented, including support for gradient accumulation, mixed precision (AMP), and checkpoint saving/resume.

---

## Evaluation
An evaluation pipeline is provided to compute mAP@0.5 on VOC datasets.  
See the **eval.py** file for details on how detections are collected, NMS is applied, and AP per class is reported.

---

## Visualization
Visualization utilities allow plotting detections with bounding boxes, class labels, and confidence scores.  
Refer to **visualize.py** for usage examples and customization.

---


## Impact of YOLOv2
YOLOv2 was a landmark in real-time object detection:
- Achieved **state-of-the-art accuracy in 2017** with real-time inference.
- Introduced anchor boxes to the YOLO family.
- Balanced speed and accuracy, enabling deployment on constrained hardware.
- Influenced subsequent models like YOLOv3, YOLOv4, and beyond.
- Still relevant for educational, lightweight, and baseline benchmarking purposes.


---


## References
- Redmon, J. and Farhadi, A. (2017). YOLO9000: Better, Faster, Stronger. CVPR.
- Original Darknet implementation: https://pjreddie.com/darknet/yolo/
- PyTorch: https://pytorch.org

---

## License
This project is released under the **MIT License**. You are free to use, modify, and distribute it for research and commercial purposes, provided that proper attribution is given...



