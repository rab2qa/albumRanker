//////////////////////
//                  //
//     RANKABLE     //
//                  //
//////////////////////

export interface Rankable {
    
  /**************/
  /* PROPERTIES */
  /**************/

  ranking: number;

  /***********/
  /* METHODS */
  /***********/

  isRanked(): boolean;
  isRankable(): boolean;

} // End interface Rankable
