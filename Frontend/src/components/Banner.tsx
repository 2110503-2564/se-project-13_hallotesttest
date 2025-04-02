"use client"
import styles from './banner.module.css'
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'

export default function Banner() {
    const covers = ['/img/cover.jpg', '/img/cover2.jpg', '/img/cover3.jpg', '/img/cover4.jpg'];
    const [index, setIndex] = useState(0);
    const router = useRouter();

    // Auto-rotate images every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % 4);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.banner}>
            {/* Image with overlay */}
            <div className={styles.imageContainer}>
                <Image
                    src={covers[index % 4]}
                    alt='co-working space'
                    fill={true}
                    className={styles.bannerImage}
                    priority
                />
                <div className={styles.overlay}></div>
            </div>

            {/* Content */}
            <div className={styles.bannerContent}>
                <div className={styles.bannerText}>
                    <h1 className={styles.heading}>
                        Where Productivity <span className={styles.highlight}>Meets</span> Comfort
                    </h1>
                    <h3 className={styles.subheading}>
                        Premium co-working spaces for professionals and teams
                    </h3>
                    
                    <div className={styles.buttonGroup}>
                        <button 
                            onClick={() => router.push('/booking')}
                            className={styles.primaryButton}
                        >
                            Book a Space
                        </button>
                    </div>
                </div>

                {/* Image navigation dots */}
                <div className={styles.dots}>
                    {covers.map((_, i) => (
                        <span 
                            key={i} 
                            className={`${styles.dot} ${i === index % 4 ? styles.activeDot : ''}`}
                            onClick={() => setIndex(i)}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
}