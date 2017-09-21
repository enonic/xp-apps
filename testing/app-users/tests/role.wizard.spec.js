/**
 * Created on 12.09.2017.
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const roleWizard = require('../page_objects/wizardpanel/role.wizard');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const testUtils = require('../libs/test.utils');
const userItemsBuilder = require('../libs/userItems.builder.js');
const appConst = require('../libs/app_const');
const userItemStatisticsPanel = require('../page_objects/browsepanel/userItem.statistics.panel')

describe('Role Wizard page and info on the UserItemStatisticsPanel spec ', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let testRole
    it('GIVEN `Roles` wizard is opened WHEN name and description has been typed AND `Save` button pressed THEN `User Store Wizard` should be present',
        () => {
            testRole = userItemsBuilder.buildRole(userItemsBuilder.generateRandomName('role'), 'test role', null);
            return userBrowsePanel.clickOnRowByName('roles').then(()=> {
                return userBrowsePanel.clickOnNewButton();
            }).then(()=> {
                return roleWizard.waitForOpened();
            }).then(()=> roleWizard.typeData(testRole)).then(()=> {
                return roleWizard.waitAndClickOnSave();
            }).then(()=> {
                return roleWizard.waitForNotificationMessage();
            }).then(result=> {
                expect(result).to.equal('Role was created');
            })
        });

    it(`GIVEN existing 'Role' WHEN 'Super User' has been added in members THEN the member should appear on the wizard page`, () => {
        return testUtils.findAndSelectItem(testRole.displayName).then(()=> {
            return userBrowsePanel.clickOnEditButton();
        }).then(()=> {
            return roleWizard.waitForOpened();
        }).then(()=> roleWizard.filterOptionsAndAddMember(appConst.SUPER_USER)).then(()=>roleWizard.waitAndClickOnSave()).then(()=> {
            return roleWizard.getMembers();
        }).then((members)=> {
            expect(members[0]).to.equal(appConst.SUPER_USER);
        })
    });

    it(`GIVEN existing 'Role' WHEN it has been selected and opened THEN correct description should be present`, () => {
        return testUtils.findAndSelectItem(testRole.displayName).then(()=> {
            return userBrowsePanel.clickOnEditButton();
        }).then(()=> {
            return roleWizard.waitForOpened();
        }).then(()=> {
            return expect(roleWizard.getDescription()).to.eventually.be.equal(testRole.description);
        })
    });

    it(`GIVEN existing 'Role' with a member WHEN it has been selected THEN correct info should be present in the 'statistics panel'`,
        () => {
            return testUtils.findAndSelectItem(testRole.displayName).then(()=> {
                return userItemStatisticsPanel.waitForPanelVisible();
            }).then(()=> {
                return expect(userItemStatisticsPanel.getItemName()).to.eventually.be.equal(testRole.displayName);
                //TODO uncomment  it , when the bug will be fixed
                // }).then(()=>{
                //    return expect(userItemStatisticsPanel.getItemPath()).to.eventually.be.equal('/roles/'+testRole.name);
                // })
            })
        });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});
