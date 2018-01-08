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
            parameters: parameters
        };
    },
    buildSite: function (displayName, description, applications) {
        return {
            contentType: appConst.contentTypes.SITE,
            displayName: displayName,

            data: {
                description: description,
                applications: applications
            },
        };
    },
    buildContentWithImageSelector: function (displayName, contentType, images) {
        return {
            contentType: contentType,
            displayName: displayName,

            data: {
                images: images,
            },
        };
    },
    buildArticleContent: function (displayName, title, body, contentType) {
        return {
            contentType: contentType,
            displayName: displayName,

            data: {
                title: title,
                body: body,
            },
        };
    },

};
