/**
 * Created on 5/30/2017.
 */
const chai = require('chai');
var expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
var userStoreWizard = require('../page_objects/wizardpanel/userstore.wizard');
var userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const testUtils = require('../libs/test.utils');

describe('login page with page object spec ', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();

    it('GIVEN navigate to `users` app WHEN `New` button has been pressed AND `User Store` item selected THEN `User Store Wizard` should be present',
        () => {
            return testUtils.doOpenUserStoreWizard(webDriverHelper.browser).waitForVisible(userStoreWizard.displayNameInput).then(result=> {
            assert.isTrue(result, 'display name input should be present');
            }).waitForVisible(userStoreWizard.descriptionInput).then(result=> {
                assert.isTrue(result, 'description input should be present');
            })
    });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});



