const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const loginPage = require('../page_objects_wdio/login.page');
const homePage = require('../page_objects_wdio/home.page');

describe('Login page specification', function () {

    it('WHEN XP has been opened THEN login page should be loaded AND correct title should be displayed', function () {
        loginPage.waitForPageLoaded(13000);
        //browser.debug();
        assert.strictEqual(loginPage.getTitle(), "Enonic XP - Login");
    });

    it('WHEN user has been logged THEN home page should be loaded AND xp-tour dialog should be present', function () {
        loginPage.doLogin();
        homePage.waitForLoaded(1000);
        homePage.doCloseXpTourDialog();
        browser.pause(1000);
        browser.saveScreenshot('home_page.png');
    });

});