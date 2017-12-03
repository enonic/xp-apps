/**
 * Created on 01.12.2017.
 */
const page = require('../page');
const saveBeforeCloseDialog = require('../save.before.close.dialog');
const elements = require('../../libs/elements');
const appConst = require('../../libs/app_const');
const studioUtils = require('../../libs/studio.utils');

var component = {
    container: `//div[contains(@id,'LoaderComboBox')]`,
    optionItemByDisplayName: "//button[contains(@class, 'icon-search')]",

}
var loaderComboBox = Object.create(page, {

    selectOption: {
        value: function (optionDisplayName) {
            let optionSelector = `${component.container}` + elements.slickRowByDisplayName(optionDisplayName);
            return this.waitForVisible(optionSelector, appConst.TIMEOUT_3).catch(err=> {
                throw new Error('option was not found! ' + optionDisplayName);
            }).then(()=> {
                return this.doClick(optionSelector).catch((err)=> {
                    this.saveScreenshot('err_select_option');
                    throw new Error('itemTabButton was not found!' + displayName);
                })
            })
        }
    },
    typeSearchTExt: {
        value: function (itemName) {

        }
    },
});
module.exports = loaderComboBox;


