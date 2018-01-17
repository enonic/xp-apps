function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }
    return value;
}

function nullOrValue(value) {
    return value == null ? null : value;
}

/**
 * Returns the user store for the specified key.
 *
 * @param {object} params JSON parameters.
 * @param {string} params.key UserStore key.
 * @returns {object} the user store specified, or null if it doesn't exist.
 */
exports.getUserStore = function (params) {
    var bean = __.newBean('com.enonic.xp.app.users.lib.auth.GetUserStoreHandler');
    bean.userStoreKey = required(params, 'key');
    return __.toNativeObject(bean.getUserStore());
};

/**
 * Returns the list of all the user stores.
 *
 * @returns {object[]} Array of user stores.
 */
exports.getUserStores = function () {
    var bean = __.newBean('com.enonic.xp.app.users.lib.auth.GetUserStoresHandler');
    return __.toNativeObject(bean.getUserStores());
};

/**
 * Returns a string representation of the ID provider mode.
 *
 * @param {object} params JSON parameters.
 * @param {string} params.key Application key of the ID Provider.
 * @returns {string} The ID provider mode.
 */
exports.getIdProviderMode = function (params) {
    var bean = __.newBean('com.enonic.xp.app.users.lib.auth.GetIdProviderModeHandler');
    bean.applicationKey = required(params, 'key');
    return bean.getIdProviderMode();
};

/**
 * Returns the user store permissions.
 *
 * @param {object} params JSON parameters.
 * @param {string} params.key Key of the user store to fetch permissions for.
 * @returns {object[]} Returns the list of principals with access level.
 */
exports.getPermissions = function (params) {
    var bean = __.newBean('com.enonic.xp.app.users.lib.auth.GetPermissionsHandler');
    bean.userStoreKey = required(params, 'key');
    return __.toNativeObject(bean.getPermissions());
};

/**
 * Creates a user store.
 *
 * @param {string} name User store name.
 * @param {string} params.displayName User store display name.
 * @param {string} params.description as user store description.
 */
exports.createUserStore = function (params) {
    var bean = __.newBean('com.enonic.xp.app.users.lib.auth.CreateUserStoreHandler');

    bean.name = required(params, 'name');
    bean.displayName = nullOrValue(params.displayName);
    bean.description = nullOrValue(params.description);
    bean.authConfig = __.toScriptValue(params.authConfig);
    bean.permissions = __.toScriptValue(params.permissions);

    return __.toNativeObject(bean.createUserStore());
};
