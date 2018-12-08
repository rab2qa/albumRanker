//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Comparison, ComparisonType } from "./comparison";
import { exclusiveSelect, ExternalEvent, EventType } from "./event";
import { Presenter } from "./presenter";

/**************/
/* INTERFACES */
/**************/

import { Activatable } from "../interfaces/activatable";
import { Supportable } from "../interfaces/supportable";

/////////////////////////
//                     //
//     FILTER TYPE     //
//                     //
/////////////////////////

export enum FilterType {
    Album,
    AlbumArtist,
    AlbumArtwork,
    AlbumLove,
    AlbumRating,
    Artist,
    BitRate,
    BPM,
    Category,
    Checked,
    Comments,
    Compilation,
    Composer,
    DateAdded,
    DateModified,
    Description,
    DiscNumber,
    Disliked,        // Not a property in iTunes
    Genre,
    Grouping,
    ICloudStatus,
    Kind,
    LastPlayed,
    LastSkipped,
    Liked,           // Not a property in iTunes
    Location,
    Love,
    MediaKind,
    MovementName,
    MovementNumber,
    Name,
    Playlist,
    Plays,
    Purchased,
    Rating,
    SampleRate,
    Season,
    Show,
    Size,
    Skips,
    SortAlbum,
    SortAlbumArtist,
    SortArtist,
    SortComposer,
    SortName,
    SortShow,
    Time,
    TrackNumber,
    VideoRating,
    Work,
    Year
}

////////////////////
//                //
//     FILTER     //
//                //
////////////////////

export abstract class Filter extends Presenter implements Activatable, Supportable {

    public comparisons: Array<Comparison>;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        public id: FilterType,
        public name: string,
    ) {
        super();
        this.comparisons = new Array<Comparison>();
    }

    public get selectedComparison(): Comparison {
        return this.comparisons.find(comparison => comparison.isSelected());
    }

    /******************/
    /* STATIC METHODS */
    /******************/

    public static getFilterName(id: FilterType): string {
        switch (id) {
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

    public static getFilterValue(id: FilterType): string {
        switch (id) {
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

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isValid(): boolean {
        const hasSelectedComparison = !!(this.comparisons.find(comparison => comparison.isSelected()));
        return hasSelectedComparison;
    }

    // -------------------- IMPLEMENT THE ACTIVATABLE INTERFACE -------------------- //

    public isActive(value?: boolean, force?: boolean): boolean {
        if (value !== undefined && (this._status.active !== value || force === true)) {   // are we changing state?
            this._status.active = value;                                                // make the state change
            if (this.notify) {                                                          // do we implement the Observable interface?
                this.notify(this, EventType.Active);                                    // update listeners to the state change
            }
        }
        return this._status.active;
    };

    public toggleActive(): void {
        this.isActive(!this.isActive());                                // toggle the active state
    };

    // -------------------- IMPLEMENT THE SUPPORTABLE INTERFACE -------------------- //

    public isSupported(value?: boolean): boolean {
        if (value !== undefined && this._status.supported !== value) {  // are we changing state?
            this._status.supported = value;                             // make the state change
            if (this.notify) {                                          // do we implement the Observable interface?
                this.notify(this, EventType.Supported);                 // update listeners to the state change
            }
        }
        return this._status.supported;
    };

    public toggleSupported(): void {
        this.isSupported(!this.isSupported());                          // toggle the supported state
    };

    // -------------------- HIDE BASE CLASS SELECTABLE IMPLEMENTATION -------------------- //

    public clean(): void {
        super.clean();
        this.comparisons.forEach(comparison => comparison.clean());
    }

    public isDirty(): boolean {
        return super.isDirty() || !!(this.comparisons.find(comparison => comparison.isDirty()));
    }

}  // End class Filter

////////////////////////////
//                        //
//     BOOLEAN FILTER     //
//                        //
////////////////////////////

export class BooleanFilter extends Filter {

    constructor(
        public id: FilterType,
        public name: string,
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.IsFalse, Comparison.getComparisonName(ComparisonType.IsFalse)));
        this.comparisons.push(new Comparison(ComparisonType.IsTrue, Comparison.getComparisonName(ComparisonType.IsTrue)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, array)));
    }

} // End class BooleanFilter

///////////////////////////
//                       //
//     NUMBER FILTER     //
//                       //
///////////////////////////

export class NumberFilter extends Filter {

    constructor(
        public id: FilterType,
        public name: string,
        public value?: number
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.Is, Comparison.getComparisonName(ComparisonType.Is)));
        this.comparisons.push(new Comparison(ComparisonType.IsGreaterThan, Comparison.getComparisonName(ComparisonType.IsGreaterThan)));
        this.comparisons.push(new Comparison(ComparisonType.IsLessThan, Comparison.getComparisonName(ComparisonType.IsLessThan)));
        this.comparisons.push(new Comparison(ComparisonType.IsNot, Comparison.getComparisonName(ComparisonType.IsNot)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, array)));
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get dirtyValue(): number {
        return this._cache.get('value');
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isValid(): boolean {
        const superIsValid = super.isValid();
        const isComplete = !!(this.value);
        const isNotActive = !this.isActive();
        const isDirty = this.isDirty();
        return superIsValid && isComplete && (isNotActive || isDirty);
    }

    // -------------------- HIDE BASE CLASS SELECTABLE IMPLEMENTATION -------------------- //

    public clean(): void {
        super.clean();
        if (this.value) {
            if (this._cache.has('value')) {
                this._cache.update('value', this.value);
            } else {
                this._cache.add('value', this.value);
            }
        }
    }

    public isDirty(): boolean {
        return super.isDirty() || this.valueIsDirty();
    }

    // -------------------- HIDE BASE CLASS ACTIVATABLE IMPLEMENTATION -------------------- //

    public isActive(value?: boolean): boolean {
        if (value === true && this.isDirty()) {
            this.clean();
            return super.isActive(value, true);
        } else {
            return super.isActive(value);
        }
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    protected valueIsDirty(): boolean {
        let response = false;
        if (this.value) {
            if (this._cache.has('value')) {
                if (this._cache.get('value') !== this.value) {
                    response = true;
                }
            } else {
                response = true;
            }
        }
        return response;
    }

} // End class NumberFilter

//////////////////////////
//                      //
//     RANGE FILTER     //
//                      //
//////////////////////////

export class RangeFilter extends NumberFilter {

    constructor(
        public id: FilterType,
        public name: string,
        public value?: number,
        public rangeEnd?: number
    ) {
        super(id, name, value);
        const comparisons = [new Comparison(ComparisonType.IsInTheRange, Comparison.getComparisonName(ComparisonType.IsInTheRange))];
        comparisons.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, this.comparisons)));
        Array.prototype.push.apply(this.comparisons, comparisons);
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get dirtyRangeEnd(): number {
        return this._cache.get('rangeEnd');
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isValid(): boolean {
        const superIsValid = super.isValid();
        const selectedComparison = this.comparisons.find(comparison => comparison.isSelected());
        const rangeComparisonIsSelected = !!(selectedComparison && selectedComparison.id === ComparisonType.IsInTheRange);
        const isComplete = rangeComparisonIsSelected ? !!(this.rangeEnd) : true;
        const isNotActive = !this.isActive();
        const isDirty = this.isDirty();
        return superIsValid && isComplete && (isNotActive || isDirty);
    }

    // -------------------- HIDE BASE CLASS SELECTABLE IMPLEMENTATION -------------------- //

    public clean(): void {
        super.clean();
        if (this.rangeEnd) {
            if (this._cache.has('rangeEnd')) {
                this._cache.update('rangeEnd', this.rangeEnd);
            } else {
                this._cache.add('rangeEnd', this.rangeEnd);
            }
        }
    }

    public isDirty(): boolean {
        return super.isDirty() || this.rangeEndIsDirty();
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    protected rangeEndIsDirty(): boolean {
        let response = false;
        if (this.rangeEnd) {
            if (this._cache.has('rangeEnd')) {
                if (this._cache.get('rangeEnd') !== this.rangeEnd) {
                    response = true;
                }
            } else {
                response = true;
            }
        }
        return response;
    }

} // End class RangeFilter

///////////////////////////
//                       //
//     STRING FILTER     //
//                       //
///////////////////////////

export class StringFilter extends Filter {

    constructor(
        public id: FilterType,
        public name: string,
        public value?: string
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.BeginsWith, Comparison.getComparisonName(ComparisonType.BeginsWith)));
        this.comparisons.push(new Comparison(ComparisonType.Contians, Comparison.getComparisonName(ComparisonType.Contians)));
        this.comparisons.push(new Comparison(ComparisonType.DoesNotContain, Comparison.getComparisonName(ComparisonType.DoesNotContain)));
        this.comparisons.push(new Comparison(ComparisonType.EndsWith, Comparison.getComparisonName(ComparisonType.EndsWith)));
        this.comparisons.push(new Comparison(ComparisonType.Is, Comparison.getComparisonName(ComparisonType.Is)));
        this.comparisons.push(new Comparison(ComparisonType.IsNot, Comparison.getComparisonName(ComparisonType.IsNot)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, array)));
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get dirtyValue(): number {
        return this._cache.get('value');
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isValid(): boolean {
        const superIsValid = super.isValid();
        const isComplete = !!(this.value);
        const isNotActive = !this.isActive();
        const isDirty = this.isDirty();
        return superIsValid && isComplete && (isNotActive || isDirty);
    }

    // -------------------- HIDE BASE CLASS SELECTABLE IMPLEMENTATION -------------------- //

    public clean(): void {
        super.clean();
        if (this.value) {
            if (this._cache.has('value')) {
                this._cache.update('value', this.value);
            } else {
                this._cache.add('value', this.value);
            }
        }
    }

    public isDirty(): boolean {
        return super.isDirty() || this.valueIsDirty();
    }

    // -------------------- HIDE BASE CLASS ACTIVATABLE IMPLEMENTATION -------------------- //

    public isActive(value?: boolean): boolean {
        if (value === true && this.isDirty()) {
            this.clean();
            return super.isActive(value, true);
        } else {
            return super.isActive(value);
        }
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    protected valueIsDirty(): boolean {
        let response = false;
        if (this.value) {
            if (this._cache.has('value')) {
                if (this._cache.get('value') !== this.value) {
                    response = true;
                }
            } else {
                response = true;
            }
        }
        return response;
    }

} // End class StringFilter