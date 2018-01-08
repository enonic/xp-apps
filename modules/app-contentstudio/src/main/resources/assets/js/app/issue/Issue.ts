import {IssueSummary, IssueSummaryBuilder} from './IssueSummary';
import {PublishRequest} from './PublishRequest';
import {IssueJson} from './json/IssueJson';
import {Comment} from './Comment';
import PrincipalKey = api.security.PrincipalKey;

export class Issue extends IssueSummary {

    private approvers: PrincipalKey[];

    private publishRequest: PublishRequest;

    private comments: Comment[];

    constructor(builder: IssueBuilder) {
        super(builder);

        this.approvers = builder.approvers;
        this.publishRequest = builder.publishRequest;
        this.comments = builder.comments;
    }

    public getApprovers(): PrincipalKey[] {
        return this.approvers;
    }

    public getPublishRequest(): PublishRequest {
        return this.publishRequest;
    }

    public getComments(): Comment[] {
        return this.comments;
    }

    static fromJson(json: IssueJson): Issue {
        return new IssueBuilder().fromJson(json).build();
    }

    static create(): IssueBuilder {
        return new IssueBuilder();
    }
}

export class IssueBuilder extends IssueSummaryBuilder {

    approvers: PrincipalKey[] = [];

    publishRequest: PublishRequest;

    comments: Comment[];

    fromJson(json: IssueJson): IssueBuilder {
        super.fromJson(json);
        this.approvers = json.approverIds ? json.approverIds.map(approver => PrincipalKey.fromString(approver)) : [];
        this.comments = json.comments ? json.comments.map(comment => Comment.fromJson(comment)) : [];
        this.publishRequest = json.publishRequest ? PublishRequest.create().fromJson(json.publishRequest).build() : null;

        return this;
    }

    setApprovers(value: PrincipalKey[]): IssueBuilder {
        this.approvers = value;
        return this;
    }

    setPublishRequest(value: PublishRequest): IssueBuilder {
        this.publishRequest = value;
        return this;
    }

    setDescription(value: string): IssueBuilder {
        this.description = value;
        return this;
    }

    setComments(value: Comment[]): IssueBuilder {
        this.comments = value;
        return this;
    }

    build(): Issue {
        return new Issue(this);
    }
}
