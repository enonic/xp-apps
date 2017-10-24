/**
 * Created on 24.10.2017.
 */

var page = require('../page');
var elements = require('../../libs/elements');
var dialog = {
    container: `//div[contains(@id,'ChangeUserPasswordDialog')]`,
    passwordInput: "//input[contains(@id,'PasswordInput')]",
    changePasswordButton: `//button[contains(@id,'DialogButton') and child::span[text()='Change Password']]`,
    cancelButton: `//button[contains(@id,'DialogButton')]/span[text()='Cancel']`,
    showPasswordLink: `//a[contains(@class,'show-link')]`,
    generatePasswordLink: `//a[text()='Generate']`,
    userPath: `//h6[@class='user-path']`,
};
var changeUserPasswordDialog = Object.create(page, {

    passwordInput: {
        get: function () {
            return `${dialog.container}` + `${dialog.passwordInput}`;
        }
    },
    passwordInput: {
        get: function () {
            return `${dialog.container}` + `${dialog.passwordInput}`;
        }
    },

    cancelButton: {
        get: function () {
            return `${dialog.container}` + `${dialog.cancelButton}`;
        }
    },

    cancelButtonTop: {
        get: function () {
            return `${dialog.container}` + `${elements.CANCEL_BUTTON_TOP}`;
        }
    },
    userPath: {
        get: function () {
            return `${dialog.container}` + `${dialog.userPath}`;
        }
    },

    clickOnChangePasswordButton: {
        value: function () {
            return this.doClick(this.changePasswordButton).then(()=> {
                return this.waitForNotVisible(`${dialog.container}`, 2000);
            });
        }
    },
    getUserPath: {
        value: function () {
            return this.getTextFromElements(this.userPath);
        }
    },


    waitForDialogVisible: {
        value: function (ms) {
            return this.waitForVisible(`${dialog.container}`, ms);
        }
    },
    waitForDialogClosed: {
        value: function (ms) {
            return this.waitForVisible(`${dialog.container}`, ms);
        }
    },

    clickOnCancelTopButton: {
        value: function () {
            return this.doClick(this.cancelButtonTop);
        }
    },
    clickOnCancelButton: {
        value: function () {
            return this.doClick(this.cancelButton);
        }
    },
});
module.exports = changeUserPasswordDialog;




