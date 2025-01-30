package handlers

import (
	"encoding/json"
	"net/http"

	redis "github.com/devXpranay/huddler/lib/common/queue"
	"github.com/gin-gonic/gin"
)

type ReqBody struct {
	MeetURL string `json:"meet_url" binding:"required" example:"https://meet.google.com/abc-xyz" validate:"required,url"`
	BotName string `json:"bot_name" binding:"required" example:"bot1" validate:"required"`
}

func BotJoinMeeting(c *gin.Context) {
	var req ReqBody

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task, err := json.Marshal(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal request"})
		return
	}

	err = redis.PushTaskToQueue(c.Request.Context(), "worker_queue", string(task))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to push task to queue"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Task added to queue"})
}
