import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import DataService from "../../services/DataService";
import styles from './styles';


const ImageClassification = (props) => {
    const { classes } = props;

    console.log("================================== ImageClassification ======================================");


    const inputFile = useRef(null);

    // Component States
    const [image, setImage] = useState(null);
    const [prediction, setPrediction] = useState(null);


    // Setup Component
    useEffect(() => {

    }, []);

    // Handlers
    const handleImageUploadClick = () => {
        inputFile.current.click();
    }
    const handleOnChange = (event) => {
        console.log(event.target.files);
        setImage(URL.createObjectURL(event.target.files[0]));

        var formData = new FormData();
        formData.append("file", event.target.files[0]);
        DataService.ImageClassificationPredict(formData)
            .then(function (response) {
                console.log(response.data);
                setPrediction(response.data);
            })
    }



    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth="md" className={classes.container}>
                    <Typography variant="h5" gutterBottom>Image Classification</Typography>
                    <Divider />
                    {
                        prediction &&
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Index</TableCell>
                                        <TableCell>Class</TableCell>
                                        <TableCell>Probability</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {prediction.results && prediction.results.map((itm, idx) =>
                                        <TableRow key={idx}>
                                            <TableCell>{itm["class_index"]}</TableCell>
                                            <TableCell>{itm["class_name"]}</TableCell>
                                            <TableCell>{itm["probability"]}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                    <div className={classes.dropzone} onClick={() => handleImageUploadClick()}>
                        <input
                            type="file"
                            accept="image/*"
                            capture="camera"
                            on
                            autocomplete="off"
                            tabindex="-1"
                            className={classes.fileInput}
                            ref={inputFile}
                            onChange={(event) => handleOnChange(event)}
                        />
                        <div><img className={classes.preview} src={image} /></div>
                        <div className={classes.help}>Click to take a picture or upload...</div>
                    </div>

                    {prediction &&
                        <Typography gutterBottom align='center'>
                            <pre>{JSON.stringify(prediction)}</pre>
                        </Typography>
                    }
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(ImageClassification);