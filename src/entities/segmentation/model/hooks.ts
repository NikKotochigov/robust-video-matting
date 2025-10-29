import { useCallback, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useSegmentationStore, useSegmentationActions } from '../../../shared/store';
import { loadSegmentationModel } from '../../../shared/lib/tensorflow/loadModel';
import { setupWebcam, captureFrame } from '../../../shared/lib/tensorflow/setupWebcam';
import { performInference } from '../lib/inference';
import { drawMatte } from '../lib/drawMatte';
import { drawHidden } from '../lib/drawHidden';
import { BACKGROUND_OPTIONS } from '../../../shared/config/constants';

/**
 * Hook for initializing the segmentation model and webcam
 */
export const useSegmentationInit = () => {
    const actions = useSegmentationActions();
    const { model, webcam, isLoading } = useSegmentationStore(state => ({
        model: state.model,
        webcam: state.webcam,
        isLoading: state.isLoading,
    }));

    const initializeModel = useCallback(async () => {
        try {
            actions.setLoading(true);
            actions.setError(null);

            console.log('Loading model...');
            const loadedModel = await loadSegmentationModel();
            actions.setModel(loadedModel);

            actions.setLoading(false);
        } catch (err) {
            console.error('Model initialization error:', err);
            actions.setError(err instanceof Error ? err.message : 'Failed to load model');
            actions.setLoading(false);
        }
    }, [actions]);

    const initializeWebcam = useCallback(async (videoElement: HTMLVideoElement) => {
        try {
            if (!videoElement) return;
            
            console.log('Setting up webcam...');
            const webcamIterator = await setupWebcam(videoElement);
            actions.setWebcam(webcamIterator);
        } catch (err) {
            console.error('Webcam initialization error:', err);
            actions.setError(err instanceof Error ? err.message : 'Failed to setup webcam');
        }
    }, [actions]);

    return {
        model,
        webcam,
        isLoading,
        initializeModel,
        initializeWebcam,
    };
};

/**
 * Hook for managing segmentation inference loop
 */
export const useSegmentationInference = () => {
    const {
        model,
        webcam,
        recurrentStates,
        isRunning,
        selectedBackground,
    } = useSegmentationStore(state => ({
        model: state.model,
        webcam: state.webcam,
        recurrentStates: state.recurrentStates,
        isRunning: state.isRunning,
        selectedBackground: state.selectedBackground,
    }));
    
    const actions = useSegmentationActions();
    const animationFrameRef = useRef<number | null>(null);

    const startInference = useCallback(async (canvasElement: HTMLCanvasElement) => {
        if (!model || !webcam || !canvasElement || isRunning) {
            return;
        }

        actions.setRunning(true);
        actions.setError(null);

        const inferenceLoop = async () => {
            if (!model || !webcam || !canvasElement || !isRunning) {
                return;
            }

            try {
                const startTime = performance.now();
                await tf.nextFrame();

                // Capture frame
                const src = await captureFrame(webcam);
                const captureTime = performance.now();

                // Perform inference
                const outputs = await performInference(model, src, recurrentStates);
                const inferenceEndTime = performance.now();

                // Render output
                await renderOutput(outputs, canvasElement, selectedBackground);
                const renderTime = performance.now();

                // Update performance metrics
                const totalTime = renderTime - startTime;
                actions.updateInferenceTime(inferenceEndTime - captureTime);
                actions.updateFPS(1000 / totalTime);
                actions.updateLastFrameTime(Date.now());

                // Update recurrent states
                actions.updateRecurrentStates({
                    r1: outputs.r1o,
                    r2: outputs.r2o,
                    r3: outputs.r3o,
                    r4: outputs.r4o,
                });

                // Dispose input tensor
                tf.dispose([src]);

                // Continue loop
                if (isRunning) {
                    animationFrameRef.current = requestAnimationFrame(inferenceLoop);
                }
            } catch (err) {
                console.error('Inference error:', err);
                actions.setError(err instanceof Error ? err.message : 'Inference failed');
                actions.setRunning(false);
            }
        };

        inferenceLoop();
    }, [model, webcam, recurrentStates, isRunning, selectedBackground, actions]);

    const stopInference = useCallback(() => {
        actions.setRunning(false);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }, [actions]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return {
        isRunning,
        startInference,
        stopInference,
    };
};

/**
 * Helper function to render segmentation output
 */
const renderOutput = async (
    outputs: any,
    canvas: HTMLCanvasElement,
    selectedBackground: string
) => {
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