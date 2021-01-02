import React, {useState} from 'react';
//import axios from 'axios';
import './LoginForm.css';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/apiConstants';
import { withRouter } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';

//  client id : 605293844765-f1ssb58dhs05b5516pbn5j89un0iahjb.apps.googleusercontent.com
// client secret : Wtlzehbrz8XaOEjia_eZZntq

const clientId = '605293844765-f1ssb58dhs05b5516pbn5j89un0iahjb.apps.googleusercontent.com';
function LoginForm(props) {
    let loggedIn = false
    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null,
        loggedIn
    })
    const session_user_id = sessionStorage.id;
    console.log('session_user_id :',session_user_id);
    if(session_user_id){
        loggedIn = true
    }
    if(loggedIn == true){
        props.updateTitle('home')
        props.history.push('/home');
    }
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        console.log('state.password :',state.password);
        if((state.email !== '' || state.email !== null) && (state.password !== '' || state.password !== null)) {
            sendDetailsToServer()    
        } else {
            props.showError('Enter valid email and password');
        }
    }

    const sendDetailsToServer = () => {
        if(state.email.length && state.password.length) {
            console.log('login details here');
            props.showError(null);
            // POST request using fetch with error handling
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"email":state.email, "password":state.password})
            };
            fetch('http://localhost:5000/api/userlogin', requestOptions)
                .then(async response => {
                    const data = await response.json();
                   
                    console.log('response data:',data.status);
                    // check for error response
                    if (data.status == 200) {
                        console.log('response :',response);
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Login successful.Redirecting to home page..',
                            'loggedIn' : true
                        }))
                        sessionStorage.setItem('id', data.body[0].id);
                        sessionStorage.setItem('email',data.body[0].email);
                        sessionStorage.setItem('is_active',data.body[0].is_active);
                        sessionStorage.setItem('account_type',data.body[0].account_type);
                        redirectToHome();
                        props.showError(null)
                    }
                    else if(data.status == 204){
                        props.showError("Your user account in not active");
                    }
                    else{
                        props.showError("Username does not exists");
                    }
                })
                .catch(error => {
                    //this.setState({ errorMessage: error.toString() });
                    console.error('There was an error!', error);
                });
  
        } else {
            props.showError('Please enter valid username and password')    
        }
        
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }
    const onSuccess = (res) => {
        console.log('[Login Success] currentUser:',res.profileObj);
        // google login 
        if(res.profileObj.email && res.profileObj.googleId) {
            console.log('login google details here');
            props.showError(null);
            // POST request using fetch with error handling
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"email":res.profileObj.email, "googleId":res.profileObj.googleId})
            };
            fetch('http://localhost:5000/api/google_login', requestOptions)
                .then(async response => {
                    const data = await response.json();
                   
                    console.log('response data:',data.status);
                    // check for error response
                    if (data.status == 200) {
                        console.log('response :',response);
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Login successful.Redirecting to home page..',
                            'loggedIn' : true
                        }))
                        sessionStorage.setItem('id', data.body[0].id);
                        sessionStorage.setItem('email',data.body[0].email);
                        sessionStorage.setItem('is_active',data.body[0].is_active);
                        sessionStorage.setItem('account_type',data.body[0].account_type);
                        redirectToHome();
                        props.showError(null)
                    }
                    else if(data.status == 204){
                        props.showError("Your user account in not active");
                    }
                    else{
                        props.showError("Username does not exists");
                    }
                })
                .catch(error => {
                    //this.setState({ errorMessage: error.toString() });
                    console.error('There was an error!', error);
                });
  
        } else {
            props.showError('Invalid user account')    
        }
    }
    const onFailure = (res) => {
        console.log('[Login Failed] res:',res);
    }
    console.log('logged in check :',loggedIn);
    return(
        
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
          
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="Enter email" 
                       value={state.email}
                       onChange={handleChange}
                />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" 
                       className="form-control" 
                       id="password" 
                       placeholder="Password"
                       value={state.password}
                       onChange={handleChange} 
                />
                </div>
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>
           
            <span>or</span>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                style={{ marginTop: '100px' }}
                isSignedIn={true}            
            />

            <div className="registerMessage">
                <span>Dont have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
            </div>
 
        </div>


    )
}

export default withRouter(LoginForm);