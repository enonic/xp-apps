/**
 * Created on 8.12.2017.
 */

var page = require('../page');
var elements = require('../../libs/elements');
var dialog = {
    container: `//div[contains(@id,'InstallAppDialog')]`,
    filterInput:`//div[contains(@id,'ApplicationInput')]/input`,
};
var installAppDialog = Object.create(page, {

    header: {
        get: function () {
            return `${dialog.container}${dialog.header}`;
        }
    },
    applicationFilterInput: {
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
            return this.waitForVisible(`${dialog.container}`, 3000).catch(err=> {
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
    getHeaderText: {
        value: function () {
            return this.getText(this.header);
        }
    },
    clickOnInstallAppLink: {
        //TODO 
    }
});
module.exports = installAppDialog;
