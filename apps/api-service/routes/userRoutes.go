package routes

import (
	"github.com/devXpranay/huddler/apps/api-service/handlers"
	"github.com/gin-gonic/gin"
)

func SetUserRoutes(router *gin.RouterGroup) {
	userRoute := router.Group("/user")
	{
		userRoute.GET("/meetings", handlers.UserGetAllMeetings)
		userRoute.GET("/meeting/:meetingId", handlers.UserGetMeetingById)
	}
}
