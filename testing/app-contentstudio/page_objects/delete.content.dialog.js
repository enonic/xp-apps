const page = require('./page');
const appConst = require('../libs/app_const');
const dialog = {
    container: `//div[contains(@id,'ContentDeleteDialog')]`,
    deleteButton: `//button/span[contains(.,'Delete')]`,
    cancelButton: `//button/span[text()='Cancel']`,
    itemList: `//div[contains(@id,'DeleteDialogItemList']`,
    itemViewer: `//div[contains(@id,'DeleteItemViewer']`,
    deleteItemByDisplayName: function (displayName) {
        return `//div[contains(@id,'DeleteItemViewer') and descendant::h6[contains(@class,'main-name') and contains(.,'${displayName}')]]`
    },
    inboundLink: `//a[contains(@class,'inbound-dependency')]`,
};
// it appears when select a content and click on  'Delete' button on the toolbar
var deleteContentDialog = Object.create(page, {

    cancelButton: {
        get: function () {
            return `${dialog.container}` + `${dialog.cancelButton}`;

        }
    },
    deleteButton: {
        get: function () {
            return `${dialog.container}` + `${dialog.deleteButton}`;
        }
    },
    clickOnDeleteButton: {
        value: function () {
            return this.doClick(this.deleteButton).then(()=> {
                return this.waitForNotVisible(`${dialog.container}`, appConst.TIMEOUT_3);
            }).catch((err)=> {
                this.saveScreenshot('err_close_delete_dialog');
                throw new Error('Delete dialog must be closed!')
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
            return this.waitForNotVisible(`${dialog.container}`, ms);
        }
    },
    isItemHasInboundLink: {
        value: function (itemDisplayName) {
            let selector = `${dialog.deleteItemByDisplayName(itemDisplayName)}` + `${dialog.inboundLink}`;
            return this.waitForVisible(selector, appConst.TIMEOUT_1);
        }
    },
    getNumberOfInboundDependency: {
        value: function (itemDisplayName) {
            let selector = `${dialog.deleteItemByDisplayName(itemDisplayName)}` + `${dialog.inboundLink}`;
            return this.getText(selector);
        }
    },

    clickOnNoButton: {
        value: function () {
            return this.doClick(this.noButton);
        }
    },
});
module.exports = deleteContentDialog;




