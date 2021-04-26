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
        const [allPlaylists] = yield getPlaylists();
        res.send(allPlaylists);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.get('/by-user/:userId&:songId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, songId } = req.params;
    try {
        const query = datastore.createQuery('Playlist').filter('userId', '=', Number(userId));
        const [playlists] = yield datastore.runQuery(query);
        const filteredPlaylists = playlists.filter((playlist) => !playlist.songs.find((song) => Number(song) === Number(songId)));
        res.send(filteredPlaylists);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.get('/:playlistId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId } = req.params;
    try {
        const playlist = yield getPlaylist(Number(playlistId));
        res.send(playlist);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, name, coverImg } = req.body;
    try {
        const id = yield getLastId();
        const data = { id: id + 1, userId: userId, name: name, coverImg: coverImg, createdAt: new Date(), updatedAt: new Date(), songs: [], likes: 0 };
        yield insertData(data, 'Playlist');
        res.send(data);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.patch('/:playlistId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId } = req.params;
    const { like, songId } = req.body;
    try {
        const playlistKey = datastore.key(['Playlist', Number(playlistId)]);
        const [playlist] = yield datastore.get(playlistKey);
        if (like === 'like') {
            playlist.likes ? playlist.likes = playlist.likes + 1 : playlist.likes = 1;
        }
        else if (like === 'unlike') {
            playlist.likes ? playlist.likes = playlist.likes - 1 : playlist.likes = 0;
        }
        else if (songId) {
            playlist.songs.push(Number(songId));
        }
        const entity = {
            key: playlistKey,
            data: playlist,
        };
        yield datastore.update(entity);
        res.send(entity);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.delete('/:playlistId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId } = req.params;
    try {
        const query = datastore.createQuery('Playlist').filter('id', '=', Number(playlistId));
        const playlist = yield datastore.runQuery(query);
        res.send(playlist);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
const insertData = (data, key) => __awaiter(void 0, void 0, void 0, function* () {
    return datastore.insert({
        key: datastore.key(key),
        data: data,
    });
});
const getLastId = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore.createQuery('Playlist').order('id', { descending: true }).limit(1);
    const [playlist] = yield datastore.runQuery(query);
    return Number(playlist[0].id);
});
const getPlaylists = () => {
    const query = datastore.createQuery('Playlist');
    return datastore.runQuery(query);
};
const getPlaylist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore.createQuery('Playlist').filter('id', '=', Number(id));
    const [playlist] = yield datastore.runQuery(query);
    const songs = yield getSongs(playlist[0].songs);
    return { playlist: playlist[0], songs };
});
const getSongs = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield Promise.all(arr.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const query = datastore.createQuery('Song').filter('id', '=', Number(id));
        const [song] = yield datastore.runQuery(query);
        return song[0];
    })));
    return songs;
});
module.exports = router;
