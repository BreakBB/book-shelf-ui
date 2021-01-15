import React from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

interface Props {
    children: JSX.Element[],
    className: string
}

function Theme(props: Props): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <div className={props.className}>
                {props.children}
            </div>
        </ThemeProvider>
    );
}

const theme = createMuiTheme({
    // palette: {
    //     primary: {
    //         light: '#757ce8',
    //         main: '#3f50b5',
    //         dark: '#002884',
    //         contrastText: '#fff',
    //     },
    //     secondary: {
    //         light: '#ff7961',
    //         main: '#f44336',
    //         dark: '#ba000d',
    //         contrastText: '#000',
    //     },
    // }
});

export default Theme;