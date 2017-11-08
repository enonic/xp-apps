const wizard = require('./wizard.panel');
const elements = require('../../libs/elements');
const loaderComboBox = require('../inputs/loaderComboBox');
var panel = {
    container: `//div[contains(@id,'UserStoreWizardPanel')]`,
    providerFilterInput: "//div[contains(@id,'InputView') and descendant::div[text()='ID Provider']]" +
                         `${loaderComboBox.optionFilterInput}`,
    permissionsFilterInput: `//div[contains(@id,'UserStoreAccessControlComboBox')]` + `${loaderComboBox.optionFilterInput}`,
    permissionsLink: `//li[child::a[text()='Permissions']]`,
    aclList: `//ul[contains(@class,'access-control-list')]`,

};
var userStoreWizard = Object.create(wizard, {

    descriptionInput: {
        get: function () {
            return `${panel.container}//input[contains(@name,'description')]`;
        }
    },
    providerOptionsFilterInput: {
        get: function () {
            return `${panel.container}` + `${panel.providerFilterInput}`;
        }
    },
    permissionsOptionsFilterInput: {
        get: function () {
            return `${panel.container}` + `${panel.permissionsFilterInput}`;
        }
    },
    permissionsLink: {
        get: function () {
            return `${panel.container}` + `${panel.permissionsLink}`;
        }
    },

    typeDescription: {
        value: function (description) {
            return this.typeTextInInput(this.descriptionInput, description);
        }
    },
    addPrincipals: {
        value: function (principalDisplayNames) {
            let result = Promise.resolve();
            principalDisplayNames.forEach((displayName)=> {
                result = result.then(() => this.filterOptionsAndSelectPermission(displayName));
            });
            return result;
        }
    },
    clickOnPermissionsTabItem: {
        value: function () {
            return this.doClick(this.permissionsLink).pause(300);
        }
    },
    typeData: {
        value: function (userstore) {
            return this.typeDisplayName(userstore.displayName)
                .then(() => this.typeDescription(userstore.description)).then(()=> {

                    if (userstore.permissions != null) {
                        return this.clickOnPermissionsTabItem().then(()=> {
                            return this.addPrincipals(userstore.permissions);
                        })
                    }
                }).then(()=> {
                    if (userstore.providerName != null) {
                        return this.filterOptionsAndSelectIdProvider(userstore.providerName);
                    }
                }).pause(400);
        }
    },
    waitForOpened: {
        value: function () {
            return this.waitForVisible(this.displayNameInput, 3000);
        }
    },
    filterOptionsAndSelectIdProvider: {
        value: function (providerName) {
            return this.typeTextInInput(`${panel.providerFilterInput}`, providerName).pause(400).then(()=> {
                return loaderComboBox.waitForOptionVisible(`${panel.container}`, providerName);
            }).then(()=> {
                return loaderComboBox.clickOnOption(`${panel.container}`, providerName);
            }).catch((err)=> {
                throw new Error('Error when selecting the ID Provider: ' + providerName + ' ' + err);
            })
        }
    },
    filterOptionsAndSelectPermission: {
        value: function (permissionDisplayName) {
            return this.typeTextInInput(`${panel.permissionsFilterInput}`, permissionDisplayName).pause(400).then(()=> {
                return loaderComboBox.waitForOptionVisible(`${panel.container}`, permissionDisplayName);
            }).then(()=> {
                return loaderComboBox.clickOnOption(`${panel.container}`, permissionDisplayName);
            }).catch((err)=> {
                throw new Error('Error when selecting the ACL-entry: ' + permissionDisplayName + ' ' + err);
            })
        }
    },

    typeDescription: {
        value: function (description) {
            this.typeTextInInput(this.descriptionInput, description);
        }
    },
    getDescription: {
        value: function () {
            return this.getTextFromInput(this.descriptionInput);
        }
    },
    getPermissions: {
        value: function () {
            let items = `${panel.container}` + `${panel.aclList}` + `${elements.H6_DISPLAY_NAME}`;
            return this.waitForVisible(`${panel.aclList}`, 1000).catch((err)=> {
                throw new Error('ACL-list is not present on the page!');
            }).then(()=> {
                return this.isVisible(items);
            }).then((result)=> {
                if (!result) {
                    return [];
                }
                return this.getTextFromElements(items)
            }).catch((err)=> {
                return [];
            })
        }
    },
    isDescriptionInputDisplayed: {
        value: function () {
            return this.isVisible(this.descriptionInput);
        }
    },
    isProviderOptionsFilterInputDisplayed: {
        value: function () {
            return this.isVisible(this.providerOptionsFilterInput);
        }
    },
    isPermissionsOptionsFilterInputDisplayed: {
        value: function () {
            return this.isVisible(this.permissionsOptionsFilterInput);
        }
    },
});
module.exports = userStoreWizard;
