/**
 * Created on 5/30/2017.
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
        }
    },
    waitForSaveButtonDisabled: {
        value: function () {
            return this.waitForDisabled(this.saveButton, 1000);
        }
    },
    typeDisplayName: {
        value: function (displayName) {
            return this.typeTextInInput(this.displayNameInput, displayName);
        }
    },
    clearDisplayNameInput: {
        value: function () {
            return this.clearElement(this.displayNameInput);
        }
    },
    isDisplayNameInputVisible: {
        value: function () {
            return this.isVisible(this.displayNameInput);
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
    },
    waitUntilInvalidIconAppears: {
        value: function (displayName) {
            let selector = elements.tabItemByDisplayName(displayName);
            return this.getBrowser().waitUntil(()=> {
                return this.getBrowser().getAttribute(selector, 'class').then(result=> {
                    return result.includes('invalid');
                });
            }, 2000).then(()=> {
                return true;
            }).catch((err)=> {
                throw new Error('group-wizard:invalid-icon was not found' + err);
            });
        }
    },
    waitUntilInvalidIconDisappears: {
        value: function (displayName) {
            let selector = elements.tabItemByDisplayName(displayName);
            return this.getBrowser().waitUntil(()=> {
                return this.getBrowser().getAttribute(selector, 'class').then(result=> {
                    return !result.includes('invalid');
                })
            }, 2000).then(()=> {
                return true;
            }).catch((err)=> {
                throw new Error(err);
            });
        }
    }

});
module.exports = wizardPanel;


