const page = require('../page');
const shortcutForm = require('./shortcut.form.panel');
var panel = {
    container: `//div[contains(@id,'ContentWizardPanel')]`,
}
var contentWizardStepForm = Object.create(page, {

    type: {
      value:  function (data, contentType) {
            let formPanel = null;
            if (contentType.includes('base:shortcut')) {
                return shortcutForm.type(data);
            }
        }
    },
});
module.exports = contentWizardStepForm;


