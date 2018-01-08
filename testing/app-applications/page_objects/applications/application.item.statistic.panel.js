var page = require('../page');
var elements = require('../../libs/elements');
var dialog = {
    container: `//div[contains(@id,'NewContentDialog')]`,
};

const xpath = {
    main: `//div[contains(@id,'ApplicationItemStatisticsPanel')]`,
    header: `//div[contains(@id,'ItemStatisticsHeader')]`,
    title: `//div[contains(@id,'ItemStatisticsHeader')]/h1[contains(@class,'title')]`,
    dataContainer: `//div[contains(@id,'ApplicationItemStatisticsPanel')]/div[contains(@class,'application-data-container')]`,
    applicationData: `//div[contains(@id,'ApplicationItemStatisticsPanel')]/div[contains(@class,'application-data-container')]/div[contains(@class,'application')]//span`,
    siteDataHeaders: `//div[contains(@id,'ApplicationItemStatisticsPanel')]/div[contains(@class,'application-data-container')]/div[contains(@class,'site')]//li[contains(@class,'list-header')]`,
};

var applicationItemStatisticsPanel = Object.create(page, {
    getApplicationName: {
        value: function () {
            return this.getText(xpath.title);
        }
    },
    getDataContainer: {
        value: function () {
            return this.element(xpath.dataContainer);
        }
    },
    getApplicationDataText: {
        value: function () {
            return this.getText(xpath.applicationData);
        }
    },
    getSiteDataCount: {
        value: function () {
            return this.elements(xpath.siteDataHeaders).then((elements => elements.value.length));
        }
    }
});

module.exports = applicationItemStatisticsPanel;
