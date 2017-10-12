/**
 * Created on 09.10.2017.
 */

var wizard = require('./wizard.panel');
var elements = require('../../libs/elements');
const loaderComboBox = require('../inputs/loaderComboBox');

var panel = {
    container: `//div[contains(@id,'GroupWizardPanel')]`,
    memberOptionsFilterInput: "//div[contains(@id,'FormItem') and child::label[text()='Members']]" + `${loaderComboBox.optionFilterInput}`,
    roleOptionsFilterInput: "//div[contains(@id,'FormItem') and child::label[text()='Roles']]" + `${loaderComboBox.optionFilterInput}`,
    rolesLink: `//li[child::a[text()='Roles']]`,
    membersLink: `//li[child::a[text()='Members']]`,
    membersStepForm: `//div[contains(@id,'GroupMembersWizardStepForm')]`,
    rolesStepForm: `//div[contains(@id,'MembershipsWizardStepForm')]`
};
var groupWizard = Object.create(wizard, {

    descriptionInput: {
        get: function () {
            return `${panel.container}//div[contains(@id,'PrincipalDescriptionWizardStepForm')]` + `${elements.TEXT_INPUT}`;
        }
    },
    memberOptionsFilterInput: {
        get: function () {
            return `${panel.container}` + `${panel.memberOptionsFilterInput}`;
        }
    },
    roleOptionsFilterInput: {
        get: function () {
            return `${panel.container}` + `${panel.roleOptionsFilterInput}`;
        }
    },
    rolesLink: {
        get: function () {
            return `${panel.container}` + `${panel.rolesLink}`;
        }
    },
    membersLink: {
        get: function () {
            return `${panel.container}` + `${panel.membersLink}`;
        }
    },
    clickOnRolesLink: {
        value: function () {
            return this.doClick(this.rolesLink).pause(300);
        }
    },
    clickOnMembersLink: {
        value: function () {
            return this.doClick(this.membersLink);
        }
    },
    typeData: {
        value: function (group) {
            return this.typeTextInInput(this.displayNameInput, group.displayName)
                .then(() => this.typeTextInInput(this.descriptionInput, group.description)).then(()=> {
                    if (group.roles != null) {
                        return this.clickOnRolesLink();
                    }
                    return;
                }).pause(300).then(()=> {
                    if (group.roles != null) {
                        return this.addRoles(group.roles);
                    }
                    return;
                }).then(()=> {
                    if (group.members != null) {
                        return this.clickOnMembersLink();
                    }
                    return;
                }).pause(300).then(()=> {
                    if (group.members != null) {
                        return this.addMembers(group.members);
                    }
                    return;
                });
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
    addMembers: {
        value: function (memberDisplayNames) {
            let result = Promise.resolve();
            memberDisplayNames.forEach((displayName)=> {
                result = result.then(() => this.filterOptionsAndAddMember(displayName));
            });
            return result;
        }
    },
    filterOptionsAndAddMember: {
        value: function (displayName) {
            return this.typeTextInInput(this.memberOptionsFilterInput, displayName).then(()=> {
                return loaderComboBox.waitForOptionVisible(`${panel.container}`, displayName);
            }).then(()=> {
                return loaderComboBox.clickOnOption(`${panel.container}`, displayName);
            }).catch((err)=> {
                throw new Error('Error selecting the member-option ' + displayName + ' ' + err);
            }).pause(300);
        }
    },
    filterOptionsAndAddRole: {
        value: function (displayName) {
            return this.typeTextInInput(this.roleOptionsFilterInput, displayName).then(()=> {
                return loaderComboBox.waitForOptionVisible(`${panel.container}`, displayName);
            }).then(()=> {
                return loaderComboBox.clickOnOption(`${panel.container}`, displayName);
            }).catch((err)=> {
                throw new Error('Error selecting the role-option ' + displayName + ' ' + err);
            }).pause(1000);
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(this.memberOptionsFilterInput, 3000).catch((e)=> {
                throw new Error("Group wizard was not loaded! " + e);
            });
        }
    },

    typeDescription: {
        value: function (description) {
            return this.typeTextInInput(this.descriptionInput, description);
        }
    },
    getDescription: {
        value: function () {
            return this.getTextFromInput(this.descriptionInput);
        }
    },
    getMembers: {
        value: function () {
            let selectedOptions = `${panel.container}` + `${panel.membersStepForm}` + `${elements.PRINCIPAL_SELECTED_OPTION}`
                                  + `${elements.H6_DISPLAY_NAME}`
            return this.getTextFromElements(selectedOptions);
        }
    },
    getRoles: {
        value: function () {
            let selectedOptions = `${panel.container}` + `${panel.rolesStepForm}` + `${elements.PRINCIPAL_SELECTED_OPTION}` +
                                  `${elements.H6_DISPLAY_NAME}`
            return this.clickOnRolesLink().then(()=>this.getTextFromElements(selectedOptions));
        }
    },
    removeMember: {
        value: function (displayName) {
            let selector = `${panel.container}` + `${panel.membersStepForm}` + `${elements.selectedPrincipalByDisplayName(displayName)}` +
                           `${elements.REMOVE_ICON}`;
            return this.doClick(selector).pause(300);
        }
    },
    removeRole: {
        value: function (displayName) {
            let selector = `${panel.container}` + `${panel.rolesStepForm}` + `${elements.selectedPrincipalByDisplayName(displayName)}` +
                           `${elements.REMOVE_ICON}`;
            return this.clickOnMembersLink().pause(400).then(()=>this.doClick(selector)).pause(300);
        }
    },

});
module.exports = groupWizard;

