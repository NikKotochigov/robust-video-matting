// shared/lib/tensorflow/setupWebcam.ts
import * as tf from '@tensorflow/tfjs';
import {SEGMENTATION_CONFIG} from '../../config/constants';

export const setupWebcam = async (videoElement: HTMLVideoElement): Promise<tf.data.WebcamIterator> => {
    try {
        videoElement.width = SEGMENTATION_CONFIG.VIDEO_WIDTH;
        videoElement.height = SEGMENTATION_CONFIG.VIDEO_HEIGHT;

        const webcam = await tf.data.webcam(videoElement);
        console.log('Webcam setup successful');
        return webcam;
    } catch (error) {
        console.error('Failed to setup webcam:', error);
        throw new Error(`Failed to setup webcam: ${error}`);
    }
};

export const captureFrame = async (webcam: tf.data.WebcamIterator): Promise<tf.Tensor> => {
    const img = await webcam.capture();
    return tf.tidy(() => img.expandDims(0).div(255)); // normalize input
};