import {CommentJson} from './json/CommentJson';
import PrincipalKey = api.security.PrincipalKey;

export class Comment {

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

    static fromJson(json: CommentJson) {
        const createdTime = json.createdTime ? new Date(Date.parse(json.createdTime)) : null;
        return new Comment(PrincipalKey.fromString(json.creatorKey), json.creatorDisplayName, json.text, createdTime);
    }

}
