import {IssueCommentJson} from '../json/IssueCommentJson';
import {IssueResourceRequest} from './IssueResourceRequest';
import {IssueComment} from '../IssueComment';
import Path = api.rest.Path;
import JsonResponse = api.rest.JsonResponse;

export class UpdateIssueCommentRequest
    extends IssueResourceRequest<IssueCommentJson, IssueComment> {

    private commentName: string;
    private text: string;
    private issueId: string;

    constructor(issueId: string, commentName: string) {
        super();
        super.setMethod('POST');
        this.issueId = issueId;
        this.commentName = commentName;
    }

    setText(text: string) {
        this.text = text;
        return this;
    }

    getParams(): Object {
        return {
            issue: this.issueId,
            text: this.text,
            comment: this.commentName
        };
    }

    getRequestPath(): Path {
        return Path.fromParent(super.getResourcePath(), 'comment/update');
    }

    sendAndParse(): wemQ.Promise<IssueComment> {
        return this.send().then((response: JsonResponse<IssueCommentJson>) => {
            return IssueComment.fromJson(response.getResult());
        });
    }
}
