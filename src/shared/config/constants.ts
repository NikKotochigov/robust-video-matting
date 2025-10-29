export const SEGMENTATION_CONFIG = {
    VIDEO_WIDTH: 640,
    VIDEO_HEIGHT: 480,
    DOWNSAMPLE_RATIO: 0.5,
    MODEL_PATH: '/model/model.json',
} as const;

export const BACKGROUND_OPTIONS = [
    {value: 'white', label: 'White Background', background: 'rgb(255, 255, 255)'},
    {value: 'green', label: 'Green Background', background: 'rgb(120, 255, 155)'},
    {value: 'alpha', label: 'Alpha', background: 'rgb(0, 0, 0)'},
    {value: 'foreground', label: 'Foreground', background: 'transparent'},
    {value: 'recurrent1', label: 'Recurrent State 1', background: 'transparent'},
    {value: 'recurrent2', label: 'Recurrent State 2', background: 'transparent'},
    {value: 'recurrent3', label: 'Recurrent State 3', background: 'transparent'},
    {value: 'recurrent4', label: 'Recurrent State 4', background: 'transparent'},
] as const;