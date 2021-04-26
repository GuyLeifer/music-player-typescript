import React, { useState } from 'react';
import './Songs.css';

// packages
import YouTube from 'react-youtube';
import axios from 'axios';

// types
import { Song as SongType } from '../../types/types';

const opts = {
    height: '160',
    width: '260',
}

function Song({ song }: { song: SongType }): JSX.Element {
    const [counterLimit, setCounterLimit] = useState(1);

    const playCounter = async () => {
        if (counterLimit === 1) {
            await axios.patch(`/api/v1/songs/${song.id}`)
            setCounterLimit(0);
        }
    }

    return (
        <div className="song" >
            <span className="songTitle">{song.title}</span>
            <span className="songLength">{song.length}</span>
            <div>
                <YouTube videoId={song.youtubeLink} opts={opts} onPlay={playCounter} />
            </div>
        </div>
    )
}

export default Song
