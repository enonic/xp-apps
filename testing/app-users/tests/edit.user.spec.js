/**
 * Created on 04.10.2017.
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;
const expect = chai.expect;
const webDriverHelper = require('../libs/WebDriverHelper');
const userWizard = require('../page_objects/wizardpanel/user.wizard');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const testUtils = require('../libs/test.utils');
const userItemsBuilder = require('../libs/userItems.builder.js');
const appConst = require('../libs/app_const');
const userStatisticsPanel = require('../page_objects/browsepanel/user.statistics.panel.js');

describe('Edit user spec', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let testUser;

    it('GIVEN `User` with a role has been saved WHEN the user has been clicked THEN correct role should be displayed on the statistic panel',
        () => {
            let userName = userItemsBuilder.generateRandomName('user');
            let roles = [appConst.roles.CM_ADMIN, appConst.roles.USERS_ADMINISTRATOR];
            testUser = userItemsBuilder.buildUser(userName, '1q2w3e', userItemsBuilder.generateEmail(userName), roles);
            return testUtils.clickOnSystemOpenUserWizard().then(()=> {
                return userWizard.typeData(testUser);
            }).then(()=> {
                return userWizard.waitAndClickOnSave();
            }).then(()=> {
                return userBrowsePanel.clickOnAppHomeButton();
            }).then(()=> {
                return testUtils.typeNameInFilterPanel(userName);
            }).pause(500).then(()=> {
                return userBrowsePanel.clickOnRowByName(userName);
            }).then(()=> {
                return userStatisticsPanel.getDisplayNameOfRoles();
            }).then((roles)=> {
                assert.equal(roles[0], appConst.roles.CM_ADMIN, '`Content Manager Administrator` role should be present on the panel');
                assert.equal(roles[1], appConst.roles.USERS_ADMINISTRATOR,
                    '`Content Manager Administrator` role should be present on the panel')
            }).then(()=> {
                return expect(userStatisticsPanel.getItemName()).to.eventually.be.equal(userName);
            })
        });

    it('GIVEN existing user is opened WHEN display name has been changed THEN user should be searchable with the new display name',
        () => {
            return testUtils.selectUserAndOpenWizard(testUser.displayName).then(()=> {
                return userWizard.typeDisplayName('new-name');
            }).then(()=> {
                return testUtils.saveAndClose('new-name');
            }).then(()=> {
                return testUtils.typeNameInFilterPanel('new-name');
            }).pause(500).then(()=> {
                return expect(userBrowsePanel.isItemDisplayed(testUser.displayName)).to.eventually.be.true;
            })
        });

    it('GIVEN existing user is opened WHEN one role has been removed THEN the role should not be present on the statistics panel',
        () => {
            return testUtils.selectUserAndOpenWizard(testUser.displayName).then(()=> {
                return userWizard.removeRole(appConst.roles.USERS_ADMINISTRATOR);
            }).then(()=> {
                return testUtils.saveAndClose('new-name');
            }).pause(1000).then(()=> {
                return userStatisticsPanel.getDisplayNameOfRoles();
            }).then((roles)=> {
                assert.equal(roles.length, 1, 'one role should be present on the statistics panel');
                assert.equal(roles[0], appConst.roles.CM_ADMIN, '`Content Manager Administrator` role should be present on the panel');
            })
        });


    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});
