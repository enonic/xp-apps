/**
 * Created on 21.02.2018.
 */
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const webDriverHelper = require('../libs/WebDriverHelper');
const appConstant = require('../libs/app_const');
const studioUtils = require('../libs/studio.utils.js');
const issueListDialog = require('../page_objects/issue/issue.list.dialog');
const createIssueDialog = require('../page_objects/issue/create.issue.dialog');
const issueDetailsDialog = require('../page_objects/issue/issue.details.dialog');


describe('issue.details.dialog.spec: Issue Details Dialog specification', function () {
    this.timeout(appConstant.SUITE_TIMEOUT);
    webDriverHelper.setupBrowser();
    let issueTitle = appConstant.generateRandomName('issue')
    it(`WHEN new issue has been created THEN correct notification should be displayed`,
        () => {
            this.bail(1);
            return studioUtils.openCreateIssueDialog().then(()=> {
                return createIssueDialog.typeTitle(issueTitle);
            }).then(result=> {
                return createIssueDialog.clickOnCreateIssueButton();
            }).then(()=> {
                return createIssueDialog.waitForNotificationMessage();
            }).then((result)=> {
                return assert.isTrue(result == 'New issue created successfully.',
                    'correct notification message should appear');
            });
        });
    it(`GIVEN issues list dialog is opened WHEN issue has been clicked THEN Issue Details dialog should be displayed`,
        () => {
            return studioUtils.openIssuesListDialog().then(()=> {
                return issueListDialog.clickOnIssue(issueTitle);
            }).then(()=> {
                return issueDetailsDialog.waitForDialogLoaded();
            }).then(()=> {
                return issueDetailsDialog.isCommentsTabBarItemActive();
            }).then(result=> {
                assert.isTrue(result, 'Comments Tab should be active');
            }).then(()=> {
                assert.eventually.isTrue(issueDetailsDialog.isCloseIssueButtonDisplayed(), 'Close Issue button should be present');
            }).then(()=> {
                assert.eventually.isTrue(issueDetailsDialog.isAddCommentButtonDisplayed(), 'Add Comment button should be displayed');
            }).then(()=> {
                assert.eventually.isFalse(issueDetailsDialog.isAddCommentButtonEnabled(), 'Add Comment button should be disabled');
            })
        });

    beforeEach(() => studioUtils.navigateToContentStudioApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseAllWindowTabsAndSwitchToHome(webDriverHelper.browser));
});
