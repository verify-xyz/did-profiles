import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/styleApp.css';
import './styles/styleLayout.css';
import './styles/styleContact.css';
import './styles/styleWallet.css';
import './styles/stylePublish.css';
import './styles/styleView.css';
import './styles/styleToggleButton.css';
import './styles/styleHome.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
