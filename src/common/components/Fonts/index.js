import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  font: state.ui.font
});

class Fonts extends Component {
  render() {
    const { font } = this.props;

    return (
      <Helmet>
        <style>
          @import
          url('https://fonts.googleapis.com/css?family=Anonymous+Pro|B612+Mono|Cousine|Cutive+Mono|Fira+Mono|IBM+Plex+Mono|Inconsolata|Major+Mono+Display|Nanum+Gothic+Coding|Nova+Mono|Overpass+Mono|Oxygen+Mono|PT+Mono|Roboto+Mono|Share+Tech+Mono|Source+Code+Pro|Space+Mono|Ubuntu+Mono|VT323&display=swap');
        </style>
        <style type="text/css">{`
            #chart * {
              font-size: 10px !important;
            }

            * {
              font-family: "${font.fontFamily}", monospace !important;
              font-weight: ${font.fontWeight} !important;
              letter-spacing: ${font.fontSpacing} !important;
              font-size: ${font.fontSize} !important;
            }
          `}</style>
      </Helmet>
    );
  }
}

export default connect(mapStateToProps)(Fonts);
