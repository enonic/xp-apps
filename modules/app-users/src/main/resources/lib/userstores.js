var common = require('./common');
var authLib = require('/lib/xp/auth');

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
    getByKey: function (key) {
        var args = {key: key};
        var userstore = authLib.getUserStore(args);
        if (userstore != null) {
            var authDescriptor = authLib.getAuthDescriptor(args);
            userstore.idProviderMode = authDescriptor ? authDescriptor.mode : null;
            userstore.permissions = authLib.getUserstorePermissions(args);
        }
        return userstore;
    },
    getByKeys: function(keys) {
        var result = common.queryAll({
            query:
                createUserstoreQuery() +
                ' AND ' +
                common.createQueryByField('_name', keys)
        });
        result.hits = result.hits.filter(rolesFilter);
        result.hits.forEach(function(hit) {
            calculateAccess(hit);
        });
        return common.singleOrArray(result.hits);
    },
    list: function(start, count, sort) {
        var result = common.queryAll({
            query: createUserstoreQuery(),
            start: start,
            count: count,
            sort: sort
        });
        result.hits = result.hits.filter(rolesFilter);
        result.hits.forEach(function(hit) {
            calculateAccess(hit);
        });
        return result;
    },
    create: function(params) {
        var name = common.required(params, 'key');
        var displayName = common.required(params, 'displayName');

        var createdStore = common.create({
            _parentPath: '/identity',
            _name: common.prettifyName(name),
            _permissions: calculateUserStorePermissions(params.permissions),
            displayName: displayName,
            description: params.description,
            idProvider: calculateIdProvider(params.authConfig)
        });

        var createdUsers;
        var createdGroups;
        if (createdStore) {
            createdUsers = common.create({
                _parentPath: '/identity/' + createdStore._name,
                _name: 'users',
                _permissions: calculateUsersPermissions(params.permissions)
            });

            createdGroups = common.create({
                _parentPath: '/identity/' + createdStore._name,
                _name: 'groups',
                _permissions: calculateGroupsPermissions(params.permissions)
            });

            createdStore.idProviderMode = calculateIdProviderMode(
                params.authConfig
            );

            calculateAccess(createdStore, createdUsers, createdGroups);
        }

        return createdStore;
    },
    update: function(params) {
        var key = common.required(params, 'key');
        var displayName = common.required(params, 'displayName');

        var updatedStore = common.update({
            key: '/identity/' + key,
            editor: function(store) {
                var newStore = store;
                newStore.displayName = displayName;
                newStore.description = params.description;
                newStore._permissions = calculateUserStorePermissions(
                    params.permissions
                );
                newStore.idProvider = calculateIdProvider(params.authConfig);
                return newStore;
            }
        });

        var updatedUsers = common.update({
            key: '/identity/' + key + '/users',
            editor: function(users) {
                var newUsers = users;
                newUsers._permissions = calculateUsersPermissions(
                    params.permissions
                );
                return newUsers;
            }
        });

        var updatedGroups = common.update({
            key: '/identity/' + key + '/groups',
            editor: function(groups) {
                var newGroups = groups;
                newGroups._permissions = calculateGroupsPermissions(
                    params.permissions
                );
                return newGroups;
            }
        });

        updatedStore.idProviderMode = calculateIdProviderMode(
            params.authConfig
        );

        calculateAccess(updatedStore, updatedUsers, updatedGroups);

        return updatedStore;
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
