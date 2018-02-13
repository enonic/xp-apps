import ListBox = api.ui.selector.list.ListBox;
import PrincipalViewerCompact = api.ui.security.PrincipalViewerCompact;
import H6El = api.dom.H6El;
import InPlaceTextArea = api.ui.text.InPlaceTextArea;
import Principal = api.security.Principal;
import i18n = api.util.i18n;
import ContextMenu = api.ui.menu.ContextMenu;
import Action = api.ui.Action;
import ElementHelper = api.dom.ElementHelper;
import ConfirmationDialog = api.ui.dialog.ConfirmationDialog;
import {IssueComment} from '../IssueComment';
import {DeleteIssueCommentRequest} from '../resource/DeleteIssueCommentRequest';
import {Issue} from '../Issue';
import {ListIssueCommentsRequest} from '../resource/ListIssueCommentsRequest';
import {UpdateIssueCommentRequest} from '../resource/UpdateIssueCommentRequest';

export class IssueCommentsList
    extends ListBox<IssueComment> {
    private parentIssue: Issue;
    private activeItem: IssueComment;
    private menu: ContextMenu;
    private confirmDialog: ConfirmationDialog;

    constructor() {
        super('issue-comments-list');
        this.setEmptyText(i18n('field.issue.noComments'));

        this.confirmDialog = new ConfirmationDialog().setQuestion(i18n('dialog.issue.confirmCommentDelete'));
        this.menu = this.createContextMenu();
    }

    getContextMenu(): ContextMenu {
        return this.menu;
    }

    getConfirmDialog(): ConfirmationDialog {
        return this.confirmDialog;
    }

    setParentIssue(issue: Issue) {
        this.parentIssue = issue;
        new ListIssueCommentsRequest(issue.getId()).sendAndParse().then(response => {
            this.setItems(response.getIssueComments());
        });
    }

    protected getItemId(item: IssueComment): string {
        return item.getId();
    }

    protected createItemView(item: IssueComment, readOnly: boolean): api.dom.Element {
        const listItem = new IssueCommentsListItem(item, this.parentIssue);
        listItem.onContextMenuClicked((x: number, y: number, comment: IssueComment) => {
            this.activeItem = comment;
            this.menu.showAt(x, y);
        });
        return listItem;
    }

    private createContextMenu(): ContextMenu {
        const editAction = new Action(i18n('action.edit')).onExecuted(() => {
            (<IssueCommentsListItem> this.getItemView(this.activeItem)).beginEdit();
        });
        const removeAction = new Action(i18n('action.delete')).onExecuted(action => {
            if (this.parentIssue && this.activeItem) {
                ((parentIssue, activeItem) => {  // closure to remember activeItem in case it changes during request

                    this.confirmDialog.setYesCallback(() => {
                        new DeleteIssueCommentRequest(parentIssue.getId(), activeItem.getName()).sendAndParse().done(result => {
                            if (result) {
                                this.removeItem(activeItem);
                                api.notify.showFeedback(i18n('notify.issue.commentDeleted'));
                            }
                        });
                    }).open();

                })(this.parentIssue, this.activeItem);
            }
        });

        this.confirmDialog.onShown(event => {
            removeAction.setEnabled(false);
        });

        this.confirmDialog.onHidden(event => {
            removeAction.setEnabled(true);
        });

        const menu = new ContextMenu([editAction, removeAction]);
        menu.onHidden(() => this.activeItem = undefined);
        return menu;
    }
}

class IssueCommentsListItem
    extends api.ui.Viewer<IssueComment> {

    private header: H6El;
    private text: InPlaceTextArea;
    private principalViewer: PrincipalViewerCompact;
    private contextMenuClickedListeners: { (x: number, y: number, comment: IssueComment): void }[] = [];

    constructor(comment: IssueComment, private parentIssue: Issue) {
        super('issue-comments-list-item');
        this.setObject(comment);
    }

    protected doLayout(comment: IssueComment) {
        super.doLayout(comment);

        const p = Principal.create()
            .setKey(comment.getCreatorKey())
            .setDisplayName(comment.getCreatorDisplayName()).build();

        if (!this.principalViewer) {
            this.principalViewer = new PrincipalViewerCompact();
            this.principalViewer.setObject(p);
            this.appendChild(this.principalViewer);
        } else {
            this.principalViewer.doLayout(p);
        }

        if (!this.header) {
            this.header = new H6El("header");
            this.header.setHtml(this.resolveDisplayName(comment), false);
            this.text = new InPlaceTextArea(this.resolveSubName(comment));
            this.text.onEditModeChanged((editMode, newVal, oldVal) => {
                if (!editMode && newVal !== oldVal) {
                    new UpdateIssueCommentRequest(this.parentIssue.getId(), comment.getName()).setText(newVal).sendAndParse().done(() => {
                        api.notify.showFeedback(i18n('notify.issue.commentUpdated'));
                    });
                }
            });
            this.appendChildren(this.header, this.text);

            this.header.onClicked((event: MouseEvent) => {
                const targetEl = (<HTMLElement>event.target);
                if (targetEl.tagName === 'I' && targetEl.classList.contains('icon-menu2')) {
                    event.stopImmediatePropagation();
                    const targetHelper = new ElementHelper(targetEl);
                    const dims = targetHelper.getDimensions();
                    this.notifyContextMenuClicked(dims.left, dims.top + dims.height, this.getObject());
                }
            });
        }

        this.setObject(comment);
    }

    private resolveDisplayName(comment: IssueComment): string {
        const time = api.util.DateHelper.getModifiedString(comment.getCreatedTime());
        return `<i class="icon icon-small icon-menu2"/>${comment.getCreatorDisplayName()}<span class="created-time">${time}</span>`;
    }

    private resolveSubName(comment: IssueComment): string {
        return comment.getText();
    }

    public beginEdit() {
        this.text.setEditMode(true);
    }

    public onContextMenuClicked(listener: (x: number, y: number, comment: IssueComment) => void) {
        this.contextMenuClickedListeners.push(listener);
    }

    public unContextMenuClicked(listener: (x: number, y: number, comment: IssueComment) => void) {
        this.contextMenuClickedListeners = this.contextMenuClickedListeners.filter(curr => curr !== listener);
    }

    private notifyContextMenuClicked(x: number, y: number, comment: IssueComment) {
        this.contextMenuClickedListeners.forEach(listener => listener(x, y, comment));
    }
}
