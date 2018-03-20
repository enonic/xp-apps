/**
 * Created on 10.10.2017.
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const groupWizard = require('../page_objects/wizardpanel/group.wizard');
const testUtils = require('../libs/test.utils');
const userItemsBuilder = require('../libs/userItems.builder.js');

describe('`group.wizard.spec` - validation and check inputs', function () {
    this.timeout(70000);
    webDriverHelper.setupBrowser();
    let testGroup;
    it('WHEN `Group` wizard is opened  THEN red circle should be present, because required inputs are empty',
        () => {
            return testUtils.clickOnSystemAndOpenGroupWizard().then(()=> {
                return groupWizard.waitUntilInvalidIconAppears('<Unnamed Group>');
            }).then((isRedIconPresent)=> {
                assert.isTrue(isRedIconPresent, 'red circle should be present on the tab, because required inputs are empty');
            })
        });

    it('WHEN `Group` wizard is opened THEN all required inputs should be present on the page',
        () => {
            return testUtils.clickOnSystemAndOpenGroupWizard().then(()=> {
                return expect(groupWizard.isRoleOptionFilterInputDisplayed()).to.eventually.be.true;
            }).then(()=> {
                return expect(groupWizard.isMemberOptionFilterInputDisplayed()).to.eventually.be.true;
            }).then(()=> {
                return expect(groupWizard.isDescriptionInputDisplayed()).to.eventually.be.true;
            })
        });

    it('GIVEN `Group` wizard is opened WHEN name and description has been typed THEN red circle should not be present on the tab',
        () => {
            testGroup =
                userItemsBuilder.buildGroup(userItemsBuilder.generateRandomName('group'), 'test group', null, null);
            return testUtils.clickOnSystemAndOpenGroupWizard().then(()=> {
                return groupWizard.typeData(testGroup);
            }).then(()=> {
                return groupWizard.waitUntilInvalidIconDisappears(testGroup.displayName);
            }).then((isRedIconNotPresent)=> {
                assert.isTrue(isRedIconNotPresent, 'red circle should not be present on the tab, because all required inputs are filled');
            }).then(()=> {
                return expect(groupWizard.waitForSaveButtonEnabled()).to.eventually.be.true;
            });
        });

    it('GIVEN `Group` wizard is opened WHEN name input has been cleared THEN red circle should appears on the tab',
        () => {
            testGroup =
                userItemsBuilder.buildGroup(userItemsBuilder.generateRandomName('group'), 'test group', null, null);
            return testUtils.clickOnSystemAndOpenGroupWizard().then(()=> {
                return groupWizard.typeData(testGroup);
            }).then(()=> {
                return groupWizard.clearDisplayNameInput();
            }).then(()=> {
                return groupWizard.waitUntilInvalidIconAppears('<Unnamed Group>');
            }).then((isRedIconPresent)=> {
                assert.isTrue(isRedIconPresent, 'red circle should appears on the tab, because name input has been cleared');
            }).then(()=> {
                return expect(groupWizard.waitForSaveButtonDisabled()).to.eventually.be.true;
            });
        });

    beforeEach(() => testUtils.navigateToUsersApp());
    afterEach(() => testUtils.doCloseUsersApp());
    before(()=> {
        return console.log('specification starting: ' + this.title);
    });
});
