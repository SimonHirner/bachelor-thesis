#!/bin/sh

# Build image from dockerfile
docker build -f ../../crm-frontend/Dockerfile -t crm-frontend:latest ../../crm-frontend

# Deploy CRM Frontend
kubectl apply -f ../../kubernetes/crm-frontend.yaml
kubectl rollout status deployments/crm-frontend