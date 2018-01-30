const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const testUtils = require('../libs/test.utils');
const gridContextMenu = require('../page_objects/browsepanel/grid.context.menu');
const userItemsBuilder = require('../libs/userItems.builder.js');

describe('userbrowse.panel.context.menu.spec User Browse Panel Context Menu specification', function () {
    this.timeout(0);
    webDriverHelper.setupBrowser();

    it('GIVEN navigate to the browse panel WHEN right click on the `Roles` folder THEN `New role` menu item should be first ',
        () => {
            return userBrowsePanel.rightClickOnRowByDisplayName('Roles').then(()=> {
                return gridContextMenu.waitForContextMenuVisible();
            }).then(()=> {
                return gridContextMenu.getGridContextMenuItems();
            }).then(result=> {
                assert.isTrue(result[0] == 'New Role');
            })
        });
    it('GIVEN navigate to the browse panel WHEN right click on the `System` folder THEN `New...` menu item should be first ',
        () => {
            return userBrowsePanel.rightClickOnRowByDisplayName('System User Store').then(()=> {
                return gridContextMenu.waitForContextMenuVisible();
            }).then(()=> {
                return gridContextMenu.getGridContextMenuItems();
            }).then(result=> {
                assert.isTrue(result[0] == 'New...');
            })
        });

    it('GIVEN navigate to the browse panel WHEN right click on the `System` folder THEN `Delete` menu item should be disabled ',
        () => {
            return userBrowsePanel.rightClickOnRowByDisplayName('System User Store').then(()=> {
                return gridContextMenu.waitForContextMenuVisible();
            }).then(()=> {
                return gridContextMenu.waitForDeleteMenuItemDisabled();
            }).then(()=> {
                testUtils.saveScreenshot(webDriverHelper.browser, 'system_context_menu');
                return assert.eventually.isFalse(gridContextMenu.isEditMenuItemDisabled(), "`Edit` menu item should be enabled");
            }).then(()=> {
                return assert.eventually.isFalse(gridContextMenu.isNewMenuItemDisabled(), "`New..` menu item should be enabled");
            })
        });

    it('GIVEN navigate to the browse panel WHEN right click on the `Users` folder THEN `New User` menu item should be first ',
        () => {
            return userBrowsePanel.clickOnExpanderIcon('/system').then(()=> {
                return userBrowsePanel.rightClickOnRowByDisplayName('Users');
            }).then(()=> {
                return gridContextMenu.waitForContextMenuVisible();
            }).then(()=> {
                return gridContextMenu.getGridContextMenuItems();
            }).then(result=> {
                assert.isTrue(result[0] == 'New User');
            })
        });

    it('GIVEN `/system` folder is expanded WHEN right click on the `Groups` folder THEN `New User Group` menu item should be first ',
        () => {
            return userBrowsePanel.clickOnExpanderIcon('/system').then(()=> {
                return userBrowsePanel.rightClickOnRowByDisplayName('Groups');
            }).then(()=> {
                return gridContextMenu.waitForContextMenuVisible();
            }).then(()=> {
                return gridContextMenu.getGridContextMenuItems();
            }).then(result=> {
                testUtils.saveScreenshot(webDriverHelper.browser, "groups_context_menu");
                assert.isTrue(result[0] == 'New User Group');
            })
        });

    it('GIVEN existing User Store(empty) WHEN right click on the store THEN `Delete` menu item should be enabled ',
        () => {
            let userStore = userItemsBuilder.buildUserStore(userItemsBuilder.generateRandomName('store'), 'test user store3');
            return testUtils.openWizardAndSaveUserStore(userStore).then(()=> {
                return userBrowsePanel.doClickOnCloseTabAndWaitGrid(userStore.displayName);
            }).pause(1000).then(()=> {
                return userBrowsePanel.rightClickOnRowByDisplayName(userStore.displayName);
            }).then(()=> {
                return gridContextMenu.waitForContextMenuVisible();
            }).then(()=> {
                return gridContextMenu.isDeleteMenuItemDisabled();
            }).then((result)=> {
                testUtils.saveScreenshot(webDriverHelper.browser, "store_context_menu");
                return assert.isFalse(result, "`Delete` menu item should be enabled, because the store is empty");
            });
        });

    beforeEach(() => testUtils.navigateToUsersApp(webDriverHelper.browser));
    afterEach(() => testUtils.doCloseUsersApp(webDriverHelper.browser));
    before(()=> {
        return console.log('specification starting: ' + this.title);
    });
})
;
