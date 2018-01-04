const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const appBrowsePanel = require('../page_objects/applications/applications.browse.panel');
const installAppDialog = require('../page_objects/applications/install.app.dialog');
const studioUtils = require('../libs/studio.utils.js');

describe('Install Application Dialog specification', function () {
    this.timeout(180000);
    webDriverHelper.setupBrowser();

    it(`WHEN Install button has been clicked THEN Install App dialog should be present`, () => {
        return appBrowsePanel.clickOnInstallButton().then(()=> {
            return installAppDialog.waitForOpened();
        }).then(()=> {
            return installAppDialog.getPlaceholderMessage();
        }).then(placeholder=> {
            assert.isTrue(placeholder == 'Search Enonic Market, paste url or upload directly',
                'Correct message should be in the placeholder');
        })
    });
    it(`GIVEN Install App Dialog is opened WHEN search text has been typed THEN Install App dialog should be present`, () => {
        return appBrowsePanel.clickOnInstallButton().then(()=> {
            return installAppDialog.waitForOpened();
        }).then(()=> {
            return installAppDialog.typeSearchText('Chuck Norris');
        }).then(()=> {
            return installAppDialog.isApplicationPresent('Chuck Norris');
        }).then(isPresent=> {
            assert.isTrue(isPresent, 'required application should be filtered');
        })
    });

    beforeEach(() => studioUtils.navigateToApplicationsApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseCurrentBrowserTab(webDriverHelper.browser));
});
