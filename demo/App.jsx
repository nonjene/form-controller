import React, { Component } from 'react';
import { $ } from '../src/util/';

export class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $(this.dom)
      .find('p')
      .filter('[data-id="foo"]')
      .filter('[data-val="foo"]')
      .each(function(i, node) {
        console.log('p:', this);
      })
      .find('span')
      .each(function() {
        console.log('span:', this);
      });
    console.log('first node:', $(this.dom).find('p').eq(0));
    const chkboxName = $(this.dom).find('[name="chk1"]').prop('checked', true).filter(':checked').each(function(){
      console.log('checkbox:', this);
    }).map((i, node)=>{
      return node.name;
    }).get();
    console.log('["chk1"]:', chkboxName);

    $(this.dom).on('click.xx', 'p', function(e){
      console.log('event envirenment should be "<p/>":', this);
      console.log('e:', e);
    });
  }
  render() {
    return (
      <div ref={dom => (this.dom = dom)}>
        <h3>for query test</h3>
        <p data-id="foo" id="click_test">
          <span>foo</span>
        </p>
        <p data-id="foo" data-val="foo">
          <span>foo</span>
        </p>
        <p>bar</p>
        <label><input name="chk1" type="checkbox" /> checkbox</label>
      </div>
    );
  }
}
