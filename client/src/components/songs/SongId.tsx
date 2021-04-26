import React, { useEffect, useState } from 'react'
import './Songs.css';

//components
import Song from './Song';

// packages
import axios from 'axios';
import { Link } from 'react-router-dom';
import YouTube, { Options } from 'react-youtube';

// recoil
import { useRecoilValue } from "recoil";
import { userState } from '../../Atoms/userState';

//inside components
// import ArtistSongs from './components/ArtistSongs';
// import AlbumSongs from './components/AlbumSongs';
// import PlaylistSongs from './components/PlaylistSongs';

//icons
import likeIcon from '../images/likeIcon.webp';

// types
import { Song as SongType, Artist as ArtistType, Album as AlbumType, Playlist as PlaylistType, User as UserType } from '../../types/types';


function SongId({ match }: { match: any }): JSX.Element {
    const [song, setSong] = useState<SongType | null>(null);
    const [artist, setArtist] = useState<ArtistType | null>(null);
    const [album, setAlbum] = useState<AlbumType | null>(null);

    const user = useRecoilValue<UserType | null>(userState);

    const [userPlaylists, setUserPlaylists] = useState<PlaylistType[] | null>([]);
    const [playlistId, setPlaylistId] = useState<number | null>();

    const [likes, setLikes] = useState<number | null>();
    const [isLiked, setIsLiked] = useState<boolean | null>();

    useEffect(() => {
        fetchSong(match.params.id);
    }, []);

    useEffect(() => {
        fetchIsLikedAndIncrementPlayCount();
        user && song && fetchUserPlaylists()
    }, [user, song]);


    const fetchSong = async (id: number) => {
        const { data } = await axios.get(`/api/v1/songs/${id}`);
        setSong(data.song);
        setLikes(data.song.likes)
        setArtist(data.artist);
        setAlbum(data.album);
    }

    const fetchUserPlaylists = async () => {
        const { data } = await axios.get(`/api/v1/playlists/by-user/${user!.id}&${song!.id}`)
        setUserPlaylists(data)
    }

    const fetchIsLikedAndIncrementPlayCount = async () => {
        if (user && song) {
            const { data } = await axios.get(`/api/v1/users/${user.id}`);
            if (data) {
                if (data.songsLiked.find((songLiked: SongType) => Number(songLiked.id) === Number(song.id))) {
                    setIsLiked(true);
                } else {
                    setIsLiked(false);
                }
                await axios.patch(`/api/v1/songs/${song.id}`)
            } else {
                setIsLiked(null);
                await axios.patch(`/api/v1/songs/${song.id}`)
            }
        } else if (song) {
            setIsLiked(null)
            await axios.patch(`/api/v1/songs/${song.id}`)
        }
    };

    const optsForMainSong: Options = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        },
    }

    const handleLikeSong = async () => {
        await axios.patch(`/api/v1/users/${user!.id}`, {
            songId: song!.id,
        })
        isLiked ? await axios.patch(`/api/v1/songs/${song!.id}`, { like: 'unlike' }) : await axios.patch(`/api/v1/songs/${song!.id}`, { like: 'like' })
        isLiked ? setLikes(likes! - 1) : setLikes(likes! + 1)
        setIsLiked(!isLiked)
    }

    const addToPlaylist = async () => {
        await axios.patch(`/api/v1/playlists/${playlistId}`, {
            songId: song!.id,
        });
    }

    return (
        <>
            {song && (
                <div className="info">
                    <div className="title">Song Title: {song.title}</div>
                    <div className="description">
                        <p>Total plays: {song!.playCount! + 1}</p>
                        <p>Total Likes: {likes ? likes : 0}</p>
                    </div>
                    {user && (
                        <div>
                            {!isLiked && (
                                <img className="likeIcon" onClick={handleLikeSong} src={likeIcon} alt="Like" />
                            )}
                            {isLiked && (
                                <img className="unlikeIcon" onClick={handleLikeSong} src={likeIcon} alt="Unlike" />
                            )}
                        </div>
                    )}
                    <div className="songContainer">
                        <div>
                            <YouTube videoId={song.youtubeLink} opts={optsForMainSong} />
                        </div>
                        {(artist && album) &&
                            <div>
                                <Link to={`/artist/${song.artistId}?song=${song.id}`}>
                                    <div className="songLink">Artist Name: {artist.name}</div>
                                </Link>
                                <Link to={`/album/${song.albumId}?song=${song.id}`}>
                                    <div className="songLink">Album Name: {album.name}</div>
                                </Link>
                                {user && userPlaylists && (
                                    <div className="playlistAddDiv">
                                        <form
                                            onSubmit={addToPlaylist}
                                        >
                                            <div>Add To Your Playlist</div>
                                            <div className="buttons">
                                                <select id="mySelect"
                                                    onChange={(e) => setPlaylistId(Number(e.target.value))}
                                                >
                                                    {userPlaylists.map(playlist => {
                                                        return (
                                                            <option value={playlist.id}>{playlist.name}</option>
                                                        )
                                                    })}
                                                </select>
                                                <input id="inputSubmit" type="submit" value="ADD" />
                                            </div>
                                            <div>
                                                want to add a new playlist?
                                                <Link to={`/user/${user.id}`}>
                                                    <span className="addPlaylist">Click Here!</span>
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                <div>Length: {song.length}</div>
                                <div>Created At: {song.createdAt.toString().split('T')[0]}</div>
                                <div>Updated At: {song.updatedAt.toString().split('T')[0]}</div>
                            </div>
                        }
                    </div>
                    <div className="lyrics">
                        <h3>Lyrics:</h3>
                        <div>{song.lyrics}</div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SongId