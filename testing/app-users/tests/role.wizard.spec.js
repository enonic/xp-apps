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
const roleStatisticsPanel = require('../page_objects/browsepanel/role.statistics.panel');

describe('Role Wizard and Statistics Panel spec', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let testRole
    it('GIVEN `Roles` wizard is opened WHEN name and description has been typed AND `Save` button pressed THEN `Role was created` message should appear',
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
                return roleStatisticsPanel.waitForPanelVisible();
            }).then(()=> {
                return expect(roleStatisticsPanel.getItemName()).to.eventually.be.equal(testRole.displayName);
                //TODO uncomment  it , when the bug will be fixed
                // }).then(()=>{
                //    return expect(userItemStatisticsPanel.getItemPath()).to.eventually.be.equal('/roles/'+testRole.name);
                // })
            })
        });

    it(`GIVEN existing 'Role' with a member is opened WHEN member has been removed AND navigated to the grid THEN no one member should be present on the 'statistics panel'`,
        () => {
            return testUtils.selectRoleAndOpenWizard(testRole.displayName).then(()=> {
                return roleWizard.removeMember(appConst.SUPER_USER)
            }).then(()=>{
                // role has been saved and the wizard closed
                return testUtils.saveAndCloseWizard(testRole.displayName);
            }).then(()=> {
                return roleStatisticsPanel.getDisplayNameOfMembers();
            }).then((members)=>{
                expect(members.length).to.equal(0);
            })
        });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});
