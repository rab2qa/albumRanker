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

import { Globals } from '../utilities/globals';

/////////////////////
//                 //
//     LIBRARY     //
//                 //
/////////////////////

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

        const artists = {};
        const albums = {};
        const playlists = {};
        const songs = {};

        for (const key in json["Tracks"]) {

            const track = json["Tracks"][key];
            const albumName = track["Album"];
            const artistName = track["Artist"];
            const discNumber = +track["Disc Number"] || 1;
            const trackId: string = track["Track ID"];
            const trackNumber = +track["Track Number"];

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

            // Create Artist
            let artist = artists[artistName];
            if (!artist) {
                artist = new Artist(track);
                artist.library = this;
                artists[artistName] = artist;
            }

            // Create Album
            let album = albums[albumName];
            if (!album) {
                album = new Album(track);
                album.library = this;
                albums[albumName] = album;
            }
            album.artist = artist;
            if (!artist.albums.find(a => a.name === album.name)) {
                artist.albums.push(album);
            }
            
            // Create Song
            const song = new Song(track);
            songs[trackId] = song;
            song.library = this;
            song.artist = artist;
            song.album = album;
            album.tracks[discNumber - 1] = album.tracks[discNumber - 1] || new Array<Song>();
            album.tracks[discNumber - 1][trackNumber - 1] = song;

            // Update Cache
            if (album.rating) { this._albumStarCount[album.rating - 1]++; }
            if (song.liked) { this._likedCount++; }
            if (song.disliked) { this._dislikedCount++; }
            if (song.rating) { this._songStarCount[song.rating - 1]++; }
            this._maxPlayCount = Math.max(song.playCount, this._maxPlayCount);
            this._maxSkipCount = Math.max(song.skipCount, this._maxSkipCount);
            this._minPlayCount = Math.min(song.playCount, this._minPlayCount);
            this._minSkipCount = Math.min(song.skipCount, this._minSkipCount);
        }

        // Create Playlists
        json["Playlists"].forEach(jsonPlaylist => {
            // TODO: Add support for Folders and Downloaded Content
            if (!(jsonPlaylist["Folder"] || jsonPlaylist["Name"] === "Downloaded")) {
                const name = jsonPlaylist["Name"];
                const playlist = new Playlist(jsonPlaylist);
                playlist.library = this;

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

        this._artists = new Array<Artist>();
        this._albums = new Array<Album>();
        this._playlists = new Array<Playlist>();
        this._songs = new Array<Song>();

        Array.prototype.push.apply(this._songs, Object.values(songs));
        Array.prototype.push.apply(this._albums, Object.values(albums));
        Array.prototype.push.apply(this._artists, Object.values(artists));
        Array.prototype.push.apply(this._playlists, Object.values(playlists));

    } // End constructor()

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

    public getMaxPlayCount(): number {
        if (!this.cache.has('maxPlayCount')) {
            const maxPlayCount = this.songs.reduce((max, song) => Math.max(song.playCount, max), 0);
            this.cache.add('maxPlayCount', maxPlayCount);
        }
        return this.cache.get('maxPlayCount');
    }

    public getMaxSkipCount(): number {
        if (!this.cache.has('maxSkipCount')) {
            const maxSkipCount = this.songs.reduce((max, song) => Math.max(song.skipCount, max), 0);
            this.cache.add('maxSkipCount', maxSkipCount);
        }
        return this.cache.get('maxSkipCount');
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private updateStarWeights(): void {
        for (let i = 2; i < Globals.maxRating; i++) {
            if (this._songStarCount[i]) {
                const previousStarWeight = Globals.starWeights[i - 1];
                const currentStarMultiplier = this._songStarCount[i - 1] / this._songStarCount[i];
                Globals.starWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, 2);
            }
        }
    }
    
} // End class Library