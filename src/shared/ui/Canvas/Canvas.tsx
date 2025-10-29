// shared/ui/Canvas/Canvas.tsx
import React, {forwardRef} from 'react';
import styles from './Canvas.module.css';

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
    className?: string;
    backgroundColor?: string;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
    ({className, backgroundColor, style, ...props}, ref) => {
        const canvasStyle = {
            ...style,
            backgroundColor: backgroundColor || 'transparent',
        };

        return (
            <canvas
                ref={ref}
                className={`${styles.canvas} ${className || ''}`}
                style={canvasStyle}
                {...props}
            />
        );
    }
);

Canvas.displayName = 'Canvas';