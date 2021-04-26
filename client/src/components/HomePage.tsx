import React, { useState, useEffect, FC } from 'react';
import './HomePage.css';
import axios from 'axios';
import { isMobile } from "react-device-detect";

// components
import TopSongs from './songs/TopSongs';
import TopArtists from './artists/TopArtists';
import TopAlbums from './albums/TopAlbums';
import TopPlaylists from './playlists/TopPlaylists';
import TopSkeletons from './skeletons/TopSkeletons';

// types
import { Song as SongType, Artist as ArtistType, Album as AlbumType, Playlist as PlaylistType } from '../types/types';

function HomePage(): JSX.Element {

    const [songs, setSongs] = useState<SongType[][]>([]);
    const [artists, setArtists] = useState<ArtistType[][]>([]);
    const [albums, setAlbums] = useState<AlbumType[][]>([]);
    const [playlists, setPlaylists] = useState<PlaylistType[][]>([]);
    const [topSongs, setTopSongs] = useState<SongType[]>([]);
    const [topArtists, setTopArtists] = useState<ArtistType[]>([]);
    const [topAlbums, setTopAlbums] = useState<AlbumType[]>([]);
    const [topPlaylists, setTopPlaylists] = useState<PlaylistType[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('/api/v1/top');
                setSongs(data[0])
                setArtists(data[1])
                setAlbums(data[2])
                setPlaylists(data[3])
                setTopSongs(data[0][0])
                setTopArtists(data[1][0])
                setTopAlbums(data[2][0])
                setTopPlaylists(data[3][0])
                setLoading(false)
            } catch (err) {
                console.log(err.message)
            }
        })()
    }, [])

    const setTop = (option: string) => {

        // style
        if (option === "like") {
            setTopSongs(songs[0])
            setTopArtists(artists[0])
            setTopAlbums(albums[0])
            setTopPlaylists(playlists[0])

            const chosen: HTMLElement | null = document.getElementById(option);
            chosen && chosen.setAttribute("class", "chosen");
            const play: HTMLElement | null = document.getElementById("play");
            if (play && play.classList.contains("chosen")) play.classList.remove("chosen");
            const newEl: HTMLElement | null = document.getElementById("new");
            if (newEl && newEl.classList.contains("chosen")) newEl.classList.remove("chosen");
        }
        if (option === "play") {
            setTopSongs(songs[1])
            setTopArtists(artists[1])
            setTopAlbums(albums[1])
            setTopPlaylists(playlists[1])

            const chosen: HTMLElement | null = document.getElementById(option);
            chosen && chosen.setAttribute("class", "chosen");
            const like: HTMLElement | null = document.getElementById("like");
            if (like && like.classList.contains("chosen")) like.classList.remove("chosen");
            const newEl: HTMLElement | null = document.getElementById("new");
            if (newEl && newEl.classList.contains("chosen")) newEl.classList.remove("chosen");
        }
        if (option === "new") {
            setTopSongs(songs[2])
            setTopArtists(artists[2])
            setTopAlbums(albums[2])
            setTopPlaylists(playlists[2])

            const chosen: HTMLElement | null = document.getElementById(option);
            chosen && chosen.setAttribute("class", "chosen");
            const like: HTMLElement | null = document.getElementById("like");
            if (like && like.classList.contains("chosen")) like.classList.remove("chosen");
            const play: HTMLElement | null = document.getElementById("play");
            if (play && play.classList.contains("chosen")) play.classList.remove("chosen");
        }
    }

    return (
        <div className="homepage">

            <div className={!isMobile ? "topTitles" : "topTitles-mobile"}>
                <h2 id="like" className="chosen" onClick={() => setTop("like")}>Top Liked</h2>
                <h2 id="play" onClick={() => setTop("play")}>Top Played</h2>
                <h2 id="new" onClick={() => setTop("new")}>Newest</h2>
            </div>

            {loading ?
                <>
                    <TopSkeletons type="Songs" />
                    <TopSkeletons type="Artists" />
                    <TopSkeletons type="Albums" />
                    <TopSkeletons type="Playlists" />
                </>
                :
                <>
                    <TopSongs topSongs={topSongs} />
                    <TopArtists topArtists={topArtists} />
                    <TopAlbums topAlbums={topAlbums} />
                    <TopPlaylists topPlaylists={topPlaylists} />
                </>
            }
        </div>
    )
}

export default HomePage
