import * as tf from '@tensorflow/tfjs';
import { BackgroundOption } from '../../features/background-selector/model/types';

export interface SegmentationState {
    // Model and resources
    model: tf.GraphModel | null;
    webcam: tf.data.WebcamIterator | null;
    recurrentStates: {
        r1: tf.Tensor;
        r2: tf.Tensor;
        r3: tf.Tensor;
        r4: tf.Tensor;
    };
    
    // Application state
    isLoading: boolean;
    isRunning: boolean;
    error: string | null;
    selectedBackground: BackgroundOption;
    
    // Performance metrics
    fps: number;
    inferenceTime: number;
    lastFrameTime: number;
}

export interface SegmentationActions {
    // Model management
    setModel: (model: tf.GraphModel | null) => void;
    setWebcam: (webcam: tf.data.WebcamIterator | null) => void;
    updateRecurrentStates: (states: SegmentationState['recurrentStates']) => void;
    
    // State management
    setLoading: (loading: boolean) => void;
    setRunning: (running: boolean) => void;
    setError: (error: string | null) => void;
    setSelectedBackground: (background: BackgroundOption) => void;
    
    // Performance tracking
    updateFPS: (fps: number) => void;
    updateInferenceTime: (time: number) => void;
    updateLastFrameTime: (time: number) => void;
    
    // Cleanup
    cleanup: () => void;
    reset: () => void;
}

export type SegmentationStore = SegmentationState & SegmentationActions;