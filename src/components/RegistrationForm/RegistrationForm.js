import React, {useState} from 'react';
import { withRouter } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';

const clientId = '605293844765-f1ssb58dhs05b5516pbn5j89un0iahjb.apps.googleusercontent.com';
function RegistrationForm(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        confirmPassword : "",
        successMessage: null,
        emailError : ""
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    //validations
    const validate = () => {
        if(state.email == '' || state.password == ''){
            props.showError('Enter valid email and password');
            return false;
        }else{
            if(typeof state.email !== "undefined"){
                if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(state.email)) { 
                    console.log('result true');   
                    props.showError(null); 
                    //return true;   
                }else{
                    console.log('result false')      
                    props.showError('Please enter valid email address.');  
                    return false;
                }
            }
            if(state.password !== state.confirmPassword) {                
                props.showError('Passwords do not match');  
                return false;
            }
        }
        return true;
        
    }
    //submit form
    const handleSubmitClick = (e) => {
        e.preventDefault();
        const isValid = validate();
        if(isValid){
            sendDetailsToServer()  
        }
            
    }
    // api call to send details to server
    const sendDetailsToServer = () => {
        if(state.email.length && state.password.length) {
            console.log('send details here');
            props.showError(null);
            // POST request using fetch with error handling
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"email":state.email, "password":state.password})
            };
            fetch('http://localhost:5000/api/registerUser', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log('response.status - ',data.status);
                    // check for error response
                    if (data.status == 200) {
                        console.log('response :',response);
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Activatation link has been send to your mail,activate your account to login..'
                        }))
                        //redirectToLogin();
                        props.showError(null)    
                        //this.setState({ postId: data.id })
                    }else if(data.status == 400){                       
                        props.showError("Email address already exist");
                    }else{
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        props.showError(error);
                        //return Promise.reject(error);
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
    const redirectToLogin = () => {
        props.history.push('/login'); 
        props.updateTitle('Login');
    }
    const onSuccess = (res) => {
        console.log('[Login Success] currentUser:',res.profileObj);
        console.log('[Login Success] google id:',res.profileObj.googleId);
        console.log('[Login Success] email:',res.profileObj.email);

        // google register
        if(res.profileObj.googleId && res.profileObj.email) {
            console.log('send google reg details here');
            props.showError(null);
            // POST request using fetch with error handling
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"email":res.profileObj.email, "googleId":res.profileObj.googleId})
            };
            fetch('http://localhost:5000/api/google_registeration', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log('response.status - ',data.status);
                    // check for error response
                    if (data.status == 200) {
                        console.log('response :',response);
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Activatation link has been send to your mail,activate your account to login..'
                        }))
                        //redirectToLogin();
                        props.showError(null)    
                        //this.setState({ postId: data.id })
                    }else if(data.status == 400){                       
                        props.showError("Email address already exist");
                    }else{
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        props.showError(error);
                        //return Promise.reject(error);
                    }

                })
                .catch(error => {
                    //this.setState({ errorMessage: error.toString() });
                    console.error('There was an error!', error);
                });
  
        } else {
            props.showError('Invalid user email')    
        }

    }
    const onFailure = (res) => {
        console.log('[Login Failed] res:',res);
    } 
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
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        placeholder="Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Register
                </button>
            </form>
            
            <span>or</span>
            <GoogleLogin
                clientId={clientId}
                buttonText="Register"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                style={{ marginTop: '100px' }}
                isSignedIn={true}            
            />
            <div className="loginMessage">
                <span>Have an account? </span>
                <span className="registerText" onClick={() => redirectToLogin()}>Login</span> 
            </div>
        </div>
    )
}
export default withRouter(RegistrationForm);