/**
 * Created on 6.04.2018.
 *
 * Verifies xp-apps#686 "Template Wizard - Inspection Panel should appear after page controller is selected"
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../../libs/WebDriverHelper');
const appConstant = require('../../libs/app_const');
const contentBrowsePanel = require('../../page_objects/browsepanel/content.browse.panel');
const studioUtils = require('../../libs/studio.utils.js');
const contentWizard = require('../../page_objects/wizardpanel/content.wizard.panel');
const contentBuilder = require("../../libs/content.builder");
const liveContextWindow = require('../../page_objects/wizardpanel/liveform/liveform.context.window');

describe('page.template.controller: select a controller in a template-wizard', function () {
    this.timeout(appConstant.SUITE_TIMEOUT);
    webDriverHelper.setupBrowser();

    let SITE;
    let TEMPLATE;
    let SUPPORT = 'Site';
    let CONTROLLER_NAME = 'main region';

    it(`WHEN new site has been added THEN the site should be listed in the grid`,
        () => {
            this.bail(1);
            let displayName = contentBuilder.generateRandomName('site');
            SITE = contentBuilder.buildSite(displayName, 'description', ['All Content Types App']);
            return studioUtils.doAddSite(SITE).then(()=> {
            }).then(()=> {
                studioUtils.saveScreenshot(displayName + '_created');
                return studioUtils.findAndSelectItem(SITE.displayName);
            }).then(()=> {

                return contentBrowsePanel.waitForContentDisplayed(SITE.displayName);
            }).then(isDisplayed=> {
                assert.isTrue(isDisplayed, 'site should be listed in the grid');
            });
        });
    // verifies the xp-apps#686 "Template Wizard - Inspection Panel should appear after page controller is selected"
    it(`GIVEN template wizard is opened WHEN controller has been selected THEN Live Context Window should be loaded automatically`,
        () => {
            let templateName = contentBuilder.generateRandomName('template');
            TEMPLATE = contentBuilder.buildPageTemplate(templateName, SUPPORT, CONTROLLER_NAME);
            return studioUtils.doOpenPageTemplateWizard(SITE.displayName).then(()=> {
                return contentWizard.typeDisplayName(TEMPLATE.displayName);
            }).then(()=> {
                return contentWizard.selectPageDescriptor(CONTROLLER_NAME);
            }).then(()=> {
                return liveContextWindow.waitForOpened();
            }).then(isDisplayed=> {
                studioUtils.saveScreenshot('template_context_window_should_be_loaded');
                assert.isTrue(isDisplayed, 'Context Window should be loaded automatically');
            });
        });

    beforeEach(() => studioUtils.navigateToContentStudioApp());
    afterEach(() => studioUtils.doCloseAllWindowTabsAndSwitchToHome());
    before(()=> {
        return console.log('specification starting: ' + this.title);
    });
});
