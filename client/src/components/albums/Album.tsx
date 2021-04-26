import React from 'react'
import './Albums.css';

// types
import { Album as AlbumType } from '../../types/types';

function Album({ album }: { album: AlbumType }): JSX.Element {

    return (
        album ?
            <div className="album" >
                <span className="albumName">{album.name}</span>
                <div className="albumImg">
                    <img src={album.coverImg} alt={album.name} />
                </div>
            </div>
            :
            <>
            </>
    )
}

export default Album;