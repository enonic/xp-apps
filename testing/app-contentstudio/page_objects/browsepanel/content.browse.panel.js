/**
 * Created on 5/31/2017.
 */
const page = require('../page');
const saveBeforeCloseDialog = require('../save.before.close.dialog');
const elements = require('../../libs/elements');
const appConst = require('../../libs/app_const');

var panel = {
    toolbar: `//div[contains(@id,'ContentBrowseToolbar')]`,
    searchButton: "//button[contains(@class, 'icon-search')]",
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
var contentBrowsePanel = Object.create(page, {

    searchButton: {
        get: function () {
            return `${panel.toolbar}` + `${panel.searchButton}`;
        }
    },
    newButton: {
        get: function () {
            return `${panel.toolbar}/*[contains(@id, 'ActionButton') and child::span[contains(.,'New...')]]`
        }
    },
    editButton: {
        get: function () {
            return `${panel.toolbar}/*[contains(@id, 'ActionButton') and child::span[text()='Edit']]`;
        }
    },

    deleteButton: {
        get: function () {
            return `${panel.toolbar}/*[contains(@id, 'ActionButton') and child::span[text()='Delete...']]`;
        }
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    waitForPanelVisible: {
        value: function (ms) {
            return this.waitForVisible(`${panel.toolbar}`, ms).catch(err=> {
                throw new Error('Content browse panel was not loaded in ' + ms);
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
    waitForGridLoaded: {
        value: function (ms) {
            return this.waitForVisible(`${elements.GRID_CANVAS}`, ms).then(()=> {
                return this.waitForSpinnerNotVisible(appConst.TIMEOUT_3);
            }).then(()=> {
                return console.log('content browse panel is loaded')
            }).catch(err=> {
                throw new Error('content browse panel was not loaded in ' + ms);
            });
        }
    },
    clickOnSearchButton: {
        value: function () {
            return this.doClick(this.searchButton);
        }
    },

    clickOnNewButton: {
        value: function () {
            return this.waitForEnabled(this.newButton, 1000).then(()=> {
                return this.doClick(this.newButton);
            }).catch((err)=> {
                throw new Error('New button is not enabled! ' + err);
            })
        }
    },
    clickOnEditButton: {
        value: function () {
            return this.waitForEnabled(this.editButton, 1000).then(()=> {
                return this.doClick(this.editButton);
            }).catch((err)=> {
                this.saveScreenshot('err_browsepanel_edit');
                throw new Error('Edit button is not enabled! ' + err);
            })
        }
    },
    clickOnDeleteButton: {
        value: function () {
            return this.waitForEnabled(this.deleteButton, 2000).then(()=> {
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
            return this.waitForEnabled(this.newButton, 3000);
        }
    },

    waitForEditButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.editButton, 3000);
        }
    },
    waitForDeleteButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.deleteButton, 3000);
        }
    },
    waitForDeleteButtonDisabled: {
        value: function () {
            return this.waitForDisabled(this.deleteButton, 3000);
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
            return this.waitForVisible(nameXpath, 3000).then(()=> {
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
            return this.waitForVisible(nameXpath, 3000)
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
    doCloseWindowTabAndSwitchToBrowsePanel: {
        value: function (displayName) {
            return this.getBrowser().close().pause(300).then(()=> {
                return saveBeforeCloseDialog.isDialogPresent(100);
            }).then((result)=> {
                if (result) {
                    this.saveScreenshot('err_save_close_item').then(()=> {
                        console.log('save before close dialog must not be present');
                        throw new Error('`Save Before Close` dialog should not appear when try to close the ' + displayName);
                    });
                }
            }).then(()=> {
                return this.doSwitchToContentBrowsePanel(1000);
            });
        }
    },
    clickOnExpanderIcon: {
        value: function (name) {
            var expanderIcon = panel.expanderIconByName(name);
            return this.doClick(expanderIcon);
        }
    }
});
module.exports = contentBrowsePanel;


