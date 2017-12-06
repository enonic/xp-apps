/**
 * Created on 1.12.2017.
 */

var page = require('../page');
var elements = require('../../libs/elements');
var dialog = {
    container: `//div[contains(@id,'NewContentDialog')]`,
    searchInput: `//div[contains(@id,'FileInput')]/input`,
    header: `//div[contains(@class,'dialog-header')`,
    contentTypeByName: function (name) {
        return `//li[contains(@class,'content-types-list-item') and descendant::p[contains(@class,'sub-name') and text()='${name}']]`;
    },

};
var newContentDialog = Object.create(page, {

    header: {
        get: function () {
            return `${dialog.container}${dialog.header}`;
        }
    },
    searchInput: {
        get: function () {
            return `${dialog.container}${dialog.searchInput}`;
        }
    },
    header: {
        get: function () {
            return `${dialog.container}${dialog.header}`;
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
                this.saveScreenshot('err_principal_dialog');
                throw new Error('Error when try click on cancel button ' + err);
            })
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(`${dialog.container}`, 3000).catch(err=> {
                this.saveScreenshot('err_new_content_dialog_load');
                throw new Error('New Content dialog was not loaded! ' + err);
            });
        }
    },
    waitForClosed: {
        value: function () {
            return this.waitForNotVisible(`${dialog.container}`, 3000).catch(error=> {
                this.saveScreenshot('err_new_content_dialog_close');
                throw new Error('New Content Dialog was not closed');
            });
        }
    },
    getHeaderText: {
        value: function () {
            return this.getText(this.header);
        }
    },
    clickOnContentType: {
        value: function (contentTypeName) {
            let typeSelector = `${dialog.contentTypeByName(contentTypeName)}`;
            return this.waitForVisible(typeSelector, 3000).then(()=> {
                return this.doClick(typeSelector).catch(err=> {
                    this.saveScreenshot('err_find_content_type');
                    throw new Error('The content type was not found! ' + contentTypeName);
                });
            })

        }
    }
});
module.exports = newContentDialog;
