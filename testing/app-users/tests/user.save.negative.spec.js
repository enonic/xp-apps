/**
 * Created on 25.09.2017.
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const userWizard = require('../page_objects/wizardpanel/user.wizard');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const testUtils = require('../libs/test.utils');
const userItemsBuilder = require('../libs/userItems.builder.js');
const appConst = require('../libs/app_const');


describe('User Wizard negative spec ', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let testUser
    it('GIVEN `User` wizard is opened WHEN name and e-mail has been typed AND `Save` button pressed THEN correct error-notification message should appear',
        () => {
            let userName = userItemsBuilder.generateRandomName('user');
            testUser = userItemsBuilder.buildUser(userName, '1q2w3e', userItemsBuilder.generateEmail(userName), null);
            return testUtils.clickOnSystemOpenUserWizard(webDriverHelper.browser).then(()=> {
                return userWizard.typeEmail(testUser.email);
            }).then(()=> {
                return userWizard.typeDisplayName(testUser.displayName);
            }).then(()=> {
                return userWizard.waitAndClickOnSave();
            }).then(()=> {
                return userWizard.waitForErrorNotificationMessage();
            }).then(result=> {
                expect(result).to.equal(appConst.USER_WIZARD_PASS_MESSAGE);
            })
        });

    it('GIVEN `User` wizard is opened WHEN name and e-mail has been typed  THEN red cirkle should be displayed on the wizard page ',
        () => {
            let userName = userItemsBuilder.generateRandomName('user');
            testUser = userItemsBuilder.buildUser(userName, '1q2w3e', userItemsBuilder.generateEmail(userName), null);
            return testUtils.clickOnSystemOpenUserWizard(webDriverHelper.browser).then(()=> {
                return userWizard.typeEmail(testUser.email);
            }).then(()=> {
                return userWizard.typeDisplayName(testUser.displayName);
            }).then(()=> {
                return userWizard.isItemInvalid(testUser.displayName);
            }).then((result)=> {
                assert.isTrue(result, 'red circle should be present on the tab');
            })
        });

    it('GIVEN `User` wizard is opened WHEN name and password has been typed AND `Save` button pressed THEN correct error-notification message should appear',
        () => {
            let userName = userItemsBuilder.generateRandomName('user');
            testUser = userItemsBuilder.buildUser(userName, '1q2w3e', userItemsBuilder.generateEmail(userName), null);
            return testUtils.clickOnSystemOpenUserWizard(webDriverHelper.browser).then(()=> {
                return userWizard.typePassword(testUser.password);
            }).then(()=> {
                return userWizard.typeDisplayName(testUser.displayName);
            }).then(()=> {
                return userWizard.waitAndClickOnSave();
            }).then(()=> {
                return userWizard.waitForErrorNotificationMessage();
            }).then(result=> {
                expect(result).to.equal(appConst.USER_WIZARD_EMAIL_MESSAGE);
            })
        });

    it('GIVEN `User` wizard is opened WHEN name and e-mail has been typed  THEN red circle should be displayed on the wizard page',
        () => {
            let userName = userItemsBuilder.generateRandomName('user');
            testUser = userItemsBuilder.buildUser(userName, '1q2w3e', userItemsBuilder.generateEmail(userName), null);
            return testUtils.clickOnSystemOpenUserWizard(webDriverHelper.browser).then(()=> {
                return userWizard.typeEmail(testUser.email);
            }).then(()=> {
                return userWizard.typeDisplayName(testUser.displayName);
            }).then(()=> {
                return userWizard.isItemInvalid(testUser.displayName);
            }).then((result)=> {
                assert.isTrue(result, 'red circle should be present on the tab, because e-mail is empty');
            })
        });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});
