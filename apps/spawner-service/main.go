package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
	"time"

	redis "github.com/devXpranay/huddler/lib/common/queue"
	"github.com/google/uuid"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize Redis
	if err := redis.InitRedis(); err != nil {
		log.Fatalf("Error initializing Redis: %v", err)
	}

	// Handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-sigChan
		log.Println("Received shutdown signal, exiting...")
		cancel()
		os.Exit(0)
	}()

	for {
		select {
		case <-ctx.Done():
			return
		default:
			processQueue(ctx)
			time.Sleep(500 * time.Millisecond)
		}
	}
}

func processQueue(ctx context.Context) {
	s, err := redis.PopTaskFromQueue(ctx, "worker_queue")
	if err != nil {
		log.Printf("Error popping from queue: %v", err)
		return
	}

	log.Println("Processing task:", s)

	taskMap := make(map[string]string)
	if err := json.Unmarshal([]byte(s), &taskMap); err != nil {
		log.Printf("Error unmarshalling task: %v", err)
		return
	}

	meetURL := taskMap["meet_url"]
	botName := taskMap["bot_name"]
	meetType := taskMap["meet_type"]

	go runDockerContainer(meetURL, botName, meetType)
}

func runDockerContainer(meetURL, botName, meetType string) {
	containerName := fmt.Sprintf("bot-%s", uuid.NewString())

	cmdStr := fmt.Sprintf(`docker run --name %s -e MEETING_URL="%s" -e BOT_NAME="%s" -e MEET_TYPE=%s --network huddler_network --env-file .env bot1`,
		containerName, meetURL, botName, meetType)

	log.Println("Running command:", cmdStr)

	cmd := exec.Command("sh", "-c", cmdStr)
	cmdOutput, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("Error running command: %v", err)
	}

	log.Println("Command output:", string(cmdOutput))
}
