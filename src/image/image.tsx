import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { detectEmotions, type Emotion } from "./faceDetection";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";

function Image() {
  const [image, setImage] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);

      const img: HTMLImageElement = new window.Image();
      img.src = URL.createObjectURL(file);

      const processImage = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const size = Math.min(500, window.innerWidth - 20);

        canvas.width = size;
        canvas.height = size;

        const scale = Math.max(size / img.width, size / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        const offsetX = (size - scaledWidth) / 2;
        const offsetY = (size - scaledHeight) / 2;

        ctx?.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        const imgUrl = canvas.toDataURL("image/jpeg");
        setImage(imgUrl);

        const resizedFile = await new Promise<File>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            }
          }, "image/jpeg");
        });

        const results = await detectEmotions(resizedFile);
        setEmotions(results);
        setLoading(false);

        URL.revokeObjectURL(img.src);
      };

      if (img.complete) {
        processImage();
      } else {
        img.onload = processImage;
      }
    }
  };

  useEffect(() => {
    if (image && imgRef.current && canvasRef.current) {
      const img = imgRef.current;
      const canvas = canvasRef.current;

      const draw = async () => {
        canvas.width = img.width;
        canvas.height = img.height;

        const detections = await faceapi
          .detectAllFaces(img)
          .withFaceLandmarks()
          .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, {
          width: img.width,
          height: img.height,
        });
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      };

      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
      }
    }
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  return (
    <div className={styles.container}>
      <a href="/" className={styles.backLink}>
        Quay về Trang Chủ
      </a>
      <h1 className={styles.title}>Nhận diện cảm xúc gương mặt</h1>
      <label className={styles.fileInput}>
        Chọn ảnh
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
        />
      </label>
      {loading && <p className={styles.loading}>Đang xử lý...</p>}
      {image && (
        <div className={styles.imageContainer}>
          <img
            ref={imgRef}
            src={image}
            alt="Uploaded"
            className={styles.image}
          />
          {loading && (
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
            </div>
          )}
          <canvas ref={canvasRef} className={styles.overlay} />
        </div>
      )}
      {emotions.length > 0 && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>Kết quả:</h2>
          <ul className={styles.resultsList}>
            {emotions.map((emotion, index) => (
              <li
                key={index}
                className={styles.resultItem}
                style={{ color: emotion.data.color }}
              >
                {emotion.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Image;
