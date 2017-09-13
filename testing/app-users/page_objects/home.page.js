/**
 * Created on 6/19/2017.
 */

var page = require('./page');
var xpTourDialog = {
    container: `div[class*='xp-tour']`
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
    doCloseXpTourDialog: {
        value: function () {
            return this.doClick(this.closeXpTourButton);
        }
    },
    switchToUsersTab: {
        value: function () {
            return this.getBrowser().getTabIds().then(tabs=> {
                return this.browser.switchTab(tabs[1]);
            })
            // return this.browser.getTabIds().then(handles => {
            //     handles.forEach((handle)=>{
            //         this.browser.switchTab(handle);
            //         if(new String(this.browser.getTitle()).valueOf()==new String("Users - Enonic XP Admin").valueOf()){
            //             return this.browser.switchTab(handle);
            //         }
            //     })
            //
            // });
        }
    },
});
module.exports = homePage;
