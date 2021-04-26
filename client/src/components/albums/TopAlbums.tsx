import React from 'react';
import './Albums.css';

// packages
import Carousel from 'styled-components-carousel';
import { Link } from 'react-router-dom';

// components
import Album from './Album';

// types
import { Album as AlbumType } from '../../types/types';

function TopAlbums({ topAlbums }: { topAlbums: AlbumType[] }): JSX.Element {

    return (
        <div className="topAlbums">
            <div className="topHeader">Top Albums</div>
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
                {topAlbums.map((album: AlbumType) => {
                    return (
                        <Link to={`/album/${album.id}`} key={album.id}>
                            <Album album={album} />
                        </Link>
                    )
                })}
            </Carousel>
        </div>
    )
}

export default TopAlbums;