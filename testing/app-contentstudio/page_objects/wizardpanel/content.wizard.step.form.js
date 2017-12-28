const page = require('../page');
const shortcutForm = require('./shortcut.form.panel');
const siteForm = require('./site.form.panel');
const imageSelectorForm = require('./imageselector.form.panel');
const appConst = require('../../libs/app_const');
var panel = {
    container: `//div[contains(@id,'ContentWizardPanel')]`,
}
var contentWizardStepForm = Object.create(page, {

    type: {
        value: function (data, contentType) {
            if (contentType.includes('base:shortcut')) {
                return shortcutForm.type(data);
            }
            if (contentType.includes('portal:site')) {
                return siteForm.type(data);
            }
            if (contentType.includes(appConst.contentTypes.IMG_SELECTOR_2_4)) {
                return imageSelectorForm.type(data);
            }
        }
    },
});
module.exports = contentWizardStepForm;


