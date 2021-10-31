import { useSelector } from "react-redux";
import Dots from "../Spinner/Dots";
import styles from "./Status.module.scss";

const Status = () => {
  const { calculating, done, total } = useSelector(state => state.status);

  return (
    calculating && (
      <div className={styles.p}>
        {`Finding paths: ${done} / ${total} done`} <Dots />
      </div>
    )
  );
};
export default Status;
