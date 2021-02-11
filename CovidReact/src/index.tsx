import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline/>
    <App />
  </ThemeProvider>,
  document.getElementById('root') || document.createElement('div') // for testing purposes
  );