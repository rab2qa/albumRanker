import { FilterType, ComparisonType } from "./enums";

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

export class Globals {

    /*************/
    /* ACCESSORS */
    /*************/

    public static get defaultRating(): number { return null; }

    public static get fortyFiveMinutes(): number { return 45 * 60 * 1000; }

    public static get maxRating(): number { return 5; }

    public static get minRating(): number { return 0; }

    public static get thirtyMinutes(): number { return 30 * 60 * 1000; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public static getComparisonName(comparison: ComparisonType): string {
        switch (comparison) {
            case ComparisonType.BeginsWith:
                return "Begins With";
            case ComparisonType.Contians:
                return "Contains";
            case ComparisonType.DoesNotContain:
                return "Does Not Contain";
            case ComparisonType.EndsWith:
                return "Ends With";
            case ComparisonType.Is:
                return "Is";
            case ComparisonType.IsNot:
                return "Is Not";
            case ComparisonType.IsFalse:
                return "Is False";
            case ComparisonType.IsGreaterThan:
                return "Is Greater Than";
            case ComparisonType.IsLessThan:
                return "Is Less Than";
            case ComparisonType.IsInTheRange:
                return "Is In The Range";
            case ComparisonType.IsTrue:
                return "Is True";

        }
    }

    public static getPropertyName(property: FilterType): string {
        switch (property) {
            case FilterType.Album:
                return "Album";
            case FilterType.AlbumArtist:
                return "Artist";
            case FilterType.AlbumArtwork:
                return "Artowrk";
            case FilterType.AlbumLove:
                return "Love";
            case FilterType.AlbumRating:
                return "Album Rating";
            case FilterType.Artist:
                return "Artist";
            case FilterType.BitRate:
                return "Bit Rate";
            case FilterType.BPM:
                return "BPM";
            case FilterType.Category:
                return "Category";
            case FilterType.Checked:
                return "Checked";
            case FilterType.Comments:
                return "Comments";
            case FilterType.Compilation:
                return "Compilation";
            case FilterType.Composer:
                return "Composer";
            case FilterType.DateAdded:
                return "Date Added";
            case FilterType.DateModified:
                return "Date Modified";
            case FilterType.Description:
                return "Description";
            case FilterType.DiscNumber:
                return "Disc Number";
            case FilterType.Disliked:
                return "Disliked";
            case FilterType.Genre:
                return "Genre";
            case FilterType.Grouping:
                return "Grouping";
            case FilterType.ICloudStatus:
                return "iCloud Status";
            case FilterType.Kind:
                return "Kind";
            case FilterType.LastPlayed:
                return "Last Played";
            case FilterType.LastSkipped:
                return "Last Skipped";
            case FilterType.Liked:
                return "Liked";
            case FilterType.Location:
                return "Location";
            case FilterType.Love:
                return "Love";
            case FilterType.MediaKind:
                return "Media Kind";
            case FilterType.MovementName:
                return "Movement Name";
            case FilterType.MovementNumber:
                return "Movement Number";
            case FilterType.Name:
                return "Name";
            case FilterType.Playlist:
                return "Playlist";
            case FilterType.Plays:
                return "Plays";
            case FilterType.Purchased:
                return "Purchased";
            case FilterType.Rating:
                return "Rating";
            case FilterType.SampleRate:
                return "Sample Rate";
            case FilterType.Season:
                return "Season";
            case FilterType.Show:
                return "Show";
            case FilterType.Size:
                return "Size";
            case FilterType.Skips:
                return "Skips";
            case FilterType.SortAlbum:
                return "Sort Album";
            case FilterType.SortAlbumArtist:
                return "Sort Album Artist";
            case FilterType.SortArtist:
                return "Sort Artist";
            case FilterType.SortComposer:
                return "Sort Composer";
            case FilterType.SortName:
                return "Sort Name";
            case FilterType.SortShow:
                return "Sort Show";
            case FilterType.Time:
                return "Time";
            case FilterType.TrackNumber:
                return "Track Number";
            case FilterType.VideoRating:
                return "Video Rating";
            case FilterType.Work:
                return "Work";
            case FilterType.Year:
                return "Year";
        }
    }


    public static getPropertyValue(property: FilterType): string {
        switch (property) {
            case FilterType.Album:
                return "album";
            case FilterType.AlbumArtist:
                return "artist";
            case FilterType.AlbumArtwork:
                return "artowrk";
            case FilterType.AlbumLove:
                return "love";
            case FilterType.AlbumRating:
                return "albumRating";
            case FilterType.Artist:
                return "artist";
            case FilterType.BitRate:
                return "bitRate";
            case FilterType.BPM:
                return "bpm";
            case FilterType.Category:
                return "category";
            case FilterType.Checked:
                return "checked";
            case FilterType.Comments:
                return "comments";
            case FilterType.Compilation:
                return "compilation";
            case FilterType.Composer:
                return "composer";
            case FilterType.DateAdded:
                return "cateAdded";
            case FilterType.DateModified:
                return "cateModified";
            case FilterType.Description:
                return "description";
            case FilterType.DiscNumber:
                return "discNumber";
            case FilterType.Disliked:
                return "disliked";
            case FilterType.Genre:
                return "genre";
            case FilterType.Grouping:
                return "grouping";
            case FilterType.ICloudStatus:
                return "iCloudStatus";
            case FilterType.Kind:
                return "dind";
            case FilterType.LastPlayed:
                return "lastPlayed";
            case FilterType.LastSkipped:
                return "lastSkipped";
            case FilterType.Liked:
                return "liked";
            case FilterType.Location:
                return "location";
            case FilterType.Love:
                return "love";
            case FilterType.MediaKind:
                return "mediaKind";
            case FilterType.MovementName:
                return "movementName";
            case FilterType.MovementNumber:
                return "movementNumber";
            case FilterType.Name:
                return "name";
            case FilterType.Playlist:
                return "playlist";
            case FilterType.Plays:
                return "playCount";
            case FilterType.Purchased:
                return "purchased";
            case FilterType.Rating:
                return "rating";
            case FilterType.SampleRate:
                return "sampleRate";
            case FilterType.Season:
                return "season";
            case FilterType.Show:
                return "show";
            case FilterType.Size:
                return "size";
            case FilterType.Skips:
                return "skipCount";
            case FilterType.SortAlbum:
                return "sortAlbum";
            case FilterType.SortAlbumArtist:
                return "sortAlbumArtist";
            case FilterType.SortArtist:
                return "sortArtist";
            case FilterType.SortComposer:
                return "sortComposer";
            case FilterType.SortName:
                return "sortName";
            case FilterType.SortShow:
                return "sortShow";
            case FilterType.Time:
                return "time";
            case FilterType.TrackNumber:
                return "trackNumber";
            case FilterType.VideoRating:
                return "videoRating";
            case FilterType.Work:
                return "work";
            case FilterType.Year:
                return "year";
        }
    }

    public static newStarArray(): Array<number> {
        let starArray = new Array<number>(this.maxRating);
        for (let i = 0; i < this.maxRating; i++) {
            starArray[i] = 0;
        }
        return starArray;
    }

    public static rankingToStars(ranking: number): Array<number> {
        const fixedRanking = ranking.toFixed(2);
        const array = [0, 0, 0, 0, 0];
        const ratingWhole = +fixedRanking.toString().split('.')[0];
        const ratingDecimal = +fixedRanking.toString().split('.')[1];
        for (let i = 0; i < ratingWhole; i++) {
            array[i] = 100;
        }
        if (ratingWhole < 5) {
            array[ratingWhole] = ratingDecimal;
        }
        return array;
    }

} // End class Globals