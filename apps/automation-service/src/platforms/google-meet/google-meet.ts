import { By, until } from "selenium-webdriver";
import { Bot } from "../../bot";
import { GOOGLE_MEET_CONSTANTS } from "./constants";
import { JS_SCRIPTS } from "../../constants";
import WebSocket from "ws";

export class GoogleMeet extends Bot {
    public async joinMeeting(meetingUrl: string): Promise<void> {
        try {
            await this.openUrl(meetingUrl);
            console.log("opened url")
            await this.ClickGotIt()
            console.log("clicked got it popup")
            // await this.toggleCamAndMic()
            // removed for docker
            const nameInput = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.YOUR_NAME_INPUT_XPATH);
            nameInput?.sendKeys("Huddler")
            console.log("entered bot name")
            const joinButton = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.JOIN_BUTTON_XPATH);
            await joinButton?.click();
            const ws = await this.connectToWS()
            console.log("clicked on join meet")
            await this.MeetKeepsYouSafeGotIt()
            console.log("monitoring participants && recording the meet")
            await Promise.all([
                this.startRecording(),
                this.monitorParticipantsAndLeaveMeeting()
            ])
            await this.driver?.sleep(12000)
            ws.close();
            console.log("Leaving the meet")
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

    private async monitorParticipantsAndLeaveMeeting(): Promise<void> {
        try {
            const ele = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.PARTICIPANTS_COUNTER_XPATH)
            if (ele) {
                await this.driver?.wait(until.elementTextIs(ele, "1"));
                console.log("Number of participants remaining 1")
                await this.stopRecording()

                const leaveButton = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.LEAVE_BUTTON_XPATH);
                await leaveButton?.click()
                console.log("Left the meet")
            }

        } catch (err) {
            console.error("Error monitoring participants", err);
        }
    }

    private async toggleCamAndMic(): Promise<void> {
        const mic = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.MIC_XPATH)
        const cam = await this.findElementXPath(GOOGLE_MEET_CONSTANTS.CAMERA_XPATH)
        console.log("mic and cam found")
        if (mic && cam) {
            console.log("clicking on mic")
            await this.clickElement(mic)
            // console.log("clicking on cam")
            // await this.clickElement(cam)
        } else {
            throw new Error("cannot find mic and/or cam")
        }
        console.log("clicked on both")
    }

    private async startRecording() {
        await this.driver?.executeScript(JS_SCRIPTS.SCREEN_CAPTURE_AND_SEND_BLOB)
    }

    private async stopRecording() {
        await this.driver?.executeScript(JS_SCRIPTS.STOP_RECORDING)
    }

    private async connectToWS(): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            try {
                const ws = new WebSocket("ws://localhost:8000");
    
                ws.on('open', () => {
                    console.log("Connected to WebSocket server");
                    resolve(ws);
                });
    
                ws.on('error', (error: any) => {
                    console.error("WebSocket error:", error);
                    reject(error);
                });
    
                ws.on('close', () => {
                    console.log("Disconnected from WebSocket server");
                });
    
                ws.on('message', (data: string) => {
                    console.log("Received message:", data);
                });
            } catch (error) {
                console.error("Error connecting to WebSocket:", error);
                reject(error);
            }
        });
    }
}