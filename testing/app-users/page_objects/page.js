var webDriverHelper = require('./../libs/WebDriverHelper');

function Page() {
}

Page.prototype.getBrowser = function () {
    return webDriverHelper.browser;
};

Page.prototype.numberOfElements = function (selector) {
    return this.getBrowser().elements(selector).then((res)=> {
        return res.value.filter(el=> {
            return this.getBrowser().elementIdDisplayed(el.ELEMENT);
        })
    }).then((result)=> {
        return Object.keys(result).length;
    });
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

Page.prototype.waitForNotVisible = function (selector, ms) {
    return this.getBrowser().waitForVisible(selector, ms, true);
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
    return this.getBrowser().elements(selector).then((result)=> {
        return this.getBrowser().click(selector);
    }).catch(function (err) {
        throw Error(err.message + ` ` + selector);
    })
};

Page.prototype.typeTextInInput = function (selector, text) {
    return this.getBrowser().setValue(selector, text).catch((err)=> {
        throw new Error('text was not set in the input ' + err);
    })
};
Page.prototype.clearElement = function (selector) {
    return this.getBrowser().clearElement(selector).catch((err)=> {
        throw new Error('input was not cleared ' + err);
    })
},

    Page.prototype.getText = function (selector) {
        return this.getBrowser().getText(selector);
    };
Page.prototype.waitForExist = function (selector, ms) {
    return this.getBrowser().waitForExist(selector, ms);
};

Page.prototype.waitForEnabled = function (selector, ms) {
    return this.getBrowser().waitForEnabled(selector, ms);
};

Page.prototype.waitForDisabled = function (selector, ms) {
    return this.getBrowser().waitForEnabled(selector, ms, true);
};

Page.prototype.getText = function (selector) {
    return this.getBrowser().getText(selector);
};

Page.prototype.getElementId = function (ele) {
    return ele.value.ELEMENT;
};
Page.prototype.isAttributePresent = function (selector, atrName) {
    return this.getBrowser().getAttribute(selector, atrName).then(result=> {
        if (result == null) {
            return false;
        } else {
            return true;
        }
    })
};
Page.prototype.getDisplayedElements = function (selector) {
    let displayedElements = [];
    return this.getBrowser().elements(selector).then(results=> {
        results.value.filter
    })
    return this.getBrowser().elementIdDisplayed(el.ELEMENT);
    //https://github.com/webdriverio/webdriverio/issues/1701
    //});
};

Page.prototype.getTextFromElements = function (selector) {
    let json = [];
    return this.getBrowser().elements(selector).then((result)=> {
        result.value.forEach((val)=> {
            json.push(this.getBrowser().elementIdText(val.ELEMENT));
        })
        return Promise.all(json).then((p)=> {
            return p;
        });
    }).then(responses=> {
        let res = [];
        responses.forEach((str)=> {
            return res.push(str.value);
        })
        return res;
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
