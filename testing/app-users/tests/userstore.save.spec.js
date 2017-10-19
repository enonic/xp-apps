/**
 * Created on 6/29/2017.
 */
const chai = require('chai');
var should = require('chai').should;
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
const userItemsBuilder = require('../libs/userItems.builder.js');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const userStoreWizard = require('../page_objects/wizardpanel/userstore.wizard');
const testUtils = require('../libs/test.utils');
const userWizard = require('../page_objects/wizardpanel/user.wizard');

describe('User Store saving and deleting spec', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let userStore;
    let testUser;

    it(`GIVEN 'User Store' wizard is opened WHEN name has been typed AND 'Save' button pressed THEN correct notification message should be displayed`,
        () => {
            userStore = userItemsBuilder.buildUserStore(userItemsBuilder.generateRandomName('store'), 'test user store');
            return testUtils.clickOnNewOpenUserStoreWizard().then(()=> {
                return userStoreWizard.typeDisplayName(userStore.displayName);
            }).then(()=> {
                return userStoreWizard.waitAndClickOnSave();
            }).then(()=> {
                return userStoreWizard.waitForNotificationMessage();
            }).then(result=> {
                assert.strictEqual(result, 'User store was created', 'correct notification message should be displayed');
            })
        });

    it(`GIVEN 'user store' wizard is opened WHEN the name that already in use has been typed THEN correct notification message should be present`,
        ()=> {
            return testUtils.clickOnNewOpenUserStoreWizard().then(()=>userStoreWizard.waitForOpened())
                .then(()=>userStoreWizard.typeDisplayName(userStore.displayName)).then(()=> {
                    return userStoreWizard.waitAndClickOnSave();
                }).then(()=> {
                    return userStoreWizard.waitForErrorNotificationMessage();
                }).then(result=> {
                    var msg = `User Store [` + userStore.displayName + `] could not be created. A User Store with that name already exists`
                    assert.strictEqual(result, msg, 'expected notification message should be displayed');
                })
        });

    it(`GIVEN User Store wizard is opened WHEN data has been typed and 'Save' button pressed AND the wizard has been closed THEN new User Store should be listed`,
        () => {
            userStore = userItemsBuilder.buildUserStore(userItemsBuilder.generateRandomName('store'), 'test user store');
            return testUtils.openWizardAndSaveUserStore(userStore).then(()=> {
                return userBrowsePanel.doClickOnCloseTabButton(userStore.displayName);
            }).pause(1000)
                .then(()=>userBrowsePanel.isItemDisplayed(userStore.displayName)).then(result=> {
                    assert.isTrue(result, 'new user store should be present in the grid');
                })
        });

    it(`GIVEN existing 'User Store' WHEN it has been selected and opened THEN correct description should be present`, () => {
        return userBrowsePanel.clickOnRowByName(userStore.displayName).pause(300).then(()=> {
            return userBrowsePanel.clickOnEditButton();
        }).then(()=> {
            return userStoreWizard.waitForOpened();
        }).then(()=> userStoreWizard.getDescription()).then(result=> {
            assert.strictEqual(result, userStore.description, 'actual description and expected should be equals');
        })
    });

    it(`GIVEN existing 'User Store'(no any users) WHEN it has been selected THEN Delete button should be enabled`, () => {
        return userBrowsePanel.clickOnRowByName(userStore.displayName).pause(700).then(()=> {
            return assert.eventually.equal(userBrowsePanel.isDeleteButtonEnabled(), true,
                "'Delete' button should be enabled, because of no users are present in the store");
        }).then(()=> {
            return assert.eventually.equal(userBrowsePanel.isNewButtonEnabled(), true, "'New' button should be enabled");
        }).then(()=> {
            return assert.eventually.equal(userBrowsePanel.isEditButtonEnabled(), true, "'Edit' button should be enabled");
        });
    });

    it(`GIVEN existing 'User Store' has an user WHEN store has been selected THEN 'Delete' button should be disabled`, () => {
        let userName = userItemsBuilder.generateRandomName('user');
        testUser = userItemsBuilder.buildUser(userName, '1q2w3e', userItemsBuilder.generateEmail(userName), null);
        return testUtils.clickOnUserStoreAndOpenUserWizard(userStore.displayName).pause(400).then(()=> {
            return userWizard.typeData(testUser);
        }).then(()=> {
            return testUtils.saveAndClose(testUser.displayName);
        }).then(()=> {
            //Delete should be disabled, because of the store has an user
            return expect(userBrowsePanel.isDeleteButtonEnabled()).to.eventually.be.false;
        }).then(()=> {
            return expect(userBrowsePanel.isEditButtonEnabled()).to.eventually.be.true;
        });
    });

    it(`GIVEN existing 'User Store' with an user WHEN the user has been deleted THEN the store can be deleted`, () => {
        return testUtils.selectAndDeleteItem(testUser.displayName).then(()=> {
            return userBrowsePanel.waitForItemNotDisplayed(testUser.displayName);
        }).then(result=> {
            assert.isTrue(result, 'the user should not be present in the grid');
        }).then(()=> {
            return testUtils.selectAndDeleteItem(userStore.displayName)
        }).then(()=> {
            return userBrowsePanel.waitForItemNotDisplayed(userStore.displayName)
        });
    });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
})
;