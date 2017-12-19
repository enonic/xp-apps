/**
 * Created on 15.12.2017.
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
var appConstant = require('../libs/app_const');
const contentBrowsePanel = require('../page_objects/browsepanel/content.browse.panel');
const studioUtils = require('../libs/studio.utils.js');
const imageSelectorForm = require('../page_objects/wizardpanel/imageselector.form.panel');
const contentWizard = require('../page_objects/wizardpanel/content.wizard.panel');
const contentBuilder = require("../libs/content.builder");


describe('content.image.selector: Image content specification', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let SITE;
    it(`WHEN site with content types has been added THEN the site should be listed in the grid`,
        () => {
            let displayName = contentBuilder.generateRandomName('site');
            SITE = contentBuilder.buildSite(displayName, 'description', ['All Content Types App']);
            return studioUtils.doAddSite(SITE).then(()=> {
            }).then(()=> {
                return studioUtils.findAndSelectItem(SITE.displayName);
            }).then(()=> {
                return contentBrowsePanel.isItemDisplayed(SITE.displayName);
            }).then(isDisplayed=> {
                assert.isTrue(isDisplayed, 'site should be listed in the grid');
            });
        });

    it(`GIVEN wizard for content with image-selector is opened WHEN name of image has been typed AND the option has been selected THEN new content should be listed in the grid`,
        () => {
            let images=[appConstant.TEST_IMAGES.RENAULT];
            let displayName = contentBuilder.generateRandomName('imgselector');
            let imgSelectorContent =contentBuilder.buildContentWithImageSelector(displayName, appConstant.contentTypes.IMG_SELECTOR_2_4,images);
            return studioUtils.selectSiteAndOpenNewWizard(SITE.displayName,imgSelectorContent.contentType).then(()=> {
                return contentWizard.typeData(imgSelectorContent);
            }).then(()=>{
                return contentWizard.waitAndClickOnSave();
            }).then(()=>{
                return studioUtils.doCloseWizardAndSwitchToGrid();
            }).then(()=>{
                return studioUtils.typeNameInFilterPanel(imgSelectorContent.displayName);
            }).then(()=> {
                return contentBrowsePanel.isItemDisplayed(imgSelectorContent.displayName);
            }).then(isDisplayed=> {
                assert.isTrue(isDisplayed, 'site should be listed in the grid');
            });
        });

    beforeEach(() => studioUtils.navigateToContentStudioApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseAllWindowTabsAndSwitchToHome(webDriverHelper.browser));
});
