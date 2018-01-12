/**
 * Created  on 1/3/2018.
 */
const page = require('./page');
const appConst = require('../libs/app_const');
const elements = require('../libs/elements');
const dialog = {
    container: `//div[contains(@id,'CreateIssueDialog')]`,
    createIssueButton: `//button[contains(@class,'dialog-button') and child::span[text()='Create Issue']]`,
    cancelButton: `//button[contains(@class,'button-bottom')]`,
    titleFormItem: "//div[contains(@id,'FormItem') and child::label[text()='Title']]",

};
var createIssueDialog = Object.create(page, {

    cancelTopButton: {
        get: function () {
            return `${dialog.container}` + `${elements.CANCEL_BUTTON_TOP}`;
        }
    },
    titleErrorMessage: {
        get: function () {
            return `${dialog.container}` + `${dialog.titleFormItem}` + `${elements.VALIDATION_RECORDING_VIEWER}`;
        }
    },
    titleInput: {
        get: function () {
            return `${dialog.container}` + `${dialog.titleInput}`;
        }
    },
    createIssueButton: {
        get: function () {
            return `${dialog.container}` + `${dialog.createIssueButton}`;
        }
    },
    cancelBottomButton: {
        get: function () {
            return `${dialog.container}` + `${dialog.cancelButton}`;
        }
    },
    clickOnCreateIssueButton: {
        value: function () {
            return this.doClick(this.createIssueButton)
                .catch((err)=> {
                    this.saveScreenshot('err_click_create_issue');
                    throw new Error('create issue dialog ' + err);
                })
        }
    },
    clickOnCancelBottomButton: {
        value: function () {
            return this.doClick(this.cancelBottomButton).then(()=> {
                return this.waitForNotVisible(`${dialog.container}`, appConst.TIMEOUT_3);
            }).catch((err)=> {
                this.saveScreenshot('err_close_issue_dialog');
                throw new Error('Create Issue dialog must be closed!')
            })
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
    isWarningMessageVisible: {
        value: function (ms) {
            return this.isVisible(this.warningMessage, ms);
        }
    },

    clickOnCancelTopButton: {
        value: function () {
            return this.doClick(this.cancelTopButton);
        }
    },
});
module.exports = createIssueDialog;
