import React from 'react';
import Card from './Card';
import Button from './Button';

interface ConfigurationErrorProps {
  message: string;
  onRetry?: () => void;
}

const ConfigurationError: React.FC<ConfigurationErrorProps> = ({ message, onRetry }) => {
  return (
    <Card className="border-amber-400 bg-amber-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800 mb-1">Configuration Error</h3>
          <p className="text-sm text-amber-700 mb-3">{message}</p>
          <div className="text-xs text-amber-600 space-y-1">
            <p><strong>To fix this:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Create a <code className="bg-amber-100 px-1 rounded">.env.local</code> file in your project root</li>
              <li>Add your Supabase URL: <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL=https://your-project.supabase.co</code></li>
              <li>Add your Supabase anon key: <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY=your_key_here</code></li>
              <li>Or add Gemini API key: <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY=your_key_here</code></li>
              <li>Restart your development server</li>
            </ol>
          </div>
          {onRetry && (
            <div className="mt-3">
              <Button variant="secondary" onClick={onRetry} className="text-xs">
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ConfigurationError;