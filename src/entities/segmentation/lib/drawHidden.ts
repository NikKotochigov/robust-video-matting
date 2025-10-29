import * as tf from '@tensorflow/tfjs';

export const drawHidden = async (r: tf.Tensor, canvas: HTMLCanvasElement): Promise<void> => {
    const rgba = tf.tidy(() => {
        let tensor = r.unstack(-1);
        tensor = tf.concat(tensor, 1);
        tensor = tensor.split(4, 1);
        tensor = tf.concat(tensor, 2);
        tensor = tensor.squeeze(0);
        tensor = tensor.expandDims(-1);
        tensor = tensor.add(1).mul(127.5).cast('int32');
        tensor = tensor.tile([1, 1, 3]);
        tensor = tf.concat([tensor, tf.fill([tensor.shape[0], tensor.shape[1], 1], 255, 'int32')], -1);
        return tensor;
    });

    const [height, width] = rgba.shape.slice(0, 2);
    const pixelData = new Uint8ClampedArray(await rgba.data());
    const imageData = new ImageData(pixelData, width, height);

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.putImageData(imageData, 0, 0);

    rgba.dispose();
};