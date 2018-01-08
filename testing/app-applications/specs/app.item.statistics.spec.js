const chai = require('chai');
const assert = chai.assert;
chai.use(require('chai-as-promised'));
const webDriverHelper = require('../libs/WebDriverHelper');
const studioUtils = require('../libs/studio.utils.js');
const appBrowsePanel = require('../page_objects/applications/applications.browse.panel');
const appStatisticPanel = require('../page_objects/applications/application.item.statistic.panel');

const Apps = {
    superheroBlog: 'Superhero Blog',
    simpeIdProvider: 'Simple ID Provider'
};

const startSelectedApp = () => appBrowsePanel.isStartButtonEnabled()
    .then(enabled => (enabled ? appBrowsePanel.clickOnStartButton().pause(1000) : Promise.resolve(true)));
const stopSelectedApp = () => appBrowsePanel.isStopButtonEnabled()
    .then(enabled => (enabled ? appBrowsePanel.clickOnStopButton().pause(1000) : Promise.resolve(true)));

describe('Item Statistics Panel', function () {
    beforeEach(() => studioUtils.navigateToApplicationsApp(webDriverHelper.browser));
    afterEach(() => studioUtils.doCloseCurrentBrowserTab(webDriverHelper.browser));

    this.timeout(70000);
    webDriverHelper.setupBrowser();

    // Presume Applications are already installed

    it(`should display info for the running selected application`,
        () => appBrowsePanel.clickOnRowByDisplayName(Apps.superheroBlog)
            .then(appStatisticPanel.getApplicationName)
            .then(title => assert.strictEqual(title, Apps.superheroBlog, `Application should be "${Apps.superheroBlog}".`))
            .then(startSelectedApp)
            .then(appStatisticPanel.getApplicationDataText)
            .then(data => {
                assert.strictEqual(data.length, 4, 'Application should have four data values.');
                data.forEach(value => assert.isFalse(!value, 'Application\'s data should not be empty.'));
            }).then(appStatisticPanel.getSiteDataCount)
            .then(count => assert.isAbove(count, 1, 'Application should have multiple site data.'))
    );

    it(`should display info for the stopped selected application`,
        () => appBrowsePanel.clickOnRowByDisplayName(Apps.superheroBlog)
            .then(stopSelectedApp)
            .then(appStatisticPanel.getSiteDataCount)
            .then(count => assert.strictEqual(count, 1, 'Stopped application should not have site data'))
            .then(startSelectedApp)
    );

    it(`should display info of the last selected application`, () =>
        appBrowsePanel.clickCheckboxAndSelectRowByDisplayName(Apps.simpeIdProvider)
            .then(() => appBrowsePanel.clickCheckboxAndSelectRowByDisplayName(Apps.superheroBlog).pause(1000))
            .then(appStatisticPanel.getApplicationName)
            .then(title => assert.strictEqual(title, Apps.superheroBlog, `Selected application should be "${Apps.superheroBlog}".`))
    );
});
