/**
 * Created on 12.09.2017.
 */

const chai = require('chai');
var expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
var roleWizard = require('../page_objects/wizardpanel/role.wizard');
var userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const testUtils = require('../libs/test.utils');
const userItemsBuilder = require('../libs/userItems.builder.js');


describe('login page with page object spec ', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let testRole
    it('GIVEN `Roles` wizard is opened WHEN name and description has been typed AND `Save` button pressed THEN `User Store Wizard` should be present',
        () => {
            testRole = userItemsBuilder.buildRole(userItemsBuilder.generateRandomName('role'), 'test role', null);
            return userBrowsePanel.clickOnRowByName('roles').pause(300).then(()=> {
                return userBrowsePanel.clickOnNewButton();
            }).then(()=> {
                return roleWizard.waitForOpened();
            }).then(()=> roleWizard.typeData(testRole)).then(()=> {
                return roleWizard.waitAndClickOnSave();
            }).then(()=> {
                return roleWizard.waitForNotificationMessage();
            }).then(result=> {
                assert.strictEqual(result, 'Role was created');
            })
        });

    it(`GIVEN existing 'Role' WHEN it has been selected and opened THEN correct description should be present`, () => {
        return testUtils.findAndSelectItem(testRole.displayName).pause(300).then(()=> {
            return userBrowsePanel.clickOnEditButton();
        }).then(()=> {
            return roleWizard.waitForOpened();
        }).then(()=> roleWizard.getDescription()).then(result=> {
            assert.strictEqual(result, testRole.description);
        })
    });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
});
