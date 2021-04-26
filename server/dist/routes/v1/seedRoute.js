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
const Songs = require('../../datastore/songs');
const Artists = require('../../datastore/artists');
const Albums = require('../../datastore/albums');
const Playlists = require('../../datastore/playlists');
const Users = require('../../datastore/users');
const insertData = (data, key) => __awaiter(void 0, void 0, void 0, function* () {
    const Key = datastore.key([key, data.id]);
    return datastore.save({
        key: Key,
        data: data,
    });
});
router.post('/all', (req, res) => {
    try {
        Promise.all(Songs.map((song) => __awaiter(void 0, void 0, void 0, function* () {
            yield insertData(song, 'Song');
        })));
        Artists.forEach((artist) => __awaiter(void 0, void 0, void 0, function* () {
            yield insertData(artist, 'Artist');
        }));
        Albums.forEach((album) => __awaiter(void 0, void 0, void 0, function* () {
            yield insertData(album, 'Album');
        }));
        Playlists.forEach((playlist) => __awaiter(void 0, void 0, void 0, function* () {
            yield insertData(playlist, 'Playlist');
        }));
        Users.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
            yield insertData(user, 'User');
        }));
        res.send('all seed updated');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});
module.exports = router;
