/**
 * Created on 16.03.2018.
 * verifies the xp-apps#689
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const userStoreWizard = require('../page_objects/wizardpanel/userstore.wizard');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const testUtils = require('../libs/test.utils');
const userItemsBuilder = require('../libs/userItems.builder.js');
const appConst = require('../libs/app_const');
const saveBeforeCloseDialog = require('../page_objects/save.before.close.dialog');

describe('User Store and Save Before Close dialog', function () {
    this.timeout(appConst.TIMEOUT_SUITE);
    webDriverHelper.setupBrowser();

    // verifies the xp-apps#689
    //User Store wizard - Confirmation about unsaved changes when no changes were made #689
    it('GIVEN `UserStore` wizard is opened WHEN no data has been typed AND `close` icon pressed THEN SaveBeforeClose dialog must not appear',
        () => {
            return testUtils.clickOnNewOpenUserStoreWizard().then(()=> {
                return userBrowsePanel.doClickOnCloseTabButton('<Unnamed User Store>');
            }).pause(1000).then(()=> {
                return assert.eventually.isFalse(saveBeforeCloseDialog.isDialogPresent(),
                    "`Save before close` dialog must not be present");
            })
        });

    it('GIVEN `UserStore` wizard is opened WHEN description has been typed AND `close` icon pressed THEN SaveBeforeClose dialog should appear',
        () => {
            return testUtils.clickOnNewOpenUserStoreWizard().then(()=> {
                return userStoreWizard.typeDescription('description');
            }).then(()=> {
                return userBrowsePanel.doClickOnCloseTabButton('<Unnamed User Store>');
            }).pause(1000).then(()=> {
                return assert.eventually.isTrue(saveBeforeCloseDialog.isDialogPresent(),
                    "`Save before close` dialog should appear");
            })
        });

    it(`GIVEN User Store wizard is opened AND name and idProvider have been typed WHEN 'close' icon has been pressed THEN 'Save Before' dialog should be displayed`,
        () => {
            let testStore =
                userItemsBuilder.buildUserStore(userItemsBuilder.generateRandomName('store'), 'test user store', 'First Selenium App',
                    null);
            return testUtils.clickOnNewOpenUserStoreWizard(testStore).then(()=> {
                return userStoreWizard.typeData(testStore);
            }).then(()=> {
                return userBrowsePanel.doClickOnCloseTabButton(testStore.displayName);
            }).pause(300).then(()=> {
                return assert.eventually.isTrue(saveBeforeCloseDialog.isDialogPresent(),
                    "`Save before close` dialog should appear");
            })
        });

    //TODO implement the test, when  https://github.com/enonic/xp-apps/issues/696 will be fixed
    //it(`GIVEN User Store wizard is opened AND name and idProvider have been typed AND Save button has been pressed WHEN 'close' icon has been pressed THEN 'Save Before' dialog should be displayed`,


    beforeEach(() => testUtils.navigateToUsersApp());
    afterEach(() => testUtils.doCloseUsersApp());
    before(()=> {
        return console.log('specification starting: ' + this.title);
    });
});

