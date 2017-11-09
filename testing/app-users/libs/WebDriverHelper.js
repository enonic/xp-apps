/**
 *  Created by on 10.09.2017.
 *
 * Helper class that encapsulates webdriverio
 * and sets up mocha hooks for easier test writing.
 */
function WebDriverHelper() {
    this.browser = null;
}

/**
 * Sets up a before and after mocha hook
 * that initialize and terminate the webdriverio session.
 */
WebDriverHelper.prototype.setupBrowser = function setupBrowser() {
    var _this = this;
    before(function () {
        //screenshotPath: `${__dirname}/../../screenshots/`,
        var PropertiesReader = require('properties-reader');
        var path = require('path')
        var webdriverio = require('webdriverio');
        console.log('dir name: ' + __dirname)
        var file = path.join(__dirname, '/../browser.properties');
        var properties = null;
        try {
            properties = PropertiesReader(file);
        } catch (err) {
            console.log(err);
        }

        var browser_name = properties.get('browser.name');
        console.log('browser name ##################### ' + browser_name)
        console.log('browser.height ##################### ' + properties.get('browser.height'))
        console.log('browser.width ##################### ' + properties.get('browser.width'))
        var platform_name = properties.get('platform');
        var baseUrl = properties.get('base.url');
        var options = {
            desiredCapabilities: {
                browserName: browser_name,
                platform: platform_name,
                chromeOptions: {
                    "args": [
                        "--lang=en"
                    ],
                }
            }
        };
        _this.browser = webdriverio
            .remote(options)
            .init().url(baseUrl);
        _this.browser.windowHandleSize({width: properties.get('browser.width'), height: properties.get('browser.height')});
        return _this.browser;
    });
    after(function () {
        return _this.browser.end();
    });
};
module.exports = new WebDriverHelper();