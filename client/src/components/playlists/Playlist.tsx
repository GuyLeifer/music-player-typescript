import React from 'react';
import './Playlists.css';

// types
import { Playlist as PlaylistType } from '../../types/types';

function Playlist({ playlist }: { playlist: PlaylistType }) {
    return (
        playlist ?
            <div className="playlist">
                <span className="playlistName">{playlist.name}</span>
                <div className="playlistImg">
                    <img src={playlist.coverImg} alt={playlist.name} />
                </div>
            </div>
            :
            <>
            </>
    )
}

export default Playlist;