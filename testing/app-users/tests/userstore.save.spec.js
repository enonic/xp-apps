/**
 * Created on 6/29/2017.
 */
const chai = require('chai');
var should = require('chai').should
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
const userItemsBuilder = require('../libs/userItems.builder.js');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const userStoreWizard = require('../page_objects/wizardpanel/userstore.wizard');
const testUtils = require('../libs/test.utils');

describe('User Store saving and deleting spec', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let userStore;
    
    it(`GIVEN 'User Store' wizard is opened WHEN name has been typed AND 'Save' button pressed THEN correct notification message should be displayed`,
        () => {
            userStore = userItemsBuilder.buildUserStore(userItemsBuilder.generateRandomName('store'), 'test user store');
            return testUtils.doOpenUserStoreWizard(webDriverHelper.browser).then(()=> {
                return userStoreWizard.typeDisplayName(userStore.displayName);
            }).then(()=> {
                return userStoreWizard.waitAndClickOnSave();
            }).then(()=> {
                return userStoreWizard.waitForNotificationMessage();
            }).then(result=> {
                assert.strictEqual(result, 'User store was created');
            })
        });

    it(`GIVEN 'user store' wizard is opened WHEN the name that already in use has been typed THEN correct notification message should be present`,
        ()=> {
            return testUtils.doOpenUserStoreWizard(webDriverHelper.browser).then(()=>userStoreWizard.waitForOpened())
                .then(()=>userStoreWizard.typeDisplayName(userStore.displayName)).then(()=> {
                    return userStoreWizard.waitAndClickOnSave();
                }).then(()=> {
                    return userStoreWizard.waitForErrorNotificationMessage();
                }).then(result=> {
                    var msg = `User Store [` + userStore.displayName + `] could not be created. A User Store with that name already exists`
                    assert.strictEqual(result, msg);
                })
        });


    it(`GIVEN User Store wizard is opened WHEN data has been typed and 'Save' button pressed AND the wizard has been closed THEN new User Store should be listed`,
        () => {
            userStore = userItemsBuilder.buildUserStore(userItemsBuilder.generateRandomName('store'), 'test user store');
            return testUtils.openWizardAndSaveUserStore(webDriverHelper.browser, userStore).then(()=> {
                return userBrowsePanel.doClickOnCloseTabButton(userStore.displayName);
            }).pause(1000)
                .then(()=>userBrowsePanel.isExist(userStore.displayName)).then(result=> {
                    assert.isTrue(result, 'new user store should be present in the grid');
                })
        });

    it(`GIVEN existing 'User Store' WHEN it has been selected and opened THEN correct description should be present`, () => {
        return userBrowsePanel.clickOnRowByName(userStore.displayName).pause(300).then(()=> {
            return userBrowsePanel.clickOnEditButton();
        }).then(()=> {
            return userStoreWizard.waitForOpened();
        }).then(()=> userStoreWizard.getDescription()).then(result=> {
            assert.strictEqual(result, userStore.description);
        })
    });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
})
;