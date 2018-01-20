var t = require('/lib/xp/testing');
var auth = require('/lib/auth');

var expectedJson = {
    key: 'myUserStore',
    displayName: 'User store test',
    description: 'User store used for testing',
    authConfig: {
        applicationKey: 'com.enonic.app.test',
        config: [
            {
                name: 'title',
                type: 'String',
                values: [
                    {
                        v: 'App Title'
                    }
                ]
            },
            {
                name: 'avatar',
                type: 'Boolean',
                values: [
                    {
                        v: true
                    }
                ]
            },
            {
                name: 'forgotPassword',
                type: 'PropertySet',
                values: [
                    {
                        set: [
                            {
                                name: 'email',
                                type: 'String',
                                values: [
                                    {
                                        v: 'noreply@example.com'
                                    }
                                ]
                            },
                            {
                                name: 'site',
                                type: 'String',
                                values: [
                                    {
                                        v: 'MyWebsite'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
};

exports.modifyUserStore = function () {
    var result = auth.modifyUserStore({
        key: 'myUserStore',
        editor: function (userStore) {
            var newUserStore = userStore;
            newUserStore.displayName = 'User store test';
            newUserStore.description = 'User store used for testing';
            newUserStore.authConfig = {
                applicationKey: 'com.enonic.app.test',
                config: [
                    {
                        name: 'title',
                        type: 'String',
                        values: [
                            {
                                v: 'App Title'
                            }
                        ]
                    },
                    {
                        name: 'avatar',
                        type: 'Boolean',
                        values: [
                            {
                                v: true
                            }
                        ]
                    },
                    {
                        name: 'forgotPassword',
                        type: 'PropertySet',
                        values: [
                            {
                                set: [
                                    {
                                        name: 'email',
                                        type: 'String',
                                        values: [
                                            {
                                                v: 'noreply@example.com'
                                            }
                                        ]
                                    },
                                    {
                                        name: 'site',
                                        type: 'String',
                                        values: [
                                            {
                                                v: 'MyWebsite'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
            return newUserStore
        },
        permissions: [
            {
                principal: 'user:myUserStore:user',
                access: 'ADMINISTRATOR'
            },
            {
                principal: 'group:myUserStore:group',
                access: 'CREATE_USERS'
            }
        ]
    });

    t.assertJsonEquals(expectedJson, result);
};

