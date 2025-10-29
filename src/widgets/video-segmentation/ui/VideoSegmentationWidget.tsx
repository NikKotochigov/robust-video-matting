import React, { useEffect, useRef } from 'react';
import { Video } from '../../../shared/ui/Video/Video';
import { Canvas } from '../../../shared/ui/Canvas/Canvas';
import { BackgroundSelector } from '../../../features/background-selector/ui/BackgroundSelector';
import { useBackgroundSelection } from '../../../features/background-selector/model';
import { useSegmentationInit, useSegmentationInference } from '../../../entities/segmentation/model';
import { useIsLoading, useError, useIsRunning, usePerformanceMetrics, useSegmentationActions } from '../../../shared/store';
import { BACKGROUND_OPTIONS } from '../../../shared/config/constants';
import styles from './VideoSegmentationWidget.module.css';

export const VideoSegmentationWidget: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Store state
    const isLoading = useIsLoading();
    const error = useError();
    const isRunning = useIsRunning();
    const performanceMetrics = usePerformanceMetrics();
    const { cleanup } = useSegmentationActions();
    
    // Custom hooks
    const { selectedBackground, setSelectedBackground } = useBackgroundSelection();
    const { initializeModel, initializeWebcam } = useSegmentationInit();
    const { startInference, stopInference } = useSegmentationInference();

    // Initialize model on mount
    useEffect(() => {
        initializeModel();
        
        // Cleanup on unmount
        return () => {
            cleanup();
        };
    }, [initializeModel, cleanup]);

    // Initialize webcam when video element is ready
    useEffect(() => {
        if (videoRef.current && !isLoading) {
            initializeWebcam(videoRef.current);
        }
    }, [videoRef.current, isLoading, initializeWebcam]);

    // Start inference when canvas is ready and not running
    useEffect(() => {
        if (canvasRef.current && !isLoading && !error && !isRunning) {
            const timer = setTimeout(() => {
                startInference(canvasRef.current!);
            }, 100); // Small delay to ensure everything is ready
            
            return () => clearTimeout(timer);
        }
    }, [canvasRef.current, isLoading, error, isRunning, startInference]);

    // Handle background change
    const handleBackgroundChange = (background: typeof selectedBackground) => {
        setSelectedBackground(background);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    Loading model and initializing webcam...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Error: {error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    className={styles.retryButton}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <BackgroundSelector
                value={selectedBackground}
                onChange={handleBackgroundChange}
                className={styles.selector}
            />
            <div className={styles.videoContainer}>
                <Video ref={videoRef} className={styles.video} />
                <Canvas
                    ref={canvasRef}
                    className={styles.canvas}
                    backgroundColor={
                        BACKGROUND_OPTIONS.find(bg => bg.value === selectedBackground)?.background
                    }
                />
            </div>
            <div className={styles.status}>
                <div className={styles.statusItem}>
                    Status: <span className={isRunning ? styles.running : styles.stopped}>
                        {isRunning ? 'Running' : 'Stopped'}
                    </span>
                </div>
                {isRunning && (
                    <>
                        <div className={styles.statusItem}>
                            FPS: <span className={styles.metric}>
                                {performanceMetrics.fps.toFixed(1)}
                            </span>
                        </div>
                        <div className={styles.statusItem}>
                            Inference: <span className={styles.metric}>
                                {performanceMetrics.inferenceTime.toFixed(1)}ms
                            </span>
                        </div>
                    </>
                )}
            </div>
            <div className={styles.controls}>
                <button 
                    onClick={() => isRunning ? stopInference() : startInference(canvasRef.current!)}
                    className={styles.controlButton}
                    disabled={!canvasRef.current}
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>
            </div>
        </div>
    );
};