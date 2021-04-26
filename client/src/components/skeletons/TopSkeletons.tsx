import SkeletonComponent from './SkeletonComponent';
import './Skeletons.css';

// packages
import Carousel from 'styled-components-carousel';

// const skeletonsArr: any[] = new Array(20);
const skeletonsArr: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function TopSkeletons({ type }: { type: string }): JSX.Element {
    return (
        <div className="topSkeletons">
            <div className="topHeaderSkeleton">Top {type}</div>
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
                {skeletonsArr.map(el => {
                    return (
                        <SkeletonComponent />
                    )
                })}
            </Carousel>
        </div>
    )
}

export default TopSkeletons
