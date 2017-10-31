var i18n = require('/lib/xp/i18n');
var admin = require('/lib/xp/admin');
var portal = require('/lib/xp/portal');
var mustache = require('/lib/xp/mustache');
var contentLib = require('/lib/xp/content');

var nodeLib = require('/lib/xp/node');
var repoId = 'favourites';

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
            bundles: ['admin/i18n/common'],
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
            bundles: ['admin/i18n/common'],
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
                bundles: ['admin/i18n/common'],
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
        dashboardIcons: dashboardIcons,
        favIcons: getFavs()
    };

    return {
        contentType: 'text/html',
        body: mustache.render(view, params)
    };

};

// Find all entry keys.
var getFavs = function () {
    var repo = nodeLib.connect({
        repoId: repoId,
        branch: 'master',
        principals: ['role:system.admin'],
        user: {
            login: 'su'
        }
    });

    var result = repo.findChildren({
        parentKey: '/',
        start: 0,
        count: 10000,
        recursive: false
    });
    
    var entries = [];
    for (var i = 0; i < result.hits.length; i++) {
        var node = repo.get(result.hits[i].id);
        var content = contentLib.get({
            key: node._name,
            branch: 'draft'
        });
        
        if (node) {
            entries.push({
                id: node._name,
                link: 'tool/com.enonic.xp.app.contentstudio/main#/edit/' + node._name,
                src: 'rest/schema/content/icon/' + content.type,
                caption: content.displayName
            });
        }
    }

    return entries;
};
