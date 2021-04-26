import React, { useEffect, useState } from 'react';
import './User.css';

//packages
import axios from 'axios';
import { Link } from 'react-router-dom';
import Carousel from 'styled-components-carousel';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';

// components
import Song from '../songs/Song';
import Artist from '../artists/Artist';
import Album from '../albums/Album';
import Playlist from '../playlists/Playlist';

// icons
import deleteIcon from './images/deleteIcon.png';

// recoil
import { useRecoilValue } from "recoil";
import { userState } from '../../Atoms/userState';

// types
import { Song as SongType, Artist as ArtistType, Album as AlbumType, Playlist as PlaylistType, User as UserType } from '../../types/types';

// Modal issue
Modal.setAppElement('div');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-30%',
        transform: 'translate(-50%, -50%)',
        background: ' rgb(73, 79, 82)',
        color: 'white',
        borderRadius: '10%'
    }

};

function UserId({ match }: { match: any }) {

    const [user, setUser] = useState<UserType | null>();
    const [songsLiked, setSongsLiked] = useState<SongType[] | null>();
    const [artistsLiked, setArtistsLiked] = useState<ArtistType[]>([]);
    const [albumsLiked, setAlbumsLiked] = useState<AlbumType[]>([]);
    const [playlistsLiked, setPlaylistsLiked] = useState<PlaylistType[]>([]);

    const username = useRecoilValue<UserType | null>(userState);

    const [userPlaylists, setUserPlaylists] = useState<UserType[]>([]);
    const [newPlaylist, setNewPlaylist] = useState<boolean>(false);

    const { register, handleSubmit, errors } = useForm(); // initialize the hook

    useEffect(() => {
        fetchUser();
    }, [match]);

    const fetchUser = async () => {
        const id = Number(match.params.id);
        const { data } = await axios.get(`/api/v1/users/${id}`);
        setUser(data.user);
        setSongsLiked(data.songsLiked)
        setArtistsLiked(data.artistsLiked)
        setAlbumsLiked(data.albumsLiked)
        setPlaylistsLiked(data.playlistsLiked)
        setUserPlaylists(data.userPlaylists)
    };

    const deleteUser = async () => {
        await axios.delete(`/api/v1/users/${user!.id}`);
        window.location.assign('/');
    }
    const createPlaylist = async (data: { name: string, coverImg: string }) => {
        const { name, coverImg } = data;
        await axios.post('/api/v1/playlists', {
            userId: username!.id,
            name: name,
            coverImg: coverImg
        });
        setNewPlaylist(false);
    }

    return (
        <>
            {user && (
                <div className="info">
                    <div className="title">User Name: {user.name}</div>
                    <div>Created At: {user.createdAt.toString().split('T')[0]} {user.createdAt.toString().split('T')[1].slice(0, 8)}</div>
                    <div>Updated At: {user.updatedAt.toString().split('T')[0]} {user.updatedAt.toString().split('T')[1].slice(0, 8)}</div>
                    <a href="#songsOnUserDiv" className="insideLink">Songs Liked By User</a>
                    <a href="#artistsOnUserDiv" className="insideLink">Artists Liked By User</a>
                    <a href="#albumsOnUserDiv" className="insideLink">Albums Liked By User</a>
                    <a href="#playlistsOnUserDiv" className="insideLink">Playlists Liked By User</a>


                    {userPlaylists && (
                        <div className="userPlaylists">
                            {username ?
                                username.id === Number(match.params.id) ? <h3 className="subHeader">My Playlists:</h3>
                                    : userPlaylists &&
                                        userPlaylists.length > 0 ?
                                        <h3 className="subHeader">User Playlists:</h3>
                                        : null
                                : userPlaylists &&
                                    userPlaylists.length > 0 ?
                                    <h3 className="subHeader">User Playlists:</h3>
                                    : null
                            }
                            {userPlaylists &&
                                userPlaylists.map((playlist) => {
                                    return (
                                        <Link to={`/playlist/${playlist.id}?user=${user.id}`}>
                                            <p className="playlistLink">{playlist.name}</p>
                                        </Link>
                                    )
                                })}
                            {username ?
                                username.id === Number(match.params.id) && <p className="newPlaylist" onClick={() => setNewPlaylist(!newPlaylist)}>Create a New Playlist:</p>
                                : null
                            }
                            {newPlaylist && (
                                <Modal
                                    isOpen={newPlaylist}
                                    onRequestClose={() => setNewPlaylist(!newPlaylist)}
                                    style={customStyles}
                                >
                                    <div className="modal">
                                        <h2 className="modalTitle">New Playlist</h2>
                                        <form className="accountForm" onSubmit={handleSubmit(createPlaylist)}>
                                            <div className="labelInput">
                                                <label htmlFor="name">Playlist Name:</label>
                                                <input className="input" name="name" ref={register({ required: true })} placeholder="Name" />
                                                <div className="error">{errors.email && 'Name is required.'}</div>
                                            </div>
                                            <div className="labelInput">
                                                <label htmlFor="coverImg">Cover Image:</label>
                                                <input className="input" name="coverImg" ref={register({ required: true })} placeholder="Image Link" />
                                                <div className="error">{errors.email && 'Cover Image is required.'}</div>
                                            </div>
                                            <input className="input" type="submit" value="Create" />
                                        </form>
                                    </div>
                                </Modal>
                            )}
                        </div>
                    )}

                    {songsLiked && songsLiked.length > 0 && (
                        <div id="songsOnUserDiv" className="songsOnUserDiv">
                            <h3 className="subHeader">Songs Liked By User ({songsLiked.length}) :</h3>
                            <Carousel
                                center
                                infinite
                                showArrows
                                showIndicator
                                slidesToShow={3}>
                                {songsLiked.map((song) => {
                                    return (
                                        <Link to={`/song/${song.id}?user=${user.id}`}>
                                            <Song song={song} />
                                        </Link>
                                    )
                                })}
                            </Carousel>
                        </div>
                    )}

                    {artistsLiked && artistsLiked.length > 0 && (
                        <div id="artistsOnUserDiv" className="artistsOnUserDiv">
                            <h3 className="subHeader">Artists Liked By User ({artistsLiked.length}) :</h3>
                            <Carousel
                                center
                                infinite
                                showArrows
                                showIndicator
                                slidesToShow={3}>
                                {artistsLiked.map((artist) => {
                                    return (
                                        <Link to={`/artist/${artist.id}?user=${user.id}`}>
                                            <Artist artist={artist} />
                                        </Link>
                                    )
                                })}
                            </Carousel>
                        </div>
                    )}

                    {albumsLiked && albumsLiked.length > 0 && (
                        <div id="albumsOnUserDiv" className="albumsOnUserDiv">
                            <h3 className="subHeader">Albums Liked By User ({albumsLiked.length}) :</h3>
                            <Carousel
                                center
                                infinite
                                showArrows
                                showIndicator
                                slidesToShow={3}>
                                {albumsLiked.map((album) => {
                                    return (
                                        <Link to={`/album/${album.id}?user=${user.id}`}>
                                            <Album album={album} />
                                        </Link>
                                    )
                                })}
                            </Carousel>
                        </div>
                    )}

                    {playlistsLiked && playlistsLiked.length > 0 && (
                        <div id="playlistsOnUserDiv" className="playlistsOnUserDiv">
                            <h3 className="subHeader">Playlists Liked By User ({playlistsLiked.length}) :</h3>
                            <Carousel
                                center
                                infinite
                                showArrows
                                showIndicator
                                slidesToShow={3}>
                                {playlistsLiked.map((playlist) => {
                                    return (
                                        <Link to={`/playlist/${playlist.id}?user=${user.id}`}>
                                            <Playlist playlist={playlist} />
                                        </Link>
                                    )
                                })}
                            </Carousel>
                        </div>
                    )}
                </div>
            )}

            {username ?
                username.id === Number(match.params.id) && (
                    <div className="deleteDiv">
                        <p className="deleteP">Delete Account</p>
                        <img className="deletePlaylistIcon" src={deleteIcon} alt="Delete Playlist" onClick={() => deleteUser()} />
                    </div>
                )
                : null
            }
        </>
    )
}

export default UserId