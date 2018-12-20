---
title: HPA
date: 2018-12-20
categories: 
- CS
- k8s
- hpa
tag: 
- k8s 
- hpa
---

HPA自动水平伸缩，可以根据资源使用率进行自动扩容、缩容pod的数量。根据 CPU 使用率或自定义 metrics 自动扩展 Pod 数量（支持 replication controller、deployment）；k8s1.6版本之前是通过kubelet来获取监控指标，1.6版本之后是通过api server、heapster或者kube-aggregator来获取监控指标。

### Metrics支持

根据不同版本的API中，HPA autoscale时靠以下指标来判断资源使用率： 
* autoscaling/v1: CPU
* autoscaling/v2alpha1 
    * 内存
    * 自定义metrics
    * 多metrics组合: 根据每个metric的值计算出scale的值，并将最大的那个值作为扩容的最终结果

### 使用示例
k8s环境基于k8s 1.9，仅使用autoscaling/v1 版本API，注意确保k8s 集群插件kubedns 和 heapster 工作正常。

```
kubectl top node   # 检测heapster是否正常
```

```
kubectl create -f deployment.yaml

apiVersion: apps/v1beta2
kind: Deployment
metadata:
  name: dw-gateway
  labels:
    app: dw-gateway
spec:
  template:
    metadata:
      labels:
        app: dw-gateway
    spec:
      containers:
        - name: dw-gateway
          image: xuntian/dw-gateway
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 80
              protocol: TCP
          livenessProbe:
            httpGet:
              path: /test
              port: http
          readinessProbe:
            httpGet:
              path: /test
              port: http
          resources:
            limits:
              cpu: 500m
              memory: 500Mi
            requests:
              cpu: 200m
              memory: 500Mi
```

```
kubectl create -f hpa.yaml

apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: dw-gateway-master-zh-cn
  namespace: default
spec:
  maxReplicas: 10
  minReplicas: 1
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: dw-gateway-master-zh-cn
  targetCPUUtilizationPercentage: 30
```

### 结果
利用jmeter或其他工具对pod进行压力测试
```
# kubectl get hpa -o wide
NAME                      REFERENCE                            TARGETS    MINPODS   MAXPODS   REPLICAS   AGE
dw-gateway-master-zh-cn   Deployment/dw-gateway-master-zh-cn   0% / 30%   1         10        1          17h

# kubectl get hpa -o wide
NAME                      REFERENCE                            TARGETS     MINPODS   MAXPODS   REPLICAS   AGE
dw-gateway-master-zh-cn   Deployment/dw-gateway-master-zh-cn   61% / 30%   1         10        1 

# kubectl get hpa -o wide
NAME                      REFERENCE                            TARGETS     MINPODS   MAXPODS   REPLICAS   AGE
dw-gateway-master-zh-cn   Deployment/dw-gateway-master-zh-cn   61% / 30%   1         10        3          17h

# kubectl get hpa -o wide
NAME                      REFERENCE                            TARGETS     MINPODS   MAXPODS   REPLICAS   AGE
dw-gateway-master-zh-cn   Deployment/dw-gateway-master-zh-cn   36% / 30%   1         10        8          17h
```

> 停止压测，REPLICAS的数量将逐渐降为1