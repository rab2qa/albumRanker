//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Component, OnInit, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material';

/**********/
/* MODELS */
/**********/

import { Cache } from 'src/app/models/cache/cache';
import { Comparison, ComparisonType } from 'src/app/models/presenter/comparison/comparison';
import { Filter } from 'src/app/models/presenter/filter/filter';
import { BooleanFilter } from 'src/app/models/presenter/filter/booleanFilter/booleanFilter';
import { PaginationOptions } from 'src/app/models/paginationOptions/paginationOptions';
import { Presenter } from 'src/app/models/presenter/presenter';

/**************/
/* INTERFACES */
/**************/

import { Rankable } from 'src/app/interfaces/rankable';

/*************/
/* UTILITIES */
/*************/

import { Features } from 'src/app/utilities/features';

interface ListHeader {
    rankableTitle: string;
    secondary?: string;
}

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const cache = new Cache();

///////////////////////
//                   //
//     COMPONENT     //
//                   //
///////////////////////

@Component({
    selector: 'ranker-rankables',
    templateUrl: './rankables.component.html',
    styleUrls: ['./rankables.component.scss'],
})
export class RankablesComponent implements OnInit {

    /***********/
    /*  INPUTS */
    /***********/

    @Input() filters: Array<Filter>;
    @Input() name: string;
    @Input() paginationOptions: PaginationOptions;
    @Input() rankables: Array<Rankable>;

    /**************/
    /* PROPERTIES */
    /**************/

    public listHeader: ListHeader;

    /*************/
    /* ACCESSORS */
    /*************/

    get activeFilters(): Array<Filter> {
        let activeFilters: Array<Filter> = cache.get('activeFilters');
        if (!activeFilters) {
            activeFilters = this.filters.filter(filter => filter.isActive());
        }
        return activeFilters;
    }

    get selectedComparison(): Comparison {
        let selectedComparison: Comparison = cache.get('selectedComparison');
        if (!selectedComparison) {
            selectedComparison = this.selectedFilter && this.selectedFilter.comparisons.find(comparison => comparison.isSelected());
        }
        return selectedComparison;
    }

    get selectedFilter(): Filter {
        let selectedFilter: Filter = cache.get('selectedFilter');
        if (!selectedFilter) {
            selectedFilter = this.filters.find(filter => filter.isSelected());
        }
        return selectedFilter;
    }

    get showFilters(): boolean {
        return Features.filtersEnabled;
    }

    get showRangeInput(): boolean {
        return !!(this.selectedComparison && this.selectedComparison.id === ComparisonType.IsInTheRange);
    }

    get showValueInput(): boolean {
        return !!(this.selectedFilter && this.selectedComparison && !(this.selectedFilter instanceof BooleanFilter));
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public ngOnInit(): void {
        this.listHeader = this.setListHeader(this.name.toLowerCase());
    }

    public setListHeader(name): ListHeader {
        if (name === 'albums') {
            return {
                rankableTitle: 'Artist/Album Title',
                secondary: 'Year',
            };
        } else if (name === 'artists') {
            return {
                rankableTitle: 'Artist',
            };
        } else if (name === 'songs') {
            return {
                rankableTitle: 'Artist/Song Title',
            };
        }
    }

    public onFilterUpdate(event: MatSelectChange): void {
        const model: Presenter = event.value;
        model.isSelected(true);
        if (model instanceof Filter) {
            cache.remove('selectedFilter');
        } else if (model instanceof Comparison) {
            cache.remove('selectedComparison');
        }
    }

    public onApply(): void {
        if (this.selectedFilter) {
            this.selectedFilter.isActive(true);
            cache.remove('activeFilters');
        }
    }

    public onClearAll(): void {
        this.activeFilters.forEach(filter => filter.isActive(false));
        cache.remove('activeFilters')
    }

    public onClear(filter: Filter): void {
        if (filter) {
            filter.isActive(false);
            cache.remove('activeFilters');
        }
    }

} // End class RankablesComponent