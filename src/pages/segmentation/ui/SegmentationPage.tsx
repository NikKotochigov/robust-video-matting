import React from 'react';
import {VideoSegmentationWidget} from '../../../widgets/video-segmentation/ui/VideoSegmentationWidget';
import styles from './SegmentationPage.module.css';

export const SegmentationPage: React.FC = () => {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Video Segmentation</h1>
                <p className={styles.subtitle}>
                    Real-time video segmentation with TensorFlow.js and React
                </p>
            </header>
            <main className={styles.main}>
                <VideoSegmentationWidget/>
            </main>
        </div>
    );
};