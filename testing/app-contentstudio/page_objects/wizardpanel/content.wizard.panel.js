/**
 * Created on 5/30/2017.
 */
const page = require('../page');
const elements = require('../../libs/elements');
const appConst = require('../../libs/app_const');
const contentBuilder = require('../../libs/content.builder');
const contentStepForm = require('./content.wizard.step.form');
const contextWindow = require('./liveform/liveform.context.window');
var wizard = {
    container: `//div[contains(@id,'ContentWizardPanel')]`,
    displayNameInput: `//input[contains(@name,'displayName')]`,
    toolbar: `//div[contains(@id,'ContentWizardToolbar')]`,
    saveButton: `//button[contains(@id,'ActionButton') and child::span[text()='Save']]`,
    savedButton: `//button[contains(@id,'ActionButton') and child::span[text()='Saved']]`,
    deleteButton: `//button[contains(@id,'ActionButton') and child::span[text()='Delete...']]`,
    inspectionPanelToggler: "//button[contains(@id, 'TogglerButton') and contains(@class,'icon-cog')]",
    thumbnailUploader: "//div[contains(@id,'ThumbnailUploaderEl')]",
    controllerOptionFilterInput: "//input[contains(@id,'DropdownOptionFilterInput')]",
    liveEditFrame: "//iframe[contains(@class,'live-edit-frame')]",
    pageDescriptorViewer: `//div[contains(@id,'PageDescriptorViewer')]`,
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
    savedButton: {
        get: function () {
            return `${wizard.container}` + `${wizard.savedButton}`;
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

    controllerOptionFilterInput: {
        get: function () {
            return `${wizard.liveEditFrame}` + `${elements.DROPDOWN_OPTION_FILTER_INPUT}`;
        }
    },
    //opens the ContextWindow with tabs:
    showInspectionPanelButton: {
        get: function () {
            return `${wizard.container}` + `${wizard.toolbar}` + `${wizard.inspectionPanelToggler}`;
        }
    },
    waitForInspectionPanelToggler: {
        value: function (ms) {
            return this.waitForVisible(this.showInspectionPanelButton, ms).catch((err)=> {
                this.saveScreenshot('err_open_inspection_panel');
                throw new Error('Context Window is not opened in ' + ms + '  ' + err);
            })
        }
    },
    clickOnShowInspectionPanelButton: {
        value: function () {
            return this.doClick(this.showInspectionPanelButton).catch(err=> {
                return this.doCatch('err_click_on_show_inspection_button', err);
            })
        }
    },
    doOpenContextWindow: {
        value: function () {
            return this.clickOnShowInspectionPanelButton().then(()=> {
                return contextWindow.waitForOpened();
            });
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
    },
    switchToLiveEditFrame: {
        value: function () {
            return this.getBrowser().element(`${wizard.liveEditFrame}`).then(result=> {
                return this.frame(result.value);
            });
        }
    },
    doFilterAndClickOnOption: {
        value: function (pageControllerDisplayName) {
            let optionSelector = elements.slickRowByDisplayName(`//div[contains(@id,'PageDescriptorDropdown')]`,
                pageControllerDisplayName);
            return this.typeTextInInput(wizard.controllerOptionFilterInput, pageControllerDisplayName).then(()=> {
                return this.waitForVisible(optionSelector, appConst.TIMEOUT_3);
            }).catch(err=> {
                throw new Error('option was not found! ' + pageControllerDisplayName + ' ' + err);
            }).then(()=> {
                return this.doClick(optionSelector).catch((err)=> {
                    this.saveScreenshot('err_select_option');
                    throw new Error('option not found!' + pageControllerDisplayName);
                }).pause(500);
            });
        }
    },
    selectPageDescriptor: {
        value: function (pageControllerDisplayName) {
            return this.switchToLiveEditFrame().then(()=> {
                return this.doFilterAndClickOnOption(pageControllerDisplayName);
            }).then(()=> {
                return this.getBrowser().frameParent();
            }).then(()=> {
                return contextWindow.waitForOpened(4000);
            })
        }
    }
});
module.exports = contentWizardPanel;


