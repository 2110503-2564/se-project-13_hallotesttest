"use client"
import styles from './topmenu.module.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TopMenuItem ({title, pageRef} : {title: string, pageRef: string}) {
    const pathname = usePathname();
    const isActive = pathname === pageRef;
    
    return (
        <Link className={`${styles.itemcontainer} ${isActive ? styles.active : ''}`} href={pageRef}>
            <span className={styles.itemtext}>{title}</span>
            {isActive && <div className={styles.activeindicator}></div>}
        </Link>
    );
}