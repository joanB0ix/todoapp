import * as React from 'react';
import './Home.scss';
import LogIn from './HomeComponents/SignIn/LogIn';
import Register from './HomeComponents/Register/Register';

export default function Home(props: any) {

    const [signPage, setSignPage] = React.useState(true);

    function changePage() {
        setSignPage(!signPage);
    }

    return (
        <div id="parent" className="home-wrapper">
            <div className="home-title">
                TODO<span>APP</span>
            </div>
            <div className="home-card">
                {
                    signPage && 
                    <LogIn/>
                }
                {
                    !signPage && 
                    <Register/>
                }
                <div className="home-switchtext">
                    {signPage && <div>Don't have an account? <span onClick={changePage}>Register.</span></div>}
                    {!signPage && <div>Already have an account? <span onClick={changePage}>Log in.</span></div>}
                </div>
            </div>
        </div>
    );
}