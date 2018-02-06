/**
 * Created by on 6/26/2017.
 */
var page = require('./page');
var panel = {
    container: `div[class^='launcher-main-container']`
};

var launcherPanel = Object.create(page, {
    /**
     * define elements
     */
    homeLink: {
        get: function () {
            return `${panel.container} a[data-id*='home']`
        }
    },
    applications: {
        get: function (userName) {
            return `${panel.container} a[data-id*='app.applications']`
        }
    },
    contentStudioLink: {
        get: function () {
            return `${panel.container} a[data-id*='app.contentstudio']`
        }
    },
    usersLink: {
        get: function () {
            return `${panel.container} a[data-id*='app.users']`
        }
    },

    clickOnUsersLink: {
        value: function () {
            return this.waitForVisible(this.usersLink, 2000).then(()=> {
                return this.doClick(this.usersLink).catch(err=> {
                    console.log('err when click on Users link' + err);
                    throw new Error(err);
                })
            })
        }
    },
    waitForPanelVisible: {
        value: function (ms) {
            return this.waitForVisible(`${panel.container}`, ms).catch((err)=> {
                console.log('launcher panel is not visible  ' + err)
                return false;
            })
        }
    },

});
module.exports = launcherPanel;
