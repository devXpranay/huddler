import { GoogleMeet, Zoom } from "./platforms";
import { InitializeWebSocketServer } from "./ws/ws";
import { createClient } from "redis";

const redisClient = createClient({
    url: "redis://redis:6379",
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Error connecting to Redis", error);
        process.exit(1);
    }
}

const meetingUrl = process.env.MEETING_URL;
const meetType = process.env.MEET_TYPE;
const botName = process.env.BOT_NAME;

if (!meetingUrl || !meetType || !botName) {
    console.error("Missing required environment variables");
    process.exit(1);
}

async function start(meetingUrl: string, meetType: string, botName: string): Promise<void> {
    try {
        switch (meetType) {
            case "google":
                const webSocketServer = InitializeWebSocketServer(8000);
                const googleMeet = new GoogleMeet();
                await googleMeet.joinMeeting(meetingUrl, botName);
                webSocketServer.close();
                break;
            case "zoom":
                const zoom = new Zoom();
                await zoom.joinMeeting(meetingUrl);
                break;
            default:
                console.error("Unsupported meeting platform");
        }
    } catch (error) {
        console.error("Error joining meeting", error);
    }
}

start(meetingUrl, meetType, botName);

