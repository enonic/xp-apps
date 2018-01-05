const page = require('../page');
const elements = require('../../libs/elements');
const appConst = require('../../libs/app_const');

var panel = {
    container: `//div[contains(@class, 'application-grid')]`,
    toolbar: `//div[contains(@id,'ApplicationBrowseToolbar')]`,
    contextMenu: `//ul[contains(@id,'TreeGridContextMenu')]`,
    installButton: `//button[contains(@id, 'ActionButton') and child::span[contains(.,'Install')]]`,
    unInstallButton: `//button[contains(@id, 'ActionButton') and child::span[contains(.,'Uninstall')]]`,
    stopButton: `//button[contains(@id, 'ActionButton') and child::span[contains(.,'Stop')]]`,
    startButton: `//button[contains(@id, 'ActionButton') and child::span[contains(.,'Start')]]`,
    contextMenuButton: function (name, state) {
        return `${panel.contextMenu}/li[contains(@id,'MenuItem') and contains(@class,'${state}') and contains(.,'${name}')]`;
    },

    rowByName: function (name) {
        return `//div[contains(@id,'NamesView') and child::p[contains(@class,'sub-name') and contains(.,'${name}')]]`;
    },
    rowByDisplayName: function (displayName) {
        return `//div[contains(@id,'NamesView') and child::h6[contains(@class,'main-name') and contains(.,'${displayName}')]]`;
    },
    checkboxByName: function (name) {
        return `${elements.itemByName(name)}` +
               `/ancestor::div[contains(@class,'slick-row')]/div[contains(@class,'slick-cell-checkboxsel')]/label`;
    },
    selectedApplicationByName: function (displayName) {
        return `${elements.slickRowSelectedByDisplayName(panel.container, displayName)}`;
    }

}
var applicationBrowsePanel = Object.create(page, {

    installButton: {
        get: function () {
            return `${panel.toolbar}` + `${panel.installButton}`;
        }
    },
    unInstallButton: {
        get: function () {
            return `${panel.toolbar}` + `${panel.unInstallButton}`;
        }
    },
    stopButton: {
        get: function () {
            return `${panel.toolbar}` + `${panel.stopButton}`;
        }
    },

    startButton: {
        get: function () {
            return `${panel.toolbar}` + `${panel.startButton}`;
        }
    },

    waitForPanelVisible: {
        value: function (ms) {
            return this.waitForVisible(`${panel.toolbar}`, ms).catch(err => {
                throw new Error('Content browse panel was not loaded in ' + ms);
            });
        }
    },
    isItemDisplayedByDisplayName: {
        value: function (itemName) {
            return this.waitForVisible(`${panel.rowByDisplayName(itemName)}`, 1000).catch((err) => {
                console.log("item is not displayed:" + itemName);
                this.saveScreenshot('err_find_' + itemName)
                throw new Error('Item was not found! ' + itemName);
            });
        }
    },
    isItemDisplayed: {
        value: function (itemName) {
            return this.waitForVisible(`${panel.rowByName(itemName)}`, 1000).catch((err) => {
                console.log("item is not displayed:" + itemName);
                this.saveScreenshot('err_find_' + itemName)
                throw new Error('Item was not found! ' + itemName);
            });
        }
    },
    waitForItemNotDisplayed: {
        value: function (itemName) {
            return this.waitForNotVisible(`${panel.rowByName(itemName)}`, 1000).catch((err) => {
                console.log("item is still displayed:" + itemName);
                return false;
            });
        }
    },
    waitForGridLoaded: {
        value: function (ms) {
            return this.waitForVisible(`${elements.GRID_CANVAS}`, ms).then(() => {
                return this.waitForSpinnerNotVisible(appConst.TIMEOUT_3);
            }).then(() => {
                return console.log('applications browse panel is loaded')
            }).catch(err => {
                throw new Error('applications browse panel not loaded in ' + ms);
            });
        }
    },

    clickOnInstallButton: {
        value: function () {
            return this.waitForEnabled(this.installButton, 1000).then(() => {
                return this.doClick(this.installButton);
            }).catch((err) => {
                throw new Error('Install button is not enabled! ' + err);
            })
        }
    },
    clickOnUninstallButton: {
        value: function () {
            return this.waitForEnabled(this.unInstallButton, 1000).then(() => {
                return this.doClick(this.unInstallButton);
            }).catch((err) => {
                throw new Error('Uninstall button is not enabled! ' + err);
            })
        }
    },
    clickOnStopButton: {
        value: function () {
            return this.waitForEnabled(this.stopButton, 1000).then(() => {
                return this.doClick(this.stopButton);
            }).catch((err) => {
                this.saveScreenshot('err_browsepanel_stop');
                throw new Error('stop button is disabled! ' + err);
            })
        }
    },

    waitForStopButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.stopButton, 3000);
        }
    },
    waitForUninstallButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.unInstallButton, 3000);
        }
    },

    isInstallButtonEnabled: {
        value: function () {
            return this.isEnabled(this.installButton);
        }
    },
    isUnInstallButtonEnabled: {
        value: function () {
            return this.isEnabled(this.unInstallButton);
        }
    },
    isStopButtonEnabled: {
        value: function () {
            return this.isEnabled(this.startButton);
        }
    },
    clickOnRowByName: {
        value: function (name) {
            var nameXpath = panel.rowByName(name);
            return this.waitForVisible(nameXpath, 3000).then(() => {
                return this.doClick(nameXpath);
            }).pause(400).catch((err) => {
                this.saveScreenshot('err_find_' + name);
                throw Error('Row with the name ' + name + ' was not found')
            })
        }
    },
    clickOnRowByDisplayName: {
        value: function (name) {
            var nameXpath = panel.rowByDisplayName(name);
            return this.waitForVisible(nameXpath, 3000).then(() => {
                return this.doClick(nameXpath);
            }).pause(400).catch((err) => {
                this.saveScreenshot('err_find_' + name);
                throw Error('Row with the name ' + name + ' was not found')
            })
        }
    },
    rightClickOnRowByDisplayName: {
        value: function (name) {
            var nameXpath = panel.rowByDisplayName(name);
            return this.waitForVisible(nameXpath, 3000).then(() => {
                return this.doRightClick(nameXpath);
            }).pause(400).catch((err) => {
                this.saveScreenshot('err_find_' + name);
                throw Error('Row with the name ' + name + ' was not found')
            })
        }
    },
    waitForRowByNameVisible: {
        value: function (name) {
            var nameXpath = panel.rowByName(name);
            return this.waitForVisible(nameXpath, 3000)
                .catch((err) => {
                    this.saveScreenshot('err_find_' + name);
                    throw Error('Row with the name ' + name + ' is not visible in ' + 3000 + 'ms')
                })
        }
    },
    clickCheckboxAndSelectRowByDisplayName: {
        value: function (displayName) {
            var displayNameXpath = panel.rowByName(displayName);
            return this.waitForVisible(displayNameXpath, 2000).then(() => {
                return this.doClick(displayNameXpath);
            }).catch((err) => {
                this.saveScreenshot('err_find_item');
                throw Error('Row with the displayName ' + displayName + ' was not found')
            })
        }
    },

    getSelectedRowByDisplayName: {
        value: function (displayName) {
            var displayNameXpath = panel.selectedApplicationByName(displayName);
            return this.waitForVisible(displayNameXpath, 2000)
            .catch((err) => {
                throw Error('Row with the displayName ' + displayName + ' was not found')
            })
        }
    },

    waitForContextMenuNotDisplayed: {
        value: function () {
            return this.waitForNotVisible(`${panel.contextMenu}`, 1000).catch((err) => {
                console.log("Context menu is still displayed");
                throw Error('Context menu is still visible');
            });
        }
    },

    waitForContextMenuDisplayed: {
        value: function (name) {
            return this.waitForVisible(`${panel.contextMenu}`, 1000).catch((err) => {
                console.log("Context menu is not displayed");
                throw Error('Context menu is not visible');
            });
        }
    },

    getContextButton: {
        value: function (name, state) {
            var nameXpath = panel.contextMenuButton(name, state || '');
            return this.waitForVisible(nameXpath, 1000).catch((err) => {
                console.log("Failed to find context menu button");
                throw Error('Failed to find context menu button ' + name);
            });
        }
    }

});
module.exports = applicationBrowsePanel;


