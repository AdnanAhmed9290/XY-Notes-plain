import React, { Component } from 'react';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { year: new Date().getFullYear() };
  }

  render() {
    return (
      <footer>
        <ul className="site-link">
          <li>
            &copy; {this.state.year} Nordicomm Technologies Oy
          </li>
        </ul>
      </footer>
    );
  }
}

export default Footer;
