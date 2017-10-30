import '../../api.ts';
import {ProgressBarConfig, ProgressBarDialog} from '../dialog/ProgressBarDialog';
import {ContentDeletePromptEvent} from '../browse/ContentDeletePromptEvent';
import CompareStatus = api.content.CompareStatus;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import i18n = api.util.i18n;

export class ContentDiscardDialog
    extends ProgressBarDialog {

    private yesCallback: (exclude?: CompareStatus[]) => void;

    private noCallback: () => void;

    constructor() {
        super(<ProgressBarConfig> {
                dialogName: '',
                dialogSubName: i18n('dialog.discard.subname'),
                dependantsName: '',
                isProcessingClass: 'is-deleting',
                processingLabel: `${i18n('field.progress.deleting')}...`,
                processHandler: () => {
                    new ContentDeletePromptEvent([]).fire();
                }
            }
        );

        this.addClass('discard-dialog');

        const keepAction = new Action(i18n('action.keep'));
        keepAction.onExecuted(() => {
            this.doSave();
        });
        this.actionButton = this.addAction(keepAction, true, true);

        const discardAction = new Action(i18n('action.discard'));
        discardAction.onExecuted(() => {
            this.doDelete(false);
        });
        this.addAction(discardAction);

        this.addCancelButtonToBottom();
    }

    protected manageDescendants() {
        this.loadMask.show();
        this.lockControls();

        return this.loadDescendantIds().then(() => {
            this.loadDescendants(0, 20).then((descendants: ContentSummaryAndCompareStatus[]) => {
                this.setDependantItems(descendants);
                this.countItemsToDeleteAndUpdateButtonCounter();
                this.centerMyself();
            }).finally(() => {
                this.loadMask.hide();
                this.unlockControls();
                this.updateTabbable();
                this.actionButton.giveFocus();
            });
        });
    }

    manageContentToDelete(contents: ContentSummaryAndCompareStatus[]): ContentDiscardDialog {
        this.setIgnoreItemsChanged(true);
        this.setListItems(contents);
        this.setIgnoreItemsChanged(false);
        this.updateSubTitle();

        return this;
    }

    setContentToDelete(contents: ContentSummaryAndCompareStatus[]): ContentDiscardDialog {
        this.manageContentToDelete(contents);
        this.manageDescendants();

        return this;
    }

    setYesCallback(callback: () => void): ContentDiscardDialog {
        this.yesCallback = callback;
        return this;
    }

    setNoCallback(callback: () => void): ContentDiscardDialog {
        this.noCallback = callback;
        return this;
    }

    private doDelete(ignoreConfirmation: boolean = false) {
        if (this.yesCallback) {
            this.yesCallback([]);
        }

        this.lockControls();

        this.createDeleteRequest()
            .sendAndParse()
            .then((taskId: api.task.TaskId) => {
                this.pollTask(taskId);
            })
            .catch((reason) => {
                this.close();
                if (reason && reason.message) {
                    api.notify.showError(reason.message);
                }
            });
    }

    private countItemsToDeleteAndUpdateButtonCounter() {
        this.actionButton.setLabel(i18n('action.delete'));

        this.updateButtonCount(i18n('action.delete'), 1);
    }

    private createDeleteRequest(): api.content.resource.DeleteContentRequest {
        let deleteRequest = new api.content.resource.DeleteContentRequest();

        this.getItemList().getItems().forEach((item) => {
            deleteRequest.addContentPath(item.getContentSummary().getPath());
        });

        deleteRequest.setDeleteOnline(true);

        return deleteRequest;
    }

    protected updateButtonCount(actionString: string, count: number) {
        super.updateButtonCount(actionString, count);
    }

    private doAnyHaveChildren(items: ContentSummaryAndCompareStatus[]): boolean {
        return items.some((item: ContentSummaryAndCompareStatus) => {
            return item.getContentSummary().hasChildren();
        });
    }

    private updateSubTitle() {
        let items = this.getItemList().getItems();

        if (!this.doAnyHaveChildren(items)) {
            super.setSubTitle('');
        } else {
            super.setSubTitle(i18n('dialog.delete.subname'));
        }
    }

    private isAnySiteToBeDeleted(): boolean {
        let result = this.getItemList().getItems().some((item: ContentSummaryAndCompareStatus) => {
            return item.getContentSummary().isSite();
        });

        if (result) {
            return true;
        }

        let dependantList = this.getDependantList();
        if (dependantList.getItemCount() > 0) {
            return dependantList.getItems().some((descendant: ContentSummaryAndCompareStatus) => {
                return descendant.getContentSummary().isSite();
            });
        } else {
            return false;
        }
    }

}
