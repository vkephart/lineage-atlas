import React from 'react';
import { createRoot } from 'react-dom/client';
import { Atlas } from './Atlas';
import './atlas.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Atlas />
  </React.StrictMode>,
);
