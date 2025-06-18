import * as faceapi from 'face-api.js';
import { statusIcons } from '../constant/emoji';

export async function detectEmotions(file: File): Promise<string[]> {
    const img = await faceapi.bufferToImage(file);
    const detections = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceExpressions();

    const emotions: string[] = [];
    detections.forEach((detection) => {
        const expressions: any = detection.expressions;
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
        );
        emotions.push(`Cảm xúc: ${maxExpression} ${statusIcons[maxExpression]?.emoji || ""}`);
    });

    return emotions;
}