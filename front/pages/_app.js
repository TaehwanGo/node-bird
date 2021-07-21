import React from 'react';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import Head from 'next/head';
import '../css/_app.css';
import wrapper from '../store/configureStore';

const App = ({ Component }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <title>NodeBird</title>
    </Head>
    <Component />
  </>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App);
