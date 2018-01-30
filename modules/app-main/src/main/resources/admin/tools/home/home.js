var i18n = require('/lib/xp/i18n');
var admin = require('/lib/xp/admin');
var portal = require('/lib/xp/portal');
var mustache = require('/lib/xp/mustache');

exports.get = function () {

    var busIconUrl = portal.assetUrl({path: "icons/bus.svg"});
    var infoIconUrl = portal.assetUrl({path: "icons/info-with-circle.svg"});
    var docsIconUrl = portal.assetUrl({path: "icons/docs.svg"});
    var forumIconUrl = portal.assetUrl({path: "icons/discuss.svg"});
    var marketIconUrl = portal.assetUrl({path: "icons/market.svg"});

    var docLinkPrefix = 'http://docs.enonic.com/en/';
    var isLatestSnapshot = app.version.endsWith('.0.SNAPSHOT');

    if (isLatestSnapshot) {
        docLinkPrefix += 'latest';
    } else {
        var versionParts = app.version.split('.');
        docLinkPrefix += versionParts[0] + '.' + versionParts[1];
    }

    var locales = admin.getLocales();
    var dashboardIcons = [{
        src: infoIconUrl,
        cls: 'xp-about',
        caption: i18n.localize({
            key: 'home.dashboard.about',
            bundles: ['i18n/common'],
            locale: locales
        })
    }, {
        src: docsIconUrl,
        cls: '',
        caption: 'Docs',
        link: docLinkPrefix + '/'
    }, {
        src: forumIconUrl,
        cls: '',
        caption: 'Discuss',
        link: 'https://discuss.enonic.com/'
    }, {
        src: marketIconUrl,
        cls: '',
        caption: i18n.localize({
            key: 'home.dashboard.market',
            bundles: ['i18n/common'],
            locale: locales
        }),
        link: 'https://market.enonic.com/'
    }];

    var tourEnabled = !(app.config.tourDisabled || false);
    if (tourEnabled) {
        dashboardIcons.splice(0, 0, {
            src: busIconUrl,
            cls: 'xp-tour',
            caption: i18n.localize({
                key: 'home.dashboard.tour',
                bundles: ['i18n/common'],
                locale: locales
            })
        });
    }

    var view = resolve('./home.html');
    var params = {
        adminUrl: admin.getBaseUri(),
        assetsUri: portal.assetUrl({
            path: ''
        }),
        backgroundUri: portal.assetUrl({
            path: 'images/background.jpg'
        }),
        adminAssetsUri: admin.getAssetsUri(),
        xpVersion: app.version,
        docLinkPrefix: docLinkPrefix,
        tourEnabled: tourEnabled,
        messages: admin.getPhrases(),
        dashboardIcons: dashboardIcons
    };

    return {
        contentType: 'text/html',
        body: mustache.render(view, params)
    };

};

