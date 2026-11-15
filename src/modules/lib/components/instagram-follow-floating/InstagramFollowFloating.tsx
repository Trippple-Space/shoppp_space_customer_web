'use client';

import { AiOutlineInstagram } from 'react-icons/ai';

import FloatingPromoPill from '@/modules/lib/components/floating-promo-pill/FloatingPromoPill';

const INSTAGRAM_URL = 'https://www.instagram.com/shopppspace/';

type InstagramFollowFloatingProps = {
  orchestrated?: boolean;
  pillExpanded?: boolean;
  faded?: boolean;
};

export default function InstagramFollowFloating({
  orchestrated = false,
  pillExpanded = false,
  faded = false,
}: InstagramFollowFloatingProps) {
  if (!orchestrated) {
    return null;
  }

  return (
    <FloatingPromoPill
      variant="instagram"
      label="See our latest looks"
      icon={<AiOutlineInstagram />}
      href={INSTAGRAM_URL}
      orchestrated
      pillExpanded={pillExpanded}
      faded={faded}
      ariaLabel="Follow us on Instagram"
    />
  );
}
