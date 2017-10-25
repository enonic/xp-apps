/**
 * Created on 24.10.2017.
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const userWizard = require('../page_objects/wizardpanel/user.wizard');
const changePasswordDialog = require('../page_objects/wizardpanel/change.password.dialog');
const testUtils = require('../libs/test.utils');
const userItemsBuilder = require('../libs/userItems.builder.js');

describe('User Wizard page spec', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let testUser;
    it('WHEN `User` wizard is opened  THEN red circle should be present, because required inputs are empty',
        () => {
            return testUtils.clickOnSystemOpenUserWizard().then(()=> {
                return userWizard.waitUntilInvalidIconAppears('<Unnamed User>');
            }).then((isRedIconPresent)=> {
                assert.isTrue(isRedIconPresent, 'red circle should be present on the tab, because required inputs are empty');
            })
        });

    it('WHEN `User` wizard is opened THEN all required inputs should be present on the page',
        () => {
            return testUtils.clickOnSystemOpenUserWizard().then(()=> {
                return assert.eventually.isTrue(userWizard.isDisplayNameInputVisible(), "Display name input should be displayed");
            }).then(()=> {
                return assert.eventually.isTrue(userWizard.isEmailInputDisplayed(), "E-mail name input should be displayed");
            }).then(()=> {
                return assert.eventually.isTrue(userWizard.isPasswordInputDisplayed(), "`Password` name input should be displayed");
            }).then(()=> {
                return assert.eventually.isTrue(userWizard.isGroupOptionsFilterInputDisplayed(),
                    "`Groups` selector should be displayed");
            }).then(()=> {
                return assert.eventually.isTrue(userWizard.isRoleOptionsFilterInputDisplayed(),
                    "`Roles` selector should be displayed");
            }).then(()=> {
                return assert.eventually.isFalse(userWizard.isChangePasswordButtonDisplayed(),
                    "`Change Password` button should not be displayed");
            })
        });

    it('GIVEN `User` wizard is opened WHEN name, e-mail, password have been typed THEN red circle should not be present on the tab',
        () => {
            let displayName = userItemsBuilder.generateRandomName('user');
            testUser =
                userItemsBuilder.buildUser(displayName, 'password', userItemsBuilder.generateEmail(displayName), null, null);
            return testUtils.clickOnSystemOpenUserWizard().then(()=> userWizard.typeData(testUser)).then(()=> {
                return userWizard.waitUntilInvalidIconDisappears(testUser.displayName);
            }).then((isRedIconNotPresent)=> {
                assert.isTrue(isRedIconNotPresent, 'red circle should not be present on the tab, because all required inputs are filled');
            }).then(()=> {
                return assert.eventually.isTrue(userWizard.waitForSaveButtonEnabled(), "`Save` button should be enabled");
            });
        });

    it('GIVEN name, e-mail, password have been typed WHEN `Save` button has been pressed THEN `Change Password` button should appear',
        () => {
            let displayName = userItemsBuilder.generateRandomName('user');
            testUser =
                userItemsBuilder.buildUser(displayName, 'password', userItemsBuilder.generateEmail(displayName), null, null);
            return testUtils.clickOnSystemOpenUserWizard().then(()=> userWizard.typeData(testUser)).then(()=> {
                return userWizard.waitAndClickOnSave();
            }).pause(400).then(()=> {
                return assert.eventually.isTrue(userWizard.isChangePasswordButtonDisplayed(), "`Change Password` button should appear");
            });
        });

    it('GIVEN  existing user is opened WHEN name input has been cleared THEN red circle should appears on the tab',
        () => {
            return testUtils.selectUserAndOpenWizard(testUser.displayName).then(()=> {
                return userWizard.clearDisplayNameInput();
            }).then(()=> {
                return userWizard.waitUntilInvalidIconAppears('<Unnamed User>');
            }).then((isRedIconPresent)=> {
                assert.isTrue(isRedIconPresent, 'red circle should appears on the tab, because display-name input has been cleared');
            }).then(()=> {
                return assert.eventually.isTrue(userWizard.waitForSaveButtonDisabled(), 'Save button should be disabled now');
            });
        });
    it('GIVEN existing user is opened WHEN name input has been cleared THEN red circle should appears on the tab',
        () => {
            return testUtils.selectUserAndOpenWizard(testUser.displayName).then(()=> {
                return userWizard.clickOnChangePasswordButton();
            }).then(()=> {
                return changePasswordDialog.waitForDialogVisible();
            }).then(()=> {
                //return assert.eventually.isTrue(changePasswordDialog.getUserPath()[0].includes(), 'Display name of the user should be present in the path');
                return changePasswordDialog.getUserPath();
            }).then(result=> {
                assert.isTrue(result[0].includes(testUser.displayName), 'Display name of the user should be present in the path');
            });
        });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});
