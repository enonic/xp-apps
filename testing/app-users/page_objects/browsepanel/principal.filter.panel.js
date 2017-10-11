/**
 * Created on 12.09.2017.
 */

var page = require('../page');
var elements = require('../../libs/elements');
var panel = {
    container: "//div[contains(@id,'PrincipalBrowseFilterPanel')]",
    clearFilterButton: "//a[contains(@id,'ClearFilterButton']",
    searchInput: "//input[contains(@id,'browse.filter.TextSearchField')]"
};
var browseFilterPanel = Object.create(page, {

    clearFilterLink: {
        get: function () {
            return `${panel.container}` + `${panel.clearFilterButton}`;
        }
    },
    searchTextInput: {
        get: function () {
            return `${panel.container}` + `${panel.searchInput}`;
        }
    },
    typeSearchText: {
        value: function (text) {
            return this.typeTextInInput(this.searchTextInput, text);
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(`${panel.container}`, 3000);

        }
    },
    waitForClearLinkVisible: {
        value: function () {
            return this.waitForVisible(this.clearFilterLink)
        }
    },
    clickOnClearLink: {
        value: function () {
            return this.doClick(`${panel.clearFilterButton}`)
        }
    }
});
module.exports = browseFilterPanel;
