//////////////////////
//                  //
//     SETTINGS     //
//                  //
//////////////////////

export class Settings {

    /*************/
    /* ACCESSORS */
    /*************/

    public static get ignoreLikesAndDislikes(): boolean { return false; }

    public static get ignorePlays(): boolean { return false; }

    public static get ignoreSkips(): boolean { return false; }

    // Setting that forces albums to rank on the basis of their aggregate song ranking, but still takes into account likes and dislikes on the album unless that setting is also set
    public static get ignoreAlbumRatings(): boolean { return true; }
    
    // Setting that governs the divisor of aggregates
    // Set to false to make EPs competitive with LPs
    public static get distributeAggregateValues(): boolean { return false; }

    // Setting that forces rankings to take into account the rarity of highly rated songs
    // Example Rating Distribution: [10, 50, 50, 20, 5] -> fives and fours are rare as compared with threes and thus weighted accordingly
    // Ones and Twos are always worth 1 or 2, respectively
    public static get useWeightedRatings(): boolean { return false; }

} // End class Settings