import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Toaster, Intent } from '@blueprintjs/core'
import { app, googleProvider, firestore } from '../base'


import toastr from 'reactjs-toastr'
import 'reactjs-toastr/lib/toast.css'

const loginStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px"
}

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      loading: false
    }
  }

  authWithGoogle = () => {
    this.setState({ loading: true })
    app.auth().signInWithPopup(googleProvider)
      .then((user, error) => {
        if (error) {
          this.toaster.show({ intent: Intent.DANGER, message: "Unable to sign in with Facebook" })
        } else {
          this.props.setCurrentUser(user);
          this.saveAndUpdateUser(user.user);
          this.setState({  loading: false , redirect: true })
        }
      })
  }


  saveAndUpdateUser = (user) => {
    console.log(user);
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

  authWithEmailPassword = (event) => {
    event.preventDefault()

    const email = this.emailInput.value
    const password = this.passwordInput.value

    app.auth().fetchProvidersForEmail(email)
      .then((providers) => {
        if (providers.length === 0) {
          // create user
          return app.auth().createUserWithEmailAndPassword(email, password)
        } else if (providers.indexOf("password") === -1) {
          // they used facebook
          this.loginForm.reset()
          this.toaster.show({ intent: Intent.WARNING, message: "Try alternative login." })
        } else {
          // sign user ins
          return app.auth().signInWithEmailAndPassword(email, password)
        }
      })
      .then((user) => {
        if (user && user.email) {
          this.loginForm.reset()
          this.props.setCurrentUser(user)
          this.setState({redirect: true})
        }
      })
      .catch((error) => {
        this.toaster.show({ intent: Intent.DANGER, message: error.message })
      })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }

    if (this.state.redirect === true) {
      return <Redirect to={from} />
    }

    return (
      <div style={loginStyles}>
        <Toaster ref={(element) => { this.toaster = element }} />
        <button style={{width: "100%"}} className="pt-button pt-intent-primary" onClick={() => { this.authWithGoogle() }}>Log In with Google</button>
        <hr style={{marginTop: "10px", marginBottom: "10px"}}/>
        <form onSubmit={(event) => { this.authWithEmailPassword(event) }} ref={(form) => { this.loginForm = form }}>
          <div style={{marginBottom: "10px"}} className="pt-callout pt-icon-info-sign">
            <h5>Note</h5>
            If you don't have an account already, this form will create your account.
          </div>
          <label className="pt-label">
            Email
            <input style={{width: "100%"}} className="pt-input" name="email" type="email" ref={(input) => { this.emailInput = input }} placeholder="Email"></input>
          </label>
          <label className="pt-label">
            Password
            <input style={{width: "100%"}} className="pt-input" name="password" type="password" ref={(input) => { this.passwordInput = input }} placeholder="Password"></input>
          </label>
          <button style={{width: "100%"}} type="submit" className="pt-button pt-intent-primary">Log In</button>

        </form>
      </div>
    )
  }
}

export default Login
