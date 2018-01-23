import {IssueCommentJson} from './json/IssueCommentJson';
import PrincipalKey = api.security.PrincipalKey;

export class IssueComment {

    private creatorKey: PrincipalKey;

    private creatorDisplayName: string;

    private text: string;

    private createdTime: Date;

    constructor(creatorKey: PrincipalKey, creatorDisplayName: string, text: string = '', createdTime: Date = new Date()) {
        this.creatorKey = creatorKey;
        this.creatorDisplayName = creatorDisplayName;
        this.text = text;
        this.createdTime = createdTime;
    }

    getCreatorKey(): PrincipalKey {
        return this.creatorKey;
    }

    getCreatorDisplayName(): string {
        return this.creatorDisplayName;
    }

    getText(): string {
        return this.text;
    }

    getCreatedTime(): Date {
        return this.createdTime;
    }

    getId(): string {
        return '' + api.util.StringHelper.hashCode(this.creatorKey.toString() + this.createdTime.getTime());
    }

    static fromJson(json: IssueCommentJson) {
        const createdTime = json.createdTime ? new Date(Date.parse(json.createdTime)) : null;
        return new IssueComment(PrincipalKey.fromString(json.creatorKey), json.creatorDisplayName || 'Unknown', json.text, createdTime);
    }

}
