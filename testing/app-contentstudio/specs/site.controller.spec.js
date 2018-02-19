/**
 * Created on 01.02.2018.
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const appConstant = require('../libs/app_const');
const contentBrowsePanel = require('../page_objects/browsepanel/content.browse.panel');
const studioUtils = require('../libs/studio.utils.js');
const contentWizard = require('../page_objects/wizardpanel/content.wizard.panel');
const contentBuilder = require("../libs/content.builder");
const pageInspectionPanel = require('../page_objects/wizardpanel/liveform/page.inspection.panel');
const contextWindow = require('../page_objects/wizardpanel/liveform/liveform.context.window');


describe('site.configurator.required.input.spec: verifies the wizard-validation when the dialog contains required input', function () {
    this.timeout(appConstant.SUITE_TIMEOUT);
    webDriverHelper.setupBrowser();

    let SITE;
    it(`GIVEN existing site is opened WHEN 'edit' button on the 'selected-option-view' has been clicked THEN 'site configurator dialog should appear'`,
        () => {
            this.bail(1);
            let displayName = contentBuilder.generateRandomName('site');
            SITE = contentBuilder.buildSite(displayName, 'test for site configurator', [appConstant.APP_CONTENT_TYPES]);
            return studioUtils.doOpenSiteWizard().then(()=> {
                return contentWizard.typeData(SITE);
            }).then(()=> {
                return contentWizard.selectPageDescriptor('Page');
            }).pause().then(()=> {
                return contextWindow.clickOnInspectTabBarItem();
            }).then(()=> {
                return pageInspectionPanel.getPageTemplateDropdownOptions();
            }).then(result=> {
                let expectedOption = `( no default template found )`;
                assert.isTrue(result[0] == expectedOption, 'correct name for automatic template should be displayed');
            })
        });

    beforeEach(() => studioUtils.navigateToContentStudioApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseAllWindowTabsAndSwitchToHome(webDriverHelper.browser));
    before(()=> {
        return console.log('specification starting: ' + this.title);
    });
});
