/**
 * Created on 6/28/2017.
 */
const launcherPanel = require('../page_objects/launcher.panel');
const homePage = require('../page_objects/home.page');
const loginPage = require('../page_objects/login.page');
const browsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const userStoreWizard = require('../page_objects/wizardpanel/userstore.wizard');
const userWizard = require('../page_objects/wizardpanel/user.wizard');
const groupWizard = require('../page_objects/wizardpanel/group.wizard');
const roleWizard = require('../page_objects/wizardpanel/role.wizard');
const wizard = require('../page_objects/wizardpanel/wizard.panel');
const newPrincipalDialog = require('../page_objects/browsepanel/new.principal.dialog');
const filterPanel = require("../page_objects/browsepanel/principal.filter.panel");
const confirmationDialog = require("../page_objects/confirmation.dialog");
const appConst = require("./app_const");
const webDriverHelper = require("./WebDriverHelper");
const itemBuilder = require('./userItems.builder');

module.exports = {

    findAndSelectItem: function (name) {
        return this.typeNameInFilterPanel(name).then(()=> {
            return browsePanel.waitForRowByNameVisible(name);
        }).pause(400).then(()=> {
            return browsePanel.clickOnRowByName(name);
        });
    },
    openFilterPanel: function () {
        return browsePanel.clickOnSearchButton().then(()=> {
            return filterPanel.waitForOpened();
        })
    },
    typeNameInFilterPanel: function (name) {
        return filterPanel.isPanelVisible().then((result)=> {
            if (!result) {
                return browsePanel.clickOnSearchButton().then(()=> {
                    return filterPanel.waitForOpened();
                })
            }
            return;
        }).then(()=> {
            return filterPanel.typeSearchText(name);
        }).then(()=> {
            return browsePanel.waitForSpinnerNotVisible(appConst.TIMEOUT_3);
        });
    },
    selectAndDeleteItem: function (name) {
        return this.findAndSelectItem(name).pause(500).then(()=> {
            return browsePanel.waitForDeleteButtonEnabled();
        }).then((result)=> {
            return browsePanel.clickOnDeleteButton();
        }).then(()=> {
            return confirmationDialog.waitForDialogVisible(appConst.TIMEOUT_3);
        }).then(result=> {
            if (!result) {
                throw new Error('Confirmation dialog was not loaded!')
            }
            return confirmationDialog.clickOnYesButton();
        }).then(()=> {
            return browsePanel.waitForSpinnerNotVisible();
        })
    },
    confirmDelete: function () {
        return confirmationDialog.waitForDialogVisible(appConst.TIMEOUT_3).then(()=> {
            return confirmationDialog.clickOnYesButton();
        }).then(()=> {
            return browsePanel.waitForSpinnerNotVisible();
        }).catch(err=> {
            this.saveScreenshot('err_confirm_dialog');
            throw new Error('Error in Confirm Delete: ' + err);
        })
    },
    navigateToUsersApp: function (browser) {
        return launcherPanel.waitForPanelVisible(appConst.TIMEOUT_1).then((result)=> {
            if (result) {
                console.log("Launcher Panel is opened, click on the `Users` link...");
                return launcherPanel.clickOnUsersLink();
            } else {
                console.log("Login Page is opened, type a password and name...");
                return this.doLoginAndSClickOnUsersLink(browser);
            }
        }).then(()=> {
            return this.doSwitchToUsersApp(browser);
        }).catch((err)=> {
            console.log('tried to navigate to Users app, but: ' + err);
            this.saveScreenshot("err_navigate_to_users" + itemBuilder.generateRandomNumber());
            throw new Error('error when navigate to Users app ' + err);
        });
    },

    doLoginAndSClickOnUsersLink: function (browser) {
        return loginPage.doLogin().pause(500).then(()=> {
            return homePage.waitForXpTourVisible(appConst.TIMEOUT_3);
        }).then((result)=> {
            if (result) {
                console.log('xp-tour dialog is present, closing it... ');
                return homePage.doCloseXpTourDialog();
            } else {
                console.log('xp-tour dialog is not visible: ');
            }
        }).then(()=> {
            return launcherPanel.clickOnUsersLink().pause(700);
        })
    },

    doSwitchToUsersApp: function (browser) {
        console.log('testUtils:switching to users app...');
        return browser.getTabIds().then(tabs => {
            let prevPromise = Promise.resolve(false);
            tabs.some((tabId)=> {
                prevPromise = prevPromise.then((isUsers) => {
                    if (!isUsers) {
                        return this.switchAndCheckTitle(browser, tabId, "Users - Enonic XP Admin");
                    }
                    return false;
                });
            });
            return prevPromise;
        }).then(()=> {
            return browsePanel.waitForUsersGridLoaded(appConst.TIMEOUT_3);
        });
    },
    doSwitchToHome: function (browser) {
        console.log('testUtils:switching to Home page...');
        return browser.getTabIds().then(tabs => {
            let prevPromise = Promise.resolve(false);
            tabs.some((tabId)=> {
                prevPromise = prevPromise.then((isHome) => {
                    if (!isHome) {
                        return this.switchAndCheckTitle(browser, tabId, "Enonic XP Home");
                    }
                    return false;
                });
            });
            return prevPromise;
        }).then(()=> {
            return homePage.waitForLoaded(appConst.TIMEOUT_3);
        });
    },
    switchAndCheckTitle: function (browser, tabId, reqTitle) {
        return browser.switchTab(tabId).then(()=> {
            return browser.getTitle().then(title=> {
                return title == reqTitle;

            })
        });
    },
    doCloseUsersApp: function (browser) {
        return browser.getTabIds().then(tabIds=> {
            let result = Promise.resolve();
            tabIds.forEach((tabId)=> {
                result = result.then(() => {
                    return this.switchAndCheckTitle(browser, tabId, "Enonic XP Home");
                }).then((result)=> {
                    if (!result) {
                        return browser.close();
                    }
                });
            });
            return result;
        }).then(()=> {
            return this.doSwitchToHome(browser);
        });
    },

    doCloseUsersApp1: function (browser) {
        return browser.close().pause(300).then(()=> {
            return this.doSwitchToHome(browser);
        })
    },
    selectUserAndOpenWizard: function (displayName) {
        return this.findAndSelectItem(displayName).then(()=> {
            return browsePanel.waitForEditButtonEnabled();
        }).then(()=> {
            return browsePanel.clickOnEditButton();
        }).then(()=> {
            return userWizard.waitForOpened();
        }).pause(500);
    },
    selectSystemUserStoreAndOpenWizard: function () {
        return this.findAndSelectItem('system').then(()=> {
            return browsePanel.waitForEditButtonEnabled();
        }).then(()=> {
            return browsePanel.clickOnEditButton();
        }).then(()=> {
            return userStoreWizard.waitForOpened();
        }).pause(500);
    },
    clickOnRolesFolderAndOpenWizard: function () {
        return browsePanel.clickOnRowByName('roles').then(()=> {
            return browsePanel.clickOnNewButton();
        }).then(()=> {
            return roleWizard.waitForOpened();
        });
    },
    selectRoleAndOpenWizard: function (displayName) {
        return this.findAndSelectItem(displayName).then(()=> {
            return browsePanel.waitForEditButtonEnabled();
        }).then((result)=> {
            if (!result) {
                throw new Error('`Edit` button is disabled!');
            }
            return browsePanel.clickOnEditButton();
        }).then(()=> {
            return roleWizard.waitForOpened();
        })
    },
    selectGroupAndOpenWizard: function (displayName) {
        return this.findAndSelectItem(displayName).then(()=> {
            return browsePanel.waitForEditButtonEnabled();
        }).then((result)=> {
            if (!result) {
                throw new Error('`Edit` button is disabled!');
            }
            return browsePanel.clickOnEditButton();
        }).then(()=> {
            return groupWizard.waitForOpened();
        })
    },
    saveAndCloseWizard: function (displayName) {
        return wizard.waitAndClickOnSave().pause(1000).then(()=> {
            return browsePanel.doClickOnCloseTabAndWaitGrid(displayName);
        })
    },
    openWizardAndSaveUserStore: function (userStoreData) {
        return this.clickOnNewOpenUserStoreWizard().then(()=> {
            return userStoreWizard.typeData(userStoreData)
        }).then(()=> {
            return userStoreWizard.waitAndClickOnSave()
        }).pause(700);
    },
    openWizardAndSaveRole: function (role) {
        return this.clickOnRolesFolderAndOpenWizard().then(()=> {
            return roleWizard.typeData(role)
        }).then(()=> {
            return this.saveAndCloseWizard(role.displayName)
        }).pause(500);
    },
    openWizardAndSaveGroup: function (group) {
        return this.clickOnSystemAndOpenGroupWizard().then(()=> {
            return groupWizard.typeData(group)
        }).pause(500).then(()=> {
            return this.saveAndCloseWizard(group.displayName)
        }).pause(1000);
    },
    clickOnNewOpenUserStoreWizard: function () {
        return browsePanel.clickOnNewButton().then(()=> {
            return newPrincipalDialog.waitForOpened();
        }).then(()=> {
            return newPrincipalDialog.clickOnItem(`User Store`);
        }).then(()=>userStoreWizard.waitForOpened());
    },
    clickOnSystemOpenUserWizard: function () {
        return browsePanel.clickOnRowByName('system').then(()=> {
            return browsePanel.waitForNewButtonEnabled();
        }).then(()=> {
            return browsePanel.clickOnNewButton();
        }).then(()=> {
            return newPrincipalDialog.clickOnItem('User');
        }).then(()=> {
            return userWizard.waitForOpened();
        });
    },
    addSystemUser: function (userData) {
        return this.clickOnSystemOpenUserWizard().then(()=> {
            return userWizard.typeData(userData).then(()=> {
                return this.saveAndCloseWizard(userData.displayName);
            })
        })
    },
    clickOnSystemAndOpenGroupWizard: function () {
        return browsePanel.clickOnRowByName('system').then(()=> {
            return browsePanel.waitForNewButtonEnabled();
        }).then(()=> {
            return browsePanel.clickOnNewButton();
        }).then(()=> {
            return newPrincipalDialog.clickOnItem('Group');
        }).then(()=> {
            return groupWizard.waitForOpened();
        });
    },
    clickOnUserStoreAndOpenUserWizard: function (storeName) {
        return browsePanel.clickOnRowByName(storeName).then(()=> {
            return browsePanel.waitForNewButtonEnabled();
        }).then(()=> {
            return browsePanel.clickOnNewButton();
        }).then(()=> {
            return newPrincipalDialog.clickOnItem('User');
        }).then(()=> {
            return userWizard.waitForOpened();
        }).pause(300);
    },
    saveScreenshot: function (name) {
        var path = require('path')
        var screenshotsDir = path.join(__dirname, '/../build/screenshots/');
        return webDriverHelper.browser.saveScreenshot(screenshotsDir + name + '.png').then(()=> {
            return console.log('screenshot saved ' + name);
        }).catch(err=> {
            return console.log('screenshot was not saved ' + screenshotsDir + 'utils  ' + err);
        })
    }
};
