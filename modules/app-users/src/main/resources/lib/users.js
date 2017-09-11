var common = require('./common');
var principals = require('./principals');
var authLib = require('/lib/xp/auth');

exports.create = function createUser(params) {
    var key = common.required(params, 'key');
    var userStoreKey = common.userStoreFromKey(key);

    var createdUser = authLib.createUser({
        userStore: userStoreKey,
        name: common.required(params, 'login'),
        displayName: common.required(params, 'displayName'),
        email: common.required(params, 'email')
    });

    var mms = params.memberships;
    if (mms && mms.length > 0) {
        principals.addMemberships(key, mms);
    }

    exports.updatePwd(key, common.required(params, 'password'));

    populateMemberships(createdUser);

    return createdUser;
};

exports.update = function updateUser(params) {
    var key = common.required(params, 'key');

    var updatedUser = authLib.modifyUser({
        key: key,
        editor: function(user) {
            var newUser = user;
            newUser.displayName = params.displayName;
            newUser.email = params.email;
            newUser.login = params.login;
            return newUser;
        }
    });

    principals.updateMemberships(
        key,
        params.addMemberships,
        params.removeMemberships
    );

    populateMemberships(updatedUser);

    return updatedUser;
};

exports.updatePwd = function(key, pwd) {
    try {
        authLib.changePassword({
            userKey: key,
            password: pwd
        });
        return true;
    } catch (e) {
        log.error('Could not update password for [' + key + ']');
        return false;
    }
};

function populateMemberships(user) {
    // eslint-disable-next-line no-param-reassign
    user.memberships = principals.getMemberships(user.key || user._id);
}
