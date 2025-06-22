import { Link } from "react-router-dom";
import styles from "./style.module.scss";

const Home: React.FC = () => {
    return (
        <div className={styles.home}>
            <header className={styles.header}>
                <h1 className={styles.title}>Nhận Diện Cảm Xúc Khuôn Mặt</h1>
                <p className={styles.subtitle}>
                    Khám phá cảm xúc qua hình ảnh hoặc video thời gian thực
                </p>
            </header>

            <main className={styles.main}>
                <section className={styles.features}>
                    <div className={styles.featureCard}>
                        <div className={styles.cardIcon}>📸</div>
                        <h2 className={styles.cardTitle}>Tải Lên Hình Ảnh</h2>
                        <p className={styles.cardDescription}>
                            Tải lên một bức ảnh và phân tích cảm xúc trên khuôn mặt một cách nhanh chóng và chính xác.
                        </p>
                        <Link to="/image" className={styles.cardButton}>
                            Thử Ngay
                        </Link>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.cardIcon}>🎥</div>
                        <h2 className={styles.cardTitle}>Video Streaming</h2>
                        <p className={styles.cardDescription}>
                            Sử dụng webcam để nhận diện cảm xúc khuôn mặt theo thời gian thực.
                        </p>
                        <Link to="/streaming" className={styles.cardButton}>
                            Thử Ngay
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;