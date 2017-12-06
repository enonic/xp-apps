import '../../../api.ts';
import {ContentWizardPanel} from '../ContentWizardPanel';
import {DuplicateContentAction} from './DuplicateContentAction';
import {DeleteContentAction} from './DeleteContentAction';
import {PublishAction} from './PublishAction';
import {PublishTreeAction} from './PublishTreeAction';
import {CreateIssueAction} from './CreateIssueAction';
import {UnpublishAction} from './UnpublishAction';
import {PreviewAction} from './PreviewAction';
import {ShowLiveEditAction} from './ShowLiveEditAction';
import {ShowFormAction} from './ShowFormAction';
import {ShowSplitEditAction} from './ShowSplitEditAction';
import {UndoPendingDeleteAction} from './UndoPendingDeleteAction';
import Action = api.ui.Action;
import SaveAction = api.app.wizard.SaveAction;
import CloseAction = api.app.wizard.CloseAction;
import SaveAndCloseAction = api.app.wizard.SaveAndCloseAction;
import i18n = api.util.i18n;
import ManagedActionManager = api.managedaction.ManagedActionManager;
import ManagedActionExecutor = api.managedaction.ManagedActionExecutor;
import ManagedActionState = api.managedaction.ManagedActionState;

type ActionsState = {
    save?: boolean,
    delete?: boolean,
    duplicate?: boolean,
    preview?: boolean,
    publish?: boolean,
    publishTree?: boolean,
    createIssue?: boolean,
    unpublish?: boolean,
    close?: boolean,
    showLiveEditAction?: boolean,
    showFormAction?: boolean,
    showSplitEditAction?: boolean,
    saveAndClose?: boolean,
    publishMobile?: boolean,
    undoPendingDelete?: boolean,
};

export class ContentWizardActions extends api.app.wizard.WizardActions<api.content.Content> {

    private save: Action;

    private close: Action;

    private saveAndClose: Action;

    private delete: Action;

    private duplicate: Action;

    private publish: Action;

    private publishTree: Action;

    private createIssue: Action;

    private unpublish: Action;

    private publishMobile: Action;

    private preview: Action;

    private showLiveEditAction: Action;

    private showFormAction: Action;

    private showSplitEditAction: Action;

    private undoPendingDelete: Action;

    private deleteOnlyMode: boolean = false;

    private wizardPanel: ContentWizardPanel;

    private stashedActionsState: ActionsState = {};

    constructor(wizardPanel: ContentWizardPanel) {
        super(
            new SaveAction(wizardPanel, i18n('action.saveDraft')),
            new DeleteContentAction(wizardPanel),
            new DuplicateContentAction(wizardPanel),
            new PreviewAction(wizardPanel),
            new PublishAction(wizardPanel),
            new PublishTreeAction(wizardPanel),
            new CreateIssueAction(wizardPanel),
            new UnpublishAction(wizardPanel)
                .setIconClass('unpublish-action'),
            new CloseAction(wizardPanel),
            new ShowLiveEditAction(wizardPanel),
            new ShowFormAction(wizardPanel),
            new ShowSplitEditAction(wizardPanel),
            new SaveAndCloseAction(wizardPanel),
            new PublishAction(wizardPanel),
            new UndoPendingDeleteAction(wizardPanel)
        );

        this.wizardPanel = wizardPanel;

        [
            this.save,
            this.delete,
            this.duplicate,
            this.preview,
            this.publish,
            this.publishTree,
            this.createIssue,
            this.unpublish,
            this.close,
            this.showLiveEditAction,
            this.showFormAction,
            this.showSplitEditAction,
            this.saveAndClose,
            this.publishMobile,
            this.undoPendingDelete,
        ] = this.getActions();

        this.stashActionsState();

        ManagedActionManager.instance().onManagedActionStateChanged((state: ManagedActionState, executor: ManagedActionExecutor) => {
            if (state === ManagedActionState.PREPARING) {
                this.stashActionsState();
                this.updateActionsState({
                    delete: false,
                    duplicate: false,
                    publish: false,
                    publishTree: false,
                    unpublish: false,
                    publishMobile: false,
                });
            } else if (state === ManagedActionState.ENDED) {
                this.updateActionsState(this.stashedActionsState);
            }
        });
    }

    private enableActions(state: ActionsState) {
        if (ManagedActionManager.instance().isExecuting()) {
            this.updateStashedActionsState(state);
        } else {
            this.updateActionsState(state);
        }
    }

    private updateActionsState(state: ActionsState) {
        for (const key of Object.keys(state)) {
            const hasProperty = state.hasOwnProperty(key) && this.hasOwnProperty(key);
            if (hasProperty && state[key] != null && this[key] instanceof Action) {
                const action = <Action> this[key];
                action.setEnabled(state[key]);
            }
        }
    }

    private updateStashedActionsState(state: ActionsState) {
        for (const key of Object.keys(state)) {
            const hasProperty = state.hasOwnProperty(key);
            if (hasProperty && state[key] != null) {
                this.stashedActionsState[key] = state[key];
            }
        }
    }

    private stashActionsState() {
        this.stashedActionsState = this.stashedActionsState || {};
        this.stashedActionsState.save = this.save.isEnabled();
        this.stashedActionsState.delete = this.delete.isEnabled();
        this.stashedActionsState.duplicate = this.duplicate.isEnabled();
        this.stashedActionsState.preview = this.preview.isEnabled();
        this.stashedActionsState.publish = this.publish.isEnabled();
        this.stashedActionsState.publishTree = this.publishTree.isEnabled();
        this.stashedActionsState.createIssue = this.createIssue.isEnabled();
        this.stashedActionsState.unpublish = this.unpublish.isEnabled();
        this.stashedActionsState.close = this.close.isEnabled();
        this.stashedActionsState.showLiveEditAction = this.showLiveEditAction.isEnabled();
        this.stashedActionsState.showFormAction = this.showFormAction.isEnabled();
        this.stashedActionsState.showSplitEditAction = this.showSplitEditAction.isEnabled();
        this.stashedActionsState.saveAndClose = this.saveAndClose.isEnabled();
        this.stashedActionsState.publishMobile = this.publishMobile.isEnabled();
        this.stashedActionsState.undoPendingDelete = this.undoPendingDelete.isEnabled();
    }

    refreshPendingDeleteDecorations() {
        let compareStatus = this.wizardPanel.getCompareStatus();
        let isPendingDelete = api.content.CompareStatusChecker.isPendingDelete(compareStatus);

        this.undoPendingDelete.setVisible(isPendingDelete);
        [
            this.save,
            this.delete,
            this.duplicate,
            this.unpublish
        ].forEach(action => action.setVisible(!isPendingDelete));

        this.preview.setVisible(this.preview.isEnabled() && !isPendingDelete);
    }

    enableActionsForNew() {
        this.enableActions({save: true, delete: true});
    }

    enableActionsForExisting(existing: api.content.Content) {
        this.enableActions({save: existing.isEditable(), delete: existing.isDeletable()});
        this.enableActionsForExistingByPermissions(existing);
    }

    setDeleteOnlyMode(content: api.content.Content, valueOn: boolean = true) {
        if (this.deleteOnlyMode === valueOn) {
            return;
        }
        this.deleteOnlyMode = valueOn;
        const nonDeleteMode = !valueOn;

        this.enableActions({
            save: nonDeleteMode,
            duplicate: nonDeleteMode,
            publish: nonDeleteMode,
            createIssue: nonDeleteMode,
            unpublish: nonDeleteMode,
            publishMobile: nonDeleteMode,
        });

        this.publishMobile.setVisible(!valueOn);

        if (valueOn) {
            this.enableDeleteIfAllowed(content);
        } else {
            this.enableActions({delete: true});
            this.enableActionsForExistingByPermissions(content);
        }
    }

    private enableDeleteIfAllowed(content: api.content.Content) {
        new api.security.auth.IsAuthenticatedRequest().sendAndParse().then((loginResult: api.security.auth.LoginResult) => {
            let hasDeletePermission = api.security.acl.PermissionHelper.hasPermission(api.security.acl.Permission.DELETE,
                loginResult, content.getPermissions());
            this.enableActions({delete: hasDeletePermission});
        });
    }

    private enableActionsForExistingByPermissions(existing: api.content.Content) {
        new api.security.auth.IsAuthenticatedRequest().sendAndParse().then((loginResult: api.security.auth.LoginResult) => {

            let hasModifyPermission = api.security.acl.PermissionHelper.hasPermission(api.security.acl.Permission.MODIFY,
                loginResult, existing.getPermissions());
            let hasDeletePermission = api.security.acl.PermissionHelper.hasPermission(api.security.acl.Permission.DELETE,
                loginResult, existing.getPermissions());
            let hasPublishPermission = api.security.acl.PermissionHelper.hasPermission(api.security.acl.Permission.PUBLISH,
                loginResult, existing.getPermissions());

            if (!hasModifyPermission) {
                this.enableActions({save: false, saveAndClose: false});
            }
            if (!hasDeletePermission) {
                this.enableActions({delete: false});
            }
            if (!hasPublishPermission) {
                this.enableActions({
                    publish: false,
                    createIssue: true,
                    unpublish: false,
                    publishTree: false,
                    publishMobile: false,
                });

                this.publishMobile.setVisible(false);
            }

            if (existing.hasParent()) {
                new api.content.resource.GetContentByPathRequest(existing.getPath().getParentPath()).sendAndParse().then(
                    (parent: api.content.Content) => {
                        new api.content.resource.GetContentPermissionsByIdRequest(parent.getContentId()).sendAndParse().then(
                            (accessControlList: api.security.acl.AccessControlList) => {
                                let hasParentCreatePermission = api.security.acl.PermissionHelper.hasPermission(
                                    api.security.acl.Permission.CREATE,
                                    loginResult,
                                    accessControlList);

                                if (!hasParentCreatePermission) {
                                    this.enableActions({duplicate: false});
                                }
                            });
                    });
            } else {
                new api.content.resource.GetContentRootPermissionsRequest().sendAndParse().then(
                    (accessControlList: api.security.acl.AccessControlList) => {
                        let hasParentCreatePermission = api.security.acl.PermissionHelper.hasPermission(api.security.acl.Permission.CREATE,
                            loginResult,
                            accessControlList);

                        if (!hasParentCreatePermission) {
                            this.enableActions({duplicate: false});
                        }
                    });
            }

        });
    }

    getDeleteAction(): Action {
        return this.delete;
    }

    getSaveAction(): Action {
        return this.save;
    }

    getDuplicateAction(): Action {
        return this.duplicate;
    }

    getCloseAction(): Action {
        return this.close;
    }

    getPublishAction(): Action {
        return this.publish;
    }

    getPublishTreeAction(): Action {
        return this.publishTree;
    }

    getCreateIssueAction(): Action {
        return this.createIssue;
    }

    getUnpublishAction(): Action {
        return this.unpublish;
    }

    getPreviewAction(): Action {
        return this.preview;
    }

    getShowLiveEditAction(): Action {
        return this.showLiveEditAction;
    }

    getShowFormAction(): Action {
        return this.showFormAction;
    }

    getShowSplitEditAction(): Action {
        return this.showSplitEditAction;
    }

    getPublishMobileAction():Action {
        return this.publishMobile;
    }

    getUndoPendingDeleteAction(): Action {
        return this.undoPendingDelete;
    }
}
