// shared/ui/Video/Video.tsx
import React, {forwardRef} from 'react';
import styles from './Video.module.css';

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    className?: string;
}

export const Video = forwardRef<HTMLVideoElement, VideoProps>(
    ({className, ...props}, ref) => {
        return (
            <video
                ref={ref}
                className={`${styles.video} ${className || ''}`}
                autoPlay
                muted
                playsInline
                {...props}
            />
        );
    }
);

Video.displayName = 'Video';