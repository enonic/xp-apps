import TextArea = api.ui.text.TextArea;
import PrincipalViewerCompact = api.ui.security.PrincipalViewerCompact;
import Principal = api.security.Principal;

export class IssueCommentTextArea
    extends api.dom.DivEl {

    private textArea: TextArea;
    private icon: PrincipalViewerCompact;

    constructor() {
        super('issue-comment-textarea');
        this.textArea = new TextArea('comment');
        this.icon = new PrincipalViewerCompact();
    }

    setUser(principal: Principal) {
        this.icon.setObject(principal);
    }

    getValue(): string {
        return this.textArea.getValue();
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then(rendered => {
            this.removeChildren().appendChildren<api.dom.Element>(this.textArea, this.icon);
            return rendered;
        });
    }
}
