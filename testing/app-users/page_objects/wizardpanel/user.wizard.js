/**
 * Created on 5/30/2017.
 */
var wizard = require('./wizard.panel');
var elements = require('../../libs/elements');
const loaderComboBox = require('../inputs/loaderComboBox');

var panel = {
    container: `//div[contains(@id,'UserWizardPanel')]`,
    groupOptionsFilterInput: "//div[contains(@id,'FormItem') and child::label[text()='Groups']]" + `${loaderComboBox.optionFilterInput}`,
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
    typeData: {
        value: function (user) {
            return this.typeDisplayName(user.displayName).then(()=>{
                return this.typeEmail(user.email);
            }).then(()=>{
                return this.typePassword(user.password);
            });
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
            return this.waitForVisible(this.displayNameInput, 3000);
        }
    },

    addRoles: {
        value: function (roleDisplayNames) {
            return roleDisplayNames.forEach()
            //TODO implement it
        }
    },
    filterOptionsAndAddRole: {
        value: function (roleDisplayName) {
            return this.typeTextInInput(`${panel.groupOptionsFilterInput}`, roleDisplayName).then(()=> {
                return loaderComboBox.waitForOptionVisible(`${panel.container}`, roleDisplayName);
            }).then(()=> {
                return loaderComboBox.clickOnOption(`${panel.container}`, roleDisplayName);
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

