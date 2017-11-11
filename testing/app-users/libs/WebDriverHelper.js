/**
 * Created by on 10.09.2017.
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
        var file = path.join(__dirname, '/../browser.properties');
        var properties = PropertiesReader(file);
        var browser_name = properties.get('browser.name');
        var platform_name = properties.get('platform');
        var baseUrl = properties.get('base.url');
        console.log('browser name ##################### ' + browser_name);
        var options = {
            desiredCapabilities: {
                browserName: browser_name,
                platform: platform_name,
                chromeOptions: {
                    "args": [
                        "--lang=en",
                        "--start-maximized",
                        "--start-fullscreen"
                    ],
                }
            }
        };
        _this.browser = webdriverio
            .remote(options)
            .init().url(baseUrl);
        return _this.browser;
    });
    after(function () {
        return _this.browser.end();
    });
};

module.exports = new WebDriverHelper();