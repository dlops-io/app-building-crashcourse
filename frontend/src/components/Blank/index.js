import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';


import DataService from "../../services/DataService";
import styles from './styles';


const Blank = (props) => {
    const { classes } = props;

    console.log("================================== Blank ======================================");


    // Component States


    // Setup Component
    useEffect(() => {

    }, []);

    // Handlers



    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false} className={classes.container}>
                    <Typography>This is a blank page...</Typography>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Blank);