const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
var appConstant = require('../libs/app_const');
const studioUtils = require('../libs/studio.utils.js');
const appBrowsePanel = require('../page_objects/applications/applications.browse.panel');


describe('Description....', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();

    it(`Description 1`, () => {
        return appBrowsePanel.rightClickOnRowByDisplayName('Features App').then(()=> {
            return console.log('##################');
        }).catch(err=> {
            return console.log(err);
        })
    });

    beforeEach(() => studioUtils.navigateToApplicationsApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseCurrentBrowserTab(webDriverHelper.browser));
});
