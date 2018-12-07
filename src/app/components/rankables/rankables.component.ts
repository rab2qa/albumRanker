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

import { Container } from '../../classes/container';

/**************/
/* INTERFACES */
/**************/

import { Rankable } from '../../interfaces/rankable';
import { Filter, BooleanFilter } from 'src/app/classes/filter';
import { DataService } from 'src/app/services/data.service';
import { Comparison } from 'src/app/classes/comparison';
import { ComparisonType } from 'src/app/utilities/enums';

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
    public selectedFilter: Filter;
    public selectedComparison: Comparison;
    public showValueInput: boolean;
    public showRangeInput: boolean;
    public showApplyButton: boolean;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor() {
        this.showValueInput = false;
        this.showRangeInput = false;
        this.showApplyButton = false;
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
        if (event.value instanceof Comparison) {
            this.selectedComparison = event.value;
            this.showValueInput = !(this.selectedFilter instanceof BooleanFilter);
            this.showRangeInput = !!(event.value.id === ComparisonType.IsInTheRange);
            this.showApplyButton = !!(this.selectedFilter && this.selectedComparison);
        } else if (event.value instanceof Filter) {
            this.selectedFilter = event.value;
            this.showValueInput = false;
            this.showRangeInput = false;
            this.showApplyButton = false;
        }
    }

    public onApply(): void {
        this.rankables.addFilter(this.selectedFilter);
    }

    public onClear(): void {
        this.rankables.clearFilters();
    }

} // End class RankablesComponent
