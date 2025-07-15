import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin((prevMode) => !prevMode);
    };

    return (
        <div className="auth-container">
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            {isLogin ? <Login toggleAuthMode={toggleAuthMode} /> : <Register toggleAuthMode={toggleAuthMode} />}
            <p>
                {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
                <Link to="#" onClick={toggleAuthMode}>
                    {isLogin ? ' Register' : ' Login'}
                </Link>
            </p>
        </div>
    );
};

export default Auth;