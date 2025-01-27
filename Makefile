# General settings
APP_NAME = huddler-ai
GO_CMD = go
DOCKER_CMD = docker
TERRAFORM_CMD = terraform
K8S_CMD = kubectl

# Service names
API_SERVER_SERVICE = api-server
TRANSCODER_SERVICE = transcoder-service
TRANSCRIBER_SERVICE = transcriber-service
SUMMARIZER_SERVICE = summarizer-service
AUTOMATION_SERVICE = autmoation-service

# Directories
GO_SRC_DIR = apps
LIBS_DIR = libs
CONFIGS_DIR = configs
INFRA_DIR = infra

# Build Go binaries for all Go services
build-go:
	$(GO_CMD) build ./$(GO_SRC_DIR)/$(API_SERVER_SERVICE)/...
	$(GO_CMD) build ./$(GO_SRC_DIR)/$(TRANSCODER_SERVICE)/...
	$(GO_CMD) build ./$(GO_SRC_DIR)/$(SUMMARIZER_SERVICE)/...

# Install Go dependencies
install-go-deps:
	$(GO_CMD) mod tidy

# Build JavaScript services (Selenium and Playwright)
build-js:
	cd $(GO_SRC_DIR)/$(AUTOMATION_SERVICE) && npm install

# Docker build for each service
docker-build:
	$(DOCKER_CMD) build -t $(API_SERVER_SERVICE) ./$(GO_SRC_DIR)/$(API_SERVER_SERVICE)/
	$(DOCKER_CMD) build -t $(TRANSCODER_SERVICE) ./$(GO_SRC_DIR)/$(TRANSCODER_SERVICE)/
	$(DOCKER_CMD) build -t $(SELENIUM_SERVICE) ./$(GO_SRC_DIR)/$(SELENIUM_SERVICE)/
	$(DOCKER_CMD) build -t $(PLAYWRIGHT_SERVICE) ./$(GO_SRC_DIR)/$(PLAYWRIGHT_SERVICE)/

# Run unit tests for Go services
test-go:
	$(GO_CMD) test ./$(GO_SRC_DIR)/$(API_SERVER_SERVICE)/...
	$(GO_CMD) test ./$(GO_SRC_DIR)/$(TRANSCODER_SERVICE)/...
	$(GO_CMD) test ./$(GO_SRC_DIR)/$(SUMMARIZER_SERVICE)/...

# Run Selenium/Playwright tests
test-js:
	cd $(GO_SRC_DIR)/$(SELENIUM_SERVICE) && npm test
	cd $(GO_SRC_DIR)/$(PLAYWRIGHT_SERVICE) && npm test

# Run tests for all services
test: test-go test-js

# Deploy using Kubernetes
deploy-k8s:
	$(K8S_CMD) apply -f $(INFRA_DIR)/k8s/

# Terraform setup (Optional)
deploy-terraform:
	$(TERRAFORM_CMD) init $(INFRA_DIR)/terraform
	$(TERRAFORM_CMD) apply $(INFRA_DIR)/terraform

# Initialize database
init-db:
	./scripts/init-db.sh

# Start development environment (Local setup)
dev:
	# Start Go services locally
	go run ./$(GO_SRC_DIR)/$(API_SERVER_SERVICE)/...
	go run ./$(GO_SRC_DIR)/$(TRANSCODER_SERVICE)/...
	# Start Selenium/Playwright services
	cd $(GO_SRC_DIR)/$(SELENIUM_SERVICE) && npm start
	cd $(GO_SRC_DIR)/$(PLAYWRIGHT_SERVICE) && npm start

# Clean up Docker images and containers
clean:
	$(DOCKER_CMD) rmi $(API_SERVER_SERVICE) $(TRANSCODER_SERVICE) $(SELENIUM_SERVICE) $(PLAYWRIGHT_SERVICE)
	$(DOCKER_CMD) system prune -f

# Centralized command to build everything
build: build-go build-js docker-build

# Centralized command to deploy everything
deploy: deploy-k8s deploy-terraform

# Centralized command to clean everything
clean-all: clean
	rm -rf $(GO_SRC_DIR)/$(API_SERVER_SERVICE)/bin
	rm -rf $(GO_SRC_DIR)/$(TRANSCODER_SERVICE)/bin

.PHONY: build install-go-deps docker-build test-go test-js test dev deploy-k8s deploy-terraform init-db clean build deploy clean-all
