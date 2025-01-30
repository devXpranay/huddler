package routes

import (
	"github.com/devXpranay/huddler/apps/api-service/handlers"
	"github.com/gin-gonic/gin"
)

func SetBotRoutes(router *gin.RouterGroup) {
	botRoute := router.Group("/bot")
	{
		botRoute.POST("/join", handlers.BotJoinMeeting)
	}
}
