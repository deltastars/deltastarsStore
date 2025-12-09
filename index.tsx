import React from 'react';
import ReactDOM from 'react-dom/client';
import { injectSpeedInsights } from '@vercel/speed-insights';
import App from './App';
import './index.css';

// Inject Vercel Speed Insights for performance monitoring
// This must run on the client side only
if (typeof window !== 'undefined') {
  injectSpeedInsights();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
