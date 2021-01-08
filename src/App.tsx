import React from 'react';
import './App.css';
import BookCardView from "./BookCardView/BookCardView";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import Typography from "@material-ui/core/Typography";
import {Container} from "@material-ui/core";

function App() {
    return (
        <div className="App">
            <AppBar position="static" style={{marginBottom: "20px"}}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6">
                        Books
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg">
                <BookCardView/>
            </Container>
        </div>
    );
}

export default App;
