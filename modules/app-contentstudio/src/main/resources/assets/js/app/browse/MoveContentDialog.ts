import '../../api.ts';
import {OpenMoveDialogEvent} from './OpenMoveDialogEvent';
import {ContentMoveComboBox} from './ContentMoveComboBox';

import ContentPath = api.content.ContentPath;
import ContentSummary = api.content.ContentSummary;
import ContentIds = api.content.ContentIds;
import MoveContentResult = api.content.resource.result.MoveContentResult;
import MoveContentResultFailure = api.content.resource.result.MoveContentResultFailure;
import ConfirmationDialog = api.ui.dialog.ConfirmationDialog;
import TreeNode = api.ui.treegrid.TreeNode;
import i18n = api.util.i18n;
import ContentTreeSelectorItem = api.content.resource.ContentTreeSelectorItem;

export class MoveContentDialog
    extends api.ui.dialog.ModalDialog {

    private destinationSearchInput: ContentMoveComboBox;

    private movedContentSummaries: api.content.ContentSummary[] = [];

    private contentPathSubHeader: api.dom.H6El;

    private rootNode: TreeNode<api.content.ContentSummaryAndCompareStatus>;

    private descriptionHeader: api.dom.H6El;

    private moveConfirmationDialog: ConfirmationDialog;

    constructor() {
        super();

        this.addClass('move-content-dialog');

        this.contentPathSubHeader = new api.dom.H6El().addClass('content-path');
        this.descriptionHeader = new api.dom.H6El().addClass('desc-message');
        this.initMoveConfirmationDialog();
        this.initSearchInput();
        this.initMoveAction();

        this.listenOpenMoveDialogEvent();

        this.appendChildToContentPanel(this.contentPathSubHeader);
        this.appendChildToContentPanel(this.descriptionHeader);
        this.appendChildToContentPanel(this.destinationSearchInput);
        this.addCancelButtonToBottom();
    }

    private updateHeaderAndDescription() {
        this.setTitle(i18n('dialog.move'));
        this.descriptionHeader.setHtml(i18n('dialog.move.subname'));
    }

    private listenOpenMoveDialogEvent() {
        OpenMoveDialogEvent.on((event) => {

            this.movedContentSummaries = event.getContentSummaries();
            this.destinationSearchInput.clearCombobox();
            this.rootNode = event.getRootNode();

            this.updateHeaderAndDescription();

            const contents = event.getContentSummaries();

            this.destinationSearchInput.setFilterContents(contents);
            this.contentPathSubHeader.setHtml(contents.length === 1 ? contents[0].getPath().toString() : '');

            this.open();
        });
    }

    private initMoveConfirmationDialog() {
        this.moveConfirmationDialog = new ConfirmationDialog()
            .setQuestion(i18n('dialog.confirm.move'))
            .setYesCallback(() => this.moveContent())
            .setNoCallback(() => {
                this.open();
            });
    }

    private initSearchInput() {
        this.destinationSearchInput = new ContentMoveComboBox();
        this.destinationSearchInput.addClass('content-selector');
        this.destinationSearchInput.onOptionSelected(() => {
            this.getButtonRow().focusDefaultAction();
        });
    }

    private initMoveAction() {
        this.addClickIgnoredElement(this.moveConfirmationDialog);
        this.addAction(new api.ui.Action(i18n('action.move'), '').onExecuted(() => {
            if (this.checkContentWillMoveOutOfSite()) {
                this.showConfirmationDialog();
            } else {
                this.moveContent();
            }
        }), true);
    }

    private showConfirmationDialog() {
        this.close();
        this.moveConfirmationDialog.open();
    }

    private checkContentWillMoveOutOfSite(): boolean {
        let result = false;
        const targetContent: ContentTreeSelectorItem = this.getParentContentItem();
        const targetContentSite: ContentSummary = targetContent
            ? (targetContent.isSite() ? targetContent.getContent() : this.getParentSite(targetContent.getContent()))
            : null;
        for (let i = 0; i < this.movedContentSummaries.length; i++) {
            let content = this.movedContentSummaries[i];
            let contentParentSite = content.isSite() ? null : this.getParentSite(content);
            if (contentParentSite && (!targetContent || (!contentParentSite.equals(targetContentSite)))) {
                result = true;
                break;
            }
        }

        return result;
    }

    private getParentSite(content: ContentSummary): ContentSummary {
        const node = this.rootNode.findNode(content.getId());
        if (!node) {
            return null;
        }

        let nodeParent = node.getParent();
        while (nodeParent) {
            if (nodeParent.getData() && nodeParent.getData().getContentSummary().isSite()) {
                return nodeParent.getData().getContentSummary();
            }
            nodeParent = nodeParent.getParent();
        }

        return null;
    }

    private moveContent() {
        const parentContent: ContentTreeSelectorItem = this.getParentContentItem();
        let parentRoot = (!!parentContent) ? parentContent.getPath() : ContentPath.ROOT;
        let contentIds = ContentIds.create().fromContentIds(this.movedContentSummaries.map(summary => summary.getContentId())).build();

        new api.content.resource.MoveContentRequest(contentIds, parentRoot).sendAndParse().then((response: MoveContentResult) => {
            if (parentContent) {
                this.destinationSearchInput.deselect(parentContent);
            }

            if (response.getMoved().length > 0) {
                if (response.getMoved().length > 1) {
                    api.notify.showFeedback(i18n('notify.item.movedMultiple', response.getMoved().length));
                } else {
                    api.notify.showFeedback(i18n('notify.item.moved', response.getMoved()[0]));
                }
            } else if (response.getMoveFailures().length == 0) {
                api.notify.showWarning(i18n('notify.item.nothingToMove'));
            }

            response.getMoveFailures().forEach((failure: MoveContentResultFailure) => {
                api.notify.showWarning(failure.getReason());
            });
            if (this.isVisible()) {
                this.close();
            }
        }).catch((reason) => {
            api.notify.showWarning(reason.getMessage());
            this.close();
            this.destinationSearchInput.deselect(this.getParentContentItem());
        }).done();
    }

    private getParentContentItem(): ContentTreeSelectorItem {
        return this.destinationSearchInput.getSelectedDisplayValues()[0];
    }

    show() {
        api.dom.Body.get().appendChild(this);
        super.show();
        this.destinationSearchInput.giveFocus();
    }

}
