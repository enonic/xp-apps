/**
 * Created on 6/30/2017.
 */
const appConst = require('./app_const');
module.exports = {
    generateRandomName: function (part) {
        return part + Math.round(Math.random() * 1000000);
    },

    buildShortcut: function (displayName, targetDisplayName, parameters) {
        return {
            contentType: appConst.contentTypes.SHORTCUT,
            displayName: displayName,
            data: {
                targetDisplayName: targetDisplayName
            },
            parameters: parameters,
        };
    },

};
