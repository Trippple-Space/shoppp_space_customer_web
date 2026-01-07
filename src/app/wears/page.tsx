import Home from '@/modules/views/home/Home';
import Homepage from '@/modules/views/homepage/Homepage';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<div />}>
      <Homepage />
    </Suspense>
  );
};

export default page;
