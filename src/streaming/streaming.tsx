import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import styles from "./style.module.scss";
import { statusIcons } from "../constant/emoji";
import { Link } from "react-router-dom";

type Props = {};

const Streaming: React.FC<Props> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<string>("...");
  const [emoji, setEmoji] = useState<string>("😐");
  const [bgColor, setBgColor] = useState<string>("#02c19c");
  const [error, setError] = useState<string | null>(null);

  const isSecureContext = window.isSecureContext !== false;

  const startVideo = async () => {
    if (!videoRef.current) {
      setError("Không tìm thấy phần tử video.");
      return;
    }

    if (!isSecureContext) {
      setError(
        "Webcam chỉ hoạt động trên HTTPS hoặc localhost. Vui lòng chạy ứng dụng trong secure context."
      );
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const getUserMedia =
        (navigator as any).getUserMedia ||
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia;

      if (!getUserMedia) {
        setError("Trình duyệt của bạn không hỗ trợ truy cập webcam.");
        return;
      }

      try {
        const stream: any = await new Promise<MediaStream>(
          (resolve, reject) => {
            getUserMedia.call(
              navigator,
              { video: true },
              (stream: MediaStream) => resolve(stream),
              (err: Error) => reject(err)
            );
          }
        );

        if (videoRef.current) {
          if ("srcObject" in videoRef.current) {
            videoRef.current.srcObject = stream;
          } else {
            (videoRef.current as any).src = window.URL.createObjectURL(stream);
          }
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }
      } catch (err: any) {
        setError(`Không thể truy cập webcam: ${err.message}`);
        return;
      }
      return;
    }

    try {
      const stream: any = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        if ("srcObject" in videoRef.current) {
          videoRef.current.srcObject = stream;
        } else {
          (videoRef.current as any).src = window.URL.createObjectURL(stream);
        }
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
    } catch (err: any) {
      setError(`Không thể truy cập webcam: ${err.message}`);
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      const modelUrl = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
          faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
        ]);
        await startVideo();
      } catch (err: any) {
        setError(`Không thể tải mô hình face-api.js: ${err.message}`);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const newWidth = Math.min(500, document.documentElement.clientWidth - 20);
    video.width = newWidth;
    video.height = newWidth;
    canvas.width = newWidth;
    canvas.height = newWidth;
    video.style.width = `${newWidth}px`;
    video.style.height = `${newWidth}px`;
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newWidth}px`;

    const handlePlay = () => {
      if (!canvas || !video) return;
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      const interval = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }

        if (detections.length > 0) {
          detections.forEach((element) => {
            let maxStatus = "";
            let maxValue = 0.0;
            for (const [key, value] of Object.entries(element.expressions)) {
              if (value > maxValue) {
                maxStatus = key;
                maxValue = value;
              }
            }
            setEmoji(statusIcons[maxStatus].emoji);
            setStatus(maxStatus);
            setBgColor(statusIcons[maxStatus].color);
          });
        } else {
          setEmoji(statusIcons.default.emoji);
          setStatus("...");
          setBgColor(statusIcons.default.color);
        }
      }, 100);

      return () => clearInterval(interval);
    };

    video.addEventListener("play", handlePlay);
    return () => {
      video.removeEventListener("play", handlePlay);
    };
  }, []);

  return (
    <div className={styles.app} style={{ backgroundColor: bgColor }}>
      <Link to="/" className={styles.backButton}>
        Quay về Trang Chủ
      </Link>
      <div className={styles.container}>
        <h1 className={styles.title}>Phát hiện biểu cảm khuôn mặt</h1>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.videoWrapper}>
              <video
                ref={videoRef}
                width="640"
                height="480"
                autoPlay
                muted
                className={styles.video}
              ></video>
              <canvas ref={canvasRef} className={styles.canvas} />
            </div>
            <div className={styles.emoji}>{emoji}</div>
            <div className={styles.status}>{status}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Streaming;
