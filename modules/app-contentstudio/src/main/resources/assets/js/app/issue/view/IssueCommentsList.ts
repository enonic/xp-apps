import ListBox = api.ui.selector.list.ListBox;
import PrincipalViewerCompact = api.ui.security.PrincipalViewerCompact;
import NamesView = api.app.NamesView;
import Principal = api.security.Principal;
import i18n = api.util.i18n;
import {Comment} from '../Comment';

export class IssueCommentsList
    extends ListBox<Comment> {

    constructor() {
        super('issue-comments-list');
        this.setEmptyText(i18n('field.issue.noComments'));
    }

    protected getItemId(item: Comment): string {
        return item.getId();
    }

    protected createItemView(item: Comment, readOnly: boolean): api.dom.Element {
        return new IssueCommentsListItem(item);
    }
}

class IssueCommentsListItem
    extends api.ui.Viewer<Comment> {

    private namesView: NamesView;
    private principalViewer: PrincipalViewerCompact;

    constructor(comment: Comment) {
        super('issue-comments-list-item');
        this.setObject(comment);
    }

    protected doLayout(comment: Comment) {
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

        if (!this.namesView) {
            this.namesView = new NamesView(false);
            this.appendChild(this.namesView);
        }
        this.namesView.setMainName(this.resolveDisplayName(comment), false).setSubName(this.resolveSubName(comment));

        this.setObject(comment);
    }

    private resolveDisplayName(comment: Comment): string {
        const time = api.util.DateHelper.getModifiedString(comment.getCreatedTime());
        return `${comment.getCreatorDisplayName()}<span class="created-time">${time}</span>`;
    }

    private resolveSubName(comment: Comment): string {
        return comment.getText();
    }
}
