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
        const [allAlbums] = yield getAlbums();
        res.send(allAlbums);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.get('/:albumId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    try {
        const album = yield getAlbum(Number(albumId));
        res.send(album);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.patch('/:albumId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    const { like } = req.body;
    try {
        const albumKey = datastore.key(['Album', Number(albumId)]);
        const [album] = yield datastore.get(albumKey);
        if (like === 'like') {
            album.likes ? album.likes = album.likes + 1 : album.likes = 1;
        }
        else if (like === 'unlike') {
            album.likes ? album.likes = album.likes - 1 : album.likes = 0;
        }
        const entity = {
            key: albumKey,
            data: album,
        };
        yield datastore.update(entity);
        res.send(entity);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
const getAlbums = () => {
    const query = datastore.createQuery('Album');
    return datastore.runQuery(query);
};
const getAlbum = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore.createQuery('Album').filter('id', '=', Number(id));
    const [album] = yield datastore.runQuery(query);
    const songQuery = datastore.createQuery('Song').filter('albumId', '=', Number(id));
    const [songs] = yield datastore.runQuery(songQuery);
    const artistQuery = datastore.createQuery('Artist').filter('id', '=', Number(album[0].id));
    const [artist] = yield datastore.runQuery(artistQuery);
    return { album: album[0], artist: artist[0], songs };
});
module.exports = router;
