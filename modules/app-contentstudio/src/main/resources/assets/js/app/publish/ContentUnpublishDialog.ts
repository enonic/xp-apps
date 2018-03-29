import '../../api.ts';
import {ContentUnpublishPromptEvent} from '../browse/ContentUnpublishPromptEvent';
import {DependantItemsWithProgressDialog, DependantItemsWithProgressDialogConfig} from '../dialog/DependantItemsWithProgressDialog';
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import UnpublishContentRequest = api.content.resource.UnpublishContentRequest;
import CompareStatus = api.content.CompareStatus;
import ContentId = api.content.ContentId;
import i18n = api.util.i18n;

export class ContentUnpublishDialog
    extends DependantItemsWithProgressDialog {

    constructor() {

        super(<DependantItemsWithProgressDialogConfig> {
            title: i18n('dialog.unpublish'),
                dialogSubName: i18n('dialog.unpublish.subname'),
            dependantsName: i18n('dialog.showDependants'),
            dependantsDescription: i18n('dialog.unpublish.dependants'),
                processingLabel: `${i18n('field.progress.unpublishing')}...`,
                processHandler: () => {
                    new ContentUnpublishPromptEvent([]).fire();
                },
            }
        );

        this.getEl().addClass('unpublish-dialog');

        const unpublishAction = new ContentUnpublishDialogAction();
        unpublishAction.onExecuted(this.doUnpublish.bind(this));
        this.actionButton = this.addAction(unpublishAction, true, true);
        this.lockControls();

        this.addCancelButtonToBottom();

        this.getItemList().onItemsRemoved((items: ContentSummaryAndCompareStatus[]) => {
            if (!this.isIgnoreItemsChanged()) {
                this.reloadUnpublishDependencies().done();
            }
        });

        this.onProgressComplete(() => this.setSubTitle(i18n('dialog.unpublish.subname'), false));
    }

    open() {
        this.reloadUnpublishDependencies();

        super.open();
    }

    private reloadUnpublishDependencies(): wemQ.Promise<void> {
        if (this.isProgressBarEnabled()) {
            return wemQ<void>(null);
        }

        this.getDependantList().clearItems();
        this.lockControls();

        return this.loadDescendantIds([CompareStatus.EQUAL, CompareStatus.NEWER, CompareStatus.PENDING_DELETE]).then(() => {
            this.loadDescendants(0, 20).then((items: ContentSummaryAndCompareStatus[]) => {
                this.setDependantItems(items);

                // do not set requested contents as they are never going to change

                this.unlockControls();
            }).finally(() => {
                this.loadMask.hide();
            });
        });

    }

    private filterUnpublishableItems(items: ContentSummaryAndCompareStatus[]): ContentSummaryAndCompareStatus[] {
        return items.filter(item => {
            let status = item.getCompareStatus();
            return status === CompareStatus.EQUAL || status === CompareStatus.NEWER || status === CompareStatus.PENDING_DELETE ||
                   status === CompareStatus.OLDER;
        });
    }

    setDependantItems(items: ContentSummaryAndCompareStatus[]) {
        super.setDependantItems(this.filterUnpublishableItems(items));

        this.updateButtonCount(i18n('action.unpublish'), this.countTotal());
    }

    addDependantItems(items: ContentSummaryAndCompareStatus[]) {
        super.addDependantItems(this.filterUnpublishableItems(items));

        this.updateButtonCount(i18n('action.unpublish'), this.countTotal());
    }

    setContentToUnpublish(contents: ContentSummaryAndCompareStatus[]) {
        this.setIgnoreItemsChanged(true);
        this.setListItems(this.filterUnpublishableItems(contents));
        this.setIgnoreItemsChanged(false);
        return this;
    }

    private getContentToUnpublishIds(): ContentId[] {
        return this.getItemList().getItems().map(item => {
            return item.getContentId();
        });
    }

    private doUnpublish() {

        this.lockControls();

        this.setSubTitle(i18n('dialog.unpublish.beingUnpublished', this.countTotal()));

        let selectedIds = this.getContentToUnpublishIds();

        new UnpublishContentRequest()
            .setIncludeChildren(true)
            .setIds(selectedIds)
            .sendAndParse()
            .then((taskId: api.task.TaskId) => {
                this.pollTask(taskId);
            }).catch((reason) => {
            this.unlockControls();
            this.close();
            if (reason && reason.message) {
                api.notify.showError(reason.message);
            }
        });
    }
}

export class ContentUnpublishDialogAction
    extends api.ui.Action {
    constructor() {
        super(i18n('action.unpublish'));
        this.setIconClass('unpublish-action');
    }
}
