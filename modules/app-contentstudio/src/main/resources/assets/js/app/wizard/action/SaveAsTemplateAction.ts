import '../../../api.ts';
import {PageModel} from '../../../page-editor/PageModel';
import i18n = api.util.i18n;
import CreatePageTemplateRequest = api.content.page.CreatePageTemplateRequest;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import EditContentEvent = api.content.event.EditContentEvent;
import Action = api.ui.Action;
import Permission = api.security.acl.Permission;
import ContentSummary = api.content.ContentSummary;
import Site = api.content.site.Site;

export class SaveAsTemplateAction
    extends Action {

    private userHasCreateRights: Boolean;

    private contentSummary: ContentSummary;

    private pageModel: PageModel;

    private site: Site;

    constructor() {
        super(i18n('action.saveAsTemplate'));

        this.onExecuted(action => {
            new CreatePageTemplateRequest()
                .setController(this.pageModel.getController().getKey())
                .setRegions(this.pageModel.getRegions())
                .setConfig(this.pageModel.getConfig())
                .setDisplayName(this.contentSummary.getDisplayName())
                .setSite(this.site ? this.site.getPath() : null)
                .setSupports(this.contentSummary.getType())
                .setName(this.contentSummary.getName())
                .sendAndParse().then(createdTemplate => {

                new EditContentEvent([ContentSummaryAndCompareStatus.fromContentSummary(createdTemplate)]).fire();
            });
        });
    }

    updateVisibility() {
        if (this.pageModel.getController()) {
            if (this.userHasCreateRights === undefined) {
                new api.content.resource.GetPermittedActionsRequest()
                    .addContentIds(this.contentSummary.getContentId())
                    .addPermissionsToBeChecked(Permission.CREATE)
                    .sendAndParse().then((allowedPermissions: Permission[]) => {

                    this.userHasCreateRights = allowedPermissions.indexOf(Permission.CREATE) > -1;
                    this.setVisible(this.userHasCreateRights.valueOf());
                });
            } else {
                this.setVisible(this.userHasCreateRights.valueOf());
            }
        } else {
            this.setVisible(false);
        }
    }

    setContentSummary(contentSummary: ContentSummary): SaveAsTemplateAction {
        this.contentSummary = contentSummary;
        return this;
    }

    setSite(site: Site): SaveAsTemplateAction {
        this.site = site;
        return this;
    }

    setPageModel(model: PageModel): SaveAsTemplateAction {
        this.pageModel = model;
        return this;
    }
}
