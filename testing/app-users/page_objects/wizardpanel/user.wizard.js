/**
 * Created on 5/30/2017.
 */
const wizard = require('./wizard.panel');
const elements = require('../../libs/elements');
const loaderComboBox = require('../inputs/loaderComboBox');

var panel = {
    container: `//div[contains(@id,'UserWizardPanel')]`,
    emailInput: `//input[@type = 'email']`,
    groupOptionsFilterInput: "//div[contains(@id,'FormItem') and child::label[text()='Groups']]" + `${loaderComboBox.optionFilterInput}`,
    roleOptionsFilterInput: "//div[contains(@id,'FormItem') and child::label[text()='Roles']]" + `${loaderComboBox.optionFilterInput}`,
    rolesGroupLink: `//li[child::a[text()='Roles & Groups']]`,
    showPasswordLink: `//a[text()='Show']`,
    generatePasswordLink: `//a[text()='Generate']`,
    changePasswordButton: `//button[contains(@class,'change-password-button')]`,
};

var userWizard = Object.create(wizard, {

    emailInput: {
        get: function () {
            return `${panel.container}` + `${panel.emailInput}`;
        }
    },
    passwordInput: {
        get: function () {
            return `${panel.container}//input[@type = 'password']`;
        }
    },
    groupOptionsFilterInput: {
        get: function () {
            return `${panel.container}` + `${panel.groupOptionsFilterInput}`;
        }
    },
    roleOptionsFilterInput: {
        get: function () {
            return `${panel.container}` + `${panel.roleOptionsFilterInput}`;
        }
    },
    rolesGroupsLink: {
        get: function () {
            return `${panel.container}` + `${panel.rolesGroupLink}`;
        }
    },
    showPasswordLink: {
        get: function () {
            return `${panel.container}` + `${panel.showPasswordLink}`;
        }
    },
    generateLink: {
        get: function () {
            return `${panel.container}` + `${panel.generatePasswordLink}`;
        }
    },
    changePasswordButton: {
        get: function () {
            return `${panel.container}` + `${panel.changePasswordButton}`;
        }
    },
    clickOnChangePasswordButton: {
        value: function () {
            return this.doClick(this.changePasswordButton);
        }
    },
    isShowLinkDisplayed: {
        value: function () {
            return this.isVisible(this.showPasswordLink);
        }
    },
    isChangePasswordButtonDisplayed: {
        value: function () {
            return this.isVisible(this.changePasswordButton);
        }
    },
    isGenerateDisplayed: {
        value: function () {
            return this.isVisible(this.generateLink);
        }
    },
    isEmailInputDisplayed: {
        value: function () {
            return this.isVisible(this.emailInput);
        }
    },
    isPasswordInputDisplayed: {
        value: function () {
            return this.isVisible(this.passwordInput);
        }
    },
    isGroupOptionsFilterInputDisplayed: {
        value: function () {
            return this.isVisible(this.groupOptionsFilterInput);
        }
    },

    isRoleOptionsFilterInputDisplayed: {
        value: function () {
            return this.clickOnRolesAndGroupsLink().pause(300).then(()=> {
                return this.isVisible(this.roleOptionsFilterInput);
            })
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
    clearEmailInput: {
        value: function () {
            return this.clearElement(this.emailInput);
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
});

module.exports = userWizard;

