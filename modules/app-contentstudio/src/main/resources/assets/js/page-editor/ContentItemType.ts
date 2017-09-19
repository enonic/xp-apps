import './../api.ts';
import {ItemType} from './ItemType';
import {ItemTypeConfig, ItemTypeConfigJson} from './ItemTypeConfig';
import {CreateItemViewConfig} from './CreateItemViewConfig';
import {PartComponentView} from './part/PartComponentView';
import {ContentView, ContentViewBuilder} from './ContentView';

export class ContentItemType
    extends ItemType {

    private static INSTANCE: ContentItemType = new ContentItemType();

    static get(): ContentItemType {
        return ContentItemType.INSTANCE;
    }

    constructor() {
        super('content');
    }

    protected getItemTypeConfig(itemType: string): ItemTypeConfig {
        return new ItemTypeConfig(<ItemTypeConfigJson>{
            cssSelector: '[data-portal-component-type=content]',
            draggable: false,
            cursor: 'pointer',
            iconCls: 'live-edit-font-icon-content',
            highlighterStyle: {
                stroke: '',
                strokeDasharray: '',
                fill: 'rgba(0, 108, 255, .25)'
            },
            contextMenuConfig: ['parent', 'opencontent', 'view']
        });
    }

    createView(config: CreateItemViewConfig<PartComponentView, any>): ContentView {
        return new ContentView(
            new ContentViewBuilder().setParentPartComponentView(config.parentView).setParentElement(config.parentElement).setElement(
                config.element));
    }
}

ContentItemType.get();
