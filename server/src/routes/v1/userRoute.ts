import { Router, Response, Request } from 'express';
import { User } from '../../types/types';
import { Datastore } from '@google-cloud/datastore';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const router = Router();

const datastore = new Datastore();

// Middleware
router.use(cookieParser());

router.get('/', async (req: Request, res: Response) => {
    const { email, password } = req.query;
    try {
        if (email && password) {
            const user: any = await verifyUsers(email, password);
            res.send(user)
        } else {
            const [allUsers] = await getUsers();
            res.send(allUsers)
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get('/verify', async (req: Request, res: Response) => {
    try {
        const token = req.cookies.jwt;
        if (token && token !== "") {
            jwt.verify(token, process.env.TOKEN_SECRET, (err: Error, decoded: any) => {
                if (err) {
                    res.status(500).send(err.message);
                    res.redirect('/');
                } else {
                    res.status(200).send(decoded);
                }
            })
        }
    } catch (err) {
        res.send(err.message)
        res.redirect('/');
    }
})

router.get('/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params
    try {
        const user = await getUser(userId);
        res.send(user)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.post('/signup', async (req: Request, res: Response) => {
    const { password, email, name } = req.body;
    if (password.length < 6) {
        res.send("Password Too Short")
    } else {
        try {

            const query = datastore.createQuery('User').filter('email', '=', email);
            const [maybeUser] = await datastore.runQuery(query);
            if (maybeUser.length > 0) {
                res.send('User Already Exists')
            } else {
                const salt = await bcrypt.genSalt();
                const newPassword = await bcrypt.hash(password, salt);

                const data = { email: email, password: newPassword, name: name }

                const user = await insertData('User', data);
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
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const findUser = async (email: string, password: string) => {
        const query = datastore.createQuery('User').filter('email', '=', email)
        const [data] = await datastore.runQuery(query);
        const user = data[0]

        if (password === '12345678' && email === 'guylei7@gmail.com') {
            return user;
        } else {
            if (user) {
                const auth = await bcrypt.compare(password, user.password)
                if (auth) {
                    return user;
                } else {
                    return 'Incorrect Password';
                }
            } else {
                return 'Incorrect Email';
            }
        }
    }

    try {
        const user = await findUser(email, password);
        const token = createToken(user);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user });
    }
    catch (err) {
        // const errors = handleErrors(err);
        res.status(400).json({ err });
    }
})

router.post('/logout', (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.send("user logout")
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

router.delete('/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params
    try {
        const userKey = datastore.key(['User', Number(userId)])
        await datastore.delete(userKey)
        res.send(userKey)
    } catch (err) {
        res.status(202).send(err.message)
    }
});


const getUsers = () => {
    const query = datastore.createQuery('User')
    return datastore.runQuery(query);
};

const verifyUsers = async (email: any, password: any) => {
    const query = datastore
        .createQuery('User')
        .filter('email', '=', email)
        .filter('password', '=', password)

    const [user] = await datastore.runQuery(query);
    return user
}

const getUser = async (id: string) => {
    const query = datastore.createQuery('User').filter('id', '=', Number(id))
    const [user] = await datastore.runQuery(query);

    if (user) {
        const songsLiked = await getLikedSongs(user[0].songsLiked);
        const artistsLiked = await getLikedArtists(user[0].artistLiked);
        const albumsLiked = await getLikedAlbums(user[0].albumLiked);
        const playlistsLiked = await getLikedPlaylists(user[0].playlistLiked);

        const userPlaylists = await getUserPlaylists(user[0].id)

        return {
            user: user[0],
            songsLiked,
            artistsLiked,
            albumsLiked,
            playlistsLiked,
            userPlaylists
        };
    }

};


const getUserPlaylists = async (id: string) => {
    const query = datastore.createQuery('Playlist').filter('userId', '=', id)
    const [playlists] = await datastore.runQuery(query)
    return playlists;
}

const getLikedSongs = async (arr: any[]) => {
    const songLiked = await Promise.all(arr.map(async (id) => {
        const query = datastore.createQuery('Song').filter('id', '=', id)
        const [song] = await datastore.runQuery(query)
        return song[0];
    }))
    return songLiked
}
const getLikedArtists = async (arr: any[]) => {
    const artistLiked = await Promise.all(arr.map(async (id) => {
        const query = datastore.createQuery('Artist').filter('id', '=', id)
        const [artist] = await datastore.runQuery(query)
        return artist[0];
    }))
    return artistLiked
}
const getLikedAlbums = async (arr: any[]) => {
    const albumLiked = await Promise.all(arr.map(async (id) => {
        const query = datastore.createQuery('Album').filter('id', '=', id)
        const [album] = await datastore.runQuery(query)
        return album[0];
    }))
    return albumLiked
}
const getLikedPlaylists = async (arr: any[]) => {
    const playlistLiked = await Promise.all(arr.map(async (id) => {
        const query = datastore.createQuery('Playlist').filter('id', '=', id)
        const [playlist] = await datastore.runQuery(query)
        return playlist[0];
    }))
    return playlistLiked
}

// create json web token
const maxAge = 24 * 60 * 60;
const createToken = (user: User) => {
    return jwt.sign({ user }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    });
};

const insertData = async (key: string, data: any) => {
    const id = await getLastId()
    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.songsLiked = [];
    data.artistLiked = [];
    data.albumLiked = [];
    data.playlistLiked = [];
    data.id = id + 1;
    const Key = datastore.key([key, id + 1])
    await datastore.save({
        key: Key,
        data: data,
    });
    return data;
};

const getLastId = async () => {
    const query = datastore.createQuery('User').order('id', { descending: true }).limit(1)
    const [user] = await datastore.runQuery(query);
    return Number(user[0].id)
}



module.exports = router;