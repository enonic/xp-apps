/**
 * Created on 12.09.2017.
 */
var wizard = require('./wizard.panel');
var elements = require('../../libs/elements');
var panel = {
    container: `//div[contains(@id,'RoleWizardPanel')]`,
};
var roleWizard = Object.create(wizard, {

    descriptionInput: {
        get: function () {
            return `${panel.container}//div[contains(@id,'PrincipalDescriptionWizardStepForm')]`+`${elements.TEXT_INPUT}`;
        }
    },
    typeData: {
        value: function (data) {
            return this.typeTextInInput(this.displayNameInput, data.displayName)
                .then(() => this.typeTextInInput(this.descriptionInput, data.description));
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(this.displayNameInput, 3000);
        }
    },

    typeDescription: {
        value: function (description) {
            this.typeTextInInput(this.descriptionInput, description);
        }
    },
    getDescription: {
        value: function () {
            return this.getTextFromInput(this.descriptionInput);
        }
    },
});
module.exports = roleWizard;

