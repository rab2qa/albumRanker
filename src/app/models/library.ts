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

import { Ratable } from '../interfaces/ratable';

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

const minRating = 0;
const maxRating = 5;

const starWeights = [1, 2, 3, 4, 5];

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
        this.updateStarWeights();
        this.rankSongs();
        this.rankAlbums();
        this.rankArtists();

        // this.cache.add('lovedCount', 0);

        // this.cache.add('maxPlayCount', 0);
        // this.cache.add('minPlayCount', Number.MAX_SAFE_INTEGER);

        // this.cache.add('maxSkipCount', 0);
        // this.cache.add('minSkipCount', Number.MAX_SAFE_INTEGER);

        // this.cache.add('albumStarCount', [0, 0, 0, 0, 0]);
        // this.cache.add('songStarCount', [0, 0, 0, 0, 0]);    
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get albums(): Array<Album> { return this._albums; }

    get artists(): Array<Artist> { return this._artists; }

    get maxAlbumScore(): number {
        if (!this.cache.has('maxAlbumScore')) {
            const maxAlbumScore = this.albums.reduce((max, album) => Math.max(max, this.getAlbumScore(album)), Number.MIN_SAFE_INTEGER);
            this.cache.add('maxAlbumScore', maxAlbumScore);
        }
        return this.cache.get('maxAlbumScore');
    }

    get maxArtistScore(): number {
        if (!this.cache.has('maxArtistScore')) {
            const maxArtistScore = this.artists.reduce((max, artist) => {
                const artistScore = this.getArtistScore(artist);
                return artistScore > max ? artistScore : max;
            }, 0);
            this.cache.add('maxArtistScore', maxArtistScore);
        }
        return this.cache.get('maxArtistScore');
    }

    get minAlbumScore(): number {
        if (!this.cache.has('minAlbumScore')) {
            const minAlbumScore = this.albums.reduce((min, album) => Math.min(min, this.getAlbumScore(album)), Number.MAX_SAFE_INTEGER);
            this.cache.add('minAlbumScore', minAlbumScore);
        }
        return this.cache.get('minAlbumScore');
    }

    get minArtistScore(): number {
        if (!this.cache.has('minArtistScore')) {
            const minArtistScore = this.artists.reduce((min, artist) => {
                const artistScore = this.getArtistScore(artist);
                return artistScore < min ? artistScore : min;
            }, 800);
            this.cache.add('minArtistScore', minArtistScore);
        }
        return this.cache.get('minArtistScore');
    }

    get playlists(): Array<Playlist> { return this._playlists; }

    get songs(): Array<Song> { return this._songs; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public getArtistRanking(artist: Artist): number {
        if (!artist.ranking) {
            artist.ranking = Algorithm.normalize(this.getArtistScore(artist), this.minArtistScore, this.maxArtistScore, minRating, maxRating);
        }
        return artist.ranking;
    }

    public getAlbumRanking(album: Album): number {
        if (!album.ranking) {
            const weights = (album.rating)
                ? { rating: 0.5, aggregateSongRating: 0.4, aggregatePlayCount: 0.08, aggregateSkipCount: 0.02 }
                : { rating: 0.0, aggregateSongRating: 0.8, aggregatePlayCount: 0.16, aggregateSkipCount: 0.04 };

            const normalizedAlbumRating = Algorithm.normalize(album.rating, minRating, maxRating);
            const normalizedAlbumScore = Algorithm.normalize(this.getAlbumScore(album), this.minAlbumScore, this.maxAlbumScore);

            const topTenSongs = album.topTenSongs;
            const aggregatePlayCount = topTenSongs.reduce((sum, song) => sum + song.playCount, 0);
            const aggregateSkipCount = topTenSongs.reduce((sum, song) => sum + song.skipCount, 0);
            const normalizedAggregatePlayCount = Algorithm.normalize(aggregatePlayCount, this._minPlayCount * topTenSongs.length, this._maxPlayCount * topTenSongs.length);
            const normalizedAggregateSkipCount = Algorithm.normalize(aggregateSkipCount, this._minSkipCount * topTenSongs.length, this._maxSkipCount * topTenSongs.length);

            const weightedRating = Algorithm.applyWeight(normalizedAlbumRating, weights.rating) + Algorithm.applyWeight(normalizedAlbumScore, weights.aggregateSongRating) + Algorithm.applyWeight(normalizedAggregatePlayCount, weights.aggregatePlayCount) + Algorithm.applyWeight(normalizedAggregateSkipCount, weights.aggregateSkipCount);
            album.ranking = Algorithm.scale(weightedRating, minRating, maxRating);
        }
        return album.ranking;
    }

    public getSongRanking(song: Song): number {
        if (!song.ranking) {
            const weights = { rating: 0.8, loved: 0.0, playCount: 0.16, skipCount: 0.04 };
            const normalizedSongRating = Algorithm.normalize(song.rating, minRating, maxRating);
            const normalizedPlayCount = Algorithm.normalize(song.playCount, this._minPlayCount, this._maxPlayCount);
            const normalizedSkipCount = Algorithm.normalize(song.skipCount, this._minSkipCount, this._maxSkipCount);
            const weightedRating = Algorithm.applyWeight(normalizedSongRating, weights.rating) + Algorithm.applyWeight(normalizedPlayCount, weights.playCount) + Algorithm.applyWeight(1 - normalizedSkipCount, weights.skipCount);
            song.ranking = Algorithm.scale(weightedRating, minRating, maxRating);
        }
        return song.ranking;
    }

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

        Array.prototype.push.apply(this._albums, Object.values(albums));
        Array.prototype.push.apply(this._artists, Object.values(artists));
        Array.prototype.push.apply(this._playlists, Object.values(playlists));
        Array.prototype.push.apply(this._songs, Object.values(songs));
    }

    private getArtistScore(artist: Artist): number {
        return Object.values(artist.albums).reduce((sum, album) => sum + this.getAlbumRanking(album), 0);
    }

    private getAlbumScore(album: Album): number {
        return album.topTenSongs.reduce((sum, song) => sum + this.transformRating(song), 0);
    }

    // private getSongScore(song: Song): number {
    //     return this.GetSongRanking(song);
    // }

    private rankAlbums(): void {
        this.albums.forEach(album => this.getAlbumRanking(album));
        this._albums = this._albums
            .filter(album => album.ranking > 0)
            .sort((a, b) => b.ranking - a.ranking);
    }

    private rankArtists(): void {
        this.artists.forEach(artist => this.getArtistRanking(artist));
        this._artists = this._artists
            .filter(artist => artist.ranking > 0)
            .sort((a, b) => b.ranking - a.ranking);
    }

    private rankSongs(): void {
        this.songs.forEach(song => this.getSongRanking(song));
        this.songs.sort((a: Song, b: Song) => { return b.ranking - a.ranking });
    }

    private transformRating(ratable: Ratable): number {
        const starIndex = ratable.rating - 1;
        return Algorithm.linearTransform(ratable.rating, starWeights[starIndex]);
    }

    private updateStarWeights(): void {
        for (let i = 1; i < maxRating; i++) {
            if (this._songStarCount[i]) { starWeights[i] = Math.max(this._songStarCount[i - 1] / this._songStarCount[i], 1); }
        }
    }

} // End class Library