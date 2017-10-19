import {IssueDetailsDialog} from './view/IssueDetailsDialog';
import {IssueListDialog} from './view/IssueListDialog';
import {Issue} from './Issue';
import {CreateIssueDialog} from './view/CreateIssueDialog';
import {UpdateIssueDialog} from './view/UpdateIssueDialog';
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import ModalDialog = api.ui.dialog.ModalDialog;

export class IssueDialogsManager {

    private static INSTANCE: IssueDialogsManager;

    private detailsDialog: IssueDetailsDialog;
    private listDialog: IssueListDialog;
    private createDialog: CreateIssueDialog;
    private updateDialog: UpdateIssueDialog;

    private constructor() {
        this.detailsDialog = IssueDetailsDialog.get();
        this.listDialog = IssueListDialog.get();
        this.createDialog = CreateIssueDialog.get();
        this.updateDialog = UpdateIssueDialog.get();

        this.listenCreateDialog(this.createDialog);
        this.listenUpdateDialog(this.updateDialog);
        this.listenListDialog(this.listDialog);
        this.listenDetailsDialog(this.detailsDialog);
    }

    static get(): IssueDialogsManager {
        if (!IssueDialogsManager.INSTANCE) {
            IssueDialogsManager.INSTANCE = new IssueDialogsManager();
        }
        return IssueDialogsManager.INSTANCE;
    }

    private listenCreateDialog(dialog: CreateIssueDialog) {
        // Create dialog
        dialog.onIssueCreated(issue => {
            this.openDetailsDialog(issue);
        });
        dialog.onClosed(() => this.revealDialog(this.listDialog));
        dialog.onCloseButtonClicked((e: MouseEvent) => this.closeDialog(this.listDialog));
    }

    private listenUpdateDialog(dialog: UpdateIssueDialog) {
        // Update dialog
        dialog.onClosed(() => this.revealDialog(this.detailsDialog));
        dialog.onCloseButtonClicked((e: MouseEvent) => {
            this.closeDialog(this.detailsDialog);
            this.closeDialog(this.listDialog);
        });
    }

    private listenListDialog(dialog: IssueListDialog) {
        // List dialog
        dialog.onRendered(event => {
            dialog.addClickIgnoredElement(this.detailsDialog);
            dialog.addClickIgnoredElement(this.updateDialog);
            dialog.addClickIgnoredElement(this.createDialog);
        });
        dialog.onIssueSelected(issue => {
            dialog.addClass('masked');
            this.openDetailsDialog(issue);
        });
        dialog.onCreateButtonClicked(action => {
            dialog.addClass('masked');
            this.openCreateDialog();
        });
    }

    private listenDetailsDialog(dialog: IssueDetailsDialog) {
        // Details dialog
        dialog.onRendered(event => {
            dialog.addClickIgnoredElement(this.updateDialog);
        });
        dialog.onEditButtonClicked((issue, summaries, excludeChildIds) => {
            dialog.addClass('masked');
            this.openEditDialog(issue, summaries, excludeChildIds);
        });
        dialog.onCloseButtonClicked((e: MouseEvent) => this.closeDialog(this.listDialog));
        dialog.onClosed(() => this.revealDialog(this.listDialog));
    }

    private closeDialog(dialog: ModalDialog) {
        dialog.removeClass('masked');
        dialog.close();
    }

    private revealDialog(dialog: ModalDialog) {
        dialog.removeClass('masked');
        if (dialog.isVisible()) {
            dialog.getEl().focus();
        }
    };

    openDetailsDialog(issue: Issue) {
        if (!this.listDialog.isVisible()) {
            this.listDialog.open();
            this.listDialog.addClass('masked');
        }

        this.detailsDialog.setIssue(issue).open();
    }

    openListDialog() {
        this.listDialog.open();
    }

    openCreateDialog(summaries?: ContentSummaryAndCompareStatus[]) {
        this.createDialog.unlockPublishItems();
        if (summaries) {
            this.createDialog.setItems(summaries);
        } else {
            this.createDialog.reset();
        }
        this.createDialog
            .forceResetOnClose(true)
            .open();
    }

    openEditDialog(issue: Issue, summaries: ContentSummaryAndCompareStatus[], excludeChildIds: ContentId[]) {
        this.updateDialog.open();
        this.updateDialog.unlockPublishItems();
        this.updateDialog.setIssue(issue, summaries);
        this.updateDialog.setExcludeChildrenIds(excludeChildIds);
    }

}