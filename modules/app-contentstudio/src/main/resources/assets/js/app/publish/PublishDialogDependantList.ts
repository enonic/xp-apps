import '../../api.ts';
import {DialogDependantList} from '../dialog/DependantItemsDialog';
import {StatusSelectionItem} from '../dialog/StatusSelectionItem';
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import CompareStatus = api.content.CompareStatus;
import ContentIds = api.content.ContentIds;
import i18n = api.util.i18n;

export class PublishDialogDependantList
    extends DialogDependantList {

    private requiredIds: ContentIds;

    private itemClickListeners: { (item: ContentSummaryAndCompareStatus): void }[] = [];

    private removeClickListeners: { (item: ContentSummaryAndCompareStatus): void }[] = [];

    private listChangedListeners: { (): void }[] = [];

    constructor() {
        super();

        this.addClass('publish-dialog-dependant-list');
        this.requiredIds = ContentIds.empty();
    }

    createItemView(item: ContentSummaryAndCompareStatus, readOnly: boolean): api.dom.Element {
        const view = super.createItemView(item, readOnly);
        const isPendingDelete = api.content.CompareStatusChecker.isPendingDelete(item.getCompareStatus());
        const isRemovable = !this.requiredIds.contains(item.getContentId()) && !isPendingDelete;

        if (isRemovable) {
            view.addClass('removable');
        }

        (<StatusSelectionItem>view).setIsRemovableFn(() => !this.requiredIds.contains(item.getContentId()) && !isPendingDelete);
        (<StatusSelectionItem>view).setRemoveHandlerFn(() => this.notifyItemRemoveClicked(item));

        if (!isContentSummaryValid(item)) {
            view.addClass('invalid');
            view.getEl().setTitle(i18n('dialog.publish.editInvalid'));
        }
        if (isContentSummaryReadOnly(item)) {
            view.addClass('readonly');
            view.getEl().setTitle(i18n('field.readOnly'));
        }

        this.initListItemListeners(item, view);

        return view;
    }

    onListChanged(listener: () => void) {
        this.listChangedListeners.push(listener);
    }

    setRequiredIds(value: ContentId[]) {
        this.requiredIds = ContentIds.from(value);
    }

    public setReadOnly(value: boolean) {
        this.toggleClass('readonly', value);
    }

    onItemClicked(listener: (item: ContentSummaryAndCompareStatus) => void) {
        this.itemClickListeners.push(listener);
    }

    unItemClicked(listener: (item: ContentSummaryAndCompareStatus) => void) {
        this.itemClickListeners = this.itemClickListeners.filter((curr) => {
            return curr !== listener;
        });
    }

    private notifyItemClicked(item: ContentSummaryAndCompareStatus) {
        this.itemClickListeners.forEach(listener => {
            listener(item);
        });
    }

    onItemRemoveClicked(listener: (item: ContentSummaryAndCompareStatus) => void) {
        this.removeClickListeners.push(listener);
    }

    unItemRemoveClicked(listener: (item: ContentSummaryAndCompareStatus) => void) {
        this.removeClickListeners = this.removeClickListeners.filter((curr) => {
            return curr !== listener;
        });
    }

    private notifyItemRemoveClicked(item: ContentSummaryAndCompareStatus) {
        this.removeClickListeners.forEach(listener => {
            listener(item);
        });
    }

    unListChanged(listener: () => void) {
        this.listChangedListeners = this.listChangedListeners.filter((curr) => {
            return curr !== listener;
        });
    }

    private initListItemListeners(item: ContentSummaryAndCompareStatus, view: api.dom.Element) {
        view.onClicked((event) => {
            if (!new api.dom.ElementHelper(<HTMLElement>event.target).hasClass('remove')) {
                this.notifyItemClicked(item);
            }
        });

        view.onRendered(() => {
            (<StatusSelectionItem>view).setRemoveButtonTooltip(i18n('dialog.publish.excludeFromPublishing'));
        });

        const serverEvents = api.content.event.ContentServerEventsHandler.getInstance();

        const updatedHandler = (data: ContentSummaryAndCompareStatus[]) => {
            if (data.some(updatedContent => updatedContent.getContentId().equals(item.getContentId()))) {
                this.notifyListChanged();
            }
        };
        const deletedHandler = (changedItems: api.content.event.ContentServerChangeItem[], pending?: boolean) => {
            if (changedItems.some(changedItem => changedItem.getContentId().equals(item.getContentId()))) {
                this.notifyListChanged();
            }
        };
        serverEvents.onContentUpdated(updatedHandler);
        serverEvents.onContentDeleted(deletedHandler);

        view.onRemoved(() => {
            serverEvents.unContentUpdated(updatedHandler);
            serverEvents.unContentDeleted(deletedHandler);
        });
    }

    private notifyListChanged() {
        this.listChangedListeners.forEach(listener => {
            listener();
        });
    }

}

export function isContentSummaryValid(item: ContentSummaryAndCompareStatus): boolean {
    let status = item.getCompareStatus();
    let summary = item.getContentSummary();

    return status === CompareStatus.PENDING_DELETE ||
           (summary.isValid() && !api.util.StringHelper.isBlank(summary.getDisplayName()) && !summary.getName().isUnnamed());
}

export function isContentSummaryReadOnly(item: ContentSummaryAndCompareStatus): boolean {
    return item.isReadOnly() == true; // can be undefined so thus to true
}
