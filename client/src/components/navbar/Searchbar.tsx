import React, { useState, useEffect } from 'react';
import './Navbar.css';

// Packages
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';

// Icons
import searchIcon from './images/searchIcon.png';
import songIcon from './images/songIcon.webp';
import artistIcon from './images/artistIcon.png';
import albumIcon from './images/albumIcon.webp';
import playlistIcon from './images/playlistIcon.jpg';
import userIcon from './images/userIcon.jpg';

// types
import { Song as SongType, Artist as ArtistType, Album as AlbumType, Playlist as PlaylistType, User as UserType } from '../../types/types';


function Searchbar(): JSX.Element {

    const [options, setOptions] = useState<any[]>([]);
    const [songs, setSongs] = useState<SongType[]>([]);
    const [artists, setArtists] = useState<ArtistType[]>([]);
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);

    const [value, setValue] = useState('');

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/api/v1/search?params=${value}`);
            setOptions(data);
            setSongs(data[0])
            setArtists(data[1])
            setAlbums(data[2])
            setUsers(data[3])
        })()
    }, [value])

    const debounced = useDebouncedCallback((value) => setValue(value), 1000);

    const goToPage = (type: string, id: number) => {
        const link = `/${type}/${id}`;
        window.location.href = link;
    }

    return (
        <div className="searchContainer">
            <img className="search-icon" src={searchIcon} alt="search" />
            <input
                id="search"
                type="search"
                onChange={(e) => debounced(e.target.value)}
            />
            {options.length > 0 && (
                <div className="options">
                    {(songs.length > 0) && (
                        songs.map(song =>
                            <div
                                className={"option song"}
                                key={'song ' + song.id}
                                onClick={() => goToPage('song', song.id)}
                            >
                                <div className="optionName">{song.title}</div>
                                <div className="optionIconDiv">
                                    <img className="optionIcon" src={songIcon} alt="songIcon" />
                                </div>
                            </div>
                        )
                    )}
                    {(artists.length > 0) && (
                        artists.map(artist =>
                            <div
                                className={"option artist"}
                                key={'artist ' + artist.id}
                                onClick={() => goToPage('artist', artist.id)}
                            >
                                <div className="optionName">{artist.name}</div>
                                <div className="optionIconDiv">
                                    <img className="optionIcon" src={artistIcon} alt="artistIcon" />
                                </div>
                            </div>
                        )
                    )}
                    {(albums.length > 0) && (
                        albums.map(album =>
                            <div
                                className={"option album"}
                                key={'album ' + album.id}
                                onClick={() => goToPage('album', album.id)}
                            >
                                <div className="optionName">{album.name}</div>
                                <div className="optionIconDiv">
                                    <img className="optionIcon" src={albumIcon} alt="albumIcon" />
                                </div>
                            </div>
                        )
                    )}
                    {(users.length > 0) && (
                        users.map(user =>
                            <div
                                className={"option user"}
                                key={'user ' + user.id}
                                onClick={() => goToPage('user', user.id)}
                            >
                                <div className="optionName">{user.name}</div>
                                <div className="optionIconDiv">
                                    <img className="optionIcon" src={userIcon} alt="userIcon" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default Searchbar