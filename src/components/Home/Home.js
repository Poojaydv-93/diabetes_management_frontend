import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../../constants/apiConstants';
function Home(props) {
    const session_user_id = sessionStorage.id;
    let loggedIn = true
    const [state , setState] = useState({        
        loggedIn
    })
    if(session_user_id == null){
        loggedIn = false
    }

    console.log('logged in check :',loggedIn);
    if(loggedIn == false){
        props.updateTitle('Diabetes management')
        props.history.push('/');
    }
    return(
        <div className="mt-2">
           Welcome {sessionStorage.id} - {sessionStorage.email}
        </div>
    )
}

export default withRouter(Home);