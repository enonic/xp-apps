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
        value: function (data) {
            return this.typeTextInInput(this.displayNameInput, data.displayName)
                .then(() => this.typeEmail(data.email)).then(()=> this.typePassword(data.password)).then(()=>{

                })
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(this.displayNameInput, 3000);
        }
    },

    addRoles:{
        value: function(roleDisplayNames){
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
            this.typeTextInInput(this.emailInput, email);
        }
    },
    typePassword: {
        value: function (password) {
            this.typeTextInInput(this.passwordInput, password);
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

