import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';
import { fire, firestore } from '../../config/Fire';

import toastr from 'reactjs-toastr';
import 'reactjs-toastr/lib/toast.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null
        }
    }
    

    login = (e) => {
        const { history, hanldeSuccessfulLogin } = this.props;
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
        e.preventDefault();
        const _this = this;
        fire.auth().signInWithEmailAndPassword(email, password).then((resp)=> {
            // console.log("Login Successfull" , u);
            this.loginForm.reset();
            hanldeSuccessfulLogin(resp.user);
            // this.props.setCurrentUser(user);
            _this.setState({ redirect: true })
            // alert("logged in"+ _this.state.redirect);
            
        }).catch((error)=> {
            toastr.error(error.status, error.message, {displayDuration: 1000})
            console.log(error)
        })
    }

    authWithEmailPassword(event) {
        event.preventDefault();

        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        fire.auth().fetchSignInMethodsForEmail(email)
            .then( providers => {
                if(providers.length == 0) {
                    // create user
                    alert("User created");
                    return fire.auth().createUserWithEmailAndPassword(email, password)
                } else if(providers.indexOf('password') === -1 ) {
                    // they used Google
                    this.loginForm.reset();
                    toastr.error("Try alternative Login",'Login Failed')
                } else {
                    // sign user in
                    return fire.auth().signInWithEmailAndPassword(email, password)
                }
            })
            .then(user => {
                if(user && user.email) {
                    this.loginForm.reset();
                    
                    this.props.setCurrentUser(user);
                    this.setState({redirect: true});
                    alert("LoggedIN", );
                }
            })
            .catch(error => {
                toastr.error(error.message , error.status)
            })
    }

    loginWithGoogle = (e) => {
        e.preventDefault();
        const _this = this;
        const provider = new firebase.auth.GoogleAuthProvider();
        fire.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            _this.setState({redirect: true})
            _this.saveAndUpdateUser(user);
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            // The firebase.auth.AuthCredential type that was used.
            // var credential = error.credential;
            console.log("Error: ",error)
            toastr.error(error.status, error.message, {displayDuration: 1000})
          });
    }

    saveAndUpdateUser = (user) => {
        firestore.doc(`users/${user.uid}`).set({
            name: user.displayName || "John Doe",
            email: user.email,
            photoUrl: user.photoURL || null,
            uid: user.uid,
        }).then((x)=>{
            console.log("User Added Successfully", x)
        }).catch((error)=> {
            console.log(error)
            toastr.error(error.status, error.message, {displayDuration: 1000})
        })
    }

    signup = (e) => {
        e.preventDefault();
        const email = this.emailInput.value;
        const password = this.passwordInput.value;
        let _this = this;

        fire.auth().createUserWithEmailAndPassword(email, password).then((u)=> {
            console.log("SignUp Successfull" , u);
            _this.setState({redirect: true});
        }).catch((error)=> {
            console.log(error);
            toastr.error(error.status, error.message, {displayDuration: 1000})
        })
    }

    render() {

        const {from} = this.props.location.state || {from: {pathname: '/'}}

        if(this.state.redirect === true) {
            // alert('Redirecting to : '+from);
            console.log('Redirecting to : ',from)
            return <Redirect to={from} />
        }

        return (
            <div className="container mt-5">
                <form style={{margin: '0 auto'}} onSubmit={(event) => { this.login(event) }} ref={(form) => { this.loginForm = form }}>
                    <div style={{marginBottom: "10px"}} className="pt-callout pt-icon-info-sign">
                        <h5>Note</h5>
                        If you don't have an account already, this form will create your account.
                    </div>
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            ref={ input => { this.emailInput = input} }/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            ref={ input => { this.passwordInput = input} } />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <button
                        onClick={this.signup}
                        style={{
                        marginLeft: '25px'
                    }}
                        className="btn btn-success">Signup</button>
                    <div className="my-3">
                        <button className="btn btn-danger" onClick={this.loginWithGoogle}>Sign in with Google</button>
                    </div>
                </form>

            </div>
        );
    }

}

export default Login;