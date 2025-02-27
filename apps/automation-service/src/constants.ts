export const CHROME_CONSTANTS = {
    CHROME_OPTIONS1: [
        "----user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "--disable-blink-features=AutomationControlled",
        "--use-fake-ui-for-media-stream",
        "--window-size=1920,1080",
        "--disable-notifications",
        "--auto-select-desktop-capture-source=[RECORD]",
        "--enable-usermedia-screen-capturing",
        "--allow-running-insecure-content",
        "--safebrowsing-disable-download-protection",
        "--disable-download-notification",
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-software-rasterizer',
        '--remote-debugging-port=9222',
        '--headless'
    ],
    CHROME_OPTIONS: [
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "--disable-blink-features=AutomationControlled",
        "--use-fake-ui-for-media-stream",
        "--window-size=1920,1080",
        "--disable-notifications",
        "--auto-select-desktop-capture-source=[RECORD]",
        "--enable-usermedia-screen-capturing",
        "--allow-running-insecure-content",
        "--safebrowsing-disable-download-protection",
        "--disable-download-notification",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-software-rasterizer",
        "--remote-debugging-port=9222",
        // "--headless",
        "--force-device-scale-factor=1",
        "--high-dpi-support=1",
        "--disable-low-res-tiling",
        "--enable-font-antialiasing",
        "--enable-smooth-scrolling",
        "--disable-pinch",
        "--no-first-run",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows"
    ]
    ,
    MEDIA_STREAM_OPTIONS: {
        video: {
        displaySurface: "browser",
        },
        systemAudio: "include",
        audio: false,
        preferCurrentTab: true,
    }
};

export const JS_SCRIPTS = {
    SCREEN_CAPTURE_AND_SEND_BLOB: `
        (async () => {
        const ws = new WebSocket('ws://localhost:8000');
        let wsReady = false;

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            wsReady = true;
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            wsReady = false;
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            wsReady = false;
        };

        const mediaStreamOptions = ${JSON.stringify(CHROME_CONSTANTS.MEDIA_STREAM_OPTIONS)};
        const stream = await navigator.mediaDevices.getDisplayMedia(mediaStreamOptions);

        const audioContext = new AudioContext();
        const audioEl1 = document.querySelectorAll("audio")[0];
        const audioEl2 = document.querySelectorAll("audio")[1];
        const audioEl3 = document.querySelectorAll("audio")[2];
        const audioStream1 = audioContext.createMediaStreamSource(audioEl1.srcObject)
        const audioStream2 = audioContext.createMediaStreamSource(audioEl2.srcObject)
        const audioStream3 = audioContext.createMediaStreamSource(audioEl3.srcObject)

        const dest = audioContext.createMediaStreamDestination();
        audioStream1.connect(dest)
        audioStream2.connect(dest)
        audioStream3.connect(dest)

        const combinedStream = new MediaStream([
            ...stream.getVideoTracks(),
            ...dest.stream.getAudioTracks()
        ]);

        const mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: "video/webm; codecs=vp8,opus",
            timeSlice: 10000,
            videoBitsPerSecond: 1800000,
        });

        console.log("Starting media recording...");
        mediaRecorder.start(10000);

        mediaRecorder.ondataavailable = (event) => {
            if (wsReady) {
            try {
                ws.send(event.data);
                console.log('Sent data');
            } catch (error) {
                console.error('Error sending chunk:', error);
            }
            } else {
            console.error('WebSocket is not ready to send data');
            }
        };

        mediaRecorder.onstop = () => {
            stream.getTracks().forEach(track => track.stop());
            ws.close();
            console.log('Media recording stopped');
        };
        })();
    `,

    STOP_RECORDING: `
        window.stopRecording = () => {
        if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            ws.close();
        }
        };
    `,
};