import '../../../api.ts';
import {OpenDuplicateDialogEvent} from '../../duplicate/OpenDuplicateDialogEvent';
import i18n = api.util.i18n;
import HeavyOperationsManager = api.heavy.HeavyOperationsManager;
import HeavyOperationPerformer = api.heavy.HeavyOperationPerformer;

export class DuplicateContentAction extends api.ui.Action {

    constructor(wizardPanel: api.app.wizard.WizardPanel<api.content.Content>) {
        super(i18n('action.duplicate'));
        this.onExecuted(() => {
            const contentToDuplicate = [wizardPanel.getPersistedItem()];
            new OpenDuplicateDialogEvent(contentToDuplicate).fire();
            const duplicationEndedHandler = (performer: HeavyOperationPerformer) => {
                // const summaryAndStatus = ContentSummaryAndCompareStatus.fromContentSummary(/* duplicated */);
                // new EditContentEvent([summaryAndStatus]).fire();
                HeavyOperationsManager.instance().unHeavyOperationEnded(duplicationEndedHandler);
            };
            HeavyOperationsManager.instance().onHeavyOperationEnded(duplicationEndedHandler);
        });
    }
}
