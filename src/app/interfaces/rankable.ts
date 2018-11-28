///////////////////////
//                   //
//     INTERFACE     //
//                   //
///////////////////////

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

} // End interface Rankable