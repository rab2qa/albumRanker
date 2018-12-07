/////////////////////////////
//                         //
//     COMPARISON TYPE     //
//                         //
/////////////////////////////

export enum ComparisonType {
    BeginsWith,
    Contians,
    DoesNotContain,
    EndsWith,
    Is,
    IsNot,
    IsFalse,
    IsGreaterThan,
    IsLessThan,
    IsInTheRange,
    IsTrue
}

////////////////////////////
//                        //
//     CONTAINER TYPE     //
//                        //
////////////////////////////

export enum ContainerType {
    Album,
    Artist,
    Playlist,
    Song
}

////////////////////////
//                    //
//     EVENT TYPE     //
//                    //
////////////////////////

export enum EventType {
    Active,
    Available,
    Selected,
    Supported,
    Dirty
}
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