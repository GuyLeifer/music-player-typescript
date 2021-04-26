import { Router, Response, Request } from 'express';
import { Song, Artist, Album, Playlist, User } from '../../types/types';
const { Datastore } = require('@google-cloud/datastore');
const router = Router();

const datastore = new Datastore();
const Songs: Song[] = require('../../../datastore/songs')
const Artists: Artist[] = require('../../../datastore/artists')
const Albums: Album[] = require('../../../datastore/albums')
const Playlists: Playlist[] = require('../../../datastore/playlists')
const Users: User[] = require('../../../datastore/users')

const insertData = async (data: Song | Artist | Album | Playlist | User, key: string) => {
    const Key = datastore.key([key, data.id!])
    return datastore.save({
        key: Key,
        data: data,
        excludeFromIndexes: true
    });
};

router.post('/all', (req: Request, res: Response) => {
    try {
        Promise.all(Songs.map(async (song) => {
            await insertData(song, 'Song')
        }));
        Promise.all(Artists.map(async (artist) => {
            await insertData(artist, 'Artist')
        }));
        Promise.all(Albums.map(async (album) => {
            await insertData(album, 'Album')
        }));
        Promise.all(Playlists.map(async (playlist) => {
            await insertData(playlist, 'Playlist')
        }));
        Promise.all(Users.map(async (user) => {
            await insertData(user, 'User')
        }));
        res.send('all seed updated')
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = router