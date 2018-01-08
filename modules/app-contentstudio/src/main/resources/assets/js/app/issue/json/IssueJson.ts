import {PublishRequestJson} from './PublishRequestJson';
import {IssueSummaryJson} from './IssueSummaryJson';
import {CommentJson} from './CommentJson';

export interface IssueJson extends IssueSummaryJson {

    approverIds: string[];

    publishRequest: PublishRequestJson;

    comments: CommentJson[];
}
