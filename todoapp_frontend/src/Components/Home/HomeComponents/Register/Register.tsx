import * as React from 'react';
import './Register.scss';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function Register(props: any) {

    const axios = require('axios').default;
    let history = useHistory();
    const [, setCookie] = useCookies(['token']);

    const [register, setRegister] = React.useState({
        name: "",
        email: "",
        password: "",
        categories: ["MY DAY", "GROCERIES"],
        repeatpassword: "",
    });

    const [registerErrors, setRegisterError] = React.useState({
        username: '',
        email: '',
        password: '',
    });

    const [registerAction, setRegisterAction] = React.useState(true);

    React.useEffect(
        () => {
            setRegisterAction(!(registerErrors.username === '' && registerErrors.password === '' && registerErrors.email === '' && register.name.length > 0 && register.email.length > 0 && register.password.length > 0 && register.password.length > 0));
        },
        [registerErrors, register],
    );

    //Updates the state every keystroke
    function changeHandlerRegister(e: any) {
        setRegister({
            ...register,
            [e.target.name]: e.target.value
        })
    }

    //Check their existance one by one on the database.
    function checkUsername() {
        if (register.name !== '') {
            axios.get(process.env.REACT_APP_API + '/users/check/user/' + register.name).then(function (response: any) {
                setRegisterError({ ...registerErrors, username: response.data });
            })
        }
    }

    function checkEmail() {
        if (register.email !== '') {
            axios.get(process.env.REACT_APP_API + '/users/check/email/' + register.email).then(function (response: any) {
                setRegisterError({ ...registerErrors, email: response.data });
            })
        }
    }

    function checkPassword() {
        setRegisterError({ ...registerErrors, password: (register.password === register.repeatpassword) ? '' : 'Passwords must match' });
    }

    //Sumbit function that registers the user and logs them in.
    function submitRegister() {
        const { repeatpassword, ...lmao } = register;
        axios.post(process.env.REACT_APP_API + '/users/create', lmao)
            .then(function (response: any) {
                axios.post(process.env.REACT_APP_API + '/auth/login', { username: lmao.name, password: lmao.password }).then(function (response: any) {
                    setCookie('token', response.data.access_token, { maxAge: 60 * 20 });
                    history.push('/todolist');
                }).catch(
                    function (error: any) {
                        console.log(error);
                    }
                );
            }).catch(function (error: any) {
                console.log("error with the creation lol");
            });
    }

    return (
        <div className="register-wrapper" onSubmit={() => false}>
            <div className="register-title">
                REGISTER
            </div>
            <form className="register-form-wrapper" onSubmit={e => { e.preventDefault(); submitRegister() }}>
                <div className="register-form-inputs">
                    <input type="text"
                        placeholder="Username"
                        name="name"
                        onChange={changeHandlerRegister}
                        onBlur={checkUsername}
                        className={(registerErrors.username === '') ? '' : 'register-form-input-error'}
                    ></input>
                    <div className="register-form-error">{registerErrors.username}</div>
                </div>
                <div className="register-form-inputs">
                    <input
                        onChange={changeHandlerRegister}
                        placeholder="Email"
                        name="email"
                        type="text"
                        onBlur={checkEmail}
                        className={(registerErrors.email === '') ? '' : 'register-form-input-error'}
                    ></input>
                    <div className="register-form-error">{registerErrors.email}</div>
                </div>
                <div className="register-form-inputs">
                    <input
                        onChange={changeHandlerRegister}
                        placeholder="Password"
                        name="password"
                        type="password"
                        onBlur={checkPassword}
                        className={(registerErrors.password === '') ? '' : 'register-form-input-error'}
                    ></input>
                    <div className="register-form-error">{registerErrors.password}</div>
                </div>
                <div className="register-form-inputs">
                    <input
                        onChange={changeHandlerRegister}
                        placeholder="Repeat password"
                        name="repeatpassword"
                        type="password"
                        onBlur={checkPassword}
                        className={(registerErrors.password === '') ? '' : 'register-form-input-error'}
                    ></input>
                    <div className="register-form-error">{registerErrors.password}</div>
                </div>
                <input type="submit" style={{ display: 'none' }}>
                </input>
                <div>
                    <button type="button" className="register-form-button" onClick={submitRegister} disabled={registerAction}>REGISTER</button>
                </div>
            </form>
        </div>
    )
}