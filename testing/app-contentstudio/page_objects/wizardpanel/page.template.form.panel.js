/**
 * Created on 09.03.2018
 */

var page = require('../page');
var elements = require('../../libs/elements');
var appConst = require('../../libs/app_const');
const loaderComboBox = require('../components/loader.combobox');

const form = {
    wizardStep: `//div[contains(@id,'ContentWizardStepForm')]`,
    supportsCombobox: `//div[contains(@id,'ContentTypeComboBox')]`,
    supportOptionFilterInput: "//div[contains(@id,'ContentTypeFilter')]//input[contains(@class,'option-filter-input')]",
    applicationsSelectedOptions: "//div[contains(@id,'SiteConfiguratorSelectedOptionView')]",
    selectedAppByDisplayName: function (displayName) {
        return `//div[contains(@id,'SiteConfiguratorSelectedOptionView') and descendant::h6[contains(@class,'main-name') and text()='${displayName}']]`
    },
}

var pageTemplateForm = Object.create(page, {

    supportOptionsFilterInput: {
        get: function () {
            return `${form.wizardStep}` + `${form.supportOptionFilterInput}`;
        }
    },
    type: {
        value: function (templateData) {
            return this.filterOptionsAndSelectSupport(templateData.supports);
        }
    },
    filterOptionsAndSelectSupport: {
        value: function (contentTypeDisplayName) {
            return this.typeTextInInput(this.supportOptionsFilterInput, contentTypeDisplayName).then(()=> {
                return loaderComboBox.selectOption(contentTypeDisplayName);
            });
        }
    },
});
module.exports = pageTemplateForm;


