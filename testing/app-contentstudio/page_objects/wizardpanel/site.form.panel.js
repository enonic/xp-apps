/**
 * Created on 14.12.2017.
 */

const page = require('../page');
const elements = require('../../libs/elements');
const contentBuilder = require('../../libs/content.builder');
const loaderComboBox = require('../components/loader.combobox');
const form = {
    wizardSteps: `//div[contains(@id,'WizardStepsPanel')]`,
    descriptionInput: `//textarea[contains(@name,'description')]`,
    applicationsSelectedOptions: "//div[contains(@id,'SiteConfiguratorSelectedOptionView')]",
    selectedAppByDisplayName: function (displayName) {
        return `//div[contains(@id,'SiteConfiguratorSelectedOptionView') and descendant::h6[contains(@class,'main-name') and text()='${displayName}']]`
    },
}
var siteForm = Object.create(page, {

    applicationsOptionsFilterInput: {
        get: function () {
            return `${form.wizardSteps}`+`${elements.FORM_VIEW}`  + `${elements.COMBO_BOX_OPTION_FILTER_INPUT}`;
        }
    },
    descriptionInput: {
        get: function () {
            return `${elements.FORM_VIEW}` + `${form.descriptionInput}`;
        }
    },
    type: {
        value: function (siteData) {
            return this.typeDescription(siteData.description).then(()=> {
                return this.addApplications(siteData.applications);
            });
        }
    },
    typeDescription: {
        value: function (description) {
            return this.typeTextInInput(this.descriptionInput, description);
        }
    },
    addApplications: {
        value: function (appDisplayNames) {
            let result = Promise.resolve();
            appDisplayNames.forEach((displayName)=> {
                result = result.then(() => {
                    return this.filterOptionsAndSelectApplication(displayName)
                });
            });
            return result;
        }
    },
    filterOptionsAndSelectApplication: {
        value: function (displayName) {
            return this.typeTextInInput(this.applicationsOptionsFilterInput, displayName).then(()=> {
                return loaderComboBox.selectOption(displayName);
            }).catch(err=> {
                this.saveScreenshot(contentBuilder.generateRandomName('err_option'));
                throw new Error('application selector :' + err);
            });
        }
    },
    getAppDisplayNames: {
        value: function () {
            let selector = `${form.applicationsSelectedOptions}` + `${elements.H6_DISPLAY_NAME}`;
            return this.getTextFromElements();
        }
    },
    removeApplication: {
        value: function (displayName) {
            let selector = `${form.selectedAppByDisplayName()}` + `${elements.REMOVE_ICON}`
            return this.doClick(selector);
        }
    }
});
module.exports = siteForm;


