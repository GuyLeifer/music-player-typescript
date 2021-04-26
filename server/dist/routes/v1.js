"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.use('/v1/songs', require('./v1/songRoute'));
router.use('/v1/artists', require('./v1/artistRoute'));
router.use('/v1/albums', require('./v1/albumRoute'));
router.use('/v1/playlists', require('./v1/playlistRoute'));
router.use('/v1/users', require('./v1/userRoute'));
// router.use('/v1/seed', require('./v1/seedRoute'));
router.use('/v1/top', require('./v1/topRoute'));
router.use('/v1/search', require('./v1/searchRoute'));
router.use('/v1', (req, res) => {
    res.send('you are at api v1 route');
});
router.use('/', (req, res) => {
    res.send('you are at api route');
});
module.exports = router;
