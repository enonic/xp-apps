import {IssueResourceRequest} from './IssueResourceRequest';
import Path = api.rest.Path;
import JsonResponse = api.rest.JsonResponse;

export class DeleteIssueCommentRequest
    extends IssueResourceRequest<any, boolean> {

    private commentName: string;
    private issueId: string;

    constructor(issueId: string, commentName: string) {
        super();
        super.setMethod('POST');
        this.issueId = issueId;
        this.commentName = commentName;
    }

    getParams(): Object {
        return {
            issue: this.issueId,
            comment: this.commentName
        };
    }

    getRequestPath(): Path {
        return Path.fromParent(super.getResourcePath(), 'comment/delete');
    }

    sendAndParse(): wemQ.Promise<boolean> {
        return this.send().then((response: JsonResponse<any>) => {
            return response.getResult()['ids'].length > 0;
        });
    }
}
