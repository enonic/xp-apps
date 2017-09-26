/**
 * Created by on 5/30/2017.
 */
var page = require('../page');
var elements = require('../../libs/elements');
var wizard = {
    displayNameInput: `//input[contains(@name,'displayName')]`,
    saveButton: `//button[contains(@id,'ActionButton') and child::span[text()='Save']]`,
    deleteButton: `//button[contains(@id,'ActionButton')) and child::span[text()='Delete']`,
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
            //return this.isAttributePresent(this.saveButton, 'disabled');
        }
    },
    typeDisplayName: {
        value: function (displayName) {
            return this.typeTextInInput(this.displayNameInput, displayName);
        }
    },

    waitAndClickOnSave: {
        value: function () {
            return this.waitForSaveButtonEnabled().then((result)=> {
                if (result) {
                    return this.doClick(this.saveButton);
                } else {
                    throw new Error(`Save button is not enabled!`);
                }

            }).catch(err=> {
                throw new Error(`Save button is not enabled!` + err);
            })
        }
    },
    doClickOnDelete: {
        value: function () {
            return this.doClick(this.deleteButton);
        }
    },
    isItemInvalid: {
        value: function (displayName) {
            let selector = elements.tabItemByDisplayName(displayName);
            return this.getBrowser().getAttribute(selector, 'class').then(result=> {
                return result.includes("invalid");
            }).catch(err=> {
                throw new Error('tabItem: ' + err);
            });
        }
    }
});
module.exports = wizardPanel;


