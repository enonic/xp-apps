/**
 * Returns the user store for the specified key.
 *
 * @param {string} params JSON parameters.
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
 * @param {string} params JSON parameters.
 * @param {string} params.key Application key of the ID Provider.
 * @returns {string} The ID provider mode.
 */
exports.getIdProviderMode = function (params) {
    var bean = __.newBean('com.enonic.xp.app.users.lib.auth.GetIdProviderModeHandler');
    bean.applicationKey = required(params, 'key');
    return bean.getIdProviderMode();
};

function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }

    return value;
}