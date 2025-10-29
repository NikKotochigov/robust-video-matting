// entities/segmentation/model/types.ts
import * as tf from '@tensorflow/tfjs';

export interface RecurrentStates {
    r1: tf.Tensor;
    r2: tf.Tensor;
    r3: tf.Tensor;
    r4: tf.Tensor;
}

export interface SegmentationOutputs {
    fgr: tf.Tensor;
    pha: tf.Tensor;
    r1o: tf.Tensor;
    r2o: tf.Tensor;
    r3o: tf.Tensor;
    r4o: tf.Tensor;
}

export interface SegmentationInputs {
    src: tf.Tensor;
    r1i: tf.Tensor;
    r2i: tf.Tensor;
    r3i: tf.Tensor;
    r4i: tf.Tensor;
    downsample_ratio: tf.Tensor;
}

export type ViewOption =
    'white'
    | 'green'
    | 'alpha'
    | 'foreground'
    | 'recurrent1'
    | 'recurrent2'
    | 'recurrent3'
    | 'recurrent4';

export interface SegmentationModel {
    model: tf.GraphModel | null;
    isLoaded: boolean;
    isRunning: boolean;
    recurrentStates: RecurrentStates;
}