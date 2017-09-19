import './../../api.ts';
import {ComponentItemType} from '../ComponentItemType';
import {CreateItemViewConfig} from '../CreateItemViewConfig';
import {RegionView} from '../RegionView';
import {ImageComponentView, ImageComponentViewBuilder} from './ImageComponentView';
import ImageComponent = api.content.page.region.ImageComponent;


export class ImageItemType
    extends ComponentItemType {

    private static INSTANCE: ImageItemType = new ImageItemType();

    static get(): ImageItemType {
        return ImageItemType.INSTANCE;
    }

    constructor() {
        super('image');
    }

    createView(config: CreateItemViewConfig<RegionView, ImageComponent>): ImageComponentView {
        return new ImageComponentView(
            <ImageComponentViewBuilder>new ImageComponentViewBuilder().setItemViewProducer(config.itemViewProducer).setParentRegionView(
                config.parentView).setParentElement(config.parentElement).setElement(config.element).setComponent(
                config.data).setPositionIndex(config.positionIndex));
    }

    isComponentType(): boolean {
        return true;
    }
}

ImageItemType.get();
