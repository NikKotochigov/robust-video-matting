import * as tf from '@tensorflow/tfjs';
import {SegmentationInputs, SegmentationOutputs} from '../model/types';
import {SEGMENTATION_CONFIG} from '../../../shared/config/constants';

export const performInference = async (
    model: tf.GraphModel,
    src: tf.Tensor,
    recurrentStates: { r1: tf.Tensor; r2: tf.Tensor; r3: tf.Tensor; r4: tf.Tensor }
): Promise<SegmentationOutputs> => {
    const downsample_ratio = tf.tensor(SEGMENTATION_CONFIG.DOWNSAMPLE_RATIO);

    const inputs: SegmentationInputs = {
        src,
        r1i: recurrentStates.r1,
        r2i: recurrentStates.r2,
        r3i: recurrentStates.r3,
        r4i: recurrentStates.r4,
        downsample_ratio,
    };

    const [fgr, pha, r1o, r2o, r3o, r4o] = await model.executeAsync(
        inputs,
        ['fgr', 'pha', 'r1o', 'r2o', 'r3o', 'r4o']
    ) as tf.Tensor[];

    downsample_ratio.dispose();

    return {fgr, pha, r1o, r2o, r3o, r4o};
};