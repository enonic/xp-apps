/**
 * Created on 31.08.2017.
 */

var page = require('../page');
var elements = require('../../libs/elements');
var dialog = {
    container: `//div[contains(@id,'NewPrincipalDialog')]`,
    itemViewer: `//div[contains(@id,'UserTypesTreeGridItemViewer')]`,
    header: `//h2[@class='title']`,
};
var newPrincipalDialog = Object.create(page, {

    header: {
        get: function () {
            return `${dialog.container}${dialog.header}`;
        }
    },
    cancelButton: {
        get: function () {
            return `${dialog.container}${elements.CANCEL_BUTTON}`;
        }
    },
    clickOnCancelButtonTop: {
        value: function () {
            return this.doClick(this.cancelButton).catch((err)=> {
                throw new Error('Error when cancel button has been pressed ' + err);
            })
        }
    },
    clickOnItem: {
        value: function (itemName) {
            let selector = `${dialog.itemViewer}` + `${elements.itemByDisplayName(itemName)}`;
            return this.waitForVisible(selector, 2000).then(()=> {
                return this.doClick(selector);
            })
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(`${dialog.container}`, 3000);
        }
    },
    waitForClosed: {
        value: function () {
            return this.waitForNotVisible(`${dialog.container}`, 3000);
        }
    },
    getNumberOfItems: {
        value: function () {
            let items = `${dialog.itemViewer}` + `${elements.H6_DISPLAY_NAME}`;
            return this.numberOfElements(items)
        }
    },
    getItemNames: {
        value: function () {
            let items = `${dialog.itemViewer}` + `${elements.H6_DISPLAY_NAME}`;
            return this.getTextFromElements(items)
        }
    },
    getHeaderText: {
        value: function () {
            return this.getText(this.header);
        }
    }
});
module.exports = newPrincipalDialog;
