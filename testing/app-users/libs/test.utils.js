/**
 * Created on 6/28/2017.
 */
const launcherPanel = require('../page_objects/launcher.panel');
const homePage = require('../page_objects/home.page');
const loginPage = require('../page_objects/login.page');
const browsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const userStoreWizard = require('../page_objects/wizardpanel/userstore.wizard');
const newPrincipalDialog = require('../page_objects/browsepanel/new.principal.dialog');
const filterPanel = require("../page_objects/browsepanel/principal.filter.panel");
module.exports = {
    xpTabs: {},
    findAndSelectItem: function (name) {
        return browsePanel.clickOnSearchButton().then(()=> {
           return filterPanel.waitForOpened();
        }).then(()=>{
           return filterPanel.typeSearchText(name);
        }).then(()=>{
            return browsePanel.waitForSpinnerNotVisible(3000);
        }).then(()=>{
            return browsePanel.clickOnRowByName(name);
        })
    },
    navigateToUsersApp: function (browser) {
        return launcherPanel.waitForPanelVisible(1000).then(()=> {
            console.log("'user browse panel' should be loaded");
            return launcherPanel.clickOnUsersLink();
        }).then(()=> {
            return this.doSwitchToUsersApp(browser);
        }).catch(()=> {
            return this.doLoginAndSwitchToUsers(browser);
        })
    },

    doSwitchToUsersApp: function (browser) {
        console.log('testUtils:switching to users app...');
        return browser.getTabIds().then(tabs => {
            this.xpTabs = tabs;
            return browser.switchTab(this.xpTabs[1]);
        }).then(()=> {
            return browsePanel.waitForUsersGridLoaded(5000);
        });
    },

    doLoginAndSwitchToUsers: function (browser) {
        return loginPage.doLogin().then(()=> {
            return homePage.waitForXpTourVisible(5000);
        }).then(()=> {
            return homePage.doCloseXpTourDialog();
        }).then(()=> {
            return launcherPanel.clickOnUsersLink().pause(1000);
        }).then(()=> {
            return this.doSwitchToUsersApp(browser);
        });
    },

    doCloseUsersApp: function (browser) {
        return browser.close().pause(300).then(()=> {
            return browser.switchTab(this.xpTabs[0]);
        })
    }
    ,
    openWizardAndSaveUserStore: function (browser, userStoreData) {
        return this.doOpenUserStoreWizard(browser).then(()=> {
            return userStoreWizard.typeData(userStoreData)
        }).then(()=> {
            return userStoreWizard.waitAndClickOnSave()
        }).pause(500);
    },

    doOpenUserStoreWizard: function (browser) {
        return browsePanel.clickOnNewButton().then(()=> {
            return newPrincipalDialog.waitForOpened();
        }).then(()=> {
            return newPrincipalDialog.clickOnItem(`User Store`);
        }).then(()=>userStoreWizard.waitForOpened());
    },
};
