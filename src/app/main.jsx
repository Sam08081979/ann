/**
 * Точка входа приложения
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CreditCalculator } from '../pages/CreditCalculator/index.js';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CreditCalculator />
  </React.StrictMode>
);

