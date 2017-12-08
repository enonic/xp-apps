import '../../api.ts';
import {ApplicationBrowseActions} from '../browse/ApplicationBrowseActions';

import ContentTypeSummary = api.schema.content.ContentTypeSummary;
import RelationshipType = api.schema.relationshiptype.RelationshipType;
import PageDescriptor = api.content.page.PageDescriptor;
import PartDescriptor = api.content.page.region.PartDescriptor;
import LayoutDescriptor = api.content.page.region.LayoutDescriptor;
import ItemDataGroup = api.app.view.ItemDataGroup;
import ApplicationKey = api.application.ApplicationKey;
import Application = api.application.Application;
import MacroDescriptor = api.macro.MacroDescriptor;
import i18n = api.util.i18n;
import DivEl = api.dom.DivEl;
import {GetApplicationInfoRequest} from '../resource/GetApplicationInfoRequest';
import {ApplicationInfo} from '../resource/ApplicationInfo';
import DateTimeFormatter = api.ui.treegrid.DateTimeFormatter;
import StringHelper = api.util.StringHelper;
import AEl = api.dom.AEl;

export class ApplicationItemStatisticsPanel
    extends api.app.view.ItemStatisticsPanel<api.application.Application> {

    private applicationDataContainer: api.dom.DivEl;
    private actionMenu: api.ui.menu.ActionMenu;

    constructor() {
        super('application-item-statistics-panel');

        this.addActionMenu();
        this.addApplicationDataContainer();
    }

    private addActionMenu() {
        this.actionMenu =
            new api.ui.menu.ActionMenu(i18n('application.state.stopped'), ApplicationBrowseActions.get().START_APPLICATION,
                ApplicationBrowseActions.get().STOP_APPLICATION);

        const actionMenuWrapper: DivEl = new DivEl('action-menu-wrapper');
        actionMenuWrapper.appendChild(this.actionMenu);

        this.appendChild(actionMenuWrapper);
    }

    private addApplicationDataContainer() {
        this.applicationDataContainer = new api.dom.DivEl('application-data-container');
        this.appendChild(this.applicationDataContainer);
    }

    setItem(item: api.app.view.ViewItem<api.application.Application>) {
        let currentItem = this.getItem();

        if (currentItem && currentItem.equals(item)) {
            // do nothing in case item has not changed
            return;
        }

        super.setItem(item);
        let currentApplication = item.getModel();

        if (currentApplication.getIconUrl()) {
            this.getHeader().setIconUrl(currentApplication.getIconUrl());
        }

        if (currentApplication.getDescription()) {
            this.getHeader().setHeaderSubtitle(currentApplication.getDescription(), 'app-description');
        }

        this.actionMenu.setLabel(this.getLocalizedState(currentApplication.getState()));

        this.applicationDataContainer.removeChildren();

        const infoGroup = new ItemDataGroup(i18n('field.application'), 'application');
        const minVersion = currentApplication.getMinSystemVersion();
        const modifiedTime = currentApplication.getModifiedTime();

        if (modifiedTime) {
            infoGroup.addDataList(i18n('field.installed'), DateTimeFormatter.createHtml(modifiedTime));
        }
        infoGroup.addDataList(i18n('field.version'), currentApplication.getVersion());
        infoGroup.addDataList(i18n('field.key'), currentApplication.getApplicationKey().toString());
        infoGroup.addDataList(i18n('field.systemRequired'), i18n('field.systemRequired.value', minVersion));

        new GetApplicationInfoRequest(currentApplication.getApplicationKey()).sendAndParse().then((applicationInfo: ApplicationInfo) => {
            const descriptors = this.initDescriptors(applicationInfo);
            const schemas = this.initSchemas(applicationInfo);
            const macros = this.initMacros(applicationInfo);
            const providers = this.initProviders(currentApplication, applicationInfo);
            const deployment = this.initDeployment(applicationInfo);

            if (descriptors && !descriptors.isEmpty()) {
                this.applicationDataContainer.appendChild(descriptors);
            }

            if (schemas && !schemas.isEmpty()) {
                this.applicationDataContainer.appendChild(schemas);
            }

            if (macros && !macros.isEmpty()) {
                this.applicationDataContainer.appendChild(macros);
            }

            if (providers && !providers.isEmpty()) {
                this.applicationDataContainer.appendChild(providers);
            }

            if (deployment && !deployment.isEmpty()) {
                this.applicationDataContainer.appendChild(deployment);
            }
        });
    }

    private initMacros(applicationInfo: ApplicationInfo): ItemDataGroup {

        let macrosGroup = new ItemDataGroup(i18n('field.macros'), 'macros');

        let macroNames = applicationInfo.getMacros().filter((macro: MacroDescriptor) => {
            return !ApplicationKey.SYSTEM.equals(macro.getKey().getApplicationKey());
        }).map((macro: MacroDescriptor) => {
            return macro.getDisplayName();
        });
        macrosGroup.addDataArray(i18n('field.name'), macroNames);

        return macrosGroup;
    }

    private initDescriptors(applicationInfo: ApplicationInfo): ItemDataGroup {

        let descriptorsGroup = new ItemDataGroup(i18n('field.descriptors'), 'descriptors');

        let pageNames = applicationInfo.getPages().map((descriptor: PageDescriptor) => descriptor.getName().toString()).sort(
            this.sortAlphabeticallyAsc);
        descriptorsGroup.addDataArray(i18n('field.page'), pageNames);

        let partNames = applicationInfo.getParts().map((descriptor: PartDescriptor) => descriptor.getName().toString()).sort(
            this.sortAlphabeticallyAsc);
        descriptorsGroup.addDataArray(i18n('field.part'), partNames);

        let layoutNames = applicationInfo.getLayouts().map((descriptor: LayoutDescriptor) => descriptor.getName().toString()).sort(
            this.sortAlphabeticallyAsc);
        descriptorsGroup.addDataArray(i18n('field.layout'), layoutNames);

        return descriptorsGroup;
    }

    private initSchemas(applicationInfo: ApplicationInfo): ItemDataGroup {

        let schemasGroup = new ItemDataGroup(i18n('field.schemas'), 'schemas');

        let contentTypeNames = applicationInfo.getContentTypes().map(
            (contentType: ContentTypeSummary) => contentType.getContentTypeName().getLocalName()).sort(this.sortAlphabeticallyAsc);
        schemasGroup.addDataArray(i18n('field.contentTypes'), contentTypeNames);

        let relationshipTypeNames = applicationInfo.getRelations().map(
            (relationshipType: RelationshipType) => relationshipType.getRelationshiptypeName().getLocalName()).sort(
            this.sortAlphabeticallyAsc);
        schemasGroup.addDataArray(i18n('field.relationshipTypes'), relationshipTypeNames);

        return schemasGroup;
    }

    private initProviders(application: Application, applicationInfo: ApplicationInfo): ItemDataGroup {

        if (applicationInfo.getIdProvider().getMode() != null) {
            const providersGroup = new ItemDataGroup(i18n('field.idProviders'), 'providers');

            providersGroup.addDataList(i18n('field.key'), application.getApplicationKey().toString());
            providersGroup.addDataList(i18n('field.name'), application.getDisplayName());

            return providersGroup;
        }
        return null;
    }

    private initDeployment(applicationInfo: ApplicationInfo): ItemDataGroup {

        if (!StringHelper.isBlank(applicationInfo.getDeployment().url)) {
            const deploymentGroup = new ItemDataGroup(i18n('field.webApp'), 'deployment');
            deploymentGroup.addDataElements(i18n('field.deployment'),
                [new AEl().setUrl(applicationInfo.getDeployment().url).setHtml(applicationInfo.getDeployment().url)]);

            return deploymentGroup;
        }
        return null;
    }

    private sortAlphabeticallyAsc(a: string, b: string): number {
        return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
    }

    private getLocalizedState(state: string): string {
        switch (state) {
        case Application.STATE_STARTED:
            return i18n('application.state.started');
        case Application.STATE_STOPPED:
            return i18n('application.state.stopped');
        default:
            return '';
        }
    }
}
