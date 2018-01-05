const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
const appBrowsePanel = require('../page_objects/applications/applications.browse.panel');
const installAppDialog = require('../page_objects/applications/install.app.dialog');
const uninstallAppDialog = require('../page_objects/applications/uninstall.app.dialog');
const studioUtils = require('../libs/studio.utils.js');

describe('Application Browse Panel,  check buttons on the toolbar', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();

    const appDisplayName1 = 'Content viewer';
    const appDisplayName2 = 'ContentHive';
    const appDescription1 = 'Inspect your content';
    const appDescription2 = 'Widget generating';

    it('Uninstall previously installed applications', () => {
        return uninstallIfPresent(appDescription1)
            .then(() => uninstallIfPresent(appDescription2));
    });


    it('WHEN Install button has been clicked for two applications THEN two rows should be present in the grid', () => {
        return appBrowsePanel.clickOnInstallButton()
            .then(() => Promise.all(
                [installAppDialog.waitForInstallLink(appDisplayName1), installAppDialog.waitForInstallLink(appDisplayName2)]))
            .then(() => Promise.all(
                [installAppDialog.clickOnInstallAppLink(appDisplayName1), installAppDialog.clickOnInstallAppLink(appDisplayName2)]))
            .then(() => Promise.all(
                [installAppDialog.waitForAppInstalled(appDisplayName1), installAppDialog.waitForAppInstalled(appDisplayName2)]))
            .then(() => installAppDialog.clickOnCancelButtonTop)
            .then(() => installAppDialog.waitForClosed)
            .then(() => Promise.all([appBrowsePanel.isItemDisplayed(appDescription1), appBrowsePanel.isItemDisplayed(appDescription2)]));
    });

    it('WHEN An installed application is selected or unselected THEN the toolbar buttons must be updated', () => {
        return appBrowsePanel.clickOnRowByName(appDescription1)
            .then(() => Promise.all([appBrowsePanel.waitForUninstallButtonEnabled(), appBrowsePanel.waitForStopButtonEnabled(),
                appBrowsePanel.waitForStartButtonEnabled(true)]))
            .then(() => appBrowsePanel.clickOnRowByName(appDescription1))
            .then(() => Promise.all([appBrowsePanel.waitForUninstallButtonEnabled(true), appBrowsePanel.waitForStopButtonEnabled(true),
                appBrowsePanel.waitForStartButtonEnabled(true)]));
    });

    beforeEach(() => studioUtils.navigateToApplicationsApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseCurrentBrowserTab(webDriverHelper.browser));
});

function uninstallIfPresent(appDescription) {
    return appBrowsePanel.isItemDisplayed(appDescription)
        .then(() => appBrowsePanel.clickOnRowByName(appDescription))
        .then(() => appBrowsePanel.waitForUninstallButtonEnabled())
        .then(() => appBrowsePanel.clickOnUninstallButton())
        .then(() => uninstallAppDialog.waitForOpened())
        .then(() => uninstallAppDialog.clickOnYesButton())
        .then(() => appBrowsePanel.waitForNotificationMessage())
        .catch(() => {
        });
}






