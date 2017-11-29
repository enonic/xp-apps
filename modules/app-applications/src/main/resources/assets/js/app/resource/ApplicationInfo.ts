import '../../api.ts';
import ContentTypeSummary = api.schema.content.ContentTypeSummary;
import PageDescriptor = api.content.page.PageDescriptor;
import PartDescriptor = api.content.page.region.PartDescriptor;
import LayoutDescriptor = api.content.page.region.LayoutDescriptor;
import RelationshipType = api.schema.relationshiptype.RelationshipType;
import MacroDescriptor = api.macro.MacroDescriptor;
import {ApplicationInfoJson} from './json/ApplicationInfoJson';
import {ContentReference} from './ContentReference';

export class ApplicationInfo {

    contentTypes: ContentTypeSummary[];

    pages: PageDescriptor[];

    parts: PartDescriptor[];

    layouts: LayoutDescriptor[];

    relations: RelationshipType[];

    macros: MacroDescriptor[];

    references: ContentReference[];

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

        return result;
    }
}
