import i18n = api.util.i18n;

export class ContentPublishDialogAction
    extends api.ui.Action {
    constructor(handler: () => wemQ.Promise<any> | void) {
        super(i18n('action.publish'));
        this.setIconClass('publish-action');
        this.onExecuted(handler);
    }
}