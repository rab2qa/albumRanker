//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Component, OnInit, Input } from '@angular/core';

/***********/
/* CLASSES */
/***********/

import { Container } from '../../classes/container';

/**************/
/* INTERFACES */
/**************/

import { Rankable } from '../../interfaces/rankable';

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
} // End class RankablesComponent
