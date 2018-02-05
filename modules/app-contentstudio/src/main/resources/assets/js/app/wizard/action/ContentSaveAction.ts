import i18n = api.util.i18n;
import SaveAction = api.app.wizard.SaveAction;
import {ContentWizardPanel} from '../ContentWizardPanel';

export class ContentSaveAction
    extends SaveAction {

    private static SAVED_STATE: string = 'saved';

    constructor(wizardPanel: ContentWizardPanel, label: string = i18n('action.save')) {
        super(wizardPanel, label);

        this.setEnabled(false);
    }

    isSavedStateEnabled(): boolean {
        return ContentSaveAction.SAVED_STATE == this.getIconClass();
    }

    protected saveChanges(wizardPanel: ContentWizardPanel): wemQ.Promise<any> {
        this.setLabel(i18n('action.saving'));

        return wizardPanel.saveChanges().then(() => {
            this.setLabel(i18n('action.saved'));

            this.toggleIconClass(ContentSaveAction.SAVED_STATE, true);

        }, (reason: any) => {
            this.setLabel(i18n('action.save'));
            this.setEnabled(true);

            this.toggleIconClass(ContentSaveAction.SAVED_STATE, false);

            api.DefaultErrorHandler.handle(reason);
        });
    }
}
