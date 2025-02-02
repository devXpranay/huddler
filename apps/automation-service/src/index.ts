import { GoogleMeet, Zoom } from "./platforms";
import { InitializeWebSocketServer } from "./ws/ws";


// As soon as redis queue populates, it will trigger something, which will start this service which is dockerized. 
// Meaning each meeting will be joined by a new container. 

async function start(meetingUrl: string): Promise<void> {
    try {
        switch (meetingUrl) {
            case "https://meet.google.com/whn-wwgj-pnh":
                const webSocketServer = InitializeWebSocketServer(8000);
                const googleMeet = new GoogleMeet();
                await googleMeet.joinMeeting(meetingUrl);
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

start("https://meet.google.com/whn-wwgj-pnh");

