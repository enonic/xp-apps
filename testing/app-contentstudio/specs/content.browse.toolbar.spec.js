/**
 * Created on 28/11/2017.
 */
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
const contentBrowsePanel = require('../page_objects/browsepanel/content.browse.panel');
const studioUtils = require('../libs/studio.utils.js');
const contentWizard = require('../page_objects/wizardpanel/content.wizard.panel');

describe('Content Browse panel, toolbar spec', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();


    it(`GIVEN 'content browse panel' is opened WHEN no any items are selected THEN all buttons should have correct states`, () => {
        return contentBrowsePanel.waitForNewButtonEnabled().then(result => {
            assert.isTrue(result, `New button should be enabled`);
        }).isEnabled(contentBrowsePanel.deleteButton).then(result=> {
            assert.isFalse(result, 'Delete button should be disabled');
        }).isEnabled(contentBrowsePanel.editButton).then(result => {
            assert.isFalse(result, 'Edit button should be disabled');
        });
    });
    it(`GIVEN 'content browse panel' WHEN no any items are selected THEN all buttons should have correct states`, () => {
        return contentBrowsePanel.waitForNewButtonEnabled().then(result => {
            assert.isTrue(result, `New button should be enabled`);
        }).isEnabled(contentBrowsePanel.deleteButton).then(result=> {
            assert.isFalse(result, 'Delete button should be disabled');
        }).isEnabled(contentBrowsePanel.editButton).then(result => {
            assert.isFalse(result, 'Edit button should be disabled');
        });
    });


    beforeEach(() => studioUtils.navigateToContentStudioApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseAllWindowTabsAndSwitchToHome(webDriverHelper.browser));
});






