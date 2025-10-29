import * as tf from '@tensorflow/tfjs';
import {SEGMENTATION_CONFIG} from '../../config/constants';

export const loadSegmentationModel = async (): Promise<tf.GraphModel> => {
    try {
        console.log('Loading segmentation model...');
        const model = await tf.loadGraphModel(SEGMENTATION_CONFIG.MODEL_PATH);
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Failed to load model:', error);
        throw new Error(`Failed to load segmentation model: ${error}`);
    }
};

export const initializeRecurrentStates = () => {
    return {
        r1: tf.tensor(0.),
        r2: tf.tensor(0.),
        r3: tf.tensor(0.),
        r4: tf.tensor(0.),
    };
};