var webDriverHelper = require('./../libs/WebDriverHelper');

function Page() {
}

Page.prototype.getBrowser = function () {
    return webDriverHelper.browser;
};
Page.prototype.getTitle = function () {
    return this.getBrowser().getTitle();
};

Page.prototype.isVisible = function (selector) {
    return this.getBrowser().isVisible(selector);
};

Page.prototype.isEnabled = function (selector) {
    return this.getBrowser().isEnabled(selector);
};

Page.prototype.isDisabled = function (selector) {
    return this.getBrowser().isDisabled(selector);
};

Page.prototype.waitForVisible = function (selector, ms) {
    return this.getBrowser().waitForVisible(selector, ms);
};
Page.prototype.waitForSpinnerNotVisible = function (ms) {
    return this.getBrowser().waitForVisible(`//div[@class='spinner']`, ms, true).catch(function (err) {
        console.log('spinner is still visible after a the interval ');
        throw Error('spinner is still visible after a the interval ' + ` ` + ms);
    })
};

Page.prototype.isSpinnerVisible = function () {
    return this.getBrowser().isVisible(`//div[@class='spinner']`);
};

Page.prototype.doClick = function (selector) {
    return this.getBrowser().element(selector).then(()=> {
        return this.getBrowser().click(selector);
    }).catch(function (err) {
        console.log(err.message);
        throw Error(err.message + ` ` + selector);
    })
};

Page.prototype.typeTextInInput = function (selector, text) {
    return this.getBrowser().setValue(selector, text);
};

Page.prototype.getText = function (selector) {
    return this.getBrowser().getText(selector);
};
Page.prototype.waitForExist = function (selector, ms) {
    return this.getBrowser().waitForExist(selector, ms);
};

Page.prototype.waitForEnabled = function (selector, ms) {
    return this.getBrowser().waitForEnabled(selector, ms);
};

Page.prototype.getText = function (selector) {
    return this.getBrowser().getText(selector);
};

Page.prototype.getElementId = function (ele) {
    return ele.value.ELEMENT;
};
Page.prototype.numberOfElements = function (selector) {
    return this.getBrowser().elements(selector).then((result)=> {
        return Object.keys(result.value).length;
    });
}

Page.prototype.getTextFromElements = function (selector) {
    let strings = [];
    return this.getBrowser().elements(selector).then((result)=> {
        result.value.forEach((val,key)=> {

            strings.push(this.getBrowser().elementIdText(val.ELEMENT).value);
        });
          return Promise.all(strings).then((res)=>{
              return res;
          });
    });
}

Page.prototype.getTextFromInput = function (selector) {
    return this.getBrowser().getAttribute(selector, 'value');
};
Page.prototype.waitForNotificationMessage = function () {
    return this.getBrowser().waitForVisible(`//div[@class='notification-content']/span`, 3000).then(()=> {
        return this.getBrowser().getText(`//div[@class='notification-content']/span`);
    })
};

Page.prototype.waitForErrorNotificationMessage = function () {
    var selector = "//div[contains(@id,'NotificationMessage') and @class='notification error']//div[contains(@class,'notification-content')]/span";
    return this.getBrowser().waitForVisible(selector, 3000).then(()=> {
        return this.getBrowser().getText(selector);
    })
};

module.exports = new Page();
