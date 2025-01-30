package main

import (
	"fmt"

	"github.com/devXpranay/huddler/apps/api-service/routes"
	redis "github.com/devXpranay/huddler/lib/common/queue"
	"github.com/gin-gonic/gin"
)

func main() {
	// initialize db connection
	// initialize redis to push messages to queue
	// define routes
	err := redis.InitRedis()
	if err != nil {
		fmt.Printf("error initializing redis %v", err)
	}
	r := gin.Default()

	v1Router := r.Group("/api/v1")
	setRoutes(v1Router)

	r.Run()
}

func setRoutes(router *gin.RouterGroup) {
	routes.SetAuthRoutes(router)
	routes.SetUserRoutes(router)
	routes.SetBotRoutes(router)
}
