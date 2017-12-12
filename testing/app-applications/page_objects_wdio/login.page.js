var page = require('./page')

var loginPage = Object.create(page, {
    
    usernameInput: {
        get: function () {
            return `input[id^='username-input']`
        }
    },
    passwordInput: {
        get: function () {
            return `input[id^='password-input']`
        }
    },
    loginButton: {
        get: function () {
            return `button[id^='login-button']`
        }
    },

    typeUserName: {
        value: function (userName) {
            return this.typeTextInInput(this.usernameInput, userName);
        }
    },
    typePassword: {
        value: function (password) {
            return this.typeTextInInput(this.passwordInput, password);
        }
    },

    isLoginButtonVisible: {
        value: function () {
            this.isVisible(this.loginButton);
        }
    },

    isUserNameInputVisible: {
        value: function (ms) {
            return this.waitForExist(this.usernameInput, ms);
        }
    },

    isPasswordInputVisible: {
        value: function (ms) {
            return this.waitForExist(this.passwordInput, ms);
        }
    },

    waitForLoginButtonVisible: {
        value: function (ms) {
            return this.waitForVisible(this.loginButton, ms);
        }
    },
    waitForPageLoaded: {
        value: function (ms) {
            return this.waitForVisible(this.usernameInput, ms);
        }
    },

    clickOnLoginButton: {
        value: function () {
            return this.doClick(this.loginButton);
        }
    },

    doLogin: {
        value: function () {
            this.typeTextInInput(this.usernameInput, 'su');
            this.typeTextInInput(loginPage.passwordInput, 'password');
            this.waitForLoginButtonVisible(1000);
            this.doClick(loginPage.loginButton);
        }
    },
});
module.exports = loginPage;



