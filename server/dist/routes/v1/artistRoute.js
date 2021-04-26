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
        const [allArtists] = yield getArtists();
        res.send(allArtists);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.get('/:artistId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId } = req.params;
    try {
        const artist = yield getArtist(Number(artistId));
        res.send(artist);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.patch('/:artistId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artistId } = req.params;
    const { like } = req.body;
    try {
        const artistKey = datastore.key(['Artist', Number(artistId)]);
        const [artist] = yield datastore.get(artistKey);
        if (like === 'like') {
            artist.likes ? artist.likes = artist.likes + 1 : artist.likes = 1;
        }
        else if (like === 'unlike') {
            artist.likes ? artist.likes = artist.likes - 1 : artist.likes = 0;
        }
        const entity = {
            key: artistKey,
            data: artist,
        };
        yield datastore.update(entity);
        res.send(entity);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
const getArtists = () => {
    const query = datastore.createQuery('Artist');
    return datastore.runQuery(query);
};
const getArtist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore.createQuery('Artist').filter('id', '=', Number(id));
    const [artist] = yield datastore.runQuery(query);
    const songQuery = datastore.createQuery('Song').filter('artistId', '=', Number(id));
    const [songs] = yield datastore.runQuery(songQuery);
    const albumQuery = datastore.createQuery('Album').filter('artistId', '=', Number(id));
    const [albums] = yield datastore.runQuery(albumQuery);
    return { artist: artist[0], songs, albums };
});
module.exports = router;
