import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Carousel from 'styled-components-carousel';
import Song from '../songs/Song';
import likeIcon from '../images/likeIcon.webp';

// recoil
import { useRecoilValue } from "recoil";
import { userState } from '../../Atoms/userState';

// types
import { Artist as ArtistType, Song as SongType, Album as AlbumType, User as UserType } from '../../types/types';

function AlbumId({ match }: { match: any }) {

    const [album, setAlbum] = useState<AlbumType | null>();
    const [artist, setArtist] = useState<ArtistType | null>();
    const [songs, setSongs] = useState<SongType[] | null>();

    const user = useRecoilValue<UserType | null>(userState);

    const [likes, setLikes] = useState<number | null>();
    const [isLiked, setIsLiked] = useState<boolean | null>();

    useEffect(() => {
        fetchAlbum();
    }, []);

    useEffect(() => {
        fetchIsLiked();
    }, [user, album]);

    const fetchAlbum = async () => {
        const { data } = await axios.get(`/api/v1/albums/${match.params.id}`);
        setAlbum(data.album);
        setLikes(data.album.likes)
        setArtist(data.artist);
        setSongs(data.songs);
    }

    const fetchIsLiked = async () => {
        if (user && album) {
            const { data } = await axios.get(`/api/v1/users/${user.id}`);
            if (data) {
                if (data.albumsLiked.find((albumLike: AlbumType) => Number(albumLike.id) === Number(album.id))) {
                    setIsLiked(true);
                } else {
                    setIsLiked(false);
                }
            } else {
                setIsLiked(null);
            }
        } else if (album) {
            setIsLiked(null)
        }
    };

    const handleLikeAlbum = async () => {
        await axios.patch(`/api/v1/users/${user!.id}`, {
            artistId: artist!.id,
        })
        isLiked ? await axios.patch(`/api/v1/albums/${artist!.id}`, { like: 'unlike' }) : await axios.patch(`/api/v1/albums/${artist!.id}`, { like: 'like' })
        isLiked ? setLikes(likes! - 1) : setLikes(likes! + 1)
        setIsLiked(!isLiked)
    }

    return (
        <>
            {(album && artist) &&
                <div className="info">
                    <div className="title">Album Name: {album.name}</div>
                    <Link to={`/artist/${album.artistId}`} className="artistLink title">
                        Artist Name: {artist.name}
                    </Link>
                    {user && (
                        <div>
                            {!isLiked && (
                                <img className="likeIcon" onClick={handleLikeAlbum} src={likeIcon} alt="Like" />
                            )}
                            {isLiked && (
                                <img className="unlikeIcon" onClick={handleLikeAlbum} src={likeIcon} alt="Unlike" />
                            )}
                        </div>
                    )}
                    <div className="albumContainer">
                        <div>
                            <div><h3>Cover Image:</h3>
                                <div>
                                    <img src={album.coverImg} alt={album.name} />
                                </div>
                            </div>
                            <div>Likes: {likes ? likes : 0}</div>
                            <div>Created At: {album.createdAt.toString().split('T')[0]}</div>
                            <div>Updated At: {album.updatedAt.toString().split('T')[0]}</div>
                        </div>
                        {songs &&
                            <div className="songsOnAlbumDiv">
                                <h3 className="subHeader">Songs:</h3>
                                <Carousel
                                    center
                                    infinite
                                    showArrows
                                    showIndicator
                                    slidesToShow={3}>
                                    {songs.map((song) => {
                                        return (
                                            <Link to={`/song/${song.id}?album=${song.albumId}`}>
                                                <Song song={song} />
                                            </Link>
                                        )
                                    })}
                                </Carousel>
                            </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default AlbumId