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

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const normalizeEP: boolean = false;

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

    private _lovedCount: number = 0;

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

    public getAlbumRanking(album: Album): number {

        if (!album.ranking) {
            const albumDivisor = (normalizeEP) ? 10 : album.topTenSongs.length;
            const aggregateSongRating = album.topTenSongs.reduce((sum, song) => {
                const starWeight = starWeights[song.rating - 1];
                const songRanking = this.getSongRanking(song);

                const normalizedStarWeight = Algorithm.normalize(starWeight, 0, starWeights[starWeights.length - 1], minRating, maxRating);

                // return sum + ( (songRanking + normalizedStarWeight) / 2 );
                return sum + songRanking;
            }, 0) / albumDivisor;

            let result = 0;

            if (album.isRated()) {
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


    public getArtistRanking(artist: Artist): number {

        if (!artist.ranking) {
            const albums = Object.values(artist.albums);
            const aggregateAlbumRating = albums.reduce((sum, album) => sum + this.getAlbumRanking(album), 0) / albums.length;
            artist.ranking = aggregateAlbumRating;
        }

        return artist.ranking;

    } // End getArtistRanking()

    public getSongRanking(song: Song): number {

        if (!song.ranking) {
            const lovedRating = song.loved ? maxRating : minRating;
            const playRating = Algorithm.normalize(song.playCount, this._minPlayCount, this._maxPlayCount, minRating, maxRating);
            const skipRating = maxRating - Algorithm.normalize(song.skipCount, this._minSkipCount, this._maxSkipCount, minRating, maxRating);

            let result = 0;

            if (song.rating || song.loved || song.playCount || song.skipCount) {
                if (song.isRated()) {
                    const featureWeights = (song.loved)
                        ? { lovedRating: 0.5, playRating: 0.4, skipRating: 0.1 }
                        : { lovedRating: 0.0, playRating: 0.8, skipRating: 0.2 };
                    const weightedRating =
                        Algorithm.applyWeight(lovedRating, featureWeights.lovedRating) +
                        Algorithm.applyWeight(playRating, featureWeights.playRating) +
                        Algorithm.applyWeight(skipRating, featureWeights.skipRating);
                    result =
                        (song.rating - 1) + // take a star off
                        Algorithm.scale(weightedRating, minRating, (maxRating - (maxRating - 1)) / maxRating); // fill the last star
                } else {
                    const featureWeights = { playRating: 0.8, skipRating: 0.2 };

                    const weightedRating =
                        Algorithm.applyWeight(playRating, featureWeights.playRating) +
                        Algorithm.applyWeight(skipRating, featureWeights.skipRating);

                    if (song.loved) {
                        result =
                            (Algorithm.scale(lovedRating, minRating, (maxRating - 1) / maxRating)) +
                            Algorithm.scale(weightedRating, minRating, (maxRating - (maxRating - 1)) / maxRating);
                    } else {
                        result = weightedRating;
                    }
                }
            }

            song.ranking = result;
        }

        return song.ranking;

    } // End getSongRanking()

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private createAlbum(artist, albumName, albumRating, year): Album {
        const album = new Album(artist, albumName, albumRating, year);

        // Update ORM
        artist.albums[albumName] = album;

        // Update Cache
        if (album.rating) { this._albumStarCount[album.rating - 1]++; }

        return album;
    }

    private createSong(album, artist, discNumber, duration, genre, loved, name, playCount, rating, releaseDate, skipCount, trackNumber): Song {
        const song = new Song(album, artist, duration, genre, loved, name, playCount, rating, releaseDate, skipCount);
        // let lovedCount = this.cache.get('lovedCount');
        // let songStarCount = this.cache.get('songStarCount');
        // let maxPlayCount = this.cache.get('maxPlayCount');
        // let maxSkipCount = this.cache.get('maxSkipCount');
        // let minPlayCount = this.cache.get('minPlayCount');
        // let minSkipCount = this.cache.get('minSkipCount');

        // Update ORM
        album.tracks[discNumber - 1] = album.tracks[discNumber - 1] || new Array<Song>();
        album.tracks[discNumber - 1][trackNumber - 1] = song;

        // Update Cache
        if (song.loved) { this._lovedCount++; }
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

            const albumName = track["Album"];
            const albumRating = (track["Album Rating Computed"] === "true") ? 0 : +track["Album Rating"] / 20 || 0;
            const artistName = track["Artist"];
            const discNumber = +track["Disc Number"] || 1;
            const duration = +track["Total Time"];
            const genre = track["Genre"];
            const loved = track["Loved"] === "true";
            const name = track["Name"];
            const playCount = +track["Play Count"] || 0;
            const rating = +track["Rating"] / 20 || 0;
            const releaseDate = new Date(track["Release Date"]);
            const skipCount = +track["Skip Count"] || 0;
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
                album = this.createAlbum(artist, albumName, albumRating, year);
                albums[albumName] = album;
            }

            const song = this.createSong(album, artist, discNumber, duration, genre, loved, name, playCount, rating, releaseDate, skipCount, trackNumber);
            songs[trackId] = song;
        }

        json["Playlists"].forEach(jsonPlaylist => {
            // TODO: Add support for Folders and Downloaded Content
            if (!(jsonPlaylist["Folder"] || jsonPlaylist["Name"] === "Downloaded")) {
                const name = jsonPlaylist["Name"];
                const playlist = new Playlist(name);

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

        Array.prototype.push.apply(this._songs, Object.values(songs).sort((a: Song, b: Song) => { return this.getSongRanking(b) - this.getSongRanking(a); }));
        Array.prototype.push.apply(this._albums, Object.values(albums).sort((a: Album, b: Album) => { return this.getAlbumRanking(b) - this.getAlbumRanking(a); }));
        Array.prototype.push.apply(this._artists, Object.values(artists).sort((a: Artist, b: Artist) => { return this.getArtistRanking(b) - this.getArtistRanking(a); }));

        Array.prototype.push.apply(this._playlists, Object.values(playlists));
    }

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