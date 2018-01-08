/**
 * Created on 12/12/2017.
 */

const page = require('./page');
var xpTourDialog = {
    container: `div[class*='xp-tour']`
};
const home = {
    container: `div[class*='home-main-container']`
};
var homePage = Object.create(page, {

    closeXpTourButton: {
        get: function () {
            return `${xpTourDialog.container} div[class='cancel-button-top']`
        }
    },
    waitForXpTourVisible: {
        value: function (ms) {
            return this.waitForVisible(`${xpTourDialog.container}`, ms);
        }
    },
    waitForLoaded: {
        value: function (ms) {
            return this.waitForVisible(`${home.container}`, ms);
        }
    },
    doCloseXpTourDialog: {
        value: function () {
            return this.doClick(this.closeXpTourButton);
        }
    },
});
module.exports = homePage;
