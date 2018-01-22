var common = require('./common');
var authLib = require('./auth');

var Permission = {
    READ: 'READ',
    CREATE: 'CREATE',
    MODIFY: 'MODIFY',
    DELETE: 'DELETE',
    PUBLISH: 'PUBLISH',
    READ_PERMISSIONS: 'READ_PERMISSIONS',
    WRITE_PERMISSIONS: 'WRITE_PERMISSIONS',
    admin: function() {
        return [
            Permission.READ,
            Permission.CREATE,
            Permission.MODIFY,
            Permission.DELETE,
            Permission.PUBLISH,
            Permission.READ_PERMISSIONS,
            Permission.WRITE_PERMISSIONS
        ];
    },
    manager: function() {
        return [
            Permission.READ,
            Permission.CREATE,
            Permission.MODIFY,
            Permission.DELETE
        ];
    },
    write: function() {
        return Permission.manager();
    },
    create: function() {
        return [Permission.CREATE];
    },
    read: function() {
        return [Permission.READ];
    }
};

var Access = {
    READ: 'READ',
    CREATE_USERS: 'CREATE_USERS',
    WRITE_USERS: 'WRITE_USERS',
    USER_STORE_MANAGER: 'USER_STORE_MANAGER',
    ADMINISTRATOR: 'ADMINISTRATOR'
};

module.exports = {
    getByKey: function(key) {
        return authLib.getUserStore({key : key});
    },
    list: authLib.getUserStores,
    create: function(params) {
        var name = common.required(params, 'key');

        return authLib.createUserStore({
            name: common.prettifyName(name),
            displayName: params.displayName,
            description: params.description,
            authConfig: params.authConfig,
            permissions: params.permissions,
        });
    },
    update: function(params) {
        var key = common.required(params, 'key');

        return authLib.modifyUserStore({
            key: key,
            editor: function (userStore) {
                var newUserStore = userStore;
                newUserStore.displayName = params.displayName;
                newUserStore.description = params.description;
                newUserStore.authConfig = params.authConfig;
                return newUserStore;
            },
            permissions: params.permissions
        });
    },
    delete: function(keys) {
        common.delete(common.keysToPaths(keys));

        // TODO: find which keys could not be deleted with reasons instead of returning all
        return keys.map(function(key) {
            return {
                key: key,
                deleted: true,
                reason: ''
            };
        });
    },
    getIdProviderMode: function(applicationKey) {
        return authLib.getIdProviderMode({key:applicationKey});
    },
    getPermissions: function(key) {
        return authLib.getPermissions({key:key});
    }
};

function calculateIdProviderMode(authConfig) {
    var appKey = authConfig && authConfig.applicationKey;
    if (appKey) {
        // TODO: get idProvider
        // return = idProvider.getMode();
    }
    return undefined;
}

function calculateIdProvider(authConfig) {
    if (authConfig) {
        return {
            applicationKey: authConfig.applicationKey,
            config:
                authConfig.config && authConfig.config.length > 0
                    ? authConfig.config
                    : [{}]
        };
    }
    return undefined;
}

function calculateUserStorePermissions(access) {
    var permissions = [];
    access.forEach(function(acc) {
        if (acc.access === Access.ADMINISTRATOR) {
            permissions.push({
                principal: acc.principal.key,
                allow: Permission.admin()
            });
        }
    });
    return permissions;
}

function calculateGroupsPermissions(access) {
    var permissions = [];
    access.forEach(function(acc) {
        switch (acc.access) {
            case Access.ADMINISTRATOR:
                permissions.push({
                    principal: acc.principal.key,
                    allow: Permission.admin()
                });
                break;
            case Access.USER_STORE_MANAGER:
                permissions.push({
                    principal: acc.principal.key,
                    allow: Permission.manager()
                });
                break;
            default: // none
        }
    });

    return permissions;
}

function calculateUsersPermissions(access) {
    var permissions = [];
    access.forEach(function(acc) {
        switch (acc.access) {
            case Access.ADMINISTRATOR:
                permissions.push({
                    principal: acc.principal.key,
                    allow: Permission.admin()
                });
                break;
            case Access.USER_STORE_MANAGER:
                permissions.push({
                    principal: acc.principal.key,
                    allow: Permission.manager()
                });
                break;
            case Access.WRITE_USERS:
                permissions.push({
                    principal: acc.principal.key,
                    allow: Permission.write()
                });
                break;
            case Access.CREATE_USERS:
                permissions.push({
                    principal: acc.principal.key,
                    allow: Permission.create()
                });
                break;
            case Access.READ:
                permissions.push({
                    principal: acc.principal.key,
                    allow: Permission.read()
                });
                break;
            default: // none
        }
    });
    return permissions;
}

function rolesFilter(hit) {
    return hit._name !== 'roles';
}

function createUserstoreQuery(path) {
    return '_parentPath="/identity' + (path || '') + '"';
}

function calculateAccess(userStore, userNode, groupNode) {
    var isRole = !rolesFilter(userStore);

    if (!isRole) {
        var newUserNode =
            userNode ||
            common.querySingle(
                '_path="/identity/' + userStore._name + '/users"'
            );
        var newGroupNode =
            groupNode ||
            common.querySingle(
                '_path="/identity/' + userStore._name + '/groups"'
            );

        var uniques = {};
        var ps = getPrincipals(userStore)
            .concat(getPrincipals(newUserNode), getPrincipals(newGroupNode))
            .filter(function(item) {
                var existing = uniques[item];
                if (!existing) {
                    uniques[item] = true;
                }
                return !existing;
            });
        var accesses = [];
        ps.forEach(function(p) {
            var access = null;
            if (
                isAllowedFor(userStore, p, Permission.admin()) &&
                isAllowedFor(newUserNode, p, Permission.admin()) &&
                isAllowedFor(newGroupNode, p, Permission.admin())
            ) {
                access = Access.ADMINISTRATOR;
            } else if (
                isAllowedFor(newUserNode, p, Permission.manager()) &&
                isAllowedFor(newGroupNode, p, Permission.manager())
            ) {
                access = Access.USER_STORE_MANAGER;
            } else if (isAllowedFor(newUserNode, p, Permission.write())) {
                access = Access.WRITE_USERS;
            } else if (isAllowedFor(newUserNode, p, Permission.create())) {
                access = Access.CREATE_USERS;
            } else if (isAllowedFor(newUserNode, p, Permission.read())) {
                access = Access.READ;
            }
            if (access) {
                accesses.push({
                    principal: p,
                    access: access
                });
            }
        });
        // eslint-disable-next-line no-param-reassign
        userStore.access = accesses;
    }
}

function getPrincipals(store) {
    return store._permissions.map(function(p) {
        return p.principal;
    });
}

function isAllowedFor(store, principalKey, actions) {
    return (
        store._permissions &&
        store._permissions.some(function(perm) {
            return (
                principalKey === perm.principal &&
                actions.every(function(a) {
                    return perm.allow.indexOf(a) >= 0;
                })
            );
        })
    );
}
