/**
 * Created on 05.09.2017.
 */
const chai = require('chai');
var should = require('chai').should
const assert = chai.assert;
var webDriverHelper = require('../libs/WebDriverHelper');
const userBrowsePanel = require('../page_objects/browsepanel/userbrowse.panel');
const userStoreWizard = require('../page_objects/wizardpanel/userstore.wizard');
const testUtils = require('../libs/test.utils');

const newPrincipalDialog = require('../page_objects/browsepanel/new.principal.dialog');

describe('New Principal dialog Spec', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    
    it(`GIVEN users grid is opened WHEN 'New' button has been clicked THEN modal dialog should appear with 4 items`,
        () => {
            return userBrowsePanel.clickOnNewButton().then(()=> {
                return newPrincipalDialog.waitForOpened();
            }).waitForVisible(newPrincipalDialog.header).then(result=> {
                assert.isTrue(result, 'description input should be present');
            }).then(()=>{
                return newPrincipalDialog.getItemNames()
            }).then((result)=>{
                assert.isTrue(result.length==4, '4 items should be present on the dialog');
            })
        });
    
    beforeEach(() => {
       return testUtils.navigateToUsersApp(webDriverHelper.browser)
    });
    afterEach(() => {
        return testUtils.doCloseUsersApp(webDriverHelper.browser)
    });
});
