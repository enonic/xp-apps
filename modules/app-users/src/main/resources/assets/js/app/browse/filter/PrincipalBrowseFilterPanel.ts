import '../../../api.ts';
import {UserTreeGridItem} from '../UserTreeGridItem';
import {PrincipalTypeAggregationGroupView} from './PrincipalTypeAggregationGroupView';
import {ListUserItemsRequest} from '../../../api/graphql/principal/ListUserItemsRequest';
import {UserItemType} from '../UserItemType';
import {PrincipalBrowseSearchData} from './PrincipalBrowseSearchData';
import {ListTypesRequest} from '../../../api/graphql/principal/ListTypesRequest';
import BrowseFilterResetEvent = api.app.browse.filter.BrowseFilterResetEvent;
import BrowseFilterSearchEvent = api.app.browse.filter.BrowseFilterSearchEvent;
import AggregationGroupView = api.aggregation.AggregationGroupView;
import AggregationSelection = api.aggregation.AggregationSelection;
import Aggregation = api.aggregation.Aggregation;
import Bucket = api.aggregation.Bucket;
import i18n = api.util.i18n;

export class PrincipalBrowseFilterPanel
    extends api.app.browse.filter.BrowseFilterPanel<UserTreeGridItem> {

    static PRINCIPAL_TYPE_AGGREGATION_NAME: string = 'principalType';
    static PRINCIPAL_TYPE_AGGREGATION_DISPLAY_NAME: string = i18n('field.types');

    private principalTypeAggregation: PrincipalTypeAggregationGroupView;

    constructor() {
        super();

        this.initHitsCounter().then(() => this.initAggregationGroupView([this.principalTypeAggregation]));
    }

    protected getGroupViews(): api.aggregation.AggregationGroupView[] {
        this.principalTypeAggregation = new PrincipalTypeAggregationGroupView(
            PrincipalBrowseFilterPanel.PRINCIPAL_TYPE_AGGREGATION_NAME,
            PrincipalBrowseFilterPanel.PRINCIPAL_TYPE_AGGREGATION_DISPLAY_NAME);

        return [this.principalTypeAggregation];
    }

    private initAggregationGroupView(aggregationGroupViews: AggregationGroupView[]) {
        aggregationGroupViews.forEach(aggregation => aggregation.initialize());
    }

    doRefresh(): wemQ.Promise<void> {
        return this.searchFacets(true);
    }

    doSearch(elementChanged?: api.dom.Element): wemQ.Promise<void> {
        return this.searchFacets();
    }

    protected resetFacets(suppressEvent?: boolean, doResetAll?: boolean): wemQ.Promise<void> {
        const notify = this.hasSelectedAggregations();

        // then fire usual reset event with content grid reloading
        if (!suppressEvent && !notify) {
            new BrowseFilterResetEvent().fire();
        }

        return this.searchDataAndHandleResponse('', notify);
    }

    private searchFacets(isRefresh: boolean = false): wemQ.Promise<void> {
        let values = this.getSearchInputValues();
        let searchText = values.getTextSearchFieldValue();
        if (!searchText && !this.hasConstraint()) {
            return this.handleEmptyFilterInput(isRefresh).then(() => {
                return this.fetchAndUpdateAggregations();
            });
        }

        return this.searchDataAndHandleResponse(searchText);
    }

    private handleEmptyFilterInput(isRefresh: boolean): wemQ.Promise<void> {
        const hasSelectedAggregations = this.hasSelectedAggregations();
        if (isRefresh || hasSelectedAggregations) {
            return this.resetFacets(isRefresh);
        }
        return this.reset();
    }

    private hasSelectedAggregations(): boolean {
        const selections: AggregationSelection[] = this.getSearchInputValues().aggregationSelections || [];
        return selections.some(selection => selection.getSelectedBuckets().length > 0);
    }

    private getCheckedTypes(): UserItemType[] {
        const values = this.getSearchInputValues();
        const selectedBuckets: Bucket[] = values.getSelectedValuesForAggregationName(PrincipalBrowseFilterPanel.PRINCIPAL_TYPE_AGGREGATION_NAME) || [];
        return selectedBuckets
            .map(bucket => UserItemType[bucket.getKey().replace(/\s/g, '_').toUpperCase()])
            .filter(type => type != null);
    }

    private searchDataAndHandleResponse(searchString: string, fireEvent: boolean = true): wemQ.Promise<void> {

        const types = this.getCheckedTypes();

        return new ListUserItemsRequest()
            .setTypes(types)
            .setQuery(searchString)
            .sendAndParse()
            .then((result) => {
                let userItems = result.userItems;

                if (this.hasConstraint()) {
                    let principalKeys = this.getSelectionItems().map(key => key.getDataId());
                    userItems = userItems.filter(principal => principalKeys.some(pr => pr === principal.getKey().toString()));
                }

                if (fireEvent) {
                    new BrowseFilterSearchEvent(new PrincipalBrowseSearchData(searchString, types, userItems)).fire();
                }
                this.updateAggregations(result.aggregations, !!searchString);
                this.updateHitsCounter(userItems ? userItems.length : 0, api.util.StringHelper.isBlank(searchString));
                this.toggleAggregationsVisibility(result.aggregations);
            }).catch((reason: any) => {
                api.DefaultErrorHandler.handle(reason);
            });
    }

    private initHitsCounter(): wemQ.Promise<void> {
        return this.searchDataAndHandleResponse('', false);
    }

    private toggleAggregationsVisibility(aggregations: Aggregation[]) {
        aggregations.forEach((aggregation: api.aggregation.BucketAggregation) => {
            let aggregationIsEmpty = !aggregation.getBuckets().some((bucket: api.aggregation.Bucket) => {
                if (bucket.docCount > 0) {
                    return true;
                }
            });

            const isTypeAggregation = aggregation.getName() === PrincipalBrowseFilterPanel.PRINCIPAL_TYPE_AGGREGATION_NAME;
            if (isTypeAggregation) {
                this.principalTypeAggregation.setVisible(!aggregationIsEmpty);
            }
        });
    }

    private fetchAndUpdateAggregations(): wemQ.Promise<void> {
        return new ListTypesRequest()
            .sendAndParse()
            .then((typeAggregation) => {
                this.updateAggregations([typeAggregation], true);
                this.toggleAggregationsVisibility([typeAggregation]);
            }).catch((reason: any) => {
                api.DefaultErrorHandler.handle(reason);
            });
    }

}
