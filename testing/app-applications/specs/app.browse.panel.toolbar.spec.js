const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
const appBrowsePanel = require('../page_objects/applications/applications.browse.panel');
const studioUtils = require('../libs/studio.utils.js');

describe('Application Browse Panel,  check buttons on the toolbar', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();


    it(`test 1 description....`, () => {

    });
    it(`test 2 description...`, () => {

    });


    beforeEach(() => studioUtils.navigateToApplicationsApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseCurrentBrowserTab(webDriverHelper.browser));
});






