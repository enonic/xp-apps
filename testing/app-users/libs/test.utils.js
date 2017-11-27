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


module.exports = {
    xpTabs: {},
    findAndSelectItem: function (name) {
        return this.typeNameInFilterPanel(name).then(()=> {
            return browsePanel.waitForRowByNameVisible(name);
        }).pause(400).then(()=> {
            return browsePanel.clickOnRowByName(name);
        });
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
    confirmDelete: ()=> {
        return confirmationDialog.waitForDialogVisible(appConst.TIMEOUT_3).then(()=> {
            return confirmationDialog.clickOnYesButton();
        }).then(()=> {
            return browsePanel.waitForSpinnerNotVisible();
        });
    },
    navigateToUsersApp: function (browser) {
        return launcherPanel.waitForPanelVisible(appConst.TIMEOUT_3).then(()=> {
            console.log("'user browse panel' should be loaded");
            return launcherPanel.clickOnUsersLink();
        }).then(()=> {
            return this.doSwitchToUsersApp(browser);
        }).catch((err)=> {
            return this.doLoginAndSwitchToUsers(browser);
        }).catch((err)=> {
            this.saveScreenshot(browser, "err_login_page");
            throw  new Error("Login for was not loaded");
        });

    },
    doSwitchToUsersApp_old: function (browser) {
        console.log('testUtils:switching to users app...');
        return browser.getTabIds().then(tabs => {
            this.xpTabs = tabs;
            return browser.switchTab(this.xpTabs[1]);
        }).then(()=> {
            return browsePanel.waitForUsersGridLoaded(appConst.TIMEOUT_3);
        });
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
                prevPromise = prevPromise.then((isUsers) => {
                    if (!isUsers) {
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

    doLoginAndSwitchToUsers: function (browser) {
        return loginPage.doLogin().then(()=> {
            return homePage.waitForXpTourVisible(appConst.TIMEOUT_3);
        }).then(()=> {
            return homePage.doCloseXpTourDialog();
        }).then(()=> {
            return launcherPanel.clickOnUsersLink().pause(1000);
        }).then(()=> {
            return this.doSwitchToUsersApp(browser);
        }).catch((err)=> {
            throw new Error(err);
        })
    },

    doCloseUsersApp: function (browser) {
        return browser.close().pause(300).then(()=> {
            return this.doSwitchToHome(browser);
        })
    },
    selectUserAndOpenWizard: function (displayName) {
        return this.findAndSelectItem(displayName).then(()=> {
            return browsePanel.waitForEditButtonEnabled();
        }).then((result)=> {
            if (!result) {
                throw new Error('Edit button is disabled!');
            }
            return browsePanel.clickOnEditButton();
        }).then(()=> {
            return userWizard.waitForOpened();
        })
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
        return wizard.waitAndClickOnSave().pause(300).then(()=> {
            return browsePanel.doClickOnCloseTabAndWaitGrid(displayName);
        })
    },
    openWizardAndSaveUserStore: function (userStoreData) {
        return this.clickOnNewOpenUserStoreWizard().then(()=> {
            return userStoreWizard.typeData(userStoreData)
        }).then(()=> {
            return userStoreWizard.waitAndClickOnSave()
        }).pause(500);
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
        }).then(()=> {
            return this.saveAndCloseWizard(group.displayName)
        }).pause(500);
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
    getDisplayedElements: function (browser, selector) {
        var elems = browser.elements(selector).filter;
        elems.value.map((element)=> {

        })
        //if(!elem.isVisible()){
        //    //do something
        //}
    },
    saveScreenshot: function (browser, name) {
        var path = require('path')
        var screenshotsDir = path.join(__dirname, '/../build/screenshots/');
        return browser.saveScreenshot(screenshotsDir + name + '.png').then(()=> {
            return console.log('screenshot saved ' + name);
        }).catch(err=> {
            return console.log('screenshot was not saved ' + screenshotsDir + 'utils  ' + err);
        })
    }
};
