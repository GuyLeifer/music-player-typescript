import React from 'react';
import './Songs.css';

// packages
import Carousel from 'styled-components-carousel';
import { Link } from 'react-router-dom';

// components
import Song from './Song';

// types
import { Song as SongType } from '../../types/types';

function TopSongs({ topSongs }: { topSongs: SongType[] }): JSX.Element {
    return (
        <div className="topSongs">
            <div className="topHeader">Top Songs</div>
            {topSongs.length > 0 && (
                <div>
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
                        {topSongs.map((song: SongType) => {
                            return (
                                <Link to={`/song/${song.id}`} key={song.id}>
                                    <Song song={song} />
                                </Link>
                            )
                        })}
                    </Carousel>
                </div>
            )}
        </div>
    )
}

export default TopSongs;