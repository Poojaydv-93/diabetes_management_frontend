import React from 'react';
import { withRouter } from "react-router-dom";
import { useGoogleLogout } from 'react-google-login';
//import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';

const clientId = '605293844765-f1ssb58dhs05b5516pbn5j89un0iahjb.apps.googleusercontent.com';

function Header(props) {
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
    if(props.location.pathname === '/') {
        title = 'Diabetes management'
    }
    function renderLogout() {
        if(props.location.pathname === '/home'){
            return(
                <div className="ml-auto">
                    {(sessionStorage.account_type == '1') ? 
                    <button className="btn btn-danger" onClick={ signOut }>Logout</button>
                    :
                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                    }
                    
                </div>
            )
        }
    }
    const onLogoutSuccess = (res) => {
        //alert('Logged out successfully');
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('is_active');
        sessionStorage.removeItem('account_type');
        props.updateTitle('Diabetes management');
        props.history.push('/');
    };

    const onFailure = () => {
        console.log('Handle failure cases');
    };
    const { signOut } = useGoogleLogout({
        clientId,
        onLogoutSuccess,
        onFailure,
    });
    function handleLogout() {
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('is_active');
        sessionStorage.removeItem('account_type');
        props.updateTitle('Diabetes management');
        props.history.push('/');
        
    }
    return(
        <nav className="navbar navbar-dark bg-primary">
            <div className="row col-12 d-flex justify-content-center text-white">
                <span className="h3">{props.title || title}</span>
                {renderLogout()}
            </div>
        </nav>
    )
}
export default withRouter(Header);