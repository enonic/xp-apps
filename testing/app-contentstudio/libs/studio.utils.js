/**
 * Created on 12/2/2017.
 */
const launcherPanel = require('../page_objects/launcher.panel');
const homePage = require('../page_objects/home.page');
const loginPage = require('../page_objects/login.page');
const browsePanel = require('../page_objects/browsepanel/content.browse.panel');
const wizard = require('../page_objects/wizardpanel/content.wizard.panel');
const filterPanel = require("../page_objects/browsepanel/content.filter.panel");
const confirmationDialog = require("../page_objects/confirmation.dialog");
const appConst = require("./app_const");
const newContentDialog = require('../page_objects/browsepanel/new.content.dialog');
const contentWizardPanel = require('../page_objects/wizardpanel/content.wizard.panel');
const webDriverHelper = require("./WebDriverHelper");
const shortcutFormViewPanel = require('../page_objects/wizardpanel/shortcut.form.panel.js');


module.exports = {
    xpTabs: {},
    doCloseCurrentBrowserTab: function () {
        return webDriverHelper.browser.close();
    },
    openContentWizard: function (contentType) {
        return browsePanel.waitForNewButtonEnabled(appConst.TIMEOUT_3).then(()=> {
            return browsePanel.clickOnNewButton();
        }).then(()=> {
            return newContentDialog.waitForOpened();
        }).then(()=> {
            return newContentDialog.clickOnContentType(contentType);
        }).then(()=> {
            return this.doSwitchToNewWizard(webDriverHelper.browser);
        }).then(()=> {
            return contentWizardPanel.waitForOpened();
        })
    },
    doAddShortcut: function (shortcut) {
        return this.openContentWizard(appConst.contentTypes.SHORTCUT).then(()=> {
            return contentWizardPanel.typeData(shortcut);
        }).then(()=> {
            return contentWizardPanel.waitAndClickOnSave();
        }).then(()=> {
            return this.doCloseWizardAndSwitchToGrid()
        }).pause(1000);
    },
    doCloseWizardAndSwitchToGrid: function () {
        return this.doCloseCurrentBrowserTab().then(()=> {
            return this.doSwitchToContentBrowsePanel(webDriverHelper.browser);
        });
    },
    doAddSite: function (site) {
        return this.openContentWizard(appConst.contentTypes.SITE).then(()=> {
            return contentWizardPanel.typeData(site);
        }).then(()=> {
            return contentWizardPanel.waitAndClickOnSave();
        }).then(()=> {
            return this.doCloseCurrentBrowserTab();
        }).then(()=> {
            this.doSwitchToContentBrowsePanel(webDriverHelper.browser);
        }).pause(2000);
    },
    findAndSelectItem: function (name) {
        return this.typeNameInFilterPanel(name).then(()=> {
            return browsePanel.waitForRowByNameVisible(name);
        }).pause(400).then(()=> {
            return browsePanel.clickOnRowByName(name);
        });
    },
    
    selectSiteAndOpenNewWizard: function (siteName, contentType) {
        return this.findAndSelectItem(siteName).then(()=> {
            return browsePanel.waitForNewButtonEnabled();
        }).then(()=> {
            return browsePanel.clickOnNewButton();
        }).then(()=> {
            return newContentDialog.waitForOpened();
        }).then(()=> {
            return newContentDialog.typeSearchText(contentType);
        }).then(()=> {
            return newContentDialog.clickOnContentType(contentType);
        }).then(()=> {
            return this.doSwitchToNewWizard(webDriverHelper.browser);
        }).then(()=> {
            return contentWizardPanel.waitForOpened();
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
                throw new Error('Confirmation dialog is not loaded!')
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

    navigateToContentStudioApp: function (browser) {
        return launcherPanel.waitForPanelVisible(appConst.TIMEOUT_3).then(()=> {
            console.log("'user browse panel' should be loaded");
            return launcherPanel.clickOnContentStudioLink();
        }).then(()=> {
            return this.doSwitchToContentBrowsePanel(browser);
        }).catch((err)=> {
            return this.doLoginAndSwitchToContentStudio(browser);
        }).catch((err)=> {
            this.saveScreenshot(browser, "err_login_page");
            throw  new Error("Content Browse Panel for was not loaded");
        });

    },
    doSwitchToContentBrowsePanel: function (browser) {
        console.log('testUtils:switching to Content Studio app...');
        return browser.getTitle().then(title=> {
            if (title != "Content Studio - Enonic XP Admin") {
                return this.switchToStudioTabWindow(browser);
            }
        })
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

    doSwitchToNewWizard: function (browser) {
        console.log('testUtils:switching to the new wizard tab...');
        return browser.getTabIds().then(tabs => {
            this.xpTabs = tabs;
            return browser.switchTab(this.xpTabs[this.xpTabs.length - 1]);
        }).then(()=> {
            return contentWizardPanel.waitForOpened(appConst.TIMEOUT_3);
        });
    },
    switchAndCheckTitle: function (browser, tabId, reqTitle) {
        return browser.switchTab(tabId).then(()=> {
            return browser.getTitle().then(title=> {
                return title == reqTitle;

            })
        });
    },
    doLoginAndSwitchToContentStudio: function (browser) {
        return loginPage.doLogin().then(()=> {
            return homePage.waitForXpTourVisible(appConst.TIMEOUT_3);
        }).then(()=> {
            return homePage.doCloseXpTourDialog();
        }).then(()=> {
            return launcherPanel.clickOnContentStudioLink().pause(1000);
        }).then(()=> {
            return this.doSwitchToContentBrowsePanel(browser);
        }).catch((err)=> {
            throw new Error(err);
        })
    },
    doCloseWindowTabAndSwitchToBrowsePanel: function (browser) {
        return browser.close().pause(300).then(()=> {
            return this.doSwitchToContentBrowsePanel(browser);
        })
    },

    saveAndCloseWizard: function (displayName) {
        return wizard.waitAndClickOnSave().pause(300).then(()=> {
            return this.doCloseWindowTabAndSwitchToBrowsePanel()
        })
    },
    switchToStudioTabWindow: function (browser) {
        return browser.getTabIds().then(tabs => {
            let prevPromise = Promise.resolve(false);
            tabs.some((tabId)=> {
                prevPromise = prevPromise.then((isStudio) => {
                    if (!isStudio) {
                        return this.switchAndCheckTitle(browser, tabId, "Content Studio - Enonic XP Admin");
                    }
                    return false;
                });
            });
            return prevPromise;
        }).then(()=> {
            return browsePanel.waitForGridLoaded(appConst.TIMEOUT_3);
        });
    },
    doCloseAllWindowTabsAndSwitchToHome: function (browser) {
        return browser.getTabIds().then(tabIds=> {
            let result = Promise.resolve();
            tabIds.forEach((tabId)=> {
                result = result.then(() => {
                    return this.switchAndCheckTitle(browser, tabId, "Enonic XP Home");
                }).then((result)=> {
                    if (!result) {
                        return browser.close().then(()=> {
                            //return this.doSwitchToHome(browser);
                        });
                    }
                });
            });
            return result;
        }).then(()=> {
            return this.doSwitchToHome(browser);
        });

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
