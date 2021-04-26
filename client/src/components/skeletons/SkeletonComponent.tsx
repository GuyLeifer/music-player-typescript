import { Skeleton } from '@material-ui/lab';

function SkeletonComponent(): JSX.Element {
    return (
        <div className="skeleton"
            style={{ backgroundColor: '#222222' }}
        >
            <Skeleton variant="rect" width={260} height={160} animation="wave" />
        </div>
    )
}

export default SkeletonComponent