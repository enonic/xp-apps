const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const appBrowsePanel = require('../page_objects/applications/applications.browse.panel');
const installAppDialog = require('../page_objects/applications/install.app.dialog');
const uninstallDialog = require('../page_objects/applications/uninstall.app.dialog');
const studioUtils = require('../libs/studio.utils.js');

let installedAppName = '';

const installFirstApp = function() {
    return appBrowsePanel.clickOnInstallButton()
        .then(() => installAppDialog.waitForOpened())
        .then(() => installAppDialog.getFirstInstallAppName())
        .then(appName => {
            installedAppName = appName;
            return installAppDialog.clickOnInstallAppLink(appName);
        })
        .then(() => installAppDialog.waitForAppInstalled(installedAppName))
        .then(() => installAppDialog.clickOnCancelButtonTop())
        .catch(err => {
            throw 'Required application is not installed';
        });
};

const uninstallApp = function() {
    return appBrowsePanel.getSelectedRowByDisplayName(installedAppName)
        .catch(error => {
            return appBrowsePanel.clickOnRowByDisplayName(installedAppName);
        })
        .then(() => appBrowsePanel.clickOnUninstallButton())
        .then(() => uninstallDialog.waitForOpened())
        .then(() => uninstallDialog.clickOnYesButton())
        .pause(500)
        .catch(error => {
            throw 'Failed to uninstall the application';
        });
};

describe(`Applications Grid context menu`, function () {

    this.timeout(180000);
    webDriverHelper.setupBrowser();

    it(`context menu should initially not be visible`, () => {
        return appBrowsePanel.waitForContextMenuNotDisplayed()
            .catch(err => {
                throw 'Context menu should not be visible by default';
            });
    });

    describe(`what happens after an application is right-clicked in the Grid`, function () {

        beforeEach(() => appBrowsePanel.rightClickOnRowByDisplayName(installedAppName));
        afterEach(() => appBrowsePanel.clickOnRowByDisplayName(installedAppName));

        it(`should select the installed app in the Grid`, () => {
            return appBrowsePanel.getSelectedRowByDisplayName(installedAppName)
            .catch(err => {
                throw 'Required application is not found';
            });
        });

        it(`should open the context menu`, () => {
            return appBrowsePanel.waitForContextMenuDisplayed()
                .catch(err => {
                    throw `Context menu didn't open on right click`;
                });
        });

        it(`buttons inside the context menu should have correct state`, () => {
            return appBrowsePanel.getContextButton('Start', 'disabled')
                .then(() => appBrowsePanel.getContextButton('Stop'))
                .then(() => appBrowsePanel.getContextButton('Uninstall'))
                .catch(err => {
                    throw `Context button has incorrect status ` + err;
                });
        });

        it(`should close the context menu after clicking on the same row`, () => {
            return appBrowsePanel.waitForContextMenuDisplayed()
                .then(() => appBrowsePanel.clickOnRowByDisplayName(installedAppName))
                .then(() => appBrowsePanel.waitForContextMenuNotDisplayed())
                .catch(err => {
                    throw `Context menu didn't close after second click`;
                });
        });

    });

    beforeEach(() => studioUtils.navigateToApplicationsApp(webDriverHelper.browser).then(() => installFirstApp()));

    afterEach(() => uninstallApp().then(() => studioUtils.doCloseCurrentBrowserTab(webDriverHelper.browser)));
});

