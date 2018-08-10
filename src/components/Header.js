import React, {Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {isAuthenticated} = this.props;
        return (
            <div className="header container mb-4 mt-3">
                <div className="col-sm-6 text-left">
                    <h2>H's Law</h2>

                </div>
                <div className="col-sm-6 text-right">
                    { isAuthenticated &&
                        <Link to="/logout" className="btn btn-default" style={{border: '1px solid'}}>Log Out</Link>
                    }
                </div>
            </div>
        )
    }

}

export default Header;