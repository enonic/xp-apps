import '../../api.ts';
import ContentTypeSummary = api.schema.content.ContentTypeSummary;
import PageDescriptor = api.content.page.PageDescriptor;
import PartDescriptor = api.content.page.region.PartDescriptor;
import LayoutDescriptor = api.content.page.region.LayoutDescriptor;
import RelationshipType = api.schema.relationshiptype.RelationshipType;
import MacroDescriptor = api.macro.MacroDescriptor;
import {ApplicationInfoJson} from './json/ApplicationInfoJson';
import {ContentReference} from './ContentReference';
import {ApplicationDeployment} from './json/ApplicationDeployment';
import {ApplicationTask} from './ApplicationTask';
import {ApplicationIdProvider} from './ApplicationIdProvider';

export class ApplicationInfo {

    contentTypes: ContentTypeSummary[];

    pages: PageDescriptor[];

    parts: PartDescriptor[];

    layouts: LayoutDescriptor[];

    relations: RelationshipType[];

    references: ContentReference[];

    macros: MacroDescriptor[];

    tasks: ApplicationTask[];

    idProvider: ApplicationIdProvider;

    deployment: ApplicationDeployment;

    static fromJson(json: ApplicationInfoJson): ApplicationInfo {
        let result = new ApplicationInfo();

        result.contentTypes = json.contentTypes ? ContentTypeSummary.fromJsonArray(json.contentTypes.contentTypes) : [];

        result.pages = (json.pages && json.pages.descriptors) ? json.pages.descriptors.map(descriptorJson => {
            return PageDescriptor.fromJson(descriptorJson);
        }) : [];

        result.parts = (json.parts && json.parts.descriptors) ? json.parts.descriptors.map((descriptorJson => {
            return PartDescriptor.fromJson(descriptorJson);
        })) : [];

        result.layouts = (json.layouts && json.layouts.descriptors) ? json.layouts.descriptors.map((descriptorJson => {
            return LayoutDescriptor.fromJson(descriptorJson);
        })) : [];

        result.relations = (json.relations && json.relations.relationshipTypes) ? json.relations.relationshipTypes.map(
            (relationshipJson) => {
                return RelationshipType.fromJson(relationshipJson);
            }) : [];

        result.macros = (json.macros && json.macros.macros) ? json.macros.macros.map((macroJson) => {
            return MacroDescriptor.fromJson(macroJson);
        }) : [];

        result.references = (json.references && json.references.references) ? json.references.references.map((referenceJson) => {
            return ContentReference.fromJson(referenceJson);
        }) : [];

        result.tasks = (json.tasks && json.tasks.tasks) ? json.tasks.tasks.map((taskJson) => {
            return ApplicationTask.fromJson(taskJson);
        }) : [];

        result.idProvider = json.idProvider ? ApplicationIdProvider.fromJson(json.idProvider) : null;

        result.deployment = json.deployment;

        return result;
    }
}
