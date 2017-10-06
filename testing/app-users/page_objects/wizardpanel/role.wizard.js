/**
 * Created on 12.09.2017.
 */
var wizard = require('./wizard.panel');
var elements = require('../../libs/elements');
const loaderComboBox = require('../inputs/loaderComboBox');

var panel = {
    container: `//div[contains(@id,'RoleWizardPanel')]`,
    roleOptionsFilterInput: "//div[contains(@id,'FormItem') and child::label[text()='Members']]" + `${loaderComboBox.optionFilterInput}`,
};
var roleWizard = Object.create(wizard, {

    descriptionInput: {
        get: function () {
            return `${panel.container}//div[contains(@id,'PrincipalDescriptionWizardStepForm')]` + `${elements.TEXT_INPUT}`;
        }
    },
    typeData: {
        value: function (data) {
            return this.typeTextInInput(this.displayNameInput, data.displayName)
                .then(() => this.typeTextInInput(this.descriptionInput, data.description));
        }
    },
    filterOptionsAndAddMember: {
        value: function (displayName) {
            return this.typeTextInInput(`${panel.roleOptionsFilterInput}`, displayName).then(()=> {
                return loaderComboBox.waitForOptionVisible(`${panel.container}`, displayName);
            }).then(()=> {
                return loaderComboBox.clickOnOption(`${panel.container}`, displayName);
            })
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(this.displayNameInput, 3000).catch((e)=> {
                throw new Error("Role wizard was not loaded! " + e);
            });
        }
    },

    typeDescription: {
        value: function (description) {
            return this.typeTextInInput(this.descriptionInput, description);
        }
    },
    getDescription: {
        value: function () {
            return this.getTextFromInput(this.descriptionInput);
        }
    },
    getMembers: {
        value: function () {
            let selectedOptions = `${panel.container}` + `${elements.PRINCIPAL_SELECTED_OPTION}` + `${elements.H6_DISPLAY_NAME}`
            return this.getTextFromElements(selectedOptions);
        }
    },
    removeMember: {
        value: function (displayName) {
            let selector = `${panel.container}` + `${elements.selectedPrincipalByDisplayName(displayName)}` + `${elements.REMOVE_ICON}`;
            return this.doClick(selector).pause(300);
        }
    }
});
module.exports = roleWizard;

