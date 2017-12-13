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
    waitForXpTourClosed: {
        value: function () {
            return this.waitForNotVisible(`${xpTourDialog.container}`, 3000).catch(error=> {
                this.saveScreenshot('err_xp_tour_dialog_not_closed');
                throw new Error('Xp-tour dialog not closed');
            });
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