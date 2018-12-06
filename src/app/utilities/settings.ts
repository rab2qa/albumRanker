//////////////////////
//                  //
//     SETTINGS     //
//                  //
//////////////////////

export class Settings {

    /*************/
    /* ACCESSORS */
    /*************/
    
    // Setting that governs the divisor of aggregates
    // Set to false to make EPs competitive with LPs
    public static get distributeAggregateValues(): boolean { return false; }

    // iTunes will apply computed ratings to unrated songs where the album is rated OR unrated albums where any song is rated
    // Set to true to ignore these computed ratings
    public static get ignoreComputedRatings(): boolean { return true; }

    public static get ignoreLikesAndDislikes(): boolean { return false; }

    public static get ignorePlays(): boolean { return false; }

    public static get ignoreSkips(): boolean { return false; }

    // Setting that forces albums to rank on the basis of their aggregate song ranking, but still takes into account likes and dislikes on the album unless that setting is also set
    public static get ignoreAlbumRatings(): boolean { return false; }

    // Setting that will provide a default rating for a ratable item if it doesn't have one in the imported file
    public static get provideDefaultRating(): boolean { return true; }

    // Setting that forces rankings to take into account the rarity of highly rated songs
    // Example Rating Distribution: [10, 50, 50, 20, 5] -> fives and fours are rare as compared with threes and thus weighted accordingly
    // Ones and Twos are always worth 1 or 2, respectively
    public static get useRelativeRatingsForAlbums(): boolean { return false; }

    public static get useRelativeRatingsForArtists(): boolean { return true; }

    public static get useRelativeRatingsForSongs(): boolean { return true; }

} // End class Settings