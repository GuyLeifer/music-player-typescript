"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { Datastore } = require('@google-cloud/datastore');
const router = express_1.Router();
const datastore = new Datastore();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [topLikesSongs] = yield topLikes('Song');
        const [topPlayedSongs] = yield topPlayed('Song');
        const [topNewSongs] = yield topNews('Song');
        const songs = [topLikesSongs, topPlayedSongs, topNewSongs];
        const [topLikesArtists] = yield topLikes('Artist');
        const topPlayedArtists = yield topPlayed('Artist');
        const [topNewArtists] = yield topNews('Artist');
        const artists = [topLikesArtists, topPlayedArtists, topNewArtists];
        const [topLikesAlbums] = yield topLikes('Album');
        const topPlayedAlbums = yield topPlayed('Album');
        const [topNewAlbums] = yield topNews('Album');
        const albums = [topLikesAlbums, topPlayedAlbums, topNewAlbums];
        const [topLikesPlaylists] = yield topLikes('Playlist');
        const topPlayedPlaylists = yield topPlayed('Playlist');
        const [topNewPlaylists] = yield topNews('Playlist');
        const playlists = [topLikesPlaylists, topPlayedPlaylists, topNewPlaylists];
        res.send([songs, artists, albums, playlists]);
    }
    catch (err) {
        console.log(err);
        res.status(200).send(err.message);
    }
}));
router.get('/play', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [song] = yield topPlayed('Song');
        const artist = yield topPlayed('Artist');
        const album = yield topPlayed('Album');
        const playlist = yield topPlayed('Playlist');
        res.send([song, artist, album, playlist]);
    }
    catch (err) {
        res.send(err.message);
    }
}));
const topLikes = (key) => {
    const query = datastore
        .createQuery(key)
        .order('likes', { descending: true })
        .limit(20);
    return datastore.runQuery(query);
};
const topPlayed = (key) => __awaiter(void 0, void 0, void 0, function* () {
    if (key === 'Song') {
        const query = datastore
            .createQuery(key)
            .order('playCount', { descending: true })
            .limit(20);
        return datastore.runQuery(query);
    }
    else if (key === 'Playlist') {
        const query = datastore.createQuery(key);
        const [data] = yield datastore.runQuery(query);
        const summed = yield Promise.all(data.map((playlist) => __awaiter(void 0, void 0, void 0, function* () {
            let sum = 0;
            yield Promise.all(playlist.songs.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
                const songQuery = datastore.createQuery('Song').filter('id', '=', Number(obj));
                const [song] = yield datastore.runQuery(songQuery);
                if (song[0].hasOwnProperty('playCount') && song[0].playCount) {
                    sum = sum + song[0].playCount;
                }
            })));
            return { playlistId: playlist.id, sum };
        })));
        const sorted = summed.sort(compare).slice(0, 21);
        const topPlayedArtists = yield Promise.all(sorted.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
            const topPlayedQuery = datastore.createQuery('Playlist').filter('id', '=', Number(obj.playlistId));
            const [playlist] = yield datastore.runQuery(topPlayedQuery);
            return playlist[0];
        })));
        return topPlayedArtists;
    }
    else {
        const query = datastore.createQuery('Song').filter('playCount', '>', 0);
        const [data] = yield datastore.runQuery(query);
        let summed;
        let arrSummed = [];
        if (key === 'Artist') {
            summed = data.sort((song) => song.artistId).forEach((song) => {
                if (arrSummed.find(obj => obj.artistId === song.artistId)) {
                    arrSummed.find(obj => obj.artistId === song.artistId).sum += song.playCount;
                }
                else {
                    arrSummed.push({ artistId: song.artistId, sum: song.playCount });
                }
            });
            const sorted = arrSummed.sort(compare).slice(0, 21);
            const topPlayedArtists = yield Promise.all(sorted.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
                const topPlayedQuery = datastore.createQuery('Artist').filter('id', '=', Number(obj.artistId));
                const [artist] = yield datastore.runQuery(topPlayedQuery);
                return artist[0];
            })));
            return topPlayedArtists;
        }
        else if (key === 'Album') {
            summed = data.sort((song) => song.albumId).forEach((song) => {
                if (arrSummed.find(obj => obj.albumId === song.albumId)) {
                    arrSummed.find(obj => obj.albumId === song.albumId).sum += song.playCount;
                }
                else {
                    arrSummed.push({ albumId: song.albumId, sum: song.playCount });
                }
            });
            const sorted = arrSummed.sort(compare).slice(0, 21);
            const topPlayedAlbums = yield Promise.all(sorted.map((obj) => __awaiter(void 0, void 0, void 0, function* () {
                const topPlayedQuery = datastore.createQuery('Album').filter('id', '=', Number(obj.albumId));
                const [album] = yield datastore.runQuery(topPlayedQuery);
                return album[0];
            })));
            return topPlayedAlbums;
        }
    }
});
const topNews = (key) => {
    const query = datastore
        .createQuery(key)
        .order('createdAt', { descending: true })
        .limit(20);
    return datastore.runQuery(query);
};
function compare(a, b) {
    if (b.sum < a.sum) {
        return -1;
    }
    if (b.sum > a.sum) {
        return 1;
    }
    return 0;
}
const artistQuery = (id) => {
    const query = datastore
        .createQuery('Artist')
        .filter('id', '=', id);
    return datastore.runQuery(query);
};
const albumQuery = (id) => {
    const query = datastore
        .createQuery('Album')
        .filter('id', '=', id);
    return datastore.runQuery(query);
};
module.exports = router;
