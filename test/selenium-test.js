const { Builder, By, until } = require('selenium-webdriver');

(async function testPopup() {
    // WebDriver-Instanz mit Chrome starten
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Webserver starten (manuell oder mit live-server)
        const serverUrl = 'http://127.0.0.1:8080/pages';

        // Zur ersten Seite navigieren
        await driver.get(`${serverUrl}/page1.html`);

        // Zum Link klicken und auf Seite 2 navigieren
        let link = await driver.findElement(By.linkText("Zur zweiten Seite"));
        await link.click();

        // Sicherstellen, dass Seite 2 geladen wurde
        await driver.wait(until.titleIs('Page 2'), 1000);

        // Button auf Seite 2 finden und klicken
        let button = await driver.findElement(By.tagName('button'));
        await button.click();

        // Prüfen, ob das Pop-up angezeigt wird
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();

        if (alertText === 'Hallo, das ist ein Pop-up!') {
            console.log('Test erfolgreich: Pop-up wurde angezeigt!');
        } else {
            console.log('Test fehlgeschlagen: Falscher Pop-up-Text.');
        }

        // Pop-up schließen
        await alert.accept();
    } finally {
        // WebDriver beenden
        await driver.quit();
    }
})();
