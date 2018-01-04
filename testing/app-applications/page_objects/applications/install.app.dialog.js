/**
 * Created on 8.12.2017.
 */

var page = require('../page');
var elements = require('../../libs/elements');
var dialog = {
    container: `//div[contains(@id,'InstallAppDialog')]`,
    filterInput:`//div[contains(@id,'ApplicationInput')]/input`,
    appByDisplayName: function (displayName) {
        return `//div[contains(@id,'InstallAppDialog')]//div[contains(@id,'NamesView') and child::h6[contains(@class,'main-name')]]//a[contains(.,'${displayName}')]`
    },
};
var installAppDialog = Object.create(page, {

    
    searchInput: {
        get: function () {
            return `${dialog.container}${dialog.filterInput}`;
        }
    },
    cancelButton: {
        get: function () {
            return `${dialog.container}${elements.CANCEL_BUTTON_TOP}`;
        }
    },
    clickOnCancelButtonTop: {
        value: function () {
            return this.doClick(this.cancelButton).catch((err)=> {
                this.saveScreenshot('err_install_dialog_cancel');
                throw new Error('Error when try click on cancel button ' + err);
            })
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(this.searchInput, 3000).catch(err=> {
                this.saveScreenshot('err_install_dialog_load');
                throw new Error('New Content dialog was not loaded! ' + err);
            });
        }
    },
    waitForClosed: {
        value: function () {
            return this.waitForNotVisible(`${dialog.container}`, 3000).catch(error=> {
                this.saveScreenshot('err_install_dialog_close');
                throw new Error('Install Dialog was not closed');
            });
        }
    },
    getPlaceholderMessage: {
        value: function () {
            return this.getAttribute(this.searchInput,'placeholder');
        }
    },
    clickOnInstallAppLink: {
        //TODO 
    },
    typeSearchText: {
        value: function (text) {
            return this.typeTextInInput(this.searchInput, text);
        }
    },
    isApplicationPresent: {
        value: function (displayName) {
            let selector = `${dialog.appByDisplayName(displayName)}`;
            return this.waitForVisible(selector,1000);
        }
    },
});
module.exports = installAppDialog;
