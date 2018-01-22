import ListBox = api.ui.selector.list.ListBox;
import PrincipalViewerCompact = api.ui.security.PrincipalViewerCompact;
import NamesView = api.app.NamesView;
import Principal = api.security.Principal;
import i18n = api.util.i18n;
import {IssueComment} from '../IssueComment';

export class IssueCommentsList
    extends ListBox<IssueComment> {

    constructor() {
        super('issue-comments-list');
        this.setEmptyText(i18n('field.issue.noComments'));
    }

    protected getItemId(item: IssueComment): string {
        return item.getId();
    }

    protected createItemView(item: IssueComment, readOnly: boolean): api.dom.Element {
        return new IssueCommentsListItem(item);
    }
}

class IssueCommentsListItem
    extends api.ui.Viewer<IssueComment> {

    private namesView: NamesView;
    private principalViewer: PrincipalViewerCompact;

    constructor(comment: IssueComment) {
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

        if (!this.namesView) {
            this.namesView = new NamesView(false);
            this.appendChild(this.namesView);
        }
        this.namesView.setMainName(this.resolveDisplayName(comment), false).setSubName(this.resolveSubName(comment));

        this.setObject(comment);
    }

    private resolveDisplayName(comment: IssueComment): string {
        const time = api.util.DateHelper.getModifiedString(comment.getCreatedTime());
        return `${comment.getCreatorDisplayName()}<span class="created-time">${time}</span>`;
    }

    private resolveSubName(comment: IssueComment): string {
        return comment.getText();
    }
}
