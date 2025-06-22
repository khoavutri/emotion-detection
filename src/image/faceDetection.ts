import * as faceapi from 'face-api.js';
import { statusIcons } from '../constant/emoji';

export type Emotion = {
    text: string;
    data: any
}

export async function detectEmotions(file: File): Promise<Emotion[]> {
    const img = await faceapi.bufferToImage(file);
    const detections = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceExpressions();

    const emotions: Emotion[] = [];
    detections.forEach((detection) => {
        const expressions: any = detection.expressions;
        const maxExpression = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
        );
        emotions.push({ text: `Cảm xúc: ${statusIcons[maxExpression]?.text} ${statusIcons[maxExpression]?.emoji || ""}`, data: statusIcons[maxExpression] });
    });

    return emotions;
}