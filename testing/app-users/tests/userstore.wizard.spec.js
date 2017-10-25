/**
 * Created on 5/30/2017.
 */
const chai = require('chai');
var expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
var userStoreWizard = require('../page_objects/wizardpanel/userstore.wizard');
const testUtils = require('../libs/test.utils');

describe('User Store wizard - validation and inputs', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();

    it('WHEN `New` button has been pressed AND `User Store` item selected THEN `User Store Wizard` should be opened with all required inputs',
        () => {
            return testUtils.clickOnNewOpenUserStoreWizard().then(()=> {
                return userStoreWizard.isDisplayNameInputVisible();
            }).then(isVisible=> {
                assert.isTrue(isVisible, 'display name input should be present');
            }).waitForVisible(userStoreWizard.descriptionInput).then(result=> {
                assert.isTrue(result, 'description input should be present');
            }).then(()=> {
                return userStoreWizard.waitUntilInvalidIconAppears('<Unnamed User Store>');
            }).then((isRedIconPresent)=> {
                assert.isTrue(isRedIconPresent, 'red circle should be present on the tab, because `name` input is empty');
            }).then(()=> {

            })
        });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});



