import { useLocation } from 'react-router';
import styles from './Notification.module.scss';

const Notification = () => {
    const location = useLocation();

    return (
        <div>
            {location.state && (
                <div
                    className={`${styles.notification} ${location.state.success ? styles.success : styles.error}`}
                    role="alert"
                >
                    {location.state.message}
                </div>
            )}
        </div>
    );
};

export default Notification;