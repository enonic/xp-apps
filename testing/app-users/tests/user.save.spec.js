/**
 * Created on 28.09.2017.
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const webDriverHelper = require('../libs/WebDriverHelper');
const userWizard = require('../page_objects/wizardpanel/user.wizard');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const testUtils = require('../libs/test.utils');
const userItemsBuilder = require('../libs/userItems.builder.js');
const appConst = require('../libs/app_const');

describe('Save User spec ', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let testUser;

    it('GIVEN `User` wizard is opened AND valid data is typed WHEN the user has been saved THEN correct notification message should appear AND the user should be searchable',
        () => {
            let userName = userItemsBuilder.generateRandomName('user');
            testUser = userItemsBuilder.buildUser(userName, '1q2w3e', userItemsBuilder.generateEmail(userName), null);
            return testUtils.clickOnSystemOpenUserWizard(webDriverHelper.browser).then(()=> {
                return userWizard.typeData(testUser);
            }).then(()=> {
                return userWizard.waitAndClickOnSave();
            }).then(()=> {
                return userWizard.waitForNotificationMessage();
            }).then(message=> {
                expect(message).to.equal(appConst.USER_WAS_CREATED_MESSAGE);
            }).then(()=> {
                return userBrowsePanel.clickOnAppHomeButton();
            }).then(()=> {
                return testUtils.typeNameInFilterPanel(userName);
            }).then(()=> {
                return expect(userBrowsePanel.isExist(userName)).to.eventually.be.true;
            })
        });

    it('WHEN user has been saved in the wizard AND the wizard closed AND Users folder has been expanded THEN grid should be updated AND the user should be listed',
        () => {
            let userName  = userItemsBuilder.generateRandomName('user');
            testUser = userItemsBuilder.buildUser(userName, '1q2w3e', userItemsBuilder.generateEmail(userName), null);
            return testUtils.clickOnSystemOpenUserWizard(webDriverHelper.browser).then(()=> {
                return userWizard.typeData(testUser);
            }).then(()=> {
                return userWizard.waitAndClickOnSave();
            }).then(()=> {
                return userBrowsePanel.doClickOnCloseTabButton(userName);
            }).then(()=> {
                return userBrowsePanel.clickOnExpanderIcon("system");
            }).pause(500).then(()=> {
                return userBrowsePanel.clickOnExpanderIcon("users");
            }).then(()=> {
                return expect(userBrowsePanel.isExist(userName)).to.eventually.be.true;
            })
        });

    it('WHEN try to save user with name that already in use THEN correct notification message should appear',
        () => {
            testUser.email="aa@gmail.com";
            return testUtils.clickOnSystemOpenUserWizard(webDriverHelper.browser).then(()=> {
                return userWizard.typeData(testUser);
            }).then(()=> {
                return userWizard.waitAndClickOnSave();
            }).then(()=> {
                return userWizard.waitForErrorNotificationMessage();
            }).then(actualMessage=> {
                let expectedMessage = appConst.principalExistsMessage(testUser.displayName);
                expect(actualMessage).to.be.equal(expectedMessage);
            })
        });
    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});
