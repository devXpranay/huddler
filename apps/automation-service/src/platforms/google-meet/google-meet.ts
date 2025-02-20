import { By, until } from "selenium-webdriver";
import { Bot } from "../../bot";
import { GOOGLE_MEET_CONSTANTS, GOOGLE_MEET_CONSTANTS_ALT } from "./constants";
import { JS_SCRIPTS } from "../../constants";

export class GoogleMeet extends Bot {
    public async joinMeeting(meetingUrl: string, botName: string): Promise<void> {
        try {
            await this.openUrl(meetingUrl);
            console.log("opened url");
            await this.ClickGotIt();
            console.log("clicked got it popup");

            const nameInput = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.YOUR_NAME_XPATH);
            await nameInput?.sendKeys(botName);
            console.log("entered bot name");

            const joinButton = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.ASK_TO_JOIN_XPATH);
            await joinButton?.click();
            console.log("clicked on join meet");

            await this.MeetKeepsYouSafeGotIt();

            console.log("Starting recording and monitoring participants...");

            await Promise.all([this.startRecording(), this.monitorParticipantsAndLeave()]);
            console.log("Recording stopped, left the meet");
        } catch (error) {
            console.error("Error joining meeting", error);
        } finally {
            await this.driver?.sleep(11000);
            console.log("Quitting driver...");
            await this.quit();
            console.log("Driver quit gracefully");
        }
    }


    private async ClickGotIt(): Promise<void> {
        const ele = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.GOT_IT_PATH)
        if (ele) {
            await this.clickElement(ele)
        }
    }

    private async MeetKeepsYouSafeGotIt(): Promise<void> {
        const ele = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.MEET_KEEPS_YOU_SAFE_GOT_IT_XPATH)
        if (ele) {
            await this.clickElement(ele)
        }
    }

    private async monitorParticipantsAndLeave(): Promise<void> {
        try {
            const ele = await Promise.any([
                this.findElementXPath(GOOGLE_MEET_CONSTANTS.PARTICIPANTS_COUNTER_XPATH),
                this.findElementXPath(GOOGLE_MEET_CONSTANTS_ALT.PARTICIPANTS_COUNTER_XPATH)
            ]);
            console.log("ele", ele)
            if (ele) {
                await this.driver?.wait(until.elementTextIs(ele, "1"));
                console.log("Number of participants is 1, stopping recording...");

                await this.stopRecording();

                const leaveButton = await Promise.any([
                    this.findElementXPath(GOOGLE_MEET_CONSTANTS.LEAVE_BUTTON_XPATH, 5000),
                    this.findElementXPath(GOOGLE_MEET_CONSTANTS_ALT.LEAVE_BUTTON_XPATH, 5000)
                ]);

                if (leaveButton) {
                    await this.clickElement(leaveButton);
                    console.log("Left the meet");
                }
            }

        } catch (err) {
            console.error("Error monitoring participants", err);
        }
    }

    private async toggleCamAndMic(): Promise<void> {
        const mic = await Promise.any([
            this.findElementXPath(GOOGLE_MEET_CONSTANTS.MIC_XPATH, 5000),
            this.findElementXPath(GOOGLE_MEET_CONSTANTS_ALT.MIC_XPATH, 5000)
        ])
        const cam = await Promise.any([
            this.findElementXPath(GOOGLE_MEET_CONSTANTS.CAM_XPATH, 5000),
            this.findElementXPath(GOOGLE_MEET_CONSTANTS_ALT.CAM_XPATH, 5000)
        ])
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

    private async startRecording(): Promise<void> {
        console.log("Started recording...");
        await this.driver?.executeScript(JS_SCRIPTS.SCREEN_CAPTURE_AND_SEND_BLOB);
    }

    private async stopRecording(): Promise<void> {
        console.log("Stopping recording...");
        await this.driver?.executeScript(JS_SCRIPTS.STOP_RECORDING);
    }
}