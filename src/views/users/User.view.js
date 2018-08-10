import React  from 'react';
import { Redirect, Link } from 'react-router-dom';
import toastr from 'reactjs-toastr';
import 'reactjs-toastr/lib/toast.css';
import {firestore} from '../../base';
 


const formStyles = {
    width: "90%",
    maxWidth: "315px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "1em"
}

class User extends React.Component {

    saveUser = (e) => {
        let uid = localStorage.getItem('user');
        let colRef = `users/${uid}/persons`;
        e.preventDefault();
        const name = this.username.value
        const position = this.position.value
        const {history} = this.props;

        firestore.collection(colRef).add({name, position})
        .then(resp => {
            console.log('User Added successfully', resp);
            toastr.success('User Added successfully', "Success");
            history.push('/');
        })
        .catch(err => {
            console.log("User save operation failed", err);
            toastr.error(err.message, err.status);
        })


    }

    render() {

        return(
            <div className="User" style={formStyles}>
                <form className="form" onSubmit={(e)=> {this.saveUser(e)}} ref={ form => { this.saveForm = form }}>
                   <div className="form-group">
                        <label className="name text-left w-100">Name</label>
                        <input className="form-control" type="text" name="username" ref={ input => {this.username = input} } placeholder="Enter User name ..." required />
                   </div>
                   <div className="form-group">
                        <label className="position text-left  w-100">Position</label>
                            <input className="form-control" type="text" name="position" ref={ input => {this.position = input} } placeholder="Enter User Position ..." required />
                    </div>
                    <div className="mt-4">
                        <input style={{width: "100%"}} type="submit" className="btn btn-primary" value="Save"></input>
                        <Link className="btn btn-default mt-2" to={'/'}  style={{width: "100%", border: '1px solid'}} >Cancel</Link>
                    </div>
                </form>
            </div>
        )
    }
}

export default User;