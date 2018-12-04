//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from '../classes/presenter';

/**************/
/* INTERFACES */
/**************/

import { Disklikable } from '../interfaces/dislikable';
import { Library } from './library';
import { Likable } from '../interfaces/likable';
import { Rankable } from '../interfaces/rankable';
import { Ratable } from '../interfaces/ratable';

/**********/
/* MODELS */
/**********/

import { Artist } from './artist';
import { Song } from './song';

/************/
/* UTILTIES */
/************/

import { Algorithm } from '../utilities/algorithm';
import { Globals } from '../utilities/globals';
import { Settings } from '../utilities/settings';

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
    private _ranking?: number;
    private _rating: number;
    private _tracks: Array<Array<Song>>;
    private _year: number;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._disliked = json["Album Disliked"] === "true";
        this._name = json["Album"];
        this._rating = (json["Album Rating Computed"] === "true") ? Globals.defaultRating : +json["Album Rating"] / 20 || Globals.defaultRating;
        this._liked = json["Album Loved"] === "true";
        this._year = json["Year"];

        this._tracks = new Array<Array<Song>>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get artist(): Artist { return this._artist; }
    set artist(artist: Artist) { this._artist = artist; }

    get disliked(): boolean { return this._disliked; }

    get duration(): number {
        if (!this.cache.has('duration')) {
            const duration = this.songs.reduce((total, track) => {
                return total + track.duration;
            }, 0);
            this.cache.add('duration', duration);
        }
        return this.cache.get('duration');
    }

    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

    get liked(): boolean { return this._liked; }

    get name(): string { return this._name; }

    get playCount(): number {
        if (!this.cache.has('playCount')) {
            const playCount = this.songs.reduce((sum, song) => sum + song.playCount, 0);
            this.cache.add('playCount', playCount);
        }
        return this.cache.get('playCount');
    }

    get ranking(): number {
        if (!this.isRanked()) {
            let response = Globals.defaultRating;
            if (this.isRated()) {
                if (this.isLiked() || this.isDisliked()) {
                    const features = [
                        { value: this.getLikeDislikeRating(), weight: 0.5 },
                        { value: this.getAggregateSongRating(), weight: 0.5 }
                    ];
                    const weightedRating = features.reduce((sum, feature) => sum + Algorithm.applyWeight(feature.value, feature.weight), 0);
                    response =
                        (this._rating - 1) + // take a star off
                        Algorithm.scale(weightedRating, Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                } else {
                    response =
                        (this._rating - 1) + // take a star off
                        Algorithm.scale(this.getAggregateSongRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating); // fill the last star
                }
            } else {
                if (this.isLiked()) {
                    response =
                        Algorithm.scale(Globals.maxRating, Globals.minRating, (Globals.maxRating - 1) / Globals.maxRating) +
                        Algorithm.scale(this.getAggregateSongRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else if (this.isDisliked()) {
                    response = Algorithm.scale(this.getAggregateSongRating(), Globals.minRating, (Globals.maxRating - (Globals.maxRating - 1)) / Globals.maxRating);
                } else {
                    response = this.getAggregateSongRating();
                }
            }
            this._ranking = response;
        }
        return this._ranking;
    }

    get rating(): number { return this._rating; }

    get skipCount(): number {
        if (!this.cache.has('skipCount')) {
            const skipCount = this.songs.reduce((sum, song) => sum + song.skipCount, 0);
            this.cache.add('skipCount', skipCount);
        }
        return this.cache.get('skipCount');
    }

    get songs(): Array<Song> {
        if (!this.cache.has('songs')) {
            const songs = this.tracks.reduce((array, disc) => {
                disc.forEach(track => array.push(track));
                return array.sort((a, b) => b.ranking - a.ranking);
            }, new Array<Song>());
            this.cache.add('songs', songs);
        }
        return this.cache.get('songs');
    }

    get stars(): Array<number> {
        if (!this.cache.has('stars')) {
            const stars = Globals.rankingToStars(this.ranking);
            this.cache.add('stars', stars);;
        }
        return this.cache.get('stars');
    }

    get topTenSongs(): Array<Song> {
        if (!this.cache.has('topTenSongs')) {
            const topTenSongs = this.songs
                .sort((a, b) => b.ranking - a.ranking)
                .slice(0, 10);
            this.cache.add('topTenSongs', topTenSongs);
        }
        return this.cache.get('topTenSongs');
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
        return Number.isFinite(this._ranking);
    }

    public isSingle(): boolean {
        return this.songs.length < 5;
    }

    public isRated(): boolean {
        return !Settings.ignoreAlbumRatings && Number.isFinite(this._rating);
    }

    public getAverageValue(): number {
        let response = this.getTotalValue() / this.songs.length || 0;
        return response;
    }

    public getSongsWithRatingOf(rating: number): Array<Song> {
        return this.songs.filter(song => song.rating === rating);
    }

    public getTotalValue(): number {
        const response = this.songs.reduce((sum, song) => sum + song.value, 0);
        return response;
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private getAggregateSongRating(): number {
        const albumDivisor = (Settings.distributeAggregateValues) ? 10 : this.topTenSongs.length;
        let aggregateSongRating = this.topTenSongs.reduce((sum, song) => sum + song.ranking, 0) / albumDivisor;
        const response = Number.isFinite(aggregateSongRating) ? aggregateSongRating : 0;
        return response;
    }

    private getWeightedRating(): number {
        let response = Globals.defaultRating;

        if (this.isRated()) {
            const starWeights = this.library.getAlbumStarWeights();
            const weightedRating = starWeights[this.rating - 1];
            response = weightedRating;
        }

        return response;
    }

    private getLikeDislikeRating(): number {
        let response = Globals.maxRating / 2;

        if (this.isLiked()) {
            response = Globals.maxRating;
        } else if (this.isDisliked) {
            response = Globals.minRating;
        }

        return response;
    }

} // End class Album