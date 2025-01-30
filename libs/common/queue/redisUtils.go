package queue

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	client *redis.Client
	ctx    = context.Background()
)

func InitRedis() error {
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "password",
		DB:       0,
	})

	pong, err := client.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
		return err
	}
	fmt.Println("Connected to Redis:", pong)

	return nil
}

func PushTaskToQueue(ctx context.Context, queue string, message string) error {
	return client.LPush(ctx, queue, message).Err()
}

func PopTaskFromQueue(ctx context.Context, queueName string) (any, error) {
	res, err := client.BRPop(ctx, 0*time.Second, queueName).Result()
	if err != nil {
		return nil, err
	}

	return res[1], nil
}
