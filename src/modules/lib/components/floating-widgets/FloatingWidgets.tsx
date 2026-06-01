'use client';

import { useState } from 'react';

import InstagramFollowFloating from '@/modules/lib/components/instagram-follow-floating/InstagramFollowFloating';
import SuggestionFloating from '@/modules/lib/components/suggestion-floating/SuggestionFloating';

import { useFloatingWidgetsSequence } from './use-floating-widgets-sequence';

export default function FloatingWidgets() {
  const [rotationPaused, setRotationPaused] = useState(false);
  const {
    instagramPillExpanded,
    instagramFaded,
    suggestionPillExpanded,
    suggestionFaded,
  } = useFloatingWidgetsSequence(rotationPaused);

  return (
    <>
      <InstagramFollowFloating
        orchestrated
        pillExpanded={instagramPillExpanded}
        faded={instagramFaded}
      />
      <SuggestionFloating
        orchestrated
        pillExpanded={suggestionPillExpanded}
        faded={suggestionFaded}
        onFormOpenChange={setRotationPaused}
      />
    </>
  );
}
