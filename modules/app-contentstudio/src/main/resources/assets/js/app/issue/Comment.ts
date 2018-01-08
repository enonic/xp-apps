import {CommentJson} from './json/CommentJson';
import PrincipalKey = api.security.PrincipalKey;

export class Comment {

    private creator: PrincipalKey;

    private text: string;

    private createdTime: Date;

    constructor(creator: PrincipalKey, text: string = "", createdTime: Date = new Date()) {
        this.creator = creator;
        this.text = text;
        this.createdTime = createdTime;
    }

    getCreator(): PrincipalKey {
        return this.creator;
    }

    getText(): string {
        return this.text;
    }

    getCreatedTime(): Date {
        return this.createdTime;
    }

    getId(): string {
        return '' + api.util.StringHelper.hashCode(this.creator.toString() + this.text + this.createdTime.getTime());
    }

    static fromJson(json: CommentJson) {
        const createdTime = json.createdTime ? new Date(Date.parse(json.createdTime)) : null;
        return new Comment(PrincipalKey.fromString(json.creator), json.text, createdTime)
    }

}
