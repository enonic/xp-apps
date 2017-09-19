import './../../api.ts';
import {CreateItemViewConfig} from '../CreateItemViewConfig';
import {ComponentItemType} from '../ComponentItemType';
import {RegionView} from '../RegionView';
import {FragmentComponentView, FragmentComponentViewBuilder} from './FragmentComponentView';
import FragmentComponent = api.content.page.region.FragmentComponent;


export class FragmentItemType
    extends ComponentItemType {

    private static INSTANCE: FragmentItemType = new FragmentItemType();

    static get(): FragmentItemType {
        return FragmentItemType.INSTANCE;
    }

    constructor() {
        super('fragment');
    }

    createView(config: CreateItemViewConfig<RegionView, FragmentComponent>): FragmentComponentView {
        return new FragmentComponentView(<FragmentComponentViewBuilder>new FragmentComponentViewBuilder().setItemViewProducer(
            config.itemViewProducer).setParentRegionView(config.parentView).setParentElement(config.parentElement).setElement(
            config.element).setComponent(config.data).setPositionIndex(config.positionIndex));
    }

    isComponentType(): boolean {
        return true;
    }
}

FragmentItemType.get();

