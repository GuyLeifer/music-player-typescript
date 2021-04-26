import React from 'react';
import './Artists.css';

// packages
import Carousel from 'styled-components-carousel';
import { Link } from 'react-router-dom';

// components
import Artist from './Artist';

// types
import { Artist as ArtistType } from '../../types/types';

function TopArtists({ topArtists }: { topArtists: ArtistType[] }): JSX.Element {

    return (
        <div className="topArtists">
            <div className="topHeader">Top Artists</div>
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
                {topArtists.map((artist: ArtistType) => {
                    return (
                        <Link to={`/artist/${artist.id}`} key={artist.id}>
                            <Artist artist={artist} />
                        </Link>
                    )
                })}
            </Carousel>
        </div>
    )
}

export default TopArtists;