// ErrorPage.jsx
import React from 'react';
import { useRouteError } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700 p-8 text-center">
            <h1 className="text-6xl mb-4">Oops!</h1>
            <h2 className="text-2xl">Something went wrong.</h2>
            <p>{error.statusText || 'Unexpected Error'}</p>
            <p>Sorry for the inconvenience, please try again later.</p>
            <button
                onClick={handleGoHome}
                className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
            >
                Go to Home
            </button>
        </div>
    );
};

export default ErrorPage;
