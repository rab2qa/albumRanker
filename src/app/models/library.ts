//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from '../classes/presenter';

/**********/
/* MODELS */
/**********/

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Playlist } from '../models/playlist';
import { Song } from '../models/song';

/*************/
/* UTILITIES */
/*************/

import { Algorithm } from '../utilities/algorithm';
import { Rankable } from '../interfaces/rankable';

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const PENALIZE_EP: boolean = false;

const minRating: number = 0;
const maxRating: number = 5;

const starWeights: Array<number> = [Math.pow(2, 0), Math.pow(2, 1), Math.pow(2, 2), Math.pow(2, 3), Math.pow(2, 4)];

export class Library extends Presenter {

    /**************/
    /* PROPERTIES */
    /**************/

    private _artists: Array<Artist>;
    private _albums: Array<Album>;
    private _playlists: Array<Playlist>;
    private _songs: Array<Song>;

    private _likedCount: number = 0;
    private _dislikedCount: number = 0;

    private _maxPlayCount: number = 0;
    private _minPlayCount: number = Number.MAX_SAFE_INTEGER;

    private _maxSkipCount: number = 0;
    private _minSkipCount: number = Number.MAX_SAFE_INTEGER;

    private _albumStarCount: Array<number> = [0, 0, 0, 0, 0];
    private _songStarCount: Array<number> = [0, 0, 0, 0, 0];

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._artists = new Array<Artist>();
        this._albums = new Array<Album>();
        this._playlists = new Array<Playlist>();
        this._songs = new Array<Song>();

        this.createLibrary(json);
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get albums(): Array<Album> { return this._albums; }

    get artists(): Array<Artist> { return this._artists; }

    get playlists(): Array<Playlist> { return this._playlists; }

    get songs(): Array<Song> { return this._songs; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public getRanking(rankable: Rankable): number {

        if (rankable instanceof Artist) {
            return this.getArtistRanking(<Artist>rankable);
        } else if (rankable instanceof Album) {
            return this.getAlbumRanking(<Album>rankable);
        } else if (rankable instanceof Song) {
            return this.getSongRanking(<Song>rankable);
        }

    } // End getRanking()

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private createAlbum(artist, albumName, albumRating, disliked, liked, year): Album {
        const album = new Album(artist, disliked, liked, albumName, albumRating, year);

        // Update ORM
        artist.albums[albumName] = album;

        // Update Cache
        if (album.rating) { this._albumStarCount[album.rating - 1]++; }

        return album;
    }

    private createSong(album, artist, discNumber, disliked, duration, genre, liked, name, playCount, rating, releaseDate, skipCount, trackNumber): Song {
        const song = new Song(album, artist, disliked, duration, genre, liked, name, playCount, rating, releaseDate, skipCount);

        // Update ORM
        album.tracks[discNumber - 1] = album.tracks[discNumber - 1] || new Array<Song>();
        album.tracks[discNumber - 1][trackNumber - 1] = song;

        // Update Cache
        if (song.liked) { this._likedCount++; }
        if (song.disliked) { this._dislikedCount++; }
        if (song.rating) { this._songStarCount[song.rating - 1]++; }
        this._maxPlayCount = Math.max(song.playCount, this._maxPlayCount);
        this._maxSkipCount = Math.max(song.skipCount, this._maxSkipCount);
        this._minPlayCount = Math.min(song.playCount, this._minPlayCount);
        this._minSkipCount = Math.min(song.skipCount, this._minSkipCount);

        return song;
    }

    private createLibrary(json: Object) {
        const artists = {};
        const albums = {};
        const playlists = {};
        const songs = {};

        for (const key in json["Tracks"]) {
            const track = json["Tracks"][key];

            if (track["Movie"] === "true") {
                // TODO: Add support for Movies
                continue;
            }

            if (track["TV Show"] === "true") {
                // TODO: Add support for TV Shows
                continue;
            }

            if (track["Audiobook"] === "true") {
                // TODO: Add support for Audiobooks
                continue;
            }

            if (track["Podcast"] === "true") {
                // TODO: Add support for Podcasts
                continue;
            }

            const albumDisliked = track["Album Disliked"] === "true";
            const albumLiked = track["Album Loved"] === "true";
            const albumName = track["Album"];
            const albumRating = (track["Album Rating Computed"] === "true") ? 0 : +track["Album Rating"] / 20 || 0;
            const artistName = track["Artist"];
            const discNumber = +track["Disc Number"] || 1;
            const disliked = track["Disliked"] === "true";
            const duration = +track["Total Time"];
            const genre = track["Genre"];
            const liked = track["Loved"] === "true";
            const name = track["Name"];
            const playCount = +track["Play Count"] || 0;
            const rating = +track["Rating"] / 20 || 0;
            const releaseDate = new Date(track["Release Date"]);
            const skipCount = +track["Skip Count"] || 0;
            const trackCount = +track["Track Count"] || 0;
            const trackId: string = track["Track ID"];
            const trackNumber = +track["Track Number"];
            const year = track["Year"];

            let artist = artists[artistName];
            if (!artist) {
                artist = new Artist(artistName);
                artists[artistName] = artist;
            }

            let album = albums[albumName];
            if (!album) {
                album = this.createAlbum(artist, albumName, albumRating, albumDisliked, albumLiked, year);
                albums[albumName] = album;
            }

            const song = this.createSong(album, artist, discNumber, disliked, duration, genre, liked, name, playCount, rating, releaseDate, skipCount, trackNumber);
            songs[trackId] = song;
        }

        json["Playlists"].forEach(jsonPlaylist => {
            // TODO: Add support for Folders and Downloaded Content
            if (!(jsonPlaylist["Folder"] || jsonPlaylist["Name"] === "Downloaded")) {
                const disliked = jsonPlaylist["Disliked"] === "true";
                const liked = jsonPlaylist["Loved"] === "true";
                const name = jsonPlaylist["Name"];
                const playlist = new Playlist(disliked, liked, name);

                if (jsonPlaylist["Playlist Items"]) {
                    jsonPlaylist["Playlist Items"].forEach(item => {
                        const itemId = item["Track ID"];
                        const song = songs[itemId];
                        if (song) { playlist.songs.push(song); }
                        if (songs[itemId]) { songs[itemId].playlists.push(playlist); }
                    });
                }
                playlists[name] = playlist;
            }
        });

        this.updateStarWeights();

        Array.prototype.push.apply(this._songs, this.rank(Object.values(songs)));
        Array.prototype.push.apply(this._albums, this.rank(Object.values(albums)));
        Array.prototype.push.apply(this._artists, this.rank(Object.values(artists)));
        Array.prototype.push.apply(this._playlists, Object.values(playlists));
    }

    private getAlbumRanking(album: Album): number {

        if (!album.ranking) {
            const albumDivisor = (PENALIZE_EP) ? 10 : album.topTenSongs.length;
            let aggregateSongRating = album.topTenSongs.reduce((sum, song) => sum + this.getSongRanking(song), 0) / albumDivisor;
            aggregateSongRating = aggregateSongRating || 0; // Handle Divide by Zero Error

            let result = 0;

            if (album.rating) {
                result =
                    (album.rating - 1) +
                    Algorithm.scale(aggregateSongRating, minRating, (maxRating - (maxRating - 1)) / maxRating);
            } else {
                result = aggregateSongRating;
            }

            album.ranking = result;
        }

        return album.ranking;

    } // End getAlbumRanking()

    public getSongRarity(song: Song): number {
        const starWeight = starWeights[song.rating - 1];
        // const normalizedStarWeight = Algorithm.normalize(starWeight, 0, starWeights[starWeights.length - 1], minRating, maxRating);
        return starWeight * (song.liked ? 2 : 1) * (song.disliked ? 0.5 : 1); // + song.playCount - song.skipCount;
    }

    public getAlbumRarity(album: Album): number {
        return album.topTenSongs.reduce((sum, song) => sum + this.getSongRarity(song), 0);
    }

    private getArtistRanking(artist: Artist): number {

        if (!artist.ranking) {
            // const artistScore = artist.songs.reduce((sum, song) => {
            //     return sum + starWeights[song.rating - 1];
            // }, 0);
            // artist.ranking = artistScore;
            const albums = Object.values(artist.albums);
            let aggregateAlbumRating = albums.reduce((sum, album) => sum + this.getAlbumRanking(album), 0) / albums.length;
            aggregateAlbumRating = aggregateAlbumRating || 0; // Handle Divide by Zero Error
            artist.ranking = aggregateAlbumRating;
        }

        return artist.ranking;

    } // End getArtistRanking()

    private getSongRanking(song: Song): number {

        if (!song.ranking) {
            let likeDislikeRating = (song.liked) ? 5 : (song.disliked) ? 0 : null;
            let playSkipRatio = (song.playCount + (this._maxSkipCount - song.skipCount)) / (this._maxPlayCount + this._maxSkipCount);
            playSkipRatio = playSkipRatio || 0; // Handle Divide by Zero Error
            const playSkipRating = Algorithm.scale(playSkipRatio, minRating, maxRating);

            let result = 0;

            if (song.rating || song.liked || song.disliked || song.playCount || song.skipCount) {
                if (song.rating) {
                    if (song.liked || song.disliked) {
                        const featureWeights = { likeDislikeRating: 0.5, playSkipRating: 0.5 };
                        const weightedRating =
                            Algorithm.applyWeight(likeDislikeRating, featureWeights.likeDislikeRating) +
                            Algorithm.applyWeight(playSkipRating, featureWeights.playSkipRating);
                        result =
                            (song.rating - 1) + // take a star off
                            Algorithm.scale(weightedRating, minRating, (maxRating - (maxRating - 1)) / maxRating); // fill the last star
                    } else {
                        result =
                            (song.rating - 1) + // take a star off
                            Algorithm.scale(playSkipRating, minRating, (maxRating - (maxRating - 1)) / maxRating); // fill the last star
                    }
                } else {
                    if (song.liked) {
                        result =
                            Algorithm.scale(maxRating, minRating, (maxRating - 1) / maxRating) +
                            Algorithm.scale(playSkipRating, minRating, (maxRating - (maxRating - 1)) / maxRating);
                    } else if (song.disliked) {
                        result = Algorithm.scale(playSkipRating, minRating, (maxRating - (maxRating - 1)) / maxRating);
                    } else {
                        result = playSkipRating;
                    }
                }
            }

            // Update the Model
            song.ranking = result;
        }

        return song.ranking;

    } // End getSongRanking()

    private rank(rankables: Array<Rankable>): Array<Rankable> {

        switch (rankables.length) {
            case 0:
                break;
            case 1:
                rankables.forEach(rankable => this.getRanking(rankable));
                break;
            default:
                rankables.sort((a: Rankable, b: Rankable) => { return this.getRanking(b) - this.getRanking(a); });
        }

        return rankables;

    } // End rank()

    private updateStarWeights(): void {
        for (let i = 2; i < maxRating; i++) {
            if (this._songStarCount[i]) {
                const previousStarWeight = starWeights[i - 1];
                const currentStarMultiplier = this._songStarCount[i - 1] / this._songStarCount[i];
                starWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, 2);
            }
        }
    }

} // End class Library