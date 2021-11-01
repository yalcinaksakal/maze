import styles from "./p.module.scss";

const Paragraph = () => (
  <p className={styles.p}>
    Drag to rotate
    <br />
    Zoom in/out
    <br />
    Right click (Two touches) drag to pan
  </p>
);
export default Paragraph;
