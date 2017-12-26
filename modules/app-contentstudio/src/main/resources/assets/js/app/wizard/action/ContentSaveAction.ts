import i18n = api.util.i18n;
import {ContentWizardPanel} from '../ContentWizardPanel';
import SaveAction = api.app.wizard.SaveAction;

export class ContentSaveAction
    extends SaveAction {

    constructor(wizardPanel: ContentWizardPanel, label: string = i18n('action.save')) {
        super(wizardPanel, label);

        this.setEnabled(false);
    }
    protected saveChanges(wizardPanel: ContentWizardPanel): wemQ.Promise<any> {
        this.setLabel(i18n('action.saving'));

        return wizardPanel.saveChanges().
        catch((reason: any) => api.DefaultErrorHandler.handle(reason));
    }
}
