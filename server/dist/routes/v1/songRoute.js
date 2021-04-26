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
        const [allSongs] = yield getSongs();
        res.send(allSongs);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.get('/:songId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { songId } = req.params;
    try {
        const song = yield getSong(Number(songId));
        res.send(song);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.patch('/:songId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { songId } = req.params;
    const { like } = req.body;
    try {
        const songKey = datastore.key(['Song', Number(songId)]);
        const [song] = yield datastore.get(songKey);
        if (like === 'like') {
            song.likes ? song.likes = song.likes + 1 : song.likes = 1;
        }
        else if (like === 'unlike') {
            song.likes ? song.likes = song.likes - 1 : song.likes = 0;
        }
        else {
            song.playCount ? song.playCount = song.playCount + 1 : song.playCount = 1;
        }
        const entity = {
            key: songKey,
            data: song,
        };
        yield datastore.update(entity);
        res.send(entity);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
const getSongs = () => {
    const query = datastore.createQuery('Song');
    return datastore.runQuery(query);
};
const getSong = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore.createQuery('Song').filter('id', '=', Number(id));
    const [song] = yield datastore.runQuery(query);
    if (song) {
        const artistQuery = datastore.createQuery('Artist').filter('id', '=', Number(song[0].artistId));
        const [artist] = yield datastore.runQuery(artistQuery);
        const albumQuery = datastore.createQuery('Album').filter('id', '=', Number(song[0].albumId));
        const [album] = yield datastore.runQuery(albumQuery);
        return { song: song[0], artist: artist[0], album: album[0] };
    }
});
module.exports = router;
