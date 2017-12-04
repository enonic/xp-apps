/**
 * Created on 5/31/2017.
 */
const page = require('../page');
const saveBeforeCloseDialog = require('../save.before.close.dialog');
const elements = require('../../libs/elements');
const appConst = require('../../libs/app_const');

var panel = {
    toolbar: `//div[contains(@id,'UserBrowseToolbar')]`,
    grid: `//div[@class='grid-canvas']`,
    searchButton: "//button[contains(@class, 'icon-search')]",
    appHomeButton: "//div[contains(@id,'TabbedAppBar')]/div[contains(@class,'home-button')]",

    rowByName: function (name) {
        return `//div[contains(@id,'NamesView') and child::p[contains(@class,'sub-name') and contains(.,'${name}')]]`
    },
    checkboxByName: function (name) {
        return `${elements.itemByName(name)}` +
               `/ancestor::div[contains(@class,'slick-row')]/div[contains(@class,'slick-cell-checkboxsel')]/label`
    },

    expanderIconByName: function (name) {
        return this.rowByName(name) +
               `/ancestor::div[contains(@class,'slick-cell')]/span[contains(@class,'collapse') or contains(@class,'expand')]`;

    },
    closeItemTabButton: function (name) {
        return `//div[contains(@id,'AppBar')]//li[contains(@id,'AppBarTabMenuItem') and child::a[@class='label' and text() ='${name}']]/button`;
    },
}
var userBrowsePanel = Object.create(page, {

    /////////Getters
    appHomeButton: {
        get: function () {
            return `${panel.appHomeButton}`;
        }
    },
    searchButton: {
        get: function () {
            return `${panel.toolbar}` + `${panel.searchButton}`;
        }
    },
    newButton: {
        get: function () {
            return `${panel.toolbar}/*[contains(@id, 'ActionButton') and child::span[contains(.,'New')]]`
        }
    },
    editButton: {
        get: function () {
            return `${panel.toolbar}/*[contains(@id, 'ActionButton') and child::span[text()='Edit']]`;
        }
    },

    deleteButton: {
        get: function () {
            return `${panel.toolbar}/*[contains(@id, 'ActionButton') and child::span[text()='Delete']]`;
        }
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    waitForPanelVisible: {
        value: function (ms) {
            return this.waitForVisible(`${panel.toolbar}`, ms).catch(err=> {
                throw new Error('User browse panel was not loaded in ' + ms);
            });
        }
    },
    isItemDisplayed: {
        value: function (itemName) {
            return this.waitForVisible(`${panel.rowByName(itemName)}`, 1000).catch((err)=> {
                console.log("item is not displayed:" + itemName);
                this.saveScreenshot('err_find_' + itemName)
                throw new Error('Item was not found! ' + itemName);
            });
        }
    },
    waitForItemNotDisplayed: {
        value: function (itemName) {
            return this.waitForNotVisible(`${panel.rowByName(itemName)}`, 1000).catch((err)=> {
                console.log("item is still displayed:" + itemName);
                return false;
            });
        }
    },
    waitForFolderUsersVisible: {
        value: function () {
            return this.waitForVisible(`${panel.rowByName('users')}`, 1000).catch(()=> {
                console.log("element is not visible: row with Users");
                throw new Error(`element was not found! Users folder was not found! `);
            });
        }
    },
    waitForUsersGridLoaded: {
        value: function (ms) {
            return this.waitForVisible(`${panel.grid}`, ms).then(()=> {
                return this.waitForSpinnerNotVisible(3000);
            }).then(()=> {
                return console.log('user browse panel is loaded')
            }).catch(err=> {
                throw new Error('users browse panel was not loaded in ' + ms);
            });
        }
    },
    clickOnSearchButton: {
        value: function () {
            return this.doClick(this.searchButton);
        }
    },
    clickOnAppHomeButton: {
        value: function () {
            return this.doClick(this.appHomeButton).pause(500).catch((err)=> {
                throw new Error('err: AppHome button ' + err);
            })
        }
    },
    clickOnNewButton: {
        value: function () {
            return this.waitForEnabled(this.newButton, appConst.TIMEOUT_3).then(()=> {
                return this.doClick(this.newButton);
            }).catch((err)=> {
                throw new Error('New button is not enabled! ' + err);
            })
        }
    },
    clickOnEditButton: {
        value: function () {
            return this.waitForEnabled(this.editButton, appConst.TIMEOUT_3).then(()=> {
                return this.doClick(this.editButton);
            }).catch((err)=> {
                this.saveScreenshot('err_browsepanel_edit');
                throw new Error('Edit button is not enabled! ' + err);
            })
        }
    },
    clickOnDeleteButton: {
        value: function () {
            return this.waitForEnabled(this.deleteButton, appConst.TIMEOUT_3).then(()=> {
                return this.doClick(this.deleteButton);
            }).catch((err)=> {
                this.saveScreenshot('err_browsepanel_delete');
                throw new Error('Delete button is not enabled! ' + err);
            })
        }
    },

    isSearchButtonDisplayed: {
        value: function () {
            return this.isVisible(this.searchButton);
        }
    },
    waitForNewButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.newButton, appConst.TIMEOUT_3);
        }
    },

    waitForEditButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.editButton, appConst.TIMEOUT_3);
        }
    },
    waitForDeleteButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.deleteButton, appConst.TIMEOUT_3);
        }
    },
    waitForDeleteButtonDisabled: {
        value: function () {
            return this.waitForDisabled(this.deleteButton, appConst.TIMEOUT_3);
        }
    },

    isDeleteButtonEnabled: {
        value: function () {
            return this.isEnabled(this.deleteButton);
        }
    },
    isNewButtonEnabled: {
        value: function () {
            return this.isEnabled(this.newButton);
        }
    },
    isEditButtonEnabled: {
        value: function () {
            return this.isEnabled(this.editButton);
        }
    },
    clickOnRowByName: {
        value: function (name) {
            var nameXpath = panel.rowByName(name);
            return this.waitForVisible(nameXpath, appConst.TIMEOUT_3).then(()=> {
                return this.doClick(nameXpath);
            }).pause(400).catch((err)=> {
                this.saveScreenshot('err_find_' + name);
                throw Error('Row with the name ' + name + ' was not found')
            })
        }
    },
    waitForRowByNameVisible: {
        value: function (name) {
            var nameXpath = panel.rowByName(name);
            return this.waitForVisible(nameXpath, appConst.TIMEOUT_3)
                .catch((err)=> {
                    this.saveScreenshot('err_find_' + name);
                    throw Error('Row with the name ' + name + ' is not visible after ' + 3000 + 'ms')
                })
        }
    },
    clickCheckboxAndSelectRowByDisplayName: {
        value: function (displayName) {
            var displayNameXpath = panel.rowByName(displayName);
            return this.waitForVisible(displayNameXpath, 2000).then(()=> {
                return this.doClick(displayNameXpath);
            }).catch((err)=> {
                this.saveScreenshot('err_find_item');
                throw Error('Row with the displayName ' + displayName + ' was not found')
            })
        }
    },
    doClickOnCloseTabButton: {
        value: function (displayName) {
            return this.doClick(`${panel.closeItemTabButton(displayName)}`).catch((err)=> {
                this.saveScreenshot('err_item_tab');
                throw new Error('itemTabButton was not found!' + displayName);
            })
        }
    },
    doClickOnCloseTabAndWaitGrid: {
        value: function (displayName) {
            return this.doClick(`${panel.closeItemTabButton(displayName)}`).catch((err)=> {
                throw new Error('itemTabButton was not found!' + displayName);
            }).pause(300).then(()=> {
                return saveBeforeCloseDialog.isDialogPresent(1000);
            }).then((result)=> {
                if (result) {
                    this.saveScreenshot('err_save_close_item').then(()=> {
                        console.log('save before close dialog must not be present');
                        throw new Error('`Save Before Close` dialog should not appear when try to close the ' + displayName);
                    });

                }
            }).then(()=> {
                return this.waitForSpinnerNotVisible(1000);
            }).then(()=> {
                return this.waitForUsersGridLoaded(1000);
            })
        }
    },
    clickOnExpanderIcon: {
        value: function (name) {
            var expanderIcon = panel.expanderIconByName(name);
            return this.doClick(expanderIcon);
        }
    }
});
module.exports = userBrowsePanel;


