//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**************/
/* INTERFACES */
/**************/

import { Disklikable } from '../../../interfaces/dislikable';
import { Likable } from '../../../interfaces/likable';
import { Rankable } from '../../../interfaces/rankable';
import { Ratable } from '../../../interfaces/ratable';

/**********/
/* MODELS */
/**********/

import { Artist } from '../artist/artist';
import { Library } from '../library/library';
import { Presenter } from '../presenter';
import { Song } from '../song/song';

/************/
/* UTILTIES */
/************/

import { Algorithm } from '../../../utilities/algorithm';
import { Globals } from '../../../utilities/globals';
import { Settings } from '../../../utilities/settings';

///////////////////
//               //
//     ALBUM     //
//               //
///////////////////

export class Album extends Presenter implements Rankable, Ratable, Likable, Disklikable {

    /**************/
    /* PROPERTIES */
    /**************/

    private _artist?: Artist;
    private _disliked: boolean;
    private _library?: Library;
    private _liked: boolean;
    private _name: string;
    private _rating: number;
    private _ratingComputed?: boolean;
    private _tracks: Array<Array<Song>>;
    private _year?: number;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._disliked = json['Album Disliked'] === 'true';
        this._name = json['Album'];
        this._rating = (json['Album Rating Computed'] === 'true') ? Globals.defaultRating : +json['Album Rating'] / 20 || Globals.defaultRating;
        this._ratingComputed = (json['Album Rating Computed'] === 'true');
        this._liked = json['Album Loved'] === 'true';
        this._year = +json['Year'] || null;

        this._tracks = new Array<Array<Song>>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get artist(): Artist { return this._artist; }
    set artist(artist: Artist) { this._artist = artist; }

    get disliked(): boolean { return this._disliked; }

    get duration(): number {
        let duration: number = this._cache.get('duration');
        if (!Number.isFinite(duration)) {
            duration = this.songs.reduce((total, track) => {
                return total + track.duration;
            }, 0);
            this._cache.add('duration', duration);
        }
        return duration;
    }

    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

    get liked(): boolean { return this._liked; }

    get name(): string { return this._name; }

    get playCount(): number {
        let playCount: number = this._cache.get('playCount');
        if (!Number.isFinite(playCount)) {
            playCount = this.songs.reduce((sum, song) => sum + song.playCount, 0);
            this._cache.add('playCount', playCount);
        }
        return playCount;
    }

    get ranking(): number {
        let ranking: number = this._cache.get('ranking');
        if (!Number.isFinite(ranking)) {
            ranking = Globals.defaultRating;
            if (this.isRated()) {
                if (this.isLiked() || this.isDisliked()) {
                    const features = [
                        { value: this._getLikeDislikeRating(), weight: 0.5 },
                        { value: this._getAggregateSongRating(), weight: 0.5 }
                    ];
                    const weightedRating: number = features.reduce((sum, feature) => sum + Algorithm.applyWeight(feature.value, feature.weight), 0);
                    ranking =
                        (this._rating - 1) + // take a star off
                        Algorithm.scale(weightedRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                } else {
                    ranking =
                        (this._rating - 1) + // take a star off
                        Algorithm.scale(this._getAggregateSongRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                }
            } else {
                if (this.isLiked()) {
                    ranking =
                        Algorithm.scale(Globals.maxRating, Globals.minRating, (Globals.maxRating - 1) / Globals.maxRating) +
                        Algorithm.scale(this._getAggregateSongRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else if (this.isDisliked()) {
                    ranking = Algorithm.scale(this._getAggregateSongRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else {
                    ranking = this._getAggregateSongRating();
                }
            }
            this._cache.add('ranking', ranking);
        }
        return ranking;
    }

    get rating(): number { return this._rating; }

    get skipCount(): number {
        let skipCount: number = this._cache.get('skipCount');
        if (!Number.isFinite(skipCount)) {
            skipCount = this.songs.reduce((sum, song) => sum + song.skipCount, 0);
            this._cache.add('skipCount', skipCount);
        }
        return skipCount;
    }

    get songs(): Array<Song> {
        let songs: Array<Song> = this._cache.get('songs');
        if (!songs) {
            songs = this.tracks.reduce((array, disc) => {
                disc.forEach(track => array.push(track));
                return array.sort((a, b) => b.ranking - a.ranking);
            }, new Array<Song>());
            this._cache.add('songs', songs);
        }
        return songs;
    }

    get topTenSongs(): Array<Song> {
        let topTenSongs: Array<Song> = this._cache.get('topTenSongs');
        if (!topTenSongs) {
            topTenSongs = this.songs
                .sort((a, b) => b.ranking - a.ranking)
                .slice(0, 10);
            this._cache.add('topTenSongs', topTenSongs);
        }
        return topTenSongs;
    }

    get tracks(): Array<Array<Song>> { return this._tracks; }

    get value(): number {
        if (Settings.distributeAggregateValues) {
            return this.getTotalValue();
        } else {
            return this.getAverageValue();
        }
    }

    get year(): number { return this._year; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public hasAllSongsRated(): boolean {
        return !!(this.songs.find(song => !song.isRated()));
    }

    public isDisliked(): boolean {
        return !Settings.ignoreLikesAndDislikes && this._disliked;
    }

    public isEP(): boolean {
        return (this.songs.length >= 5 && this.songs.length < 10) && this.songs.reduce((sum, song) => sum + song.duration, 0) <= Globals.thirtyMinutes;
    }

    public isLiked(): boolean {
        return !Settings.ignoreLikesAndDislikes && this._liked;
    }

    public isLP(): boolean {
        return this.songs.length >= 10 || this.songs.reduce((sum, song) => sum + song.duration, 0) > Globals.thirtyMinutes;
    }

    public isRankable(): boolean {
        return !!(this.rating || this.liked || this.disliked || this.songs.find(song => song.isRankable()));
    }

    public isRanked(): boolean {
        const ranking = this._cache.get('ranking');
        return Number.isFinite(ranking);
    }

    public isSingle(): boolean {
        return this.songs.length < 5;
    }

    public isRated(): boolean {
        return !Settings.ignoreAlbumRatings && Number.isFinite(this._rating);
    }

    public getAverageValue(): number {
        let averageValue: number = this.getTotalValue() / this.songs.length || 0;
        return averageValue;
    }

    public getSongsWithRatingOf(rating: number): Array<Song> {
        return this.songs.filter(song => song.rating === rating);
    }

    public getTotalValue(): number {
        const totalValue: number = this.songs.reduce((sum, song) => sum + song.value, 0);
        return totalValue;
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _getAggregateSongRating(): number {
        const albumDivisor: number = (Settings.distributeAggregateValues) ? 10 : this.topTenSongs.length;
        let aggregateSongRating: number = this.topTenSongs.reduce((sum, song) => sum + song.ranking, 0) / albumDivisor;
        aggregateSongRating = Number.isFinite(aggregateSongRating) ? aggregateSongRating : 0;
        return aggregateSongRating;
    }

    private _getLikeDislikeRating(): number {
        let likeDislikeRating: number = Globals.maxRating / 2;

        if (this.isLiked()) {
            likeDislikeRating = Globals.maxRating;
        } else if (this.isDisliked) {
            likeDislikeRating = Globals.minRating;
        }

        return likeDislikeRating;
    }

    private _getWeightedRating(): number {
        let weightedRating: number = Globals.defaultRating;

        if (this.isRated()) {
            const starWeights: Array<number> = this.library.getAlbumStarWeights();
            weightedRating = starWeights[this.rating - 1];
        }

        return weightedRating;
    }

} // End class Album