import styles from "./p.module.scss";

const Paragraph = () => (
  <p className={styles.p}>
    Drag to rotate
    <br />
    Zoom in/out
  </p>
);
export default Paragraph;
