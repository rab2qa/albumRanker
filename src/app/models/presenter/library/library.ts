//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**********/
/* MODELS */
/**********/

import { Container, ContainerType } from '../../container/container';
import { Artist } from '../artist/artist';
import { Album } from '../album/album';
import { Playlist } from '../playlist/playlist';
import { Presenter } from '../presenter';
import { Song } from '../song/song';

/*************/
/* UTILITIES */
/*************/

import { Globals } from '../../../utilities/globals';
import { Settings } from '../../../utilities/settings';

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

        for (const key in json['Tracks']) {

            const track = json['Tracks'][key];
            const albumName: string = track['Album'];
            const artistName: string = track['Artist'];
            const discNumber: number = +track['Disc Number'] || 1;
            const trackId: string = track['Track ID'];
            const trackNumber: number = +track['Track Number'];

            if (track['Movie'] === 'true') {
                // TODO: Add support for Movies
                continue;
            }

            if (track['TV Show'] === 'true') {
                // TODO: Add support for TV Shows
                continue;
            }

            if (track['Audiobook'] === 'true') {
                // TODO: Add support for Audiobooks
                continue;
            }

            if (track['Podcast'] === 'true') {
                // TODO: Add support for Podcasts
                continue;
            }

            // Create Artist
            let artist: Artist = artists[artistName];
            if (!artist) {
                artist = new Artist(track);
                artist.library = this;
                artists[artistName] = artist;
            }

            // Create Album
            let album: Album = albums[albumName];
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
            const song: Song = new Song(track);
            songs[trackId] = song;
            song.library = this;
            song.artist = artist;
            song.album = album;
            album.tracks[discNumber - 1] = album.tracks[discNumber - 1] || new Array<Song>();
            album.tracks[discNumber - 1][trackNumber - 1] = song;
        }

        // Create Playlists
        json['Playlists'].forEach(jsonPlaylist => {
            if (!(jsonPlaylist['Folder'] || jsonPlaylist['Name'] === 'Downloaded')) { // TODO: Add support for Folders and Downloaded Content
                const name: string = jsonPlaylist['Name'];
                const playlist: Playlist = new Playlist(jsonPlaylist);
                playlist.library = this;

                if (jsonPlaylist['Playlist Items']) {
                    jsonPlaylist['Playlist Items'].forEach(item => {
                        const itemId: string = item['Track ID'];
                        const song: Song = songs[itemId];
                        if (song) { playlist.songs.push(song); }
                        if (songs[itemId]) { songs[itemId].playlists.push(playlist); }
                    });
                }
                playlists[name] = playlist;
            }
        });

        this._artists = new Container(ContainerType.Artist, 'Artists', Object.values(artists));
        this._albums = new Container(ContainerType.Album, 'Albums', Object.values(albums));
        this._playlists = new Container(ContainerType.Playlist, 'Playlists', Object.values(playlists));
        this._songs = new Container(ContainerType.Song, 'Songs', Object.values(songs));

        this._rank()

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

    public getAlbumStarCounts(): Array<number> {
        let albumStarCounts: Array<number> = this._cache.get('albumStarCounts')
        if (!albumStarCounts) {
            albumStarCounts = this.albums.all.reduce((starCounts, album) => {
                if (album.isRated()) {
                    const starIndex: number = album.rating - 1;
                    starCounts[starIndex] = starCounts[starIndex] || 0;
                    starCounts[starIndex]++;
                }
                return starCounts;
            }, Globals.newStarArray());
            this._cache.add('albumStarCounts', albumStarCounts);
        }
        return albumStarCounts;
    }

    public getAlbumStarWeights(): Array<number> {
        let albumStarWeights: Array<number> = this._cache.get('albumStarWeights');
        if (!albumStarWeights) {
            const albumStarCounts: Array<number> = this.getAlbumStarCounts();
            albumStarWeights = Globals.newStarArray();
            for (let i = 0; i < Globals.maxRating; i++) {
                if (i < 2) {
                    albumStarWeights[i] = i + 1;
                } else {
                    if (albumStarCounts[i]) {
                        const previousStarWeight: number = albumStarWeights[i - 1];
                        const currentStarMultiplier: number = albumStarCounts[i - 1] / albumStarCounts[i] || 1;
                        albumStarWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, i + 1);
                    }
                }
            }
            this._cache.add('albumStarWeights', albumStarWeights);
        }
        return albumStarWeights;
    }

    public getMaxPlayCount(): number {
        let maxPlayCount: number = this._cache.get('maxPlayCount');
        if (!Number.isFinite(maxPlayCount)) {
            maxPlayCount = this.songs.all.reduce((max, song) => Math.max(song.playCount, max), 0);
            this._cache.add('maxPlayCount', maxPlayCount);
        }
        return maxPlayCount;
    }

    public getMaxSkipCount(): number {
        let maxSkipCount: number = this._cache.get('maxSkipCount');
        if (!Number.isFinite(maxSkipCount)) {
            maxSkipCount = this.songs.all.reduce((max, song) => Math.max(song.skipCount, max), 0);
            this._cache.add('maxSkipCount', maxSkipCount);
        }
        return maxSkipCount;
    }

    public getMaxSongValue(): number {
        let maxSongValue: number = this._cache.get('maxSongValue');
        if (!Number.isFinite(maxSongValue)) {
            maxSongValue = this.songs.all.reduce((max, song) => Math.max(max, song.value), 0);
            this._cache.add('maxSongValue', maxSongValue);
        }
        return maxSongValue;
    }

    public getMaxArtistValue(): number {
        let maxArtistValue: number = this._cache.get('maxArtistValue');
        if (!Number.isFinite(maxArtistValue)) {
            maxArtistValue = this.artists.all.reduce((max, artist) => Math.max(max, artist.getValue()), 0)
            this._cache.add('maxArtistValue', maxArtistValue);
        }
        return maxArtistValue;
    }

    public getMaxArtistAverageValue(): number {
        let maxArtistAverageValue: number = this._cache.get('maxArtistAverageValue');
        if (!Number.isFinite(maxArtistAverageValue)) {
            maxArtistAverageValue = this.artists.all.reduce((max, artist) => Math.max(max, artist.getAverageValue()), 0)
            this._cache.add('maxArtistAverageValue', maxArtistAverageValue);
        }
        return maxArtistAverageValue;
    }

    public getMaxArtistTotalValue(): number {
        let maxArtistTotalValue: number = this._cache.get('maxArtistTotalValue');
        if (!Number.isFinite(maxArtistTotalValue)) {
            maxArtistTotalValue = this.artists.all.reduce((max, artist) => Math.max(max, artist.getTotalValue()), 0)
            this._cache.add('maxArtistTotalValue', maxArtistTotalValue);
        }
        return maxArtistTotalValue;
    }

    public getMaxWeightedRating(): number {
        let maxWeightedRating: number = this._cache.get('maxWeightedRating');
        if (!Number.isFinite(maxWeightedRating)) {
            const likeCounts: Array<number> = this.getSongLikeCounts();
            maxWeightedRating = this.getSongStarWeights().reduce((result, element, index, array) => {
                const likeMultiplier: number = likeCounts[index] ? 2 : 1;
                const playSkipMultiplier: number = 1 + 1;
                return Math.max(result, array[index] * likeMultiplier * playSkipMultiplier);
            }, 0);
            this._cache.add('maxWeightedRating', maxWeightedRating);
        }
        return maxWeightedRating;
    }

    public getMinArtistValue(): number {
        let minArtistValue: number = this._cache.get('minArtistValue');
        if (!Number.isFinite(minArtistValue)) {
            minArtistValue = this.artists.all.reduce((min, artist) => Math.min(min, artist.getValue()), Number.MAX_SAFE_INTEGER)
            this._cache.add('minArtistValue', minArtistValue);
        }
        return minArtistValue;
    }

    public getMinArtistAverageValue(): number {
        let minArtistAverageValue: number = this._cache.get('minArtistAverageValue');
        if (!Number.isFinite(minArtistAverageValue)) {
            minArtistAverageValue = this.artists.all.reduce((min, artist) => Math.min(min, artist.getAverageValue()), Number.MAX_SAFE_INTEGER)
            this._cache.add('minArtistAverageValue', minArtistAverageValue);
        }
        return minArtistAverageValue;
    }

    public getMinArtistTotalValue(): number {
        let minArtistTotalValue: number = this._cache.get('minArtistTotalValue');
        if (!Number.isFinite(minArtistTotalValue)) {
            minArtistTotalValue = this.artists.all.reduce((min, artist) => Math.min(min, artist.getTotalValue()), Number.MAX_SAFE_INTEGER)
            this._cache.add('minArtistTotalValue', minArtistTotalValue);
        }
        return minArtistTotalValue;
    }

    public getMinPlayCount(): number {
        let minPlayCount: number = this._cache.get('minPlayCount');
        if (!Number.isFinite(minPlayCount)) {
            minPlayCount = this.songs.all.reduce((min, song) => Math.min(song.playCount, min), Number.MAX_SAFE_INTEGER);
            this._cache.add('maxPlayCount', minPlayCount);
        }
        return minPlayCount;
    }

    public getMinSkipCount(): number {
        let minSkipCount: number = this._cache.get('minSkipCount');
        if (!Number.isFinite(minSkipCount)) {
            minSkipCount = this.songs.all.reduce((min, song) => Math.min(song.skipCount, min), Number.MAX_SAFE_INTEGER);
            this._cache.add('minSkipCount', minSkipCount);
        }
        return minSkipCount;
    }

    public getMinSongValue(): number {
        let minSongValue: number = this._cache.get('minSongValue');
        if (!Number.isFinite(minSongValue)) {
            minSongValue = this.songs.all.reduce((min, song) => Math.min(min, song.value), Number.MAX_SAFE_INTEGER);
            this._cache.add('minSongValue', minSongValue);
        }
        return minSongValue;
    }

    public getMinWeightedRating(): number {
        let minWeightedRating: number = this._cache.get('minWeightedRating');
        if (!Number.isFinite(minWeightedRating)) {
            const dislikeCounts: Array<number> = this.getSongLikeCounts();
            minWeightedRating = this.getSongStarWeights().reduce((result, element, index, array) => {
                const dislikeMultiplier: number = dislikeCounts[index] ? 0.5 : 1;
                const playSkipMultiplier: number = 1 + 1;
                return Math.min(result, array[index] * dislikeMultiplier * playSkipMultiplier);
            }, 0);
            this._cache.add('minWeightedRating', minWeightedRating);
        }
        return minWeightedRating;
    }

    public getSongLikeCounts(): Array<number> {
        let songLikeCounts: Array<number> = this._cache.get('songLikeCounts');
        if (!songLikeCounts) {
            songLikeCounts = this.songs.all.reduce((likeCounts, song) => {
                if (song.isLiked()) {
                    const countIndex: number = song.rating - 1;
                    likeCounts[countIndex] = likeCounts[countIndex] || 0;
                    likeCounts[countIndex]++;
                }
                return likeCounts;
            }, Globals.newStarArray());
            this._cache.add('songLikeCounts', songLikeCounts);
        }
        return songLikeCounts;
    }

    public getSongDislikeCounts(): Array<number> {
        let songDislikeCounts: Array<number> = this._cache.get('songDislikeCounts');
        if (!songDislikeCounts) {
            songDislikeCounts = this.songs.all.reduce((dislikeCounts, song) => {
                if (song.isDisliked()) {
                    const countIndex: number = song.rating - 1;
                    songDislikeCounts[countIndex] = songDislikeCounts[countIndex] || 0;
                    songDislikeCounts[countIndex]++;
                }
                return dislikeCounts;
            }, Globals.newStarArray());
            this._cache.add('songDislikeCounts', songDislikeCounts);
        }
        return songDislikeCounts;
    }

    public getSongStarCounts(): Array<number> {
        let songStarCounts: Array<number> = this._cache.get('songStarCounts');
        if (!songStarCounts) {
            songStarCounts = this.songs.all.reduce((starCounts, song) => {
                if (song.isRated()) {
                    const starIndex: number = song.rating - 1;
                    starCounts[starIndex] = starCounts[starIndex] || 0;
                    starCounts[starIndex]++;
                }
                return starCounts;
            }, Globals.newStarArray());
            this._cache.add('songStarCounts', songStarCounts);
        }
        return songStarCounts;
    }

    public getSongStarWeights(): Array<number> {
        let songStarWeights: Array<number> = this._cache.get('songStarWeights');
        if (!songStarWeights) {
            const songStarCounts: Array<number> = this.getSongStarCounts();
            songStarWeights = Globals.newStarArray();
            for (let i = 0; i < Globals.maxRating; i++) {
                if (i < 2) {
                    songStarWeights[i] = i + 1;
                } else {
                    if (songStarCounts[i]) {
                        const previousStarWeight: number = songStarWeights[i - 1];
                        const currentStarMultiplier: number = songStarCounts[i - 1] / songStarCounts[i];
                        songStarWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, i + 1);
                    }
                }
            }
            this._cache.add('songStarWeights', songStarWeights);
        }
        return songStarWeights;
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _rank(): void {
        this.artists.all.sort((a, b) => (Settings.useRelativeRatingsForArtists) ? b.ranking - a.ranking : b.ranking - a.ranking);
        this.artists.all.forEach(artist => artist.albums.sort((a, b) => (Settings.useRelativeRatingsForAlbums) ? b.value - a.value : b.ranking - a.ranking));
        this.albums.all.sort((a, b) => (Settings.useRelativeRatingsForAlbums) ? b.value - a.value : b.ranking - a.ranking);
        this.songs.all.sort((a, b) => (Settings.useRelativeRatingsForSongs) ? b.value - a.value : b.ranking - a.ranking);

    }

} // End class Library