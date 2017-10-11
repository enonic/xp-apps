/**
 * Created on 6/29/2017.
 */
var page = require('./page')
var dialog = {
    container: `//div[contains(@id,'SaveBeforeCloseDialog')]`,
    warningMessage: `//h6[text()='There are unsaved changes, do you want to save them before closing?']";`
};
var saveBeforeCloseDialog = Object.create(page, {

    warningMessage: {
        get: function () {
            return `${dialog.container}//h6[text()='There are unsaved changes, do you want to save them before closing?']`;
        }
    },

    noButton: {
        get: function () {
            return `${dialog.container}//button[contains(@id,'DialogButton') and child::span[contains(.,'o')]`
        }
    },

    yesButton: {
        get: function () {
            return `${dialog.container}//button[contains(@id,'DialogButton') and child::span[contains(.,'es')]]`

        }
    },

    waitForDialogVisible: {
        value: function (ms) {
            return this.waitForVisible(`${dialog.container}`, ms);
        }
    },
    isWarningMessageVisible: {
        value: function (ms) {
            return this.isVisible(this.warningMessage, ms);
        }
    },

    clickOnYesButton: {
        value: function () {
            return this.doClick(this.yesButton);
        }
    },

    clickOnNoButton: {
        value: function () {
            return this.doClick(this.noButton);
        }
    },
});
module.exports = saveBeforeCloseDialog;



