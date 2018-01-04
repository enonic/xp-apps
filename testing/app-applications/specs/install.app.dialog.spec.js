const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const elements = require('../libs/elements');
const webDriverHelper = require('../libs/WebDriverHelper');
const appBrowsePanel = require('../page_objects/applications/applications.browse.panel');
const dialog = require('../page_objects/applications/install.app.dialog');
const uninstallDialog = require('../page_objects/applications/uninstall.app.dialog');
const studioUtils = require('../libs/studio.utils.js');

describe('Install Application Dialog specification', function () {
    this.timeout(180000);
    webDriverHelper.setupBrowser();

    it('SHOULD show install app dialog WHEN Install button has been clicked', () => {
        return appBrowsePanel.clickOnInstallButton().then(() => {
            return dialog.waitForOpened();
        }).then(() => {
            return dialog.getPlaceholderMessage();
        }).then(placeholder => {
            assert.isTrue(placeholder == 'Search Enonic Market, paste url or upload directly',
                'Correct message should be in the placeholder');
        })
    });
    it('SHOULD contain all controls WHEN opened', () => {
        return appBrowsePanel.clickOnInstallButton().then(() => {
            return dialog.waitForOpened();
        }).then(() => {
            return dialog.waitForVisible(dialog.searchInput, 1000);
        }).then(visible => {
            assert.isTrue(visible, 'Filter input should be present in dialog');
            return dialog.waitForVisible(dialog.grid, 2000);
        }).then(visible => {
            assert.isTrue(visible, 'Grid should be present in dialog');
            return dialog.numberOfElements(`${dialog.grid}${elements.SLICK_ROW}`);
        }).then(count => {
            assert.isAbove(count, 0, 'There should be apps in the grid');
        });
    });
    it('SHOULD filter all apps WHEN search text has been typed GIVEN dialog is opened', () => {
        return appBrowsePanel.clickOnInstallButton().then(() => {
            return dialog.waitForOpened();
        }).then(() => {
            return dialog.typeSearchText('Chuck Norris');
        }).then(() => {
            return dialog.isApplicationPresent('Chuck Norris');
        }).then(isPresent => {
            assert.isTrue(isPresent, 'required application should be filtered');
        })
    });
    it('SHOULD install an app WHEN install link is clicked GIVEN dialog is opened', () => {
        const chuck = 'Chuck Norris';
        return appBrowsePanel.isItemDisplayed(chuck).then(() => {
            return appBrowsePanel.clickOnRowByName(chuck).then(() => {
                return appBrowsePanel.clickOnUninstallButton()
            }).then(() => {
                return uninstallDialog.waitForOpened();
            }).then(() => {
                return uninstallDialog.clickOnYesButton();
            })
        }).catch(error => {
            // just carry on, item is not present in grid
        }).then(() => {
            appBrowsePanel.clickOnInstallButton();
        }).then(() => {
            return dialog.waitForOpened();
        }).then(opened => {
            assert.isTrue(opened, 'Install dialog should\'ve been opened');
            return dialog.clickOnInstallAppLink(chuck);
        }).then(() => {
            return dialog.waitForAppInstalled(chuck);
        }).then(visible => {
            assert.isTrue(visible, `'${chuck}' should've been installed by now`);
            return dialog.clickOnCancelButtonTop();
        }).then(() => {
            return dialog.waitForClosed();
        }).then(closed => {
            assert.isTrue(closed, 'Install dialog should\'ve been closed');
            return appBrowsePanel.isItemDisplayed(chuck);
        }).then(visible => {
            assert.isTrue(visible, `'${chuck}' application should've been present in the grid`);
            return appBrowsePanel.waitForNotificationMessage();
        }).then(text => {
            assert.equal(text, 'Application \'Chucknorris\' installed successfully', `Incorrect notification message [${text}]`)
        });
    });

    beforeEach(() => studioUtils.navigateToApplicationsApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseCurrentBrowserTab(webDriverHelper.browser));
});
