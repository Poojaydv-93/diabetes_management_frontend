import React from 'react';
import { withRouter } from 'react-router-dom';

function Dashboard(props) {
    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }
    const redirectToLogin = () => {
        props.history.push('/login'); 
        props.updateTitle('Login');
    }
    return(
        <div className="mt-2">
            <button className="btn btn-success login-btn" onClick={() => redirectToLogin()}>Login</button>
            &nbsp;&nbsp;&nbsp;
            <button className="btn btn-danger" onClick={() => redirectToRegister()}>Register</button>
        </div>
        
        // <div className="mt-2">
        //     <div className="loginMessage">                
        //         <span className="loginText" onClick={() => redirectToLogin()}>Login</span> 
        //     </div>
        //     <div className="registerMessage">
        //         <span className="registerText" onClick={() => redirectToRegister()}>Register</span> 
        //     </div>
        // </div>
        
    )
}

export default withRouter(Dashboard);