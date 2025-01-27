import { Bot } from "../../bot";

export class GoogleMeet extends Bot {
    public async joinMeeting(meetingUrl: string): Promise<void> {
        try {
            await this.openUrl(meetingUrl);
            await this.switchToIframe('iframe');
            const joinButton = await this.findElementXPath('//span[contains(text(), "Join now")]');
            await joinButton?.click();
        } catch (error) {
            console.error("Error joining meeting", error);
        }
    }
}