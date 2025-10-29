// features/background-selector/model/types.ts
export type BackgroundOption =
    'white'
    | 'green'
    | 'alpha'
    | 'foreground'
    | 'recurrent1'
    | 'recurrent2'
    | 'recurrent3'
    | 'recurrent4';

export interface BackgroundConfig {
    value: BackgroundOption;
    label: string;
    background: string;
}