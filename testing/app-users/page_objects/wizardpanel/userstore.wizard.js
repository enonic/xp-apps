var wizard = require('./wizard.panel');
var panel = {
    container: `//div[contains(@id,'UserStoreWizardPanel')]`,
};
var userStoreWizard = Object.create(wizard, {

    descriptionInput: {
        get: function () {
            return `${panel.container}//input[contains(@name,'description')]`;
        }
    },
    descriptionInput: {
        get: function () {
            return `${panel.container}//input[contains(@name,'description')]`;
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
module.exports = userStoreWizard;
