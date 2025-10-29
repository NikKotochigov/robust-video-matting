// widgets/video-segmentation/ui/VideoSegmentationWidget.tsx
import React, {useEffect, useRef, useState} from 'react';
import * as tf from '@tensorflow/tfjs';
import {Video} from '../../../shared/ui/Video/Video';
import {Canvas} from '../../../shared/ui/Canvas/Canvas';
import {BackgroundSelector} from '../../../features/background-selector/ui/BackgroundSelector';
import {BackgroundOption} from '../../../features/background-selector/model/types';
import {loadSegmentationModel, initializeRecurrentStates} from '../../../shared/lib/tensorflow/loadModel';
import {setupWebcam, captureFrame} from '../../../shared/lib/tensorflow/setupWebcam';
import {performInference} from '../../../entities/segmentation/lib/inference';
import {drawMatte} from '../../../entities/segmentation/lib/drawMatte';
import {drawHidden} from '../../../entities/segmentation/lib/drawHidden';
import {BACKGROUND_OPTIONS} from '../../../shared/config/constants';
import styles from './VideoSegmentationWidget.module.css';

export const VideoSegmentationWidget: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>('white');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    // Refs for TensorFlow resources
    const modelRef = useRef<tf.GraphModel | null>(null);
    const webcamRef = useRef<tf.data.WebcamIterator | null>(null);
    const recurrentStatesRef = useRef(initializeRecurrentStates());
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Load model
                console.log('Loading model...');
                modelRef.current = await loadSegmentationModel();

                // // Setup webcam
                // if (videoRef.current) {
                //     console.log('Setting up webcam...');
                //     webcamRef.current = await setupWebcam(videoRef.current);
                // }

                setIsLoading(false);

            } catch (err) {
                console.error('Initialization error:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize');
                setIsLoading(false);
            }
        };

        initializeApp();

        // Cleanup function
        return () => {
            stopInference();
            if (modelRef.current) {
                modelRef.current.dispose();
            }
            if (recurrentStatesRef.current) {
                Object.values(recurrentStatesRef.current).forEach(tensor => tensor.dispose());
            }
        };
    }, []);

    useEffect(() => {
        const setupWebcamAs = async () => {
            if (videoRef.current) {
                console.log('Setting up webcam...');
                webcamRef.current = await setupWebcam(videoRef.current);
                startInference();
            }
        }
        setupWebcamAs();
    }, [videoRef.current])

    const startInference = async () => {
        if (!modelRef.current || !webcamRef.current || !canvasRef.current || isRunning) {
            return;
        }

        setIsRunning(true);

        const inferenceLoop = async () => {
            if (!modelRef.current || !webcamRef.current || !canvasRef.current || !isRunning) {
                return;
            }

            try {
                await tf.nextFrame();

                // Capture frame
                const src = await captureFrame(webcamRef.current);

                // Perform inference
                const outputs = await performInference(modelRef.current, src, recurrentStatesRef.current);

                // Render based on selected view
                await renderOutput(outputs, canvasRef.current);

                // Dispose old tensors and update recurrent states
                tf.dispose([src, ...Object.values(recurrentStatesRef.current)]);
                recurrentStatesRef.current = {
                    r1: outputs.r1o,
                    r2: outputs.r2o,
                    r3: outputs.r3o,
                    r4: outputs.r4o,
                };

                // Continue loop
                animationFrameRef.current = requestAnimationFrame(inferenceLoop);
            } catch (err) {
                console.error('Inference error:', err);
                setError(err instanceof Error ? err.message : 'Inference failed');
                setIsRunning(false);
            }
        };

        inferenceLoop();
    };

    const stopInference = () => {
        setIsRunning(false);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };

    const renderOutput = async (outputs: any, canvas: HTMLCanvasElement) => {
        const backgroundConfig = BACKGROUND_OPTIONS.find(bg => bg.value === selectedBackground);

        switch (selectedBackground) {
            case 'recurrent1':
                await drawHidden(outputs.r1o, canvas);
                break;
            case 'recurrent2':
                await drawHidden(outputs.r2o, canvas);
                break;
            case 'recurrent3':
                await drawHidden(outputs.r3o, canvas);
                break;
            case 'recurrent4':
                await drawHidden(outputs.r4o, canvas);
                break;
            case 'alpha':
                await drawMatte(null, outputs.pha.clone(), canvas);
                break;
            case 'foreground':
                await drawMatte(outputs.fgr.clone(), null, canvas);
                break;
            default: // 'white' or 'green'
                await drawMatte(outputs.fgr.clone(), outputs.pha.clone(), canvas);
                break;
        }

        // Set background color for canvas
        if (backgroundConfig && canvas) {
            canvas.style.background = backgroundConfig.background;
        }

        // Dispose outputs
        Object.values(outputs).forEach((tensor: any) => {
            if (tensor && typeof tensor.dispose === 'function') {
                tensor.dispose();
            }
        });
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading model and initializing webcam...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Error: {error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <BackgroundSelector
                value={selectedBackground}
                onChange={setSelectedBackground}
                className={styles.selector}
            />
            <div className={styles.videoContainer}>
                <Video ref={videoRef} className={styles.video}/>
                <Canvas
                    ref={canvasRef}
                    className={styles.canvas}
                    backgroundColor={BACKGROUND_OPTIONS.find(bg => bg.value === selectedBackground)?.background}
                />
            </div>
            <div className={styles.status}>
                Status: {isRunning ? 'Running' : 'Stopped'}
            </div>
        </div>
    );
};