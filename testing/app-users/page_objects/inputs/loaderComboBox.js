/**
 * Created on 19.09.2017.
 */
var wizard = require('../page');
var elements = require('../../libs/elements');
var comboBox = {
    div: `//div[contains(@id,'LoaderComboBox')]`,
    optionFilterInput: `${elements.COMBO_BOX_OPTION_FILTER_INPUT}`,
    optionByDisplayName: function (displayName) {
        return `//div[@class='slick-viewport']//div[contains(@id,'ComboBoxDisplayValueViewer') and text()='${displayName}']`
    },
};
var loaderComboBox = Object.create(wizard, {

    optionFilterInput: {
        get: function () {
            return `${comboBox.div}` + `${comboBox.optionFilterInput}`;
        }
    },
    typeTextInOptionFilterInput: {
        value: function (selector, text) {
            return this.typeTextInInput(selector, text)
        }
    },
    clickOnOption: {
        value: function (panelDiv, displayName) {
            return this.doClick(panelDiv + `${elements.slickRowByDisplayName(displayName)}`)
        }
    },
    waitForOptionVisible: {
        value: function (panelDiv, displayName) {
            return this.waitForVisible(panelDiv + `${elements.slickRowByDisplayName(displayName)}`,2000)
        }
    },

});
module.exports = loaderComboBox;

