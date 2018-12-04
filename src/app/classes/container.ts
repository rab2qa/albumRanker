//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { PageEvent } from '@angular/material';

/**************/
/* INTERFACES */
/**************/

import { Pagable, PaginationOptions } from '../interfaces/pagable';

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const defaultPageSize = 25;

///////////////////////
//                   //
//     CONTAINER     //
//                   //
///////////////////////

export class Container<T> implements Pagable {
  /**************/
  /* PROPERTIES */
  /**************/

  public paginationOptions: PaginationOptions;

  /***************/
  /* CONSTRUCTOR */
  /***************/

  public constructor(private _name: string, private _data: Array<T>) {
    this.paginationOptions = new PaginationOptions(
      null,
      false,
      false,
      this._data.length,
      0,
      defaultPageSize,
      [10, 25, 50, 100],
      true
    );
  }

  /*************/
  /* ACCESSORS */
  /*************/

  get all(): Array<T> {
    return this._data;
  }

  get page(): Array<T> {
    const testFilters = {
      name: 'Children',
      year: '2011',
    };
    const filteredData = this.filterPageData(this._data, testFilters);
    const start = this.paginationOptions.pageSize * this.paginationOptions.pageIndex;
    const end = start + this.paginationOptions.pageSize;
    return filteredData.slice(start, end);
  }

  get name(): string {
    return this._name;
  }

  /******************/
  /* PUBLIC METHODS */
  /******************/

  public onPageChange(event: PageEvent): void {
    this.paginationOptions.pageIndex = event.pageIndex;
    this.paginationOptions.pageSize = event.pageSize;
  }

  /******************/
  /* PRIVATE METHODS */
  /******************/

  public filterPageData(data: Array<T>, filters: any): Array<T> {
    console.log(filters);
    return data.filter(rankable => {
      let requiresMatch = 0;
      let hasMatch = 0;
      const type = filters.type;
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          requiresMatch++;
          const filterValue = filters[key];
          const rankableValue = rankable[key];
          if (rankableValue && rankableValue.indexOf(filterValue) >= 0) {
            hasMatch++;
          } else {
            const artist = rankable['artist'];
            const album = rankable['albums'];
            if (artist && artist.name.indexOf(filterValue) >= 0) {
              hasMatch++;
            } else if (album && album.name.indexOf(filterValue) >= 0) {
              hasMatch++;
            }
          }
          console.log(filterValue, rankableValue, requiresMatch);
        }
      });
      console.log(requiresMatch, hasMatch);
      // const name = rankable['name'] ? rankable['name'].name : undefined;
      // const year = rankable['year'] ? rankable['year'] : undefined;
      // if (name && name.indexOf(filters.name)) {
      //   hasMatch = true;
      // }
      // if (year && filters.year.indexOf(year) >= 0) {
      //   hasMatch = true;
      // }
      return hasMatch === requiresMatch;
    });
  }
} // End class Container
