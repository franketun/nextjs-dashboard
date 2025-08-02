'use client';

import { useEffect, useState } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('ErrorBoundary caught an error:', error);
      setError(error);
      setHasError(true);
    };

    window.addEventListener('error', (event) => handleError(event.error));
    window.addEventListener('unhandledrejection', (event) => 
      handleError(new Error(event.reason))
    );

    return () => {
      window.removeEventListener('error', (event) => handleError(event.error));
      window.removeEventListener('unhandledrejection', (event) => 
        handleError(new Error(event.reason))
      );
    };
  }, []);

  if (hasError) {
    return fallback || (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Something went wrong
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Please refresh the page to try again.</p>
              {error && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-1 text-xs">{error.message}</pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 