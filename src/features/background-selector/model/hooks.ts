import { useCallback } from 'react';
import { useSelectedBackground, useSegmentationActions } from '../../../shared/store';
import { BackgroundOption } from './types';

/**
 * Hook for managing background selection
 */
export const useBackgroundSelection = () => {
    const selectedBackground = useSelectedBackground();
    const { setSelectedBackground } = useSegmentationActions();

    const handleBackgroundChange = useCallback((background: BackgroundOption) => {
        setSelectedBackground(background);
    }, [setSelectedBackground]);

    return {
        selectedBackground,
        setSelectedBackground: handleBackgroundChange,
    };
};

/**
 * Hook for getting available background options
 */
export const useBackgroundOptions = () => {
    // This could be extended to dynamically load options from API or config
    return {
        // Background options are imported from constants in the component
        // This hook can be extended for dynamic options in the future
    };
};