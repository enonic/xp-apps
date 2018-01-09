import {Issue} from '../Issue';
import {IssueJson} from '../json/IssueJson';
import {IssueResourceRequest} from './IssueResourceRequest';
import PrincipalKey = api.security.PrincipalKey;
import Path = api.rest.Path;
import JsonResponse = api.rest.JsonResponse;

export class CommentIssueRequest
    extends IssueResourceRequest<IssueJson, Issue> {

    private creatorKey: PrincipalKey;
    private creatorDisplayName: string;
    private text: string;
    private issueId: string;

    constructor(issueId: string) {
        super();
        super.setMethod('POST');
        this.issueId = issueId;
    }

    setCreator(key: PrincipalKey, displayName: string) {
        this.creatorKey = key;
        this.creatorDisplayName = displayName;
        return this;
    }

    setText(text: string) {
        this.text = text;
        return this;
    }

    getParams(): Object {
        return {
            issueId: this.issueId,
            text: this.text,
            creatorKey: this.creatorKey.toString(),
            creatorDisplayName: this.creatorDisplayName
        };
    }

    getRequestPath(): Path {
        return Path.fromParent(super.getResourcePath(), 'comment');
    }

    sendAndParse(): wemQ.Promise<Issue> {
        return this.send().then((response: JsonResponse<IssueJson>) => {
            return Issue.fromJson(response.getResult());
        });
    }
}
