import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Carousel from 'styled-components-carousel';
import Song from '../songs/Song';

import deleteIcon from './images/deleteIcon.png';
import likeIcon from '../images/likeIcon.webp';

// recoil
import { useRecoilValue } from "recoil";
import { userState } from '../../Atoms/userState';

// types
import { Song as SongType, Playlist as PlaylistType, User as UserType } from '../../types/types';

function PlaylistId({ match }: { match: any }) {

    const [playlist, setPlaylist] = useState<PlaylistType | null>();
    const [songs, setSongs] = useState<SongType[]>([]);

    const user = useRecoilValue<UserType | null>(userState);

    const [likes, setLikes] = useState<number | null>();
    const [isLiked, setIsLiked] = useState<boolean | null>();

    useEffect(() => {
        fetchPlaylist();
    }, []);

    useEffect(() => {
        fetchIsLiked();
    }, [user, playlist]);

    const fetchPlaylist = async () => {
        const { data } = await axios.get(`/api/v1/playlists/${match.params.id}`);
        setPlaylist(data.playlist)
        setLikes(data.playlist.likes)
        setSongs(data.songs)
    }

    const fetchIsLiked = async () => {
        if (user && playlist) {
            const { data } = await axios.get(`/api/v1/users/${user.id}`);
            if (data) {
                if (data.playlistsLiked.find((playlistLike: PlaylistType) => Number(playlistLike.id) === Number(playlist.id))) {
                    setIsLiked(true);
                } else {
                    setIsLiked(false);
                }
            } else {
                setIsLiked(null);
            }
        } else if (playlist) {
            setIsLiked(null)
        }
    };

    const handleLikePlaylist = async () => {
        await axios.patch(`/api/v1/users/${user!.id}`, {
            playlistId: playlist!.id,
        })
        isLiked ? await axios.patch(`/api/v1/playlists/${playlist!.id}`, { like: 'unlike' }) : await axios.patch(`/api/v1/playlists/${playlist!.id}`, { like: 'like' })
        isLiked ? setLikes(likes! - 1) : setLikes(likes! + 1)
        setIsLiked(!isLiked)
    }

    return (
        <>
            {playlist && (
                <div className="info">
                    <div className="title">Playlist Name: {playlist.name}</div>
                    {user && (
                        <div>
                            {!isLiked && (
                                <img className="likeIcon" onClick={handleLikePlaylist} src={likeIcon} alt="Like" />
                            )}
                            {isLiked && (
                                <img className="unlikeIcon" onClick={handleLikePlaylist} src={likeIcon} alt="Unlike" />
                            )}
                        </div>
                    )}
                    <div className="playlistContainer">
                        <div>
                            <div>
                                <h3>Cover Image:</h3>
                                <img src={playlist.coverImg} alt={playlist.name} />
                            </div>
                            <div>Likes: {likes ? likes : 0}</div>
                            <div>Created At: {playlist.createdAt.toString().split('T')[0]}</div>
                            <div>Updated At: {playlist.updatedAt.toString().split('T')[0]}</div>
                        </div>
                        {songs.length > 0 &&
                            <div className="songsOnPlaylistDiv">
                                <h3 className="subHeader">Songs:</h3>
                                <Carousel
                                    center
                                    infinite
                                    showArrows
                                    showIndicator
                                    slidesToShow={3}>
                                    {songs.map((song) => {
                                        return (
                                            <Link to={`/song/${song.id}?playlist=${playlist.id}`}>
                                                <Song song={song} />
                                            </Link>
                                        )
                                    })}
                                </Carousel>
                            </div>
                        }
                    </div>
                    {songs.length > 0 &&
                        <div>
                            <h3>All Playlist Songs:</h3>
                            {songs.map((song) => {
                                return (
                                    <div>
                                        <Link to={`/song/${song.id}?playlist=${playlist.id}`}>
                                            <p className="playlistNameLink">{song.title}</p>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            )}
        </>
    )
}

export default PlaylistId