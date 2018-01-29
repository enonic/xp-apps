const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const appBrowsePanel = require('../page_objects/applications/applications.browse.panel');
const installAppDialog = require('../page_objects/applications/install.app.dialog');
const uninstallDialog = require('../page_objects/applications/uninstall.app.dialog');
const studioUtils = require('../libs/studio.utils.js');
const appConst = require('../libs/app_const');

describe(`Applications Grid context menu`, function () {
    this.timeout(appConst.SUITE_TIMEOUT);
    webDriverHelper.setupBrowser();

    it(`context menu should initially not be visible`, () => {
        return appBrowsePanel.waitForContextMenuNotDisplayed().then((result)=> {
            assert.isTrue(result, 'context menu should initially not be visible');
        })
    });

    it(`WHEN right click an an application THEN context menu should appear`, () => {
        return appBrowsePanel.rightClickOnRowByDisplayName(appConst.TEST_APPLICATIONS.FIRST_APP).then(()=> {
            return appBrowsePanel.waitForContextMenuDisplayed();
        }).then(result=> {
            studioUtils.saveScreenshot(webDriverHelper.browser, "app_context_menu");
            assert.isTrue(result, 'context menu should be visible');
        })
    });


//
//     describe(`what happens after an application is right-clicked in the Grid`, function () {
//
//         beforeEach(() => appBrowsePanel.rightClickOnRowByDisplayName(installedAppName));
//         afterEach(() => appBrowsePanel.clickOnRowByDisplayName(installedAppName));
//
//         it(`should select the installed app in the Grid`, () => {
//             return appBrowsePanel.getSelectedRowByDisplayName(installedAppName)
//             .catch(err => {
//                 throw 'Required application is not found';
//             });
//         });
//
//         it(`should open the context menu`, () => {
//             return appBrowsePanel.waitForContextMenuDisplayed()
//                 .catch(err => {
//                     throw `Context menu didn't open on right click`;
//                 });
//         });
//
//         it(`buttons inside the context menu should have correct state`, () => {
//             return appBrowsePanel.getContextButton('Start', 'disabled')
//                 .then(() => appBrowsePanel.getContextButton('Stop'))
//                 .then(() => appBrowsePanel.getContextButton('Uninstall'))
//                 .catch(err => {
//                     throw `Context button has incorrect status ` + err;
//                 });
//         });
//
//         it(`should close the context menu after clicking on the same row`, () => {
//             return appBrowsePanel.waitForContextMenuDisplayed()
//                 .then(() => appBrowsePanel.clickOnRowByDisplayName(installedAppName))
//                 .then(() => appBrowsePanel.waitForContextMenuNotDisplayed())
//                 .catch(err => {
//                     throw `Context menu didn't close after second click`;
//                 });
//         });
//
//     });

    beforeEach(() => studioUtils.navigateToApplicationsApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseCurrentBrowserTab(webDriverHelper.browser));

});

