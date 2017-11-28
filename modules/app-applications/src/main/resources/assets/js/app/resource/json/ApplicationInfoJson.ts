import '../../../api.ts';

import ContentTypeSummaryListJson = api.schema.content.ContentTypeSummaryListJson;
import PageDescriptorsJson = api.content.page.PageDescriptorsJson;
import PartDescriptorsJson = api.content.page.region.PartDescriptorsJson;
import LayoutDescriptorsJson = api.content.page.region.LayoutDescriptorsJson;
import RelationshipTypeListJson = api.schema.relationshiptype.RelationshipTypeListJson;
import MacrosJson = api.macro.resource.MacrosJson;
import {ContentReferencesJson} from './ContentReferencesJson';

export interface ApplicationInfoJson {

    contentTypes: ContentTypeSummaryListJson;

    pages: PageDescriptorsJson;

    parts: PartDescriptorsJson;

    layouts: LayoutDescriptorsJson;

    relations: RelationshipTypeListJson;

    macros: MacrosJson;

    references: ContentReferencesJson;

}
