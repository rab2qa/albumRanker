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

/***********/
/* CLASSES */
/***********/

import { Comparison, ComparisonType } from 'src/app/classes/comparison';
import { Container } from 'src/app/classes/container';

/**************/
/* INTERFACES */
/**************/

import { Rankable } from 'src/app/interfaces/rankable';
import { Filter, BooleanFilter } from 'src/app/classes/filter';

interface ListHeader {
    rankableTitle: string;
    secondary?: string;
}

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
    @Input() rankables: Container<Rankable>;

    /**************/
    /* PROPERTIES */
    /**************/

    public listHeader: ListHeader;

    /*************/
    /* ACCESSORS */
    /*************/

    get selectedComparison(): Comparison {
        return this.selectedFilter && this.selectedFilter.comparisons.find(comparison => comparison.isSelected());
    }

    get selectedFilter(): Filter {
        return this.rankables.filters.find(filter => filter.isSelected());
    }

    get activeFilters(): Array<Filter> {
        return this.rankables.filters.filter(filter => filter.isActive());
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
        this.listHeader = this.setListHeader(this.rankables.name.toLowerCase());
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
        event.value.isSelected(true);
    }

    public onApply(): void {
        this.selectedFilter.isActive(true);
    }

    public onClearAll(): void {
        this.rankables.clearFilters();
    }

    public onClear(filter: Filter): void {
        filter.isActive(false);
    }

} // End class RankablesComponent