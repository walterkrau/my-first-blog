const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

(async function testPopupWithScreenshots() {
    // Chrome-Optionen für den Headless-Betrieb
    let options = new chrome.Options();
    options.addArguments('--headless');                   
    options.addArguments('--disable-dev-shm-usage');      
    options.addArguments('--no-sandbox');                 
    options.addArguments('--disable-gpu');                
    options.addArguments('--remote-debugging-port=9222'); 
    options.addArguments('--window-size=1920,1080');      

    // WebDriver-Instanz mit Chrome-Optionen starten
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Webserver starten (z.B. über live-server)
        const serverUrl = 'http://127.0.0.1:8080/pages';

        // Screenshot vor dem Start
        await takeScreenshot(driver, 'screenshot-start.png');

        // Zur ersten Seite navigieren
        await driver.get(`${serverUrl}/page1.html`);
        console.log('Auf Seite 1 navigiert.');
        await takeScreenshot(driver, 'screenshot-page1.png');

        // Zum Link klicken und auf Seite 2 navigieren
        let link = await driver.findElement(By.linkText("Zur zweiten Seite"));
        await link.click();
        await driver.wait(until.titleIs('Page 2'), 1000);
        console.log('Auf Seite 2 navigiert.');
        await takeScreenshot(driver, 'screenshot-page2.png');

        // Button auf Seite 2 finden und klicken
        let button = await driver.findElement(By.tagName('button'));
        await button.click();
        console.log('Button geklickt.');

        // Screenshot nach dem Button-Klick
        await takeScreenshot(driver, 'screenshot-after-button-click.png');

        // Prüfen, ob das Pop-up angezeigt wird
        await driver.wait(until.alertIsPresent(), 1000);
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();

        if (alertText === 'Hallo, das ist ein Pop-up!') {
            console.log('Test erfolgreich: Pop-up angezeigt!');
        } else {
            console.log('Test fehlgeschlagen: Falscher Pop-up-Text.');
        }

        // Screenshot nach Pop-up-Anzeige
        await takeScreenshot(driver, 'screenshot-popup.png');

        // Pop-up schließen
        await alert.accept();
    } catch (error) {
        console.error('Test fehlgeschlagen:', error);
        await takeScreenshot(driver, 'screenshot-error.png');
    } finally {
        // WebDriver beenden
        await driver.quit();
    }

    // Funktion zur Screenshot-Erstellung
    async function takeScreenshot(driver, filename) {
        const screenshot = await driver.takeScreenshot();
        const filePath = path.resolve('screenshots', filename);
        fs.mkdirSync(path.dirname(filePath), { recursive: true }); // Ordner erstellen, falls nicht vorhanden
        fs.writeFileSync(filePath, screenshot, 'base64');
        console.log(`Screenshot gespeichert: ${filePath}`);
    }
})();


