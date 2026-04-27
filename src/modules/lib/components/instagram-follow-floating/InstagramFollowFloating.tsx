import { AiOutlineInstagram } from 'react-icons/ai';
import { GoArrowRight } from 'react-icons/go';

import styles from './InstagramFollowFloating.module.scss';

const INSTAGRAM_URL = 'https://www.instagram.com/theasoebiafrica/';

export default function InstagramFollowFloating() {
  return (
    <a
      className={styles.wrapper}
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow us on Instagram"
      title="Follow us on Instagram"
    >
      <span className={styles.iconWrap} aria-hidden="true">
        <AiOutlineInstagram className={styles.icon} />
      </span>

      {/* <span className={styles.text}>Follow us on Instagram</span> */}
      <span className={styles.text}>See our latest looks</span>

      <span className={styles.arrow} aria-hidden="true">
        <GoArrowRight />
      </span>
    </a>
  );
}

