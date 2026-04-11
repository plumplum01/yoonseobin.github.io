import site from "../data/site.json";
import styles from "./Footer.module.css";

interface FooterProps {
    variant: "desktop" | "mobile";
}

export default function Footer({ variant }: FooterProps) {
    const isMobile = variant === "mobile";
    const wrapperStyle = isMobile ? styles.mobile : styles.desktop;
    const copyrightOrder = isMobile ? "order-last" : "order-first";
    const emailOrder = isMobile ? "order-first" : "order-last";

    return (
        <footer className={`t-footer ${wrapperStyle}`}>
            <div>
                <span>{site.nameDisplay}</span>
            </div>
            <div className={styles.info}>
                <span className={copyrightOrder}>ⓒ2026</span>
                <span className={emailOrder}>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                </span>
            </div>
        </footer>
    );
}
