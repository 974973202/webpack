'use strict';

import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import '../../common';
import logo from './images/logo.png'
import { a } from './tree-shaking'


import './search.less'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Text: null,
    }
    this.loadComponent.bind(this)
  }

  loadComponent() {
    import('./text.js').then((text) => {
      console.warn(text)
      this.setState({
        Text: text.default
      })
    });
  }

  render() {
    const { Text } = this.state;
    return <div className="search-text">Search Text 111
      <img src={ logo } onClick={this.loadComponent.bind(this)}/>
      {
        Text && <Text />
      }
    </div>
  }
}

ReactDom.render(
  <Search/>,
  document.getElementById('root')
)