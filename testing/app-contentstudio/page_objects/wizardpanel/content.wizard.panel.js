/**
 * Created on 5/30/2017.
 */
const page = require('../page');
const elements = require('../../libs/elements');
const appConst = require('../../libs/app_const');
const contentStepForm = require('./content.wizard.step.form');
var wizard = {
    container: `//div[contains(@id,'ContentWizardPanel')]`,
    displayNameInput: `//input[contains(@name,'displayName')]`,
    saveButton: `//button[contains(@id,'ActionButton') and child::span[text()='Save']]`,
    deleteButton: `//button[contains(@id,'ActionButton') and child::span[text()='Delete']]`,
};
var contentWizardPanel = Object.create(page, {

    displayNameInput: {
        get: function () {
            return `${wizard.container}` + `${wizard.displayNameInput}`;
        }
    },
    saveButton: {
        get: function () {
            return `${wizard.container}` + `${wizard.saveButton}`;
        }
    },
    deleteButton: {
        get: function () {
            return `${wizard.container}` + `${wizard.deleteButton}`;
        }
    },
    typeData: {
        value: function (content) {
            return this.typeDisplayName(content.displayName).then(()=> {
                if (content.data != null) {
                    return contentStepForm.type(content.data, content.contentType);
                }
            })

        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(this.displayNameInput, appConst.TIMEOUT_3).catch((e)=> {
                this.saveScreenshot('err_content__open_wizard')
                throw new Error("Content wizard was not loaded! " + e);
            });
        }
    },
    waitForSaveButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.saveButton, appConst.TIMEOUT_3);
        }
    },
    waitForSaveButtonDisabled: {
        value: function () {
            return this.waitForDisabled(this.saveButton, appConst.TIMEOUT_3);
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

    clickOnDelete: {
        value: function () {
            return this.doClick(this.deleteButton).catch(err=> {
                console.log(err);
                this.saveScreenshot('err_delete_wizard');
                throw new Error('Error when Delete button has been clicked ' + err);
            });
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
    },
    doCatch: {
        value: function (screenshotName, errString) {
            this.saveScreenshot(screenshotName);
            throw new Error(errString);
        }
    }
});
module.exports = contentWizardPanel;


