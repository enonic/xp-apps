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
    clickOnItem: {
        value: function (itemName) {
            return this.doClick(`${dialog.itemViewer}` + `${elements.itemByDisplayName(itemName)}`);
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(`${dialog.container}`, 3000);
        }
    },
    getHeaderString: {
        value: function () {
            return this.getText(this.header);
        }
    },
    getNumberOfItems:{
        value:function(){
           let items= `${dialog.itemViewer}` +`${elements.H6_DISPLAY_NAME}`;
           return this.numberOfElements(items)
        }
    },
    getItemNames:{
        value:function(){
            let items= `${dialog.itemViewer}` +`${elements.H6_DISPLAY_NAME}`;
            return this.getTextFromElements(items)
        }
    }
});
module.exports = newPrincipalDialog;
