/**
 * Created on 01.12.2017.
 */
const page = require('../page');
const elements = require('../../libs/elements');
const appConst = require('../../libs/app_const');

var component = {
    container: `//div[contains(@id,'LoaderComboBox')]`,

}
var loaderComboBox = Object.create(page, {
    selectOption: {
        value: function (optionDisplayName) {
            let optionSelector = elements.slickRowByDisplayName(`${component.container}`, optionDisplayName);
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
});
module.exports = loaderComboBox;


