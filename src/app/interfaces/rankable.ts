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
    stars: Array<number>;
    
    /***********/
    /* METHODS */
    /***********/

    isRanked(): boolean;
    isRankable(): boolean;

} // End interface Rankable