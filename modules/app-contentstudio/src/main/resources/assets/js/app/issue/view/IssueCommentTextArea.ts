import TextArea = api.ui.text.TextArea;
import PrincipalViewerCompact = api.ui.security.PrincipalViewerCompact;
import Principal = api.security.Principal;
import CompositeFormInputEl = api.dom.CompositeFormInputEl;

export class IssueCommentTextArea
    extends CompositeFormInputEl {

    private textArea: TextArea;
    private icon: PrincipalViewerCompact;

    constructor() {
        const textArea = new TextArea('comment');
        super(textArea);
        this.addClass('issue-comment-textarea');
        this.textArea = textArea;
        this.icon = new PrincipalViewerCompact();
        this.addAdditionalElement(this.icon);
    }

    setUser(principal: Principal) {
        this.icon.setObject(principal);
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then(rendered => {
            this.removeChildren().appendChildren<api.dom.Element>(this.textArea, this.icon);
            return rendered;
        });
    }
}
