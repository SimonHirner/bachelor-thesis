#!/bin/sh

# Make scripts executable
chmod a+x ./**/*.sh

# Change directory
cd ./kube || exit

# Connect with minikube docker client
eval "$(minikube docker-env)"

# Stop and delete old minikube sessions
sh ./stop-minikube.sh

# Start new container
minikube start --driver virtualbox --memory 5120 --cpus 3 --disk-size 30000

# Deploy Contact Microservice
./deploy-contact-microservice.sh

# Deploy Interaction Microservice
#./deploy-interaction-microservice.sh

# Deploy Opportunity Microservice
#./deploy-opportunity-microservice.sh

# Deploy CRM Frontend
./deploy-crm-frontend.sh