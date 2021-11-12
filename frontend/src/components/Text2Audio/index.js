import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import DataService from "../../services/DataService";
import styles from './styles';


const Text2Audio = (props) => {
    const { classes } = props;

    console.log("================================== Text2Audio ======================================");


    // Component States
    const [text, setText] = useState("");
    const [outputs, setOutputs] = useState([]);

    // Setup Component
    useEffect(() => {

    }, []);

    // Handlers
    const handleOnSynthesisClick = () => {
        console.log(text)
        DataService.Text2Audio({ "text": text })
            .then(function (response) {
                console.log(response.data);
                var ops = [...outputs];
                setOutputs([]);
                //ops.push(response.data);
                ops.splice(0, 0, response.data);
                setOutputs(ops);
            })
    }



    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false} className={classes.container}>
                    <Typography variant="h5" gutterBottom>Text to Audio</Typography>
                    <Grid container spacing={8}>
                        <Grid item md={5}>
                            <br />
                            <Typography>
                                Enter some text and click the Speak button
                            </Typography>
                            <br />
                            <TextField

                                label="Text for Speech Synthesis"
                                multiline
                                maxRows={4}
                                variant="outlined"
                                fullWidth
                                value={text}
                                onChange={(event) => setText(event.target.value)}
                            />
                            <br />
                            <br />
                            <br />
                            <Icon className={classes.stopRecording} onClick={() => handleOnSynthesisClick()}>record_voice_over</Icon>
                        </Grid>
                        <Grid item md={7}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Text</TableCell>
                                            <TableCell>Audio</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {outputs && outputs.map((item, idx) =>
                                            <TableRow key={idx}>

                                                <TableCell>{item.text}</TableCell>
                                                <TableCell>
                                                    <audio controls>
                                                        <source src={DataService.Text2AudioGetAudio(item.audio_path)} type="audio/mp3" />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* {outputs && outputs.map((item, idx) =>
                                
                            )} */}
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Text2Audio);