/**
 * Created on 5/30/2017.
 */
var wizard = require('./wizard.panel');
var elements = require('../../libs/elements');
const loaderComboBox = require('../inputs/loaderComboBox');

var panel = {
    container: `//div[contains(@id,'UserWizardPanel')]`,
    groupOptionsFilterInput: "//div[contains(@id,'FormItem') and child::label[text()='Groups']]" + `${loaderComboBox.optionFilterInput}`,
    roleOptionsFilterInput: "//div[contains(@id,'FormItem') and child::label[text()='Roles']]" + `${loaderComboBox.optionFilterInput}`,
    rolesGroupLink: `//li[child::a[text()='Roles & Groups']]`,
};

var userWizard = Object.create(wizard, {

    emailInput: {
        get: function () {
            return `${panel.container}//input[@type = 'email']`;
        }
    },
    passwordInput: {
        get: function () {
            return `${panel.container}//input[@type = 'password']`;
        }
    },
    rolesGroupsLink: {
        get: function () {
            return `${panel.container}` + `${panel.rolesGroupLink}`;
        }
    },
    clickOnRolesAndGroupsLink: {
        value: function () {
            return this.doClick(this.rolesGroupsLink);
        }
    },
    typeData: {
        value: function (user) {
            return this.typeDisplayName(user.displayName).then(()=> {
                return this.typeEmail(user.email);
            }).then(()=> {
                return this.typePassword(user.password);
            }).then(()=> {
                if (user.roles != null) {
                    return this.clickOnRolesAndGroupsLink();
                }
                return;
            }).pause(300).then(()=> {
                if (user.roles != null) {
                    return this.addRoles(user.roles);
                }
                return;
            })
        }
    },
    clearPasswordInput: {
        value: function () {
            return this.clearElement(this.passwordInput);
        }
    },
    clearEmailInput: {
        value: function () {
            return this.clearElement(this.emailInput);
        }
    },

    waitForOpened: {
        value: function () {
            return this.waitForVisible(this.displayNameInput, 3000).catch((err)=> {
                throw new Error('User Wizard is not loaded! ' + err);
            });
        }
    },
    removeRole: {
        value: function (roleDisplayName) {
            let selector = `${panel.container}` + `${elements.selectedPrincipalByDisplayName(roleDisplayName)}` + `${elements.REMOVE_ICON}`;
            return this.clickOnRolesAndGroupsLink().pause(1000).then(()=> {
                return this.doClick(selector).pause(500);
            })
        }
    },
    addRoles: {
        value: function (roleDisplayNames) {
            let result = Promise.resolve();
            roleDisplayNames.forEach((displayName)=> {
                result = result.then(() => this.filterOptionsAndAddRole(displayName));
            });
            return result;
        }
    },
    filterOptionsAndAddRole: {
        value: function (roleDisplayName) {
            return this.typeTextInInput(`${panel.roleOptionsFilterInput}`, roleDisplayName).then(()=> {
                return loaderComboBox.waitForOptionVisible(`${panel.container}`, roleDisplayName);
            }).then(()=> {
                return loaderComboBox.clickOnOption(`${panel.container}`, roleDisplayName);
            }).catch((err)=> {
                throw new Error('Error when selecting the role-option: ' + roleDisplayName + ' ' + err);
            })
        }
    },
    typeEmail: {
        value: function (email) {
            return this.typeTextInInput(this.emailInput, email);
        }
    },
    typePassword: {
        value: function (password) {
            return this.typeTextInInput(this.passwordInput, password);
        }
    },
    getDescription: {
        value: function () {
            return this.getTextFromInput(this.descriptionInput);
        }
    },
    waitForNewButtonEnabled: {
        value: function () {
            return this.waitForEnabled(this.newButton, 1000);
        }
    },
});

module.exports = userWizard;

