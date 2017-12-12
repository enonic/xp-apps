const path = require('path');

function Page() {
}
Page.prototype.goto = function () {
    console.log('######################   ' + browser);
};

Page.prototype.getTitle = function () {
    return browser.getTitle();
};

Page.prototype.isVisible = function (selector) {
    return browser.isVisible(selector);
};

Page.prototype.isEnabled = function (selector) {
    return browser.isEnabled(selector);
};

Page.prototype.isDisabled = function (selector) {
    return browser.isDisabled(selector);
};

Page.prototype.waitForVisible = function (selector, ms) {
    return browser.waitForVisible(selector, ms);
};

Page.prototype.waitForNotVisible = function (selector, ms) {
    return browser.waitForVisible(selector, ms, true);
};
Page.prototype.waitForSpinnerNotVisible = function (ms) {
    return browser.waitForVisible(`//div[@class='spinner']`, ms, true);
};

Page.prototype.isSpinnerVisible = function () {
    return browser.isVisible(`//div[@class='spinner']`);
};

Page.prototype.doClick = function (selector) {
    this.waitForVisible(selector, 1000);
    return browser.click(selector);
};

Page.prototype.typeTextInInput = function (selector, text) {
    return browser.setValue(selector, text);
};

Page.prototype.clearElement = function (selector) {
    return browser.clearElement(selector);
};

Page.prototype.getText = function (selector) {
    return browser.getText(selector);
};
Page.prototype.waitForExist = function (selector, ms) {
    return browser.waitForExist(selector, ms);
};

Page.prototype.waitForEnabled = function (selector, ms) {
    return browser.waitForEnabled(selector, ms);
};

Page.prototype.waitForDisabled = function (selector, ms) {
    return browser.waitForEnabled(selector, ms, true);
};

Page.prototype.getText = function (selector) {
    return browser.getText(selector);
};

Page.prototype.getElementId = function (ele) {
    return ele.value.ELEMENT;
};
Page.prototype.isAttributePresent = function (selector, atrName) {
    return browser.getAttribute(selector, atrName).then(result=> {
        if (result == null) {
            return false;
        } else {
            return true;
        }
    })
};

Page.prototype.getTextFromInput = function (selector) {
    return browser.getAttribute(selector, 'value');
};

Page.prototype.getAttribute = function (selector, attributeName) {
    return browser.getAttribute(selector, attributeName);
};

Page.prototype.waitForNotificationMessage = function () {
    browser.waitForVisible(`//div[@class='notification-content']/span`, 3000);
    return browser.getText(`//div[@class='notification-content']/span`);
};

Page.prototype.waitForExpectedNotificationMessage = function (expectedMessage) {
    let selector = `//div[contains(@id,'NotificationMessage')]//div[contains(@class,'notification-content')]//span[contains(.,'${expectedMessage}')]`
    browser.waitForVisible(selector, 3000);
};

Page.prototype.waitForErrorNotificationMessage = function () {
    var selector = `//div[contains(@id,'NotificationMessage') and @class='notification error']//div[contains(@class,'notification-content')]/span`;
    return browser.waitForVisible(selector, 3000);
    return browser.getText(selector);
};

module.exports = new Page();
