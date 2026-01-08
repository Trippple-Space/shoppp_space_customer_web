import Homepage from '@/modules/views/homepage/Homepage';
import { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<div />}>
      <Homepage />
    </Suspense>
  );
};

export default page;
