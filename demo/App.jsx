import React, { Component } from 'react';
import { $ } from '../src/util/';

export class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $('p')
      .filter('[data-id="foo"]')
      .filter('[data-val="foo"]')
      .each((i, node) => {
        console.log(node);
      });
  }
  render() {
    return (
      <div ref={dom => (this.dom = dom)}>
        <p data-id="foo">foo</p>
        <p data-id="foo" data-val="foo">
          foo
        </p>
        <p>bar</p>
      </div>
    );
  }
}
