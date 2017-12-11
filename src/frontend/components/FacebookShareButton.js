import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FacebookShareButton extends Component {
  constructor(props) {
    super(props);
    this.state = ({ initialized: false });
  }

  componentDidMount() {
    if (this.state.initialized) {
      return;
    }

    if (typeof FB === 'undefined') {
      const facebookbutton = this.node;
      const facebookscript = document.createElement('script');
      facebookscript.src = '//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.5';
      facebookscript.id = 'facebook-jssdk';
      facebookbutton.parentNode.appendChild(facebookscript);
    } else {
      FB.XFBML.parse(); // eslint-disable-line
    }

    this.initialized();
  }

  initialized() {
    this.setState({ initialized: true });
  }

  render() {
    return (
      <div
        ref={node => this.node = node}
        className="fb-share-button"
        data-href={this.props.url}
        data-layout={this.props.layout}
      />
    );
  }
}

FacebookShareButton.propTypes = {
  url: PropTypes.string,
  layout: PropTypes.string
};

FacebookShareButton.defaultProps = {
  url: (typeof window !== 'undefined' ? window.url : ''),
  layout: ''
};
