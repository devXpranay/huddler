import { Builder, Browser, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export class Bot {
    private driver: WebDriver | null;

    constructor() {
        this.driver = null;
    }

    public async getDriver(): Promise<WebDriver> {
        if (this.driver) return this.driver;

        const options = new Options();
        options.addArguments('--headless');

        try {
            this.driver = await new Builder()
                .forBrowser(Browser.CHROME)
                .setChromeOptions(options)
                .build();
        } catch (error) {
            console.error("Error initializing driver", error);
            throw new Error('Failed to initialize the WebDriver');
        }

        return this.driver;
    }

    public async openUrl(url: string): Promise<void> {
        try {
            const driver = await this.getDriver();
            await driver.get(url);
        } catch (error) {
            console.error("Error opening URL", error);
        }
    }

    public async switchToIframe(iframeSelector: string): Promise<void> {
        try {
            const driver = await this.getDriver();
            const iframe = await driver.findElement(By.css(iframeSelector));
            await driver.switchTo().frame(iframe);
        } catch (error) {
            console.error("Error switching to iframe", error);
        }
    }

    public async findElementXPath(selector: string): Promise<WebElement | null> {
        try {
            const driver = await this.getDriver();
            await driver.wait(until.elementLocated(By.xpath(selector)));
            return await driver.findElement(By.xpath(selector));
        } catch (error) {
            console.error("Error finding element by XPath", error);
            return null;
        }
    }

    public async findElementCss(selector: string): Promise<WebElement | null> {
        try {
            const driver = await this.getDriver();
            await driver.wait(until.elementLocated(By.css(selector)));
            return await driver.findElement(By.css(selector));
        } catch (error) {
            console.error("Error finding element by CSS", error);
            return null;
        }
    }

    public async clickElement(ele: WebElement): Promise<void> {
        try {
            await ele.click();
        } catch (error) {
            console.error("Error clicking element", error);
        }
    }

    public async quit(): Promise<void> {
        if (this.driver) {
            try {
                await this.driver.quit();
            } catch (error) {
                console.error("Error quitting driver", error);
            } finally {
                this.driver = null;
            }
        }
    }
}
