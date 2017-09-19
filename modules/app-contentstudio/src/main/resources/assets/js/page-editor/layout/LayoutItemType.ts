import './../../api.ts';
import {CreateItemViewConfig} from '../CreateItemViewConfig';
import {ComponentItemType} from '../ComponentItemType';
import {RegionView} from '../RegionView';
import {LayoutComponentView, LayoutComponentViewBuilder} from './LayoutComponentView';
import LayoutComponent = api.content.page.region.LayoutComponent;


export class LayoutItemType
    extends ComponentItemType {

    private static INSTANCE: LayoutItemType = new LayoutItemType();

    static get(): LayoutItemType {
        return LayoutItemType.INSTANCE;
    }

    constructor() {
        super('layout');
    }

    isComponentType(): boolean {
        return true;
    }

    createView(config: CreateItemViewConfig<RegionView, LayoutComponent>): LayoutComponentView {
        return new LayoutComponentView(new LayoutComponentViewBuilder().setItemViewProducer(config.itemViewProducer).setParentRegionView(
            config.parentView).setParentElement(config.parentElement).setComponent(config.data).setElement(config.element).setPositionIndex(
            config.positionIndex));
    }
}

LayoutItemType.get();
