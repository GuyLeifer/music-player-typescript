import React from 'react';
import './Playlists.css';

// packages
import Carousel from 'styled-components-carousel';
import { Link } from 'react-router-dom';

// components
import Playlist from './Playlist';

// types
import { Playlist as PlaylistType } from '../../types/types';

function TopPlaylists({ topPlaylists }: { topPlaylists: PlaylistType[] }) {
    return (
        <div className="topPlaylists">
            <div className="topHeader">Top Playlists</div>
            <Carousel
                center
                infinite
                showArrows
                showIndicator
                breakpoints={[
                    {
                        size: 200,
                        settings: {
                            slidesToShow: 1,
                            showArrows: true,
                            showIndicator: true,
                            infinite: true,
                            center: true,
                        },
                    },
                    {
                        size: 800,
                        settings: {
                            slidesToShow: 2,
                            showArrows: true,
                            showIndicator: true,
                            infinite: true,
                            center: true,
                        },
                    },
                    {
                        size: 1200,
                        settings: {
                            slidesToShow: 3,
                            showArrows: true,
                            showIndicator: true,
                            infinite: true,
                            center: true,
                        },
                    },
                    {
                        size: 1700,
                        settings: {
                            slidesToShow: 4,
                            showArrows: true,
                            showIndicator: true,
                            infinite: true,
                            center: true,
                        },
                    },
                ]}
            >
                {topPlaylists.map(playlist => {
                    return (
                        <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
                            <Playlist playlist={playlist} />
                        </Link>
                    )
                })}
            </Carousel>
        </div>
    )
}

export default TopPlaylists;