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
            const albumName = track['Album'];
            const artistName = track['Artist'];
            const discNumber = +track['Disc Number'] || 1;
            const trackId: string = track['Track ID'];
            const trackNumber = +track['Track Number'];

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
        json['Playlists'].forEach(jsonPlaylist => {
            if (!(jsonPlaylist['Folder'] || jsonPlaylist['Name'] === 'Downloaded')) { // TODO: Add support for Folders and Downloaded Content
                const name = jsonPlaylist['Name'];
                const playlist = new Playlist(jsonPlaylist);
                playlist.library = this;

                if (jsonPlaylist['Playlist Items']) {
                    jsonPlaylist['Playlist Items'].forEach(item => {
                        const itemId = item['Track ID'];
                        const song = songs[itemId];
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
        let albumStarCounts = this._cache.get('albumStarCounts')
        if (!albumStarCounts) {
            albumStarCounts = this.albums.all.reduce((starCounts, album) => {
                if (album.isRated()) {
                    const starIndex = album.rating - 1;
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
        let albumStarWeights = this._cache.get('albumStarWeights');
        if (!albumStarWeights) {
            const albumStarCounts = this.getAlbumStarCounts();
            albumStarWeights = Globals.newStarArray();
            for (let i = 2; i < Globals.maxRating; i++) {
                if (albumStarCounts[i]) {
                    const previousStarWeight = albumStarWeights[i - 1];
                    const currentStarMultiplier = albumStarCounts[i - 1] / albumStarCounts[i] || 1;
                    albumStarWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, i + 1);
                }
            }
            this._cache.add('albumStarWeights', albumStarWeights);
        }
        return albumStarWeights;
    }

    public getMaxPlayCount(): number {
        let maxPlayCount = this._cache.get('maxPlayCount');
        if (!Number.isFinite(maxPlayCount)) {
            maxPlayCount = this.songs.all.reduce((max, song) => Math.max(song.playCount, max), 0);
            this._cache.add('maxPlayCount', maxPlayCount);
        }
        return maxPlayCount;
    }

    public getMaxSkipCount(): number {
        let maxSkipCount = this._cache.get('maxSkipCount');
        if (!Number.isFinite(maxSkipCount)) {
            maxSkipCount = this.songs.all.reduce((max, song) => Math.max(song.skipCount, max), 0);
            this._cache.add('maxSkipCount', maxSkipCount);
        }
        return maxSkipCount;
    }

    public getMaxWeightedRating(): number {
        let maxWeightedRating = this._cache.get('maxWeightedRating');
        if (!Number.isFinite(maxWeightedRating)) {
            const likeCounts = this.getSongLikeCounts
            maxWeightedRating = this.getSongStarWeights().reduce((result, element, index, array) => {
                const likeMultiplier = likeCounts[index] ? 2 : 1;
                const playSkipMultiplier = 1 + 1;
                return Math.max(result, array[index] * likeMultiplier * playSkipMultiplier);
            }, 0);
            this._cache.add('maxWeightedRating', maxWeightedRating);
        }
        return maxWeightedRating;
    }

    public getMinPlayCount(): number {
        let minPlayCount = this._cache.get('minPlayCount');
        if (!Number.isFinite(minPlayCount)) {
            minPlayCount = this.songs.all.reduce((min, song) => Math.min(song.playCount, min), Number.MAX_SAFE_INTEGER);
            this._cache.add('maxPlayCount', minPlayCount);
        }
        return minPlayCount;
    }

    public getMinSkipCount(): number {
        let minSkipCount = this._cache.get('minSkipCount');
        if (!Number.isFinite(minSkipCount)) {
            minSkipCount = this.songs.all.reduce((min, song) => Math.min(song.skipCount, min), Number.MAX_SAFE_INTEGER);
            this._cache.add('minSkipCount', minSkipCount);
        }
        return minSkipCount;
    }

    public getMinWeightedRating(): number {
        let minWeightedRating = this._cache.get('minWeightedRating');
        if (!Number.isFinite(minWeightedRating)) {
            const dislikeCounts = this.getSongLikeCounts
            minWeightedRating = this.getSongStarWeights().reduce((result, element, index, array) => {
                const dislikeMultiplier = dislikeCounts[index] ? 0.5 : 1;
                const playSkipMultiplier = 1 + 1;
                return Math.min(result, array[index] * dislikeMultiplier * playSkipMultiplier);
            }, 0);
            this._cache.add('minWeightedRating', minWeightedRating);
        }
        return minWeightedRating;
    }

    public getSongStarCounts(): Array<number> {
        let songStarCounts = this._cache.get('songStarCounts');
        if (!songStarCounts) {
            songStarCounts = this.songs.all.reduce((starCounts, song) => {
                if (song.isRated()) {
                    const starIndex = song.rating - 1;
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
        let songStarWeights = this._cache.get('songStarWeights');
        if (!songStarWeights) {
            const songStarCounts = this.getSongStarCounts();
            songStarWeights = Globals.newStarArray();
            for (let i = 2; i < Globals.maxRating; i++) {
                if (songStarCounts[i]) {
                    const previousStarWeight = songStarWeights[i - 1];
                    const currentStarMultiplier = songStarCounts[i - 1] / songStarCounts[i];
                    songStarWeights[i] = Math.max(previousStarWeight * currentStarMultiplier, i + 1);
                }
            }
            this._cache.add('songStarWeights', songStarWeights);
        }
        return songStarWeights;
    }

    public getSongLikeCounts(): Array<number> {
        let songLikeCounts = this._cache.get('songLikeCounts');
        if (!songLikeCounts) {
            songLikeCounts = this.songs.all.reduce((likeCounts, song) => {
                if (song.isLiked()) {
                    const countIndex = song.rating - 1;
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
        let songDislikeCounts = this._cache.get('songDislikeCounts');
        if (!songDislikeCounts) {
            songDislikeCounts = this.songs.all.reduce((dislikeCounts, song) => {
                if (song.isDisliked()) {
                    const countIndex = song.rating - 1;
                    songDislikeCounts[countIndex] = songDislikeCounts[countIndex] || 0;
                    songDislikeCounts[countIndex]++;
                }
                return dislikeCounts;
            }, Globals.newStarArray());
            this._cache.add('songDislikeCounts', songDislikeCounts);
        }
        return songDislikeCounts;
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _rank(): void {
        this.artists.all.sort((a, b) => (Settings.useRelativeRatingsForArtists) ? b.value - a.value : b.ranking - a.ranking);
        this.artists.all.forEach(artist => artist.albums.sort((a, b) => (Settings.useRelativeRatingsForAlbums) ? b.value - a.value : b.ranking - a.ranking));
        this.albums.all.sort((a, b) => (Settings.useRelativeRatingsForAlbums) ? b.value - a.value : b.ranking - a.ranking);
        this.songs.all.sort((a, b) => (Settings.useRelativeRatingsForSongs) ? b.value - a.value : b.ranking - a.ranking);

    }

} // End class Library