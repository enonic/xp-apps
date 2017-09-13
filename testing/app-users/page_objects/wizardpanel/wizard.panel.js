/**
 * Created by on 5/30/2017.
 */
var page = require('../page')
var wizard = {
    displayNameInput: `//input[contains(@name,'displayName')]`,
    saveButton: `//button[contains(@id,'ActionButton')]//span[text()='Save']`,
    deleteButton: `//button[contains(@id,'ActionButton')]//span[text()='Delete']`,
}
var wizardPanel = Object.create(page, {

    displayNameInput: {
        get: function () {
            return `${wizard.displayNameInput}`;
        }
    },
    saveButton: {
        get: function () {
            return `${wizard.saveButton}`;
        }
    },
    deleteButton: {
        get: function () {
            return `${wizard.deleteButton}`;
        }
    },
    waitForSaveButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.saveButton, 1000);
        }
    },
    typeDisplayName: {
        value: function (displayName) {
            return this.typeTextInInput(this.displayNameInput, displayName);
        }
    },

    waitAndClickOnSave: {
        value: function () {
            return this.waitForSaveButtonEnabled().then(()=> this.doClick(this.saveButton)).pause(500);
        }
    },
    doClickOnDelete: {
        value: function () {
            this.doClick(this.deleteButton);
        }
    }
});
module.exports = wizardPanel;


