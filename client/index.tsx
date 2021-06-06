import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader/root';

import ErrorBoundary from './components/ErrorBoundary';
import App from './App';

const HotApp = hot(App);

const rootElement = document.getElementById('root');

ReactDOM.render(
    <StrictMode>
        <ErrorBoundary>
            <HotApp />
        </ErrorBoundary>
    </StrictMode>,
    rootElement,
);
