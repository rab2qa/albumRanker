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

} // End interface Rankable