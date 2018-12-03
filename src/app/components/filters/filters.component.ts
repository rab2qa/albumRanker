import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Container } from '../../classes/container';
import { Rankable } from '../../interfaces/rankable';
import { FormGroup, FormControl } from '@angular/forms';

interface FiltersOption {
  name: string;
  id: string;
}

@Component({
  selector: 'ranker-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  @Input() sourceData: Container<Rankable>[];
  @Output() filteredData: EventEmitter<Container<Rankable>[]> = new EventEmitter();
  public filtersForm: FormGroup;
  public filtersOptions: FiltersOption[];

  constructor() {}

  ngOnInit() {
    this.filtersForm = this.createFiltersForm();
    this.filtersOptions = this.createFiltersOptions(this.sourceData);
    console.log(this.filtersForm);
    console.log(this.filtersOptions);
    // console.log('sourceData');
    // this.filteredData.emit(this.sourceData);
  }

  private createFiltersForm(): FormGroup {
    return new FormGroup({
      rankable: new FormControl(),
      year: new FormControl(),
    });
  }

  private createFiltersOptions(source: Container<Rankable>[]): FiltersOption[] {
    return [
      {
        name: 'Option 1',
        id: 'one',
      },
      {
        name: 'Option 2',
        id: 'two',
      },
    ];
  }
}
