import styles from "./Dots.module.css";

const Dots = () => (
  <div className={styles.spinner}>
    <div className={styles.step1}></div>
    <div className={styles.step2}></div>
    <div className={styles.step3}></div>
  </div>
);
export default Dots;
