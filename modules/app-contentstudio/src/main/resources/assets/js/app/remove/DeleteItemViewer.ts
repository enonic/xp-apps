import '../../api.ts';
import ContentSummaryAndCompareStatusViewer = api.content.ContentSummaryAndCompareStatusViewer;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import AEl = api.dom.AEl;
import AppBarTabId = api.app.bar.AppBarTabId;
import {ContentWizardPanelParams} from '../wizard/ContentWizardPanelParams';
import {ContentEventsProcessor} from '../ContentEventsProcessor';
import i18n = api.util.i18n;
import {ToggleSearchPanelWithDependenciesGlobalEvent} from '../browse/ToggleSearchPanelWithDependenciesGlobalEvent';

export class DeleteItemViewer
    extends ContentSummaryAndCompareStatusViewer {

    private inboundDependencyEl: AEl;

    constructor() {
        super();
        this.addClass('delete-item-viewer');
    }

    doLayout(object: ContentSummaryAndCompareStatus) {
        super.doLayout(object);

        this.inboundDependencyEl = new AEl('inbound-dependency');
        this.appendChild(this.inboundDependencyEl);

    }

    setInboundDependencyCount(value: number) {
        this.inboundDependencyEl.setHtml(value > 0
            ? value == 1
                                             ? i18n('dialog.delete.dependency') + ': ' + value
                                             : i18n('dialog.delete.dependencies') + ': ' + value
            : '');
        this.inboundDependencyEl.onClicked(() => {

            const contentSummary = this.getObject().getContentSummary();

            let tabId = new AppBarTabId('browse', contentSummary.getId());

            let wizardParams = new ContentWizardPanelParams()
                .setTabId(tabId)
                .setContentTypeName(contentSummary.getType())
                .setContentId(contentSummary.getContentId());

            let win = ContentEventsProcessor.openWizardTab(wizardParams, tabId);

            setTimeout(() => {
                new ToggleSearchPanelWithDependenciesGlobalEvent(this.getObject().getContentSummary(), true).fire(win);
            }, 1000);
        });
    }
}
