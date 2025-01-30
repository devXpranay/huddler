package routes

import (
	"github.com/devXpranay/huddler/apps/api-service/handlers"
	"github.com/gin-gonic/gin"
)

func SetAuthRoutes(router *gin.RouterGroup) {
	authRoute := router.Group("/auth")
	{
		authRoute.POST("/signup", handlers.AuthSignup)
		authRoute.POST("/login", handlers.AuthLogin)
	}
}
