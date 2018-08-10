//===============================================
// Title:  To-Do List Login System
// Author: Adil Atalay Hamamcioglu (Recoskyler)
// Date:   August 2018
//===============================================

import React from 'react';
import Firebase from 'firebase';
import {setCookie} from './Helpers/functions';

let username = "";
let password = "";
let rem = "";
let pcid = 0;

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.addUser = this.addUser.bind(this);
        this.addListener = this.addListener.bind(this);
    }

    handleClick(e) {
        let db = Firebase.database();

        db.ref('/users/').once("value").then((snapshot) => {
            const res = snapshot.val();
            username = document.getElementById("loginUN").value;
            password = document.getElementById("loginPW").value;
            rem = document.getElementById("loginCB").checked;
            
            if (snapshot.hasChild(username)) {
                pcid = res[username].pcid;

                if (res[username].password === password) {
                    if (rem) {
                        console.log((pcid).toString() + "-" + res[username].rem + "-" + username);
                        setCookie("remember", (pcid).toString() + "-" + res[username].rem + "-" + username, new Date(2019, 1, 1, 1, 1, 1, 1));
                    }
                    
                    this.props.onLogin(pcid, username);
                } else {
                    document.getElementById("loginPW").style.borderColor = "red";
                    setTimeout(function () {
                        document.getElementById("loginPW").style.borderColor = "#3949AB";
                    }, 3000);
                }
            } else {
                document.getElementById("loginUN").style.borderColor = "red";
                setTimeout(function () {
                    document.getElementById("loginUN").style.borderColor = "#3949AB";
                }, 3000);
            }
        });
    }

    addUser(e) {
        username = document.getElementById("createUN").value;
        let pw = document.getElementById("createPW").value;

        if (username === "" || username === null || username === undefined) {
            document.getElementById("createUN").style.borderColor = "red";
            setTimeout(function () {
                document.getElementById("createUN").style.borderColor = "#3949AB";
            }, 3000);
            return false;
        }

        if (pw === null || pw === undefined || pw === "" || pw.length < 8) {
            document.getElementById("createPW").style.borderColor = "red";
            setTimeout(function () {
                document.getElementById("createPW").style.borderColor = "#3949AB";
            }, 3000);
            return false;
        }

        let db = Firebase.database();
        let pcnum = 0;

        db.ref('/computers/count').once("value").then((snapshot) => {
            const res = snapshot.val();
            pcnum = parseInt(res, 10);
        });

        db.ref('/users').once("value").then((snapshot) => {
            let pid = 0;
            const rm = Math.floor(Math.random() * 9999999999);

            pid = pcnum;
            
            if (snapshot.hasChild(username)) {
                document.getElementById("createUN").style.borderColor = "red";
                setTimeout(function () {
                    document.getElementById("createUN").style.borderColor = "#3949AB";
                }, 3000);
                return false;
            } else {
                db.ref('/users/' + username).set({
                    password:pw,
                    rem:rm,
                    pcid:pid
                });

                pid++;

                db.ref('/computers/').set({
                    count:pid
                });
            }

            username = undefined;
            pw = undefined;
        });

        document.getElementById("createUN").style.borderColor = "#00C853";
        document.getElementById("createPW").style.borderColor = "#00C853";
        document.getElementById("createUN").value = "";
        document.getElementById("createPW").value = "";
        document.getElementById("loginUN").value = username;
        document.getElementById("loginPW").value = pw;
    }

    addListener() {
        var input = document.getElementById("loginPW");
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("loginBTN").click();
            }
        });

        input = document.getElementById("loginUN");
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("loginBTN").click();
            }
        });

        input = document.getElementById("createUN");
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("createBTN").click();
            }
        });

        input = document.getElementById("createPW");
        input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("createBTN").click();
            }
        });
    }

    componentDidMount() {
        this.addListener();
    }

    render() {
        return (
            <div id="loginDiv">
                <div>
                    <div className="title" id="loginTitle">
                        <h1>Login</h1>
                    </div>
                    <span>Username:</span>
                    <div className="cells">
                        <input id="loginUN" type="text" className="roundBox roundTextBox"/>
                    </div>
                    <span>Password:</span>
                    <div className="cells">
                        <input id="loginPW" type="password" className="roundBox roundTextBox"/>
                    </div>
                    <div className="cells">
                        <button id="loginBTN" className="roundBox roundButton" onClick={this.handleClick}>Login</button>
                    </div>
                    <div className="cells">
                        <label className="container"  >Remember me
                            <input id="loginCB" type="checkbox" onChange={this.handleChange}/>
                            <span className="checkmark"></span>
                        </label>
                    </div>
                </div>

                <div>
                    <div className="title" id="createTitle">
                        <h1>Create Account</h1>
                    </div>
                    <span>New Username:</span>
                    <div className="cells">
                        <input id="createUN" type="text" className="roundBox roundTextBox"/>
                    </div>
                    <span>New Password:</span>
                    <div className="cells">
                        <input id="createPW" type="password" className="roundBox roundTextBox"/>
                    </div>
                    <div className="cells">
                        <button id="createBTN" onClick={this.addUser} className="roundBox roundButton">Create Account</button>
                    </div>
                </div>
            </div>
        );
    }
}