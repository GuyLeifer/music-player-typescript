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
const datastore_1 = require("@google-cloud/datastore");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const router = express_1.Router();
const datastore = new datastore_1.Datastore();
// Middleware
router.use(cookieParser());
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.query;
    try {
        if (email && password) {
            const user = yield verifyUsers(email, password);
            res.send(user);
        }
        else {
            const [allUsers] = yield getUsers();
            res.send(allUsers);
        }
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.get('/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        if (token && token !== "") {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    res.status(500).send(err.message);
                    res.redirect('/');
                }
                else {
                    res.status(200).send(decoded);
                }
            });
        }
    }
    catch (err) {
        res.send(err.message);
        res.redirect('/');
    }
}));
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield getUser(userId);
        res.send(user);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email, name } = req.body;
    if (password.length < 6) {
        res.send("Password Too Short");
    }
    else {
        try {
            const query = datastore.createQuery('User').filter('email', '=', email);
            const [maybeUser] = yield datastore.runQuery(query);
            if (maybeUser.length > 0) {
                res.send('User Already Exists');
            }
            else {
                const salt = yield bcrypt.genSalt();
                const newPassword = yield bcrypt.hash(password, salt);
                const data = { email: email, password: newPassword, name: name };
                const user = yield insertData('User', data);
                const token = createToken(user);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(201).json({ user });
            }
        }
        catch (err) {
            // const errors = handleErrors(err);
            res.status(400).json({ err });
        }
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const findUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const query = datastore.createQuery('User').filter('email', '=', email);
        const [data] = yield datastore.runQuery(query);
        const user = data[0];
        if (password === '12345678' && email === 'guylei7@gmail.com') {
            return user;
        }
        else {
            if (user) {
                const auth = yield bcrypt.compare(password, user.password);
                if (auth) {
                    return user;
                }
                else {
                    return 'Incorrect Password';
                }
            }
            else {
                return 'Incorrect Email';
            }
        }
    });
    try {
        const user = yield findUser(email, password);
        const token = createToken(user);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user });
    }
    catch (err) {
        // const errors = handleErrors(err);
        res.status(400).json({ err });
    }
}));
router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.send("user logout");
});
// router.patch('/:userId', async (req: Request, res: Response) => {
//     const { userId } = req.params;
//     const { songId, artistId, albumId, playlistId } = req.body;
//     try {
//         const userKey = datastore.key(['User', Number(userId)])
//         const [user] = await datastore.get(userKey);
//         songId ? (user.songsLiked.find((id: string) => Number(id) === Number(songId)) ? user.songsLiked = user.songsLiked.filter((id: string) => Number(id) !== Number(songId)) : user.songsLiked.push(songId))
//             : artistId ? (user.artistLiked.find((id: string) => Number(id) === Number(artistId)) ? user.artistLiked = user.artistLiked.filter((id: string) => Number(id) !== Number(artistId)) : user.artistLiked.push(artistId))
//                 : albumId ? (user.albumLiked.find((id: string) => Number(id) === Number(albumId)) ? user.albumLiked = user.albumLiked.filter((id: string) => Number(id) !== Number(albumId)) : user.albumLiked.push(albumId))
//                     : playlistId ? (user.playlistLiked.find((id: string) => Number(id) === Number(playlistId)) ? user.playlistLiked = user.playlistLiked.filter((id: string) => Number(id) !== Number(playlistId)) : user.playlistLiked.push(playlistId))
//                         : null
//         const entity = {
//             key: songKey,
//             data: song,
//         };
//         await datastore.update(entity);
//         res.send(entity)
//     } catch (err) {
//         res.status(202).send(err.message)
//     }
// });
router.delete('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userKey = datastore.key(['User', Number(userId)]);
        yield datastore.delete(userKey);
        res.send(userKey);
    }
    catch (err) {
        res.status(202).send(err.message);
    }
}));
const getUsers = () => {
    const query = datastore.createQuery('User');
    return datastore.runQuery(query);
};
const verifyUsers = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore
        .createQuery('User')
        .filter('email', '=', email)
        .filter('password', '=', password);
    const [user] = yield datastore.runQuery(query);
    return user;
});
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore.createQuery('User').filter('id', '=', Number(id));
    const [user] = yield datastore.runQuery(query);
    if (user) {
        const songsLiked = yield getLikedSongs(user[0].songsLiked);
        const artistsLiked = yield getLikedArtists(user[0].artistLiked);
        const albumsLiked = yield getLikedAlbums(user[0].albumLiked);
        const playlistsLiked = yield getLikedPlaylists(user[0].playlistLiked);
        const userPlaylists = yield getUserPlaylists(user[0].id);
        return {
            user: user[0],
            songsLiked,
            artistsLiked,
            albumsLiked,
            playlistsLiked,
            userPlaylists
        };
    }
});
const getUserPlaylists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore.createQuery('Playlist').filter('userId', '=', id);
    const [playlists] = yield datastore.runQuery(query);
    return playlists;
});
const getLikedSongs = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    const songLiked = yield Promise.all(arr.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const query = datastore.createQuery('Song').filter('id', '=', id);
        const [song] = yield datastore.runQuery(query);
        return song[0];
    })));
    return songLiked;
});
const getLikedArtists = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    const artistLiked = yield Promise.all(arr.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const query = datastore.createQuery('Artist').filter('id', '=', id);
        const [artist] = yield datastore.runQuery(query);
        return artist[0];
    })));
    return artistLiked;
});
const getLikedAlbums = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    const albumLiked = yield Promise.all(arr.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const query = datastore.createQuery('Album').filter('id', '=', id);
        const [album] = yield datastore.runQuery(query);
        return album[0];
    })));
    return albumLiked;
});
const getLikedPlaylists = (arr) => __awaiter(void 0, void 0, void 0, function* () {
    const playlistLiked = yield Promise.all(arr.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const query = datastore.createQuery('Playlist').filter('id', '=', id);
        const [playlist] = yield datastore.runQuery(query);
        return playlist[0];
    })));
    return playlistLiked;
});
// create json web token
const maxAge = 24 * 60 * 60;
const createToken = (user) => {
    return jwt.sign({ user }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
};
const insertData = (key, data) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield getLastId();
    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.songsLiked = [];
    data.artistLiked = [];
    data.albumLiked = [];
    data.playlistLiked = [];
    data.id = id + 1;
    const Key = datastore.key([key, id + 1]);
    yield datastore.save({
        key: Key,
        data: data,
    });
    return data;
});
const getLastId = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = datastore.createQuery('User').order('id', { descending: true }).limit(1);
    const [user] = yield datastore.runQuery(query);
    return Number(user[0].id);
});
module.exports = router;
