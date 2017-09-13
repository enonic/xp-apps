const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
chai.Should();
var loginPage = require('../page_objects/login.page');
require("mocha-allure-reporter");

describe('login page spec', function () {

    this.timeout(17000);
    var client =webDriverHelper.setupBrowser();
    console.log("aaa")

    it('check login page', () => {
        return loginPage.getTitle().then(function (title) {
            assert.strictEqual(title, "Enonic XP - Login");
        })
    });

    it('check inputs on the login page', () => {
        return loginPage.isUserNameInputVisible(1000).then(function (result) {
            assert.isTrue(result, '"user name" input should be present');
        })
            .waitForExist(loginPage.passwordInput).then(function (result) {
                assert.isTrue(result, '"password" input should be present');
            })
            .isVisible(loginPage.loginButton).then(function (result) {
                assert.isFalse(result, 'login button should be not visible');
            });
    });

    it('when "user name" and "password" have typed then "login button" should be visible', () => {
        loginPage.typeUserName('su');
        loginPage.typePassword('password');
        return loginPage.waitForLoginButtonVisible(1000).then(function (result) {
            assert.isTrue(result, 'login button should be not visible');
        });
    });
});
