import React, { Component } from 'react';

import { Test } from './Test';
import { FormDemo } from './FormDemo';

export class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    return (
      <div>
        <FormDemo />
        {/* <Test /> */}
      </div>
    );
  }
}
