import ListBox = api.ui.selector.list.ListBox;
import {Comment} from '../Comment';

export class IssueCommentsList
    extends ListBox<Comment> {

    protected getItemId(item: Comment): string {
        return item.getId();
    }

    protected createItemView(item: Comment, readOnly: boolean): api.dom.Element {
        return new IssueCommentsListItem(item)
    }
}

class IssueCommentsListItem
    extends api.ui.NamesAndIconViewer<Comment> {

    private comment: Comment;

    constructor(comment: Comment) {
        super('issue-comments-list-item');
        this.comment = comment;
    }

    resolveIconUrl(comment: Comment): string {
        return comment.getCreator().toString();    //TODO: get a proper
    }
}
