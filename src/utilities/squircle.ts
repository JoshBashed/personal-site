import { getSvgPath } from 'figma-squircle';

interface CreateSquircleConfig {
    width: number;
    height: number;
    cornerRadius: number;
    cornerSmoothing: number;
}

export const createSquircle = (config: CreateSquircleConfig) =>
    getSvgPath(config);
