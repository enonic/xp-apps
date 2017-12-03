/**
 * Created on 30.11.2017.
 */
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
var appConstant = require('../libs/app_const');
const contentBrowsePanel = require('../page_objects/browsepanel/content.browse.panel');
const studioUtils = require('../libs/studio.utils.js');
const newContentDialog = require('../page_objects/browsepanel/new.content.dialog');
const contentWizard = require('../page_objects/wizardpanel/content.wizard.panel');

describe('Delete a content that has inbound references spec', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();

    it(`GIVEN 'content browse panel' is opened WHEN no any items are selected THEN all buttons should have correct states`, () => {
        return studioUtils.openContentWizard('base:shortcut').then(()=> {
            return studioUtils.doSwitchToNewWizard(webDriverHelper.browser);
        }).then(()=> {
            return contentWizard.waitForOpened();
        });
    });

    beforeEach(() => studioUtils.navigateToContentStudioApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseAllWindowTabsAndSwitchToHome(webDriverHelper.browser));
});
