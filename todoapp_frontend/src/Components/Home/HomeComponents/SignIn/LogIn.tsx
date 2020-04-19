import * as React from 'react';
import './LogIn.scss';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function LogIn(props: any) {

    const axios = require('axios').default;
    let history = useHistory();
    const [, setCookie] = useCookies(['token']);
    const [error, setError] = React.useState(false);

    const [login, setLogin] = React.useState({
        username: "",
        password: ""
    });

    function submitLogin(){
        axios.post(process.env.REACT_APP_API+'/auth/login', login)
        .then(function(response:any){
            setCookie('token',response.data.access_token);
            history.push('/todolist');
        }).catch(function(error:any){
            setError(true);
        });
    }

    function changeHandlerLogin(e:any){
        setLogin({
            ...login,
            [e.target.name] : e.target.value,
        });
    }

    return (
        <div className="login-wrapper" onSubmit={()=>false}>
            <div className="login-title">
                LOGIN
            </div>
            <form className="login-form-wrapper" onSubmit={e => {e.preventDefault(); submitLogin()}}>
                <div className="login-form-inputs">
                    <input type="text"
                     placeholder="Username"
                     name="username"
                     onChange={changeHandlerLogin}
                    ></input>
                </div>
                <div className="login-form-inputs">
                    <input
                    onChange={changeHandlerLogin}
                    placeholder="Password"
                    name="password"
                    type="password"></input>
                </div>
                <div className="login-error-message">
                    {error && <div>Incorrect username or password</div>}
                </div>
                <input type="submit" style={{ display: 'none' }}>
                </input>
                <div>
                    <button type="button" className="login-form-button" onClick={submitLogin}>LOGIN</button>
                </div>
            </form>
        </div>
    )
}