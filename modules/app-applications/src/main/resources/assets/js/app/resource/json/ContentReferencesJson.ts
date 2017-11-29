import '../../../api.ts';

export interface ContentReferenceJson {

    type: string;

    displayName: string;

    path: string;
}

export interface ContentReferencesJson {
    references: ContentReferenceJson[];
}
