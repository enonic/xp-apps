/**
 * Created on 18.12.2017.
 */

var page = require('../page');
var elements = require('../../libs/elements');
var appConst = require('../../libs/app_const');
const loaderComboBox = require('../components/loader.combobox');
var form = {
    wizardStep: `//li[contains(@id,'TabBarItem')]/a[text()='Image selector']`,
    selectedOption: "//div[contains(@id,'ImageSelectorSelectedOptionView')]",
    selectedOptions: "//div[contains(@id,'ImageSelectorSelectedOptionsView')]",
    selectedImageByName: function (imageName) {
        return `//div[contains(@id,'ImageSelectorSelectedOptionView') and descendant::div[contains(@class,'label') and text()='${imageName}']]`
    },
}
var imageSelectorForm = Object.create(page, {

    imagesOptionsFilterInput: {
        get: function () {
            return `${elements.FORM_VIEW}` + `${elements.COMBO_BOX_OPTION_FILTER_INPUT}`;
        }
    },

    type: {
        value: function (contentData) {
                return this.selectImages(contentData.images);
        }
    },

    selectImages: {
        value: function (imgNames) {
            let result = Promise.resolve();
            imgNames.forEach((name)=> {
                result = result.then(() => this.filterOptionsAndSelectImage(name));
            });
            return result;
        }
    },
    filterOptionsAndSelectImage: {
        value: function (displayName) {
            return this.typeTextInInput(this.imagesOptionsFilterInput, displayName).then(()=> {
                return loaderComboBox.selectOption(displayName);
            });
        }
    },

});
module.exports = imageSelectorForm;


