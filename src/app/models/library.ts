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
        }

        // Create Playlists
        json["Playlists"].forEach(jsonPlaylist => {
            if (!(jsonPlaylist["Folder"] || jsonPlaylist["Name"] === "Downloaded")) { // TODO: Add support for Folders and Downloaded Content
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

        this._artists = Object.values(artists);
        this._albums = Object.values(albums);
        this._playlists = Object.values(playlists);
        this._songs = Object.values(songs);

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

    public getMinPlayCount(): number {
        if (!this.cache.has('minPlayCount')) {
            const minPlayCount = this.songs.reduce((min, song) => Math.min(song.playCount, min), Number.MAX_SAFE_INTEGER);
            this.cache.add('maxPlayCount', minPlayCount);
        }
        return this.cache.get('minPlayCount');
    }

    public getMinSkipCount(): number {
        if (!this.cache.has('minSkipCount')) {
            const minSkipCount = this.songs.reduce((min, song) => Math.min(song.skipCount, min), Number.MAX_SAFE_INTEGER);
            this.cache.add('minSkipCount', minSkipCount);
        }
        return this.cache.get('minSkipCount');
    }

    public getAlbumStarCount(): Array<number> {
        if (!this.cache.has('albumStarCount')) {
            const albumStarCount = this._songs.reduce((array, album) => {
                array[album.rating - 1]++;
                return array;
            }, [0, 0, 0, 0, 0]);
            this.cache.add('albumStarCount', albumStarCount);
        }
        return this.cache.get('albumStarCount');
    }

    public getSongStarCount(): Array<number> {
        if (!this.cache.has('songStarCount')) {
            const songStarCount = this._songs.reduce((array, song) => {
                array[song.rating - 1]++;
                return array;
            }, [0, 0, 0, 0, 0]);
            this.cache.add('songStarCount', songStarCount);
        }
        return this.cache.get('songStarCount');
    }

    public getAlbumStarWeights(): Array<number> {
        if (!this.cache.has('albumStarWeights')) {
            const albumStarCount = this.getSongStarCount();
            let albumStarWeights: Array<number> = [Math.pow(2, 0), Math.pow(2, 1), Math.pow(2, 2), Math.pow(2, 3), Math.pow(2, 4)];
            for (let i = 2; i < Globals.maxRating; i++) {
                if (albumStarCount[i]) {
                    const previousStarWeight = albumStarWeights[i - 1];
                    const currentStarMultiplier = albumStarCount[i - 1] / albumStarCount[i];
                    albumStarWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, 2);
                }
            }
            this.cache.add('albumStarWeights', albumStarWeights);
        }
        return this.cache.get('albumStarWeights');
    }

    public getSongStarWeights(): Array<number> {
        if (!this.cache.has('songStarWeights')) {
            const songStarCount = this.getSongStarCount();
            let songStarWeights: Array<number> = [Math.pow(2, 0), Math.pow(2, 1), Math.pow(2, 2), Math.pow(2, 3), Math.pow(2, 4)];
            for (let i = 2; i < Globals.maxRating; i++) {
                if (songStarCount[i]) {
                    const previousStarWeight = songStarWeights[i - 1];
                    const currentStarMultiplier = songStarCount[i - 1] / songStarCount[i];
                    songStarWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, 2);
                }
            }
            this.cache.add('songStarWeights', songStarWeights);
        }
        return this.cache.get('songStarWeights');
    }

} // End class Library