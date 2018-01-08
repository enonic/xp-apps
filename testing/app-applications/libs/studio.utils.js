const launcherPanel = require('../page_objects/launcher.panel');
const homePage = require('../page_objects/home.page');
const loginPage = require('../page_objects/login.page');
const appConst = require("./app_const");
const webDriverHelper = require("./WebDriverHelper");
const browsePanel = require('../page_objects/applications/applications.browse.panel');


module.exports = {
    xpTabs: {},

    doCloseCurrentBrowserTab: function () {
        webDriverHelper.browser.close();
    },
    findAndSelectItem: function (name) {
        return browsePanel.waitForRowByNameVisible(name).then(()=> {
            return browsePanel.clickOnRowByName(name);
        }).catch(err=> {
            throw new Error('Application with the name:' + ' not found')
        })
    },


    navigateToApplicationsApp: function (browser) {
        return launcherPanel.waitForPanelVisible(appConst.TIMEOUT_3).then(()=> {
            console.log("'Application browse panel' should be loaded");
            return launcherPanel.clickOnApplicationsLink();
        }).then(()=> {
            return this.doSwitchToApplicationsBrowsePanel(browser);
        }).catch((err)=> {
            return this.doLoginAndSwitchToApplications(browser);
        }).catch((err)=> {
            this.saveScreenshot(browser, "err_login_page");
            throw  new Error("Content Browse Panel for was not loaded");
        });

    },
    doSwitchToApplicationsBrowsePanel: function (browser) {
        console.log('testUtils:switching to Applications app...');
        return browser.getTitle().then(title=> {
            if (title != "Content Studio - Enonic XP Admin") {
                return this.switchToApplicationsTabWindow(browser);
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

    switchAndCheckTitle: function (browser, tabId, reqTitle) {
        return browser.switchTab(tabId).then(()=> {
            return browser.getTitle().then(title=> {
                return title == reqTitle;

            })
        });
    },
    doLoginAndSwitchToApplications: function (browser) {
        return loginPage.doLogin().pause(1500).then(()=> {
            return homePage.isXpTourVisible(appConst.TIMEOUT_3);
        }).then((result)=> {
            if (result) {
                return homePage.doCloseXpTourDialog();
            }
        }).then(()=> {
            return launcherPanel.clickOnApplicationsLink().pause(1000);
        }).then(()=> {
            return this.doSwitchToApplicationsBrowsePanel(browser);
        }).catch((err)=> {
            throw new Error(err);
        })
    },
    switchToApplicationsTabWindow: function (browser) {
        return browser.getTabIds().then(tabs => {
            let prevPromise = Promise.resolve(false);
            tabs.some((tabId)=> {
                prevPromise = prevPromise.then((isStudio) => {
                    if (!isStudio) {
                        return this.switchAndCheckTitle(browser, tabId, "Applications - Enonic XP Admin");
                    }
                    return false;
                });
            });
            return prevPromise;
        }).then(()=> {
            return browsePanel.waitForGridLoaded(appConst.TIMEOUT_3);
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
