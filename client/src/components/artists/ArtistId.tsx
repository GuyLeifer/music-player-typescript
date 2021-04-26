import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Carousel from 'styled-components-carousel';
import Album from '../albums/Album';
import Song from '../songs/Song';
import likeIcon from '../images/likeIcon.webp';

// recoil
import { useRecoilValue } from "recoil";
import { userState } from '../../Atoms/userState';

// types
import { Artist as ArtistType, Song as SongType, Album as AlbumType, User as UserType } from '../../types/types';

function ArtistId({ match }: { match: any }): JSX.Element {

    const [artist, setArtist] = useState<ArtistType | undefined>();
    const [songs, setSongs] = useState<SongType[] | undefined>();
    const [albums, setAlbums] = useState<AlbumType[] | undefined>();

    const user: UserType | null = useRecoilValue(userState);

    const [likes, setLikes] = useState<number | undefined>();
    const [isLiked, setIsLiked] = useState<boolean | undefined>();

    useEffect(() => {
        fetchArtist();
    }, []);

    useEffect(() => {
        fetchIsLiked();
    }, [user, artist]);


    const fetchArtist = async () => {
        const { data } = await axios.get(`/api/v1/artists/${match.params.id}`);
        setArtist(data.artist);
        setLikes(data.artist.likes)
        setSongs(data.songs);
        setAlbums(data.albums);
    }

    const fetchIsLiked = async () => {
        if (user && artist) {
            const { data } = await axios.get(`/api/v1/users/${user!.id}`);
            if (data) {
                if (data.artistsLiked.find((artistLike: ArtistType) => Number(artistLike.id) === Number(artist.id!))) {
                    setIsLiked(true);
                } else {
                    setIsLiked(undefined);
                }
            } else {
                setIsLiked(undefined);
            }
        } else if (artist) {
            setIsLiked(undefined)
        }
    };

    const handleLikeArtist = async () => {
        await axios.patch(`/api/v1/users/${user!.id}`, {
            artistId: artist!.id,
        })
        isLiked ? await axios.patch(`/api/v1/artists/${artist!.id}`, { like: 'unlike' }) : await axios.patch(`/api/v1/artists/${artist!.id}`, { like: 'like' })
        isLiked ? setLikes(likes! - 1) : setLikes(likes! + 1)
        setIsLiked(!isLiked)
    }

    return (
        <>
            {artist && (
                <div className="info">
                    <div className="title">Artist Name: {artist.name}</div>
                    {user && (
                        <div>
                            {!isLiked && (
                                <img className="likeIcon" onClick={handleLikeArtist} src={likeIcon} alt="Like" />
                            )}
                            {isLiked && (
                                <img className="unlikeIcon" onClick={handleLikeArtist} src={likeIcon} alt="Unlike" />
                            )}
                        </div>
                    )}
                    <div className="artistContainer">
                        <div>
                            <div>Cover Image:
                        <div>
                                    <img src={artist.coverImg} alt={artist.name} />
                                </div>
                            </div>
                            <div>Likes: {likes ? likes : 0}</div>
                            <div>Created At: {artist.createdAt.toString().split('T')[0]}</div>
                            <div>Updated At: {artist.updatedAt.toString().split('T')[0]}</div>
                        </div>
                        {albums &&
                            <div className="albumsOnArtistDiv">
                                <h3 className="subHeader">Albums:</h3>
                                <Carousel
                                    center
                                    infinite
                                    showArrows
                                    showIndicator
                                    slidesToShow={3}>
                                    {albums.map((album) => {
                                        return (
                                            <Link to={`/album/${album.id}?artist=${album.artistId}`}>
                                                <div className="albumOnArtist">
                                                    <Album album={album} />
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </Carousel>
                            </div>
                        }
                    </div>
                    {songs &&
                        <div className="ArtistMasterpiece">
                            <h2>All Songs Of Artist</h2>
                            <div className="songsOnArtistDiv">
                                <Carousel
                                    center
                                    infinite
                                    showArrows
                                    showIndicator
                                    slidesToShow={3}>
                                    {songs.map((song) => {
                                        return (
                                            <Link to={`/song/${song.id}?artist=${song.artistId}`}>
                                                <div className="songOnArtist">
                                                    <Song song={song} />
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </Carousel>
                            </div>
                        </div>
                    }
                </div>
            )}
        </>
    )
}

export default ArtistId