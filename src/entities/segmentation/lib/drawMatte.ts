import * as tf from '@tensorflow/tfjs';

export const drawMatte = async (
    fgr: tf.Tensor | null,
    pha: tf.Tensor | null,
    canvas: HTMLCanvasElement
): Promise<void> => {
    const rgba = tf.tidy(() => {
        const rgb = (fgr !== null) ?
            fgr.squeeze(0).mul(255).cast('int32') :
            tf.fill([pha!.shape[1], pha!.shape[2], 3], 255, 'int32');
        const a = (pha !== null) ?
            pha.squeeze(0).mul(255).cast('int32') :
            tf.fill([fgr!.shape[1], fgr!.shape[2], 1], 255, 'int32');
        return tf.concat([rgb, a], -1);
    });

    fgr && fgr.dispose();
    pha && pha.dispose();

    const [height, width] = rgba.shape.slice(0, 2);
    const pixelData = new Uint8ClampedArray(await rgba.data());
    const imageData = new ImageData(pixelData, width, height);

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.putImageData(imageData, 0, 0);

    rgba.dispose();
};