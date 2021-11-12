import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import MicRecorder from 'mic-recorder-to-mp3';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DataService from "../../services/DataService";
import styles from './styles';

const recorder = new MicRecorder({
    bitRate: 128
});


const Audio2Text = (props) => {
    const { classes } = props;

    console.log("================================== Audio2Text ======================================");


    // Component States
    const [isRecording, setIsRecording] = useState(false);
    const [blobURL, setBlobURL] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcriptionResults, setTranscriptionResults] = useState([]);


    // Setup Component
    useEffect(() => {

    }, []);


    //Get permission from user to use mic
    navigator.getUserMedia({ audio: true },
        () => {
            console.log('Permission Granted');
            setIsBlocked(false);
        },
        () => {
            console.log('Permission Denied');
            setIsBlocked(true);
        },
    );

    // Handlers
    const handleOnStartRecording = () => {
        if (isBlocked) {
            console.log('Permission Denied');
        } else {
            recorder
                .start()
                .then(() => {
                    setIsRecording(true);
                })
                .catch((e) => console.error(e));
        }
    }
    const handleOnStopRecording = () => {
        recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                setBlobURL(URL.createObjectURL(blob));
                setIsRecording(false);
                setAudioBlob(blob);

                var formData = new FormData();
                formData.append("file", blob);
                DataService.Audio2Text(formData)
                    .then(function (response) {
                        console.log(response.data);
                        setTranscriptionResults(response.data)
                    })

            }).catch((e) => console.log(e));
    }


    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false} className={classes.container}>
                    <Typography variant="h5" gutterBottom>Audio to Text</Typography>
                    <Grid container spacing={8}>
                        <Grid item md={4}>
                            <Card>
                                <CardContent>
                                    <div className={classes.recordingContainer}>
                                        <div className={classes.audioContainer}>
                                            <audio src={blobURL} controls="controls" />
                                        </div>
                                        <div className={classes.buttonsContainer}>
                                            {!isRecording &&
                                                <Icon className={classes.startRecording} onClick={() => handleOnStartRecording()}>mic</Icon>
                                            }
                                            {isRecording &&
                                                <Icon className={classes.stopRecording} onClick={() => handleOnStopRecording()}>stop_circle</Icon>
                                            }
                                            {/* {blobURL &&
                                                <Icon className={classes.uploadRecording} onClick={() => handleUploadRecording()}>upload</Icon>
                                            } */}
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item md={8}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Transcription</TableCell>
                                            <TableCell>Confidence</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transcriptionResults && transcriptionResults.map((item, idx) =>
                                            <TableRow key={idx}>

                                                <TableCell>{item.transcript}</TableCell>
                                                <TableCell>{item.confidence}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Audio2Text);