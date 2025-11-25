
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary" role="status">
        <span className="sr-only">Loading...</span>
    </div>
  </div>
);
