/**
 * Created on 5/30/2017.
 */
const page = require('../page');
const elements = require('../../libs/elements');
const appConst = require('../../libs/app_const');
const contentBuilder = require('../../libs/content.builder');
const contentStepForm = require('./content.wizard.step.form');
var wizard = {
    container: `//div[contains(@id,'ContentWizardPanel')]`,
    displayNameInput: `//input[contains(@name,'displayName')]`,
    saveButton: `//button[contains(@id,'ActionButton') and child::span[text()='Save']]`,
    savedButton: `//button[contains(@id,'ActionButton') and child::span[text()='Saved']]`,
    deleteButton: `//button[contains(@id,'ActionButton') and child::span[text()='Delete']]`,
    thumbnailUploader: "//div[contains(@id,'ThumbnailUploaderEl')]",
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
    thumbnailUploader: {
        get: function () {
            return `${wizard.container}` + `${wizard.thumbnailUploader}`;
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
            return this.waitForVisible(this.displayNameInput, appConst.TIMEOUT_10).catch((e)=> {
                this.saveScreenshot(contentBuilder.generateRandomName('err_open_wizard'))
                throw new Error("Content wizard was not loaded! " + e);
            });
        }
    },
    waitForSaveButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.saveButton, appConst.TIMEOUT_3).catch(()=> {
                return false;
            })
        }
    },
    waitForSaveButtonDisabled: {
        value: function () {
            return this.waitForDisabled(this.saveButton, appConst.TIMEOUT_3).catch(()=> {
                return false;
            })
        }
    },
    waitForSaveButtonVisible: {
        value: function () {
            return this.waitForVisible(this.saveButton, appConst.TIMEOUT_3).catch(err=> {
                return this.doCatch('err_save_button_vivsible', 'Save button is not visible ' + err);
            });
        }
    },
    waitForSavedButtonVisible: {
        value: function () {
            return this.waitForVisible(this.savedButton, appConst.TIMEOUT_3).catch(err=> {
                return this.doCatch('err_saved_button_vivsible', err);
            });
        }
    },
    typeDisplayName: {
        value: function (displayName) {
            return this.typeTextInInput(this.displayNameInput, displayName);
        }
    },
    clearDisplayNameInput: {
        value: function () {
            return this.clearElement(this.displayNameInput).pause(500);
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
                return this.doClick(this.saveButton);
            }).catch(err=> {
                this.saveScreenshot('err_click_on_save');
                throw new Error(`Error when click on Save button!` + err);
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
    isContentInvalid: {
        value: function () {
            let selector = this.thumbnailUploader;
            return this.getBrowser().getAttribute(selector, 'class').then(result=> {
                return result.includes("invalid");
            }).catch(err=> {
                throw new Error('error when try to find the content validation state: ' + err);
            });
        }
    },
    waitUntilInvalidIconAppears: {
        value: function (displayName) {
            let selector = this.thumbnailUploader;
            return this.getBrowser().waitUntil(()=> {
                return this.getBrowser().getAttribute(selector, 'class').then(result=> {
                    return result.includes('invalid');
                });
            }, 2000).then(()=> {
                return true;
            }).catch((err)=> {
                throw new Error('content-wizard:invalid-icon was not found' + err);
            });
        }
    },
    waitUntilInvalidIconDisappears: {
        value: function (displayName) {
            let selector = this.thumbnailUploader;
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


