import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import * as tf from '@tensorflow/tfjs';
import { SegmentationStore } from './types';
import { initializeRecurrentStates } from '../lib/tensorflow/loadModel';

export const useSegmentationStore = create<SegmentationStore>()(    
    subscribeWithSelector((set, get) => ({
        // Initial state
        model: null,
        webcam: null,
        recurrentStates: initializeRecurrentStates(),
        isLoading: true,
        isRunning: false,
        error: null,
        selectedBackground: 'white',
        fps: 0,
        inferenceTime: 0,
        lastFrameTime: 0,

        // Model management actions
        setModel: (model) => set({ model }),
        
        setWebcam: (webcam) => set({ webcam }),
        
        updateRecurrentStates: (states) => {
            const currentStates = get().recurrentStates;
            // Dispose old tensors to prevent memory leaks
            Object.values(currentStates).forEach(tensor => {
                if (tensor && typeof tensor.dispose === 'function') {
                    tensor.dispose();
                }
            });
            set({ recurrentStates: states });
        },

        // State management actions
        setLoading: (isLoading) => set({ isLoading }),
        
        setRunning: (isRunning) => set({ isRunning }),
        
        setError: (error) => set({ error }),
        
        setSelectedBackground: (selectedBackground) => set({ selectedBackground }),

        // Performance tracking actions
        updateFPS: (fps) => set({ fps }),
        
        updateInferenceTime: (inferenceTime) => set({ inferenceTime }),
        
        updateLastFrameTime: (lastFrameTime) => set({ lastFrameTime }),

        // Cleanup actions
        cleanup: () => {
            const state = get();
            
            // Dispose model
            if (state.model) {
                state.model.dispose();
            }
            
            // Dispose recurrent states
            Object.values(state.recurrentStates).forEach(tensor => {
                if (tensor && typeof tensor.dispose === 'function') {
                    tensor.dispose();
                }
            });
            
            // Stop webcam if running
            if (state.webcam) {
                // WebcamIterator doesn't have a direct stop method,
                // but we can set it to null to release reference
                set({ webcam: null });
            }
            
            set({
                model: null,
                isRunning: false,
                error: null,
            });
        },
        
        reset: () => {
            get().cleanup();
            set({
                model: null,
                webcam: null,
                recurrentStates: initializeRecurrentStates(),
                isLoading: true,
                isRunning: false,
                error: null,
                selectedBackground: 'white',
                fps: 0,
                inferenceTime: 0,
                lastFrameTime: 0,
            });
        },
    }))
);

// Selectors for optimized re-renders
export const useModel = () => useSegmentationStore(state => state.model);
export const useWebcam = () => useSegmentationStore(state => state.webcam);
export const useRecurrentStates = () => useSegmentationStore(state => state.recurrentStates);
export const useIsLoading = () => useSegmentationStore(state => state.isLoading);
export const useIsRunning = () => useSegmentationStore(state => state.isRunning);
export const useError = () => useSegmentationStore(state => state.error);
export const useSelectedBackground = () => useSegmentationStore(state => state.selectedBackground);
export const usePerformanceMetrics = () => useSegmentationStore(state => ({
    fps: state.fps,
    inferenceTime: state.inferenceTime,
    lastFrameTime: state.lastFrameTime,
}));

// Action selectors
export const useSegmentationActions = () => useSegmentationStore(state => ({
    setModel: state.setModel,
    setWebcam: state.setWebcam,
    updateRecurrentStates: state.updateRecurrentStates,
    setLoading: state.setLoading,
    setRunning: state.setRunning,
    setError: state.setError,
    setSelectedBackground: state.setSelectedBackground,
    updateFPS: state.updateFPS,
    updateInferenceTime: state.updateInferenceTime,
    updateLastFrameTime: state.updateLastFrameTime,
    cleanup: state.cleanup,
    reset: state.reset,
}));