const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.use(require('chai-as-promised'));
const loginPage = require('../page_objects/login.page');
const homePage = require('../page_objects/home.page');
const webDriverHelper = require('../libs/WebDriverHelper');
const testUtils = require('../libs/studio.utils');


describe('Login page specification', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();


    it('WHEN XP has been opened THEN login page should be loaded AND correct title should be displayed', function () {
        return loginPage.waitForPageLoaded(3000).then(()=> {
            return loginPage.getTitle();
        }).then((title)=> {
            assert.strictEqual(title, "Enonic XP - Login");
        })
    });

    it('chai-as-promised : WHEN XP has been opened THEN login page should be loaded AND correct title should be displayed', function () {
        return loginPage.waitForPageLoaded(3000).then(()=> {
            return expect(loginPage.getTitle()).to.eventually.be.equal("Enonic XP - Login");
        });
    });

    it('WHEN user has been logged THEN home page should be loaded AND xp-tour dialog should be present', function () {
        return loginPage.doLogin().then(()=> {
            return homePage.waitForLoaded(1000);
        }).then(()=> {
            return homePage.doCloseXpTourDialog();
        }).pause(1000).then(()=> {
            testUtils.saveScreenshot(webDriverHelper.browser, 'home_page');
            return homePage.waitForXpTourClosed();
        })
    });

});
