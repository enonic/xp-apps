const page = require('../page');
const elements = require('../../libs/elements');
const xpath = {
    container: `//div[contains(@id,'IssueDetailsDialog')]`,
    issueNameInPlaceInput: `//div[contains(@id,'IssueDetailsInPlaceTextInput')]`,
    closeIssueButton: `//button[contains(@id,'DialogButton') and child::span[text()='Close Issue']]`,
    addCommentButton: `//button[contains(@id,'DialogButton') and child::span[text()='Add Comment']]`,
    itemsTabBarItem: "//li[contains(@id,'TabBarItem') and child::a[contains(.,'Items')]]",
    assigneesTabBarItem: "//li[contains(@id,'TabBarItem') and child::a[contains(.,'Assignees')]]",
    commentsTabBarItem: "//li[contains(@id,'TabBarItem') and child::a[contains(.,'Comments')]]",
    issueStatusSelector: `//div[contains(@id,'IssueStatusSelector')]`,
    issueCommentTextArea: `//div[contains(@id,'IssueCommentTextArea')]`,
    issueCommentsListItem: `//div[contains(@id,'IssueCommentsListItem')]`,
    issueCommentsListItemByText: text => `${xpath.issueCommentsListItem}//p[@class='inplace-text' and text()='${text}']`,

};
const issueDetailsDialog = Object.create(page, {

    closeIssueButton: {
        get: function () {
            return `${xpath.container}` + `${xpath.closeIssueButton}`;
        }
    },
    addCommentButton: {
        get: function () {
            return `${xpath.container}` + `${xpath.addCommentButton}`;
        }
    },
    issueCommentTextArea: {
        get: function () {
            return `${xpath.container}` + `${xpath.issueCommentTextArea}` + `${elements.TEXT_AREA}`;
        }
    },
    itemsTabBarItem: {
        get: function () {
            return `${xpath.container}` + `${xpath.itemsTabBarItem}`;
        }
    },
    commentsTabBarItem: {
        get: function () {
            return `${xpath.container}` + `${xpath.commentsTabBarItem}`;
        }
    },
    assigneesTabBarItem: {
        get: function () {
            return `${xpath.container}` + `${xpath.assigneesTabBarItem}`;
        }
    },

    cancelTopButton: {
        get: function () {
            return `${xpath.container}` + `${elements.CANCEL_BUTTON_TOP}`;
        }
    },

    waitForDialogLoaded: {
        value: function () {
            return this.waitForVisible(this.closeIssueButton, 1000);
        }
    },
    waitForDialogClosed: {
        value: function () {
            return this.waitForNotVisible(`${xpath.container}`, 1000);
        }
    },

    isDialogPresent: {
        value: function () {
            return this.isVisible(`${xpath.container}`);
        }
    },
    clickOnCancelTopButton: {
        value: function () {
            return this.doClick(this.cancelTopButton);
        }
    },
    clickOnCloseIssueButton: {
        value: function () {
            return this.doClick(this.closeIssueButton).catch(err=> {
                this.saveScreenshot('err_click_close_issue_button');
                throw  new Error('Error when click on the `Close Issue`  ' + err);
            })
        }
    },
    isCloseIssueButtonDisplayed: {
        value: function () {
            return this.isVisible(this.closeIssueButton).catch(err=> {
                this.saveScreenshot('err_visible_close_issue_button');
                throw  new Error('Issue Details Dialog: ' + err);
            })
        }
    },
    clickOnAddCommentButton: {
        value: function () {
            return this.doClick(this.addCommentButton).catch(err=> {
                this.saveScreenshot('err_click_add_comment_button');
                throw  new Error('Error when click on the `Add Comment`  ' + err);
            })
        }
    },
    isAddCommentButtonDisplayed: {
        value: function () {
            return this.isVisible(this.addCommentButton).catch(err=> {
                throw  new Error('Issue Details Dialog  ' + err);
            })
        }
    },
    isCommentTextAreaDisplayed: {
        value: function () {
            return this.isVisible(this.issueCommentTextArea).catch(err=> {
                throw  new Error('Issue Details Dialog  ' + err);
            })
        }
    },
    isAddCommentButtonEnabled: {
        value: function () {
            return this.isEnabled(this.addCommentButton).catch(err=> {
                throw  new Error('Issue Details Dialog  ' + err);
            })
        }
    },
    waitForAddCommentButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.addCommentButton).catch(err=> {
                throw  new Error('Issue Details Dialog  ' + err);
            })
        }
    },
    waitForAddCommentButtonDisabled: {
        value: function () {
            return this.waitForDisabled(this.addCommentButton).catch(err=> {
                throw  new Error('Issue Details Dialog  ' + err);
            })
        }
    },
    isCommentsTabBarItemActive: {
        value: function () {
            return this.getAttribute(this.commentsTabBarItem, 'class').then(result=> {
                return result.includes('active');
            }).catch(err=> {
                throw  new Error('Issue Details Dialog  ' + err);
            })
        }
    },

    getIssueName: {
        value: function () {
            return `${xpath.issueNameInPlaceInput}//h2`;
        }
    },
    typeComment: {
        value: function (text) {
            return this.typeTextInInput(this.issueCommentTextArea, text).catch(err=> {
                this.saveScreenshot('err_type_text_in_area');
                throw new Error('error type text in issue comment: ' + err)
            })
        }
    },
    isCommentPresent: {
        value: function (text) {
            let selector = xpath.issueCommentsListItemByText(text);
            return this.isVisible(selector).catch(err=> {
                this.saveScreenshot('err_get_comment_issue');
                throw new Error('error when get issue comment: ' + err)
            })
        }
    }

});
module.exports = issueDetailsDialog;
