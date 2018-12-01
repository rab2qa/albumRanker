//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Container } from '../classes/container';
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

    private _artists: Container<Artist>;
    private _albums: Container<Album>;
    private _playlists: Container<Playlist>;
    private _songs: Container<Song>;

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

        this._artists = new Container("Artists", <Array<Artist>>Object.values(artists));
        this._albums = new Container("Albums", <Array<Album>>Object.values(albums));
        this._playlists = new Container("Playlists", <Array<Playlist>>Object.values(playlists));
        this._songs = new Container("Songs", <Array<Song>>Object.values(songs));

    } // End constructor()

    /*************/
    /* ACCESSORS */
    /*************/

    get albums(): Container<Album> { return this._albums; }

    get artists(): Container<Artist> { return this._artists; }

    get playlists(): Container<Playlist> { return this._playlists; }

    get songs(): Container<Song> { return this._songs; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public getMaxPlayCount(): number {
        if (!this.cache.has('maxPlayCount')) {
            const maxPlayCount = this.songs.all.reduce((max, song) => Math.max(song.playCount, max), 0);
            this.cache.add('maxPlayCount', maxPlayCount);
        }
        return this.cache.get('maxPlayCount');
    }

    public getMaxSkipCount(): number {
        if (!this.cache.has('maxSkipCount')) {
            const maxSkipCount = this.songs.all.reduce((max, song) => Math.max(song.skipCount, max), 0);
            this.cache.add('maxSkipCount', maxSkipCount);
        }
        return this.cache.get('maxSkipCount');
    }

    public getMinPlayCount(): number {
        if (!this.cache.has('minPlayCount')) {
            const minPlayCount = this.songs.all.reduce((min, song) => Math.min(song.playCount, min), Number.MAX_SAFE_INTEGER);
            this.cache.add('maxPlayCount', minPlayCount);
        }
        return this.cache.get('minPlayCount');
    }

    public getMinSkipCount(): number {
        if (!this.cache.has('minSkipCount')) {
            const minSkipCount = this.songs.all.reduce((min, song) => Math.min(song.skipCount, min), Number.MAX_SAFE_INTEGER);
            this.cache.add('minSkipCount', minSkipCount);
        }
        return this.cache.get('minSkipCount');
    }

    public getAlbumStarCounts(): Array<number> {
        if (!this.cache.has('albumStarCounts')) {
            const albumStarCounts = this.songs.all.reduce((starCounts, album) => {
                const starIndex = album.rating - 1;
                starCounts[starIndex]++;
                return starCounts;
            }, [0, 0, 0, 0, 0]);
            this.cache.add('albumStarCounts', albumStarCounts);
        }
        return this.cache.get('albumStarCounts');
    }

    public getSongStarCounts(): Array<number> {
        if (!this.cache.has('songStarCounts')) {
            const songStarCounts = this.songs.all.reduce((starCounts, song) => {
                const starIndex = song.rating - 1;
                starCounts[starIndex]++;
                return starCounts;
            }, [0, 0, 0, 0, 0]);
            this.cache.add('songStarCounts', songStarCounts);
        }
        return this.cache.get('songStarCounts');
    }

    public getAlbumStarWeights(): Array<number> {
        if (!this.cache.has('albumStarWeights')) {
            const albumStarCounts = this.getSongStarCounts();
            let albumStarWeights: Array<number> = [Math.pow(2, 0), Math.pow(2, 1), Math.pow(2, 2), Math.pow(2, 3), Math.pow(2, 4)];
            for (let i = 2; i < Globals.maxRating; i++) {
                if (albumStarCounts[i]) {
                    const previousStarWeight = albumStarWeights[i - 1];
                    const currentStarMultiplier = albumStarCounts[i - 1] / albumStarCounts[i];
                    albumStarWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, 2);
                }
            }
            this.cache.add('albumStarWeights', albumStarWeights);
        }
        return this.cache.get('albumStarWeights');
    }

    public getSongStarWeights(): Array<number> {
        if (!this.cache.has('songStarWeights')) {
            const songStarCounts = this.getSongStarCounts();
            let songStarWeights: Array<number> = [Math.pow(2, 0), Math.pow(2, 1), Math.pow(2, 2), Math.pow(2, 3), Math.pow(2, 4)];
            for (let i = 2; i < Globals.maxRating; i++) {
                if (songStarCounts[i]) {
                    const previousStarWeight = songStarWeights[i - 1];
                    const currentStarMultiplier = songStarCounts[i - 1] / songStarCounts[i];
                    songStarWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, 2);
                }
            }
            this.cache.add('songStarWeights', songStarWeights);
        }
        return this.cache.get('songStarWeights');
    }

} // End class Library