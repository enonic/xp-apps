import '../../../api.ts';
import {ContentTreeGrid} from '../ContentTreeGrid';
import {ToggleSearchPanelAction} from './ToggleSearchPanelAction';
import {ShowNewContentDialogAction} from './ShowNewContentDialogAction';
import {PreviewContentAction} from './PreviewContentAction';
import {EditContentAction} from './EditContentAction';
import {DeleteContentAction} from './DeleteContentAction';
import {DuplicateContentAction} from './DuplicateContentAction';
import {MoveContentAction} from './MoveContentAction';
import {SortContentAction} from './SortContentAction';
import {PublishContentAction} from './PublishContentAction';
import {PublishTreeContentAction} from './PublishTreeContentAction';
import {UnpublishContentAction} from './UnpublishContentAction';
import {ContentBrowseItem} from '../ContentBrowseItem';
import {PreviewContentHandler} from './handler/PreviewContentHandler';
import {UndoPendingDeleteContentAction} from './UndoPendingDeleteContentAction';
import {CreateIssueAction} from './CreateIssueAction';
import Action = api.ui.Action;
import TreeGridActions = api.ui.treegrid.actions.TreeGridActions;
import BrowseItemsChanges = api.app.browse.BrowseItemsChanges;
import ContentSummary = api.content.ContentSummary;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import Content = api.content.Content;
import Permission = api.security.acl.Permission;
import GetContentByPathRequest = api.content.resource.GetContentByPathRequest;
import i18n = api.util.i18n;
import ManagedActionManager = api.managedaction.ManagedActionManager;

export class ContentTreeGridActions implements TreeGridActions<ContentSummaryAndCompareStatus> {

    public SHOW_NEW_CONTENT_DIALOG_ACTION: Action;
    public PREVIEW_CONTENT: Action;
    public EDIT_CONTENT: Action;
    public DELETE_CONTENT: Action;
    public DUPLICATE_CONTENT: Action;
    public MOVE_CONTENT: Action;
    public SORT_CONTENT: Action;
    public PUBLISH_CONTENT: Action;
    public PUBLISH_TREE_CONTENT: Action;
    public UNPUBLISH_CONTENT: Action;
    public CREATE_ISSUE: Action;
    public TOGGLE_SEARCH_PANEL: Action;
    public UNDO_PENDING_DELETE: Action;

    private actions: api.ui.Action[] = [];

    private grid: ContentTreeGrid;

    constructor(grid: ContentTreeGrid) {
        this.grid = grid;
        this.TOGGLE_SEARCH_PANEL = new ToggleSearchPanelAction();

        this.SHOW_NEW_CONTENT_DIALOG_ACTION = new ShowNewContentDialogAction(grid);
        this.PREVIEW_CONTENT = new PreviewContentAction(grid);
        this.EDIT_CONTENT = new EditContentAction(grid);
        this.DELETE_CONTENT = new DeleteContentAction(grid);
        this.DUPLICATE_CONTENT = new DuplicateContentAction(grid);
        this.MOVE_CONTENT = new MoveContentAction(grid);
        this.SORT_CONTENT = new SortContentAction(grid);
        this.PUBLISH_CONTENT = new PublishContentAction(grid);
        this.PUBLISH_TREE_CONTENT = new PublishTreeContentAction(grid);
        this.UNPUBLISH_CONTENT = new UnpublishContentAction(grid);
        this.CREATE_ISSUE = new CreateIssueAction(grid);
        this.UNDO_PENDING_DELETE = new UndoPendingDeleteContentAction(grid);

        this.actions.push(
            this.SHOW_NEW_CONTENT_DIALOG_ACTION,
            this.EDIT_CONTENT, this.DELETE_CONTENT,
            this.DUPLICATE_CONTENT, this.MOVE_CONTENT,
            this.SORT_CONTENT, this.PREVIEW_CONTENT,
            this.UNDO_PENDING_DELETE
        );

        this.initListeners();
    }

    initListeners() {
        const previewStateChangedHandler = value => {
            this.PREVIEW_CONTENT.setEnabled(value);
        };
        this.getPreviewHandler().onPreviewStateChanged(previewStateChangedHandler);

        const managedActionsHandler = () => {
            const noManagedActionExecuting = !ManagedActionManager.instance().isExecuting();
            this.DELETE_CONTENT.setEnabled(noManagedActionExecuting);
            this.DUPLICATE_CONTENT.setEnabled(noManagedActionExecuting);
            this.MOVE_CONTENT.setEnabled(noManagedActionExecuting);
            this.PUBLISH_CONTENT.setEnabled(noManagedActionExecuting);
            this.PUBLISH_TREE_CONTENT.setEnabled(noManagedActionExecuting);
            this.UNPUBLISH_CONTENT.setEnabled(noManagedActionExecuting);
        };
        ManagedActionManager.instance().onManagedActionStateChanged(managedActionsHandler);

        this.grid.onRemoved(() => {
            this.getPreviewHandler().unPreviewStateChanged(previewStateChangedHandler);
            ManagedActionManager.instance().unManagedActionStateChanged(managedActionsHandler);
        });
    }

    getPreviewHandler(): PreviewContentHandler {
        return (<PreviewContentAction>this.PREVIEW_CONTENT).getPreviewHandler();
    }

    private getDefaultVisibleActions(): api.ui.Action[] {
        return this.actions.filter(action => action !== this.UNDO_PENDING_DELETE).concat(this.PUBLISH_CONTENT);
    }

    getAllActions(): api.ui.Action[] {
        return [...this.actions, this.PUBLISH_CONTENT, this.UNPUBLISH_CONTENT];
    }

    getAllActionsNoPublish(): api.ui.Action[] {
        return this.actions;
    }

    // tslint:disable-next-line:max-line-length
    updateActionsEnabledState(browseItems: ContentBrowseItem[], changes?: BrowseItemsChanges<ContentSummaryAndCompareStatus>): wemQ.Promise<void> {

        if (changes && changes.getAdded().length == 0 && changes.getRemoved().length == 0) {
            return wemQ<void>(null);
        }

        this.TOGGLE_SEARCH_PANEL.setVisible(false);

        let parallelPromises: wemQ.Promise<any>[] = [
            this.getPreviewHandler().updateState(browseItems, changes),
            this.doUpdateActionsEnabledState(browseItems)
        ];

        return wemQ.all(parallelPromises).catch(api.DefaultErrorHandler.handle);
    }

    private resetDefaultActionsNoItemsSelected() {
        this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(true);
        this.EDIT_CONTENT.setEnabled(false);
        this.DELETE_CONTENT.setEnabled(false);
        this.DUPLICATE_CONTENT.setEnabled(false);
        this.MOVE_CONTENT.setEnabled(false);
        this.SORT_CONTENT.setEnabled(false);

        this.PUBLISH_TREE_CONTENT.setEnabled(false);
        this.PUBLISH_CONTENT.setEnabled(false);
        this.UNPUBLISH_CONTENT.setEnabled(false);

        this.UNPUBLISH_CONTENT.setVisible(false);
        this.UNDO_PENDING_DELETE.setVisible(false);

        this.CREATE_ISSUE.setEnabled(false);

        this.showDefaultActions();
    }

    private showDefaultActions() {
        this.getDefaultVisibleActions().forEach(action => action.setVisible(true));
    }

    private resetDefaultActionsMultipleItemsSelected(contentBrowseItems: ContentBrowseItem[]) {
        let contentSummaries: ContentSummary[] = contentBrowseItems.map((elem: ContentBrowseItem) => {
            return elem.getModel().getContentSummary();
        });

        const noManagedActionExecuting = !ManagedActionManager.instance().isExecuting();

        let treePublishEnabled = true;
        let unpublishEnabled = true;

        const deleteEnabled = this.anyDeletable(contentSummaries) && noManagedActionExecuting;
        const duplicateEnabled = contentSummaries.length === 1 && noManagedActionExecuting;
        const moveEnabled = !this.isAllItemsSelected(contentBrowseItems.length) && noManagedActionExecuting;

        let allAreOnline = contentBrowseItems.length > 0;
        let allArePendingDelete = contentBrowseItems.length > 0;
        let someArePublished = false;
        let allAreReadonly = contentBrowseItems.length > 0;

        contentBrowseItems.forEach((browseItem) => {
            let content = browseItem.getModel();

            if (allAreOnline && !content.isOnline()) {
                allAreOnline = false;
            }
            if (allArePendingDelete && !content.isPendingDelete()) {
                allArePendingDelete = false;
            }
            if (!someArePublished && content.isPublished()) {
                someArePublished = true;
            }
            if (allAreReadonly && !content.isReadOnly()) {
                allAreReadonly = false;
            }
        });

        const publishEnabled = !allAreOnline && noManagedActionExecuting;
        if (this.isEveryLeaf(contentSummaries)) {
            treePublishEnabled = false;
            unpublishEnabled = someArePublished;
        } else if (this.isOneNonLeaf(contentSummaries)) {
            unpublishEnabled = someArePublished;
        } else if (this.isNonLeafInMany(contentSummaries)) {
            unpublishEnabled = someArePublished;
        }

        treePublishEnabled = treePublishEnabled && noManagedActionExecuting;
        unpublishEnabled = unpublishEnabled && noManagedActionExecuting;

        this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(contentSummaries.length < 2);
        this.EDIT_CONTENT.setEnabled(!allAreReadonly && this.anyEditable(contentSummaries));
        this.DELETE_CONTENT.setEnabled(deleteEnabled);
        this.DUPLICATE_CONTENT.setEnabled(duplicateEnabled);
        this.MOVE_CONTENT.setEnabled(moveEnabled);
        this.SORT_CONTENT.setEnabled(contentSummaries.length === 1 && contentSummaries[0].hasChildren());

        this.PUBLISH_CONTENT.setEnabled(publishEnabled);
        this.PUBLISH_TREE_CONTENT.setEnabled(treePublishEnabled);
        this.UNPUBLISH_CONTENT.setEnabled(unpublishEnabled);

        this.CREATE_ISSUE.setEnabled(true);

        this.SHOW_NEW_CONTENT_DIALOG_ACTION.setVisible(!allArePendingDelete);
        this.MOVE_CONTENT.setVisible(!allArePendingDelete);
        this.SORT_CONTENT.setVisible(!allArePendingDelete);
        this.DELETE_CONTENT.setVisible(!allArePendingDelete);

        if (allArePendingDelete) {
            this.getAllActions().forEach(action => action.setVisible(false));
        } else {
            this.getAllActionsNoPublish().forEach(action => action.setVisible(true));
            this.UNPUBLISH_CONTENT.setVisible(unpublishEnabled);
        }
        this.PUBLISH_CONTENT.setVisible(publishEnabled);
        this.UNDO_PENDING_DELETE.setVisible(allArePendingDelete);
    }

    private isEveryLeaf(contentSummaries: ContentSummary[]): boolean {
        return contentSummaries.every((obj: ContentSummary) => !obj.hasChildren());
    }

    private isOneNonLeaf(contentSummaries: ContentSummary[]): boolean {
        return contentSummaries.length === 1 && contentSummaries[0].hasChildren();
    }

    private isNonLeafInMany(contentSummaries: ContentSummary[]): boolean {
        return contentSummaries.length > 1 && contentSummaries.some((obj: ContentSummary) => obj.hasChildren());
    }

    private doUpdateActionsEnabledState(contentBrowseItems: ContentBrowseItem[]): wemQ.Promise<any> {
        switch (contentBrowseItems.length) {
        case 0:
            return this.updateActionsByPermissionsNoItemsSelected();
        case 1:
            return this.updateActionsByPermissionsSingleItemSelected(contentBrowseItems);
        default:
            return this.updateActionsByPermissionsMultipleItemsSelected(contentBrowseItems);
        }
    }

    private updateActionsByPermissionsNoItemsSelected(): wemQ.Promise<any> {
        return new api.content.resource.GetPermittedActionsRequest().addPermissionsToBeChecked(Permission.CREATE).sendAndParse().then(
            (allowedPermissions: Permission[]) => {
                this.resetDefaultActionsNoItemsSelected();

                let canCreate = allowedPermissions.indexOf(Permission.CREATE) > -1;

                this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(canCreate);
            });
    }

    private updateActionsByPermissionsSingleItemSelected(contentBrowseItems: ContentBrowseItem[]): wemQ.Promise<any> {
        let selectedItem = contentBrowseItems[0].getModel().getContentSummary();

        return this.checkIsChildrenAllowedByContentType(selectedItem).then((contentTypeAllowsChildren: boolean) => {
            return this.updateActionsByPermissionsMultipleItemsSelected(contentBrowseItems, contentTypeAllowsChildren).then(() => {
                return this.updateCanDuplicateActionSingleItemSelected(selectedItem);
            });
        });
    }

    private handleDeletedContentType(contentSummary: ContentSummary): wemQ.Promise<any> {
        api.notify.NotifyManager.get().showWarning(i18n('notify.contentType.notFound', contentSummary.getType().getLocalName()));

        return new api.content.resource.GetPermittedActionsRequest().
            addContentIds(contentSummary.getContentId()).
            addPermissionsToBeChecked(Permission.CREATE, Permission.DELETE, Permission.PUBLISH).
            sendAndParse().
            then((allowedPermissions: Permission[]) => {
                this.resetDefaultActionsNoItemsSelected();
                this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(false);

                let canCreate = allowedPermissions.indexOf(Permission.CREATE) > -1;

            let canDelete = allowedPermissions.indexOf(Permission.DELETE) > -1 && !ManagedActionManager.instance().isExecuting();

            let canPublish = allowedPermissions.indexOf(Permission.PUBLISH) > -1 && !ManagedActionManager.instance().isExecuting();

                if (canDelete) {
                    this.DELETE_CONTENT.setEnabled(true);
                }

                if (canCreate && canDelete) {
                    this.MOVE_CONTENT.setEnabled(true);
                }

                if (canPublish) {
                    this.UNPUBLISH_CONTENT.setEnabled(true);
                }
            });
    }

    private updateActionsByPermissionsMultipleItemsSelected(contentBrowseItems: ContentBrowseItem[],
                                                            contentTypesAllowChildren: boolean = true): wemQ.Promise<any> {
        return new api.content.resource.GetPermittedActionsRequest().
            addContentIds(...contentBrowseItems.map(contentBrowseItem => contentBrowseItem.getModel().getContentId())).
            addPermissionsToBeChecked(Permission.CREATE, Permission.DELETE, Permission.PUBLISH).
            sendAndParse().
            then((allowedPermissions: Permission[]) => {
                this.resetDefaultActionsMultipleItemsSelected(contentBrowseItems);

                let canCreate = allowedPermissions.indexOf(Permission.CREATE) > -1;

            let canDelete = allowedPermissions.indexOf(Permission.DELETE) > -1 && !ManagedActionManager.instance().isExecuting();

            let canPublish = allowedPermissions.indexOf(Permission.PUBLISH) > -1 && !ManagedActionManager.instance().isExecuting();

                if (!contentTypesAllowChildren || !canCreate) {
                    this.SHOW_NEW_CONTENT_DIALOG_ACTION.setEnabled(false);
                    this.SORT_CONTENT.setEnabled(false);
                }

                if (!canDelete) {
                    this.DELETE_CONTENT.setEnabled(false);
                    this.MOVE_CONTENT.setEnabled(false);
                }

                if (!canPublish) {
                    this.PUBLISH_CONTENT.setEnabled(false);
                    this.PUBLISH_TREE_CONTENT.setEnabled(false);
                    this.UNPUBLISH_CONTENT.setEnabled(false);
                }
            });
    }

    private checkIsChildrenAllowedByContentType(contentSummary: ContentSummary): wemQ.Promise<Boolean> {
        let deferred = wemQ.defer<boolean>();

        new api.schema.content.GetContentTypeByNameRequest(contentSummary.getType()).sendAndParse()
            .then((contentType: api.schema.content.ContentType) => deferred.resolve(contentType && contentType.isAllowChildContent()))
            .fail(() => this.handleDeletedContentType(contentSummary));

        return deferred.promise;
    }

    private anyEditable(contentSummaries: api.content.ContentSummary[]): boolean {
        return contentSummaries.some((content) => {
            return !!content && content.isEditable();
        });
    }

    private anyDeletable(contentSummaries: api.content.ContentSummary[]): boolean {
        return contentSummaries.some((content) => {
            return !!content && content.isDeletable();
        });
    }

    private updateCanDuplicateActionSingleItemSelected(selectedItem: ContentSummary) {
        // Need to check if parent allows content creation
        new GetContentByPathRequest(selectedItem.getPath().getParentPath()).sendAndParse().then((content: Content) => {
            new api.content.resource.GetPermittedActionsRequest()
                .addContentIds(content.getContentId())
                .addPermissionsToBeChecked(Permission.CREATE)
                .sendAndParse().then((allowedPermissions: Permission[]) => {
                const canDuplicate = allowedPermissions.indexOf(Permission.CREATE) > -1 &&
                                     !ManagedActionManager.instance().isExecuting();
                this.DUPLICATE_CONTENT.setEnabled(canDuplicate);
            });
        });
    }

    private isAllItemsSelected(items: number): boolean {
        return items === this.grid.getRoot().getDefaultRoot().treeToList(false, false).length;
    }
}
