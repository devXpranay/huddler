import { GoogleMeet, Zoom } from "./platforms";


// An event bridge will trigger the start function

async function start(meetingUrl: string): Promise<void> {
    try {
        switch (meetingUrl) {
            case "google-meet":
                const googleMeet = new GoogleMeet();
                await googleMeet.joinMeeting(meetingUrl);
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

