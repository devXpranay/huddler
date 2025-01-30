import { By, until } from "selenium-webdriver";
import { Bot } from "../../bot";
import { GOOGLE_MEET_CONSTANTS } from "./constants";

export class GoogleMeet extends Bot {
    public async joinMeeting(meetingUrl: string): Promise<void> {
        try {
            await this.openUrl(meetingUrl);
            await this.ClickGotIt()
            await this.toggleCamAndMic()
            const nameInput = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.YOUR_NAME_INPUT_XPATH);
            nameInput?.sendKeys("Huddler")
            const joinButton = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.JOIN_BUTTON_XPATH);
            await joinButton?.click();
            this.MeetKeepsYouSafeGotIt()
            await this.monitorParticipants()
            console.log("Leaving the meet")
            const leaveButton = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.LEAVE_BUTTON_XPATH);
            await leaveButton?.click()
            console.log("Left the meet")
        } catch (error) {
            console.error("Error joining meeting", error);
        }
        finally {
            console.log("quitting driver")
            await this.driver?.quit()
            console.log("driver quit gracefully")
        }
    }

    private async ClickGotIt(): Promise<void> {
        const ele = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.SIGNIN_BTN_XPATH)
        if (ele) {
            this.clickElement(ele)
        }
    }

    private async MeetKeepsYouSafeGotIt(): Promise<void> {
        const ele = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.MEET_KEEPS_YOU_SAFE_GOT_IT_XPATH)
        if (ele) {
            this.clickElement(ele)
        }
    }

    private async monitorParticipants(): Promise<void> {
        const ele = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.PARTICIPANTS_COUNTER_XPATH)
        if (ele) {
            await this.driver?.wait(until.elementTextIs(ele, "1"));
            console.log("Number of participants remaining 1")
        } else {
            throw new Error("Participants counter element not found");
        }
    }

    private async toggleCamAndMic(): Promise<void> {
        const mic = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.MIC_XPATH)
        const cam = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.CAMERA_XPATH)
        console.log("mic and cam found")
        if (mic && cam) {
            console.log("clicking on mic")
            await this.clickElement(mic)
            console.log("clicking on cam")
            await this.clickElement(cam)
        } else {
            throw new Error("cannot find mic and/or cam")
        }
        console.log("clicked on both")
    }
}