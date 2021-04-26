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
    const searchWord = req.query.params;
    if (req.query.params === "") {
        res.send([[], [], [], []]);
    }
    else {
        try {
            const [songs] = yield getSearch('Song', searchWord);
            const [artists] = yield getSearch('Artist', searchWord);
            const [albums] = yield getSearch('Album', searchWord);
            const [users] = yield getSearch('User', searchWord);
            res.send([songs, artists, albums, users]);
        }
        catch (err) {
            res.send(err.message);
        }
    }
}));
const getSearch = (key, word) => __awaiter(void 0, void 0, void 0, function* () {
    word = word.toLowerCase();
    word = word.charAt(0).toUpperCase() + word.slice(1);
    const newWord = word.replace(word.charAt(word.length - 1), word.charAt(word.length - 1) + 'z');
    const query = datastore.createQuery(key)
        .filter(key === 'Song' ? 'title' : 'name', '>', word)
        .filter(key === 'Song' ? 'title' : 'name', '<=', newWord)
        .limit(3);
    return datastore.runQuery(query);
});
module.exports = router;
