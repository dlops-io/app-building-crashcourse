import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';


import DataService from "../../services/DataService";
import styles from './styles';


const StyleTransfer = (props) => {
    const { classes } = props;

    console.log("================================== StyleTransfer ======================================");


    // Component States
    const [numImages, setNumImages] = useState(12);
    const [contentImages, setContentImages] = useState([]);
    const [styleImages, setStyleImages] = useState([]);
    const [selectedContentImage, setSelectedContentImage] = useState(null);
    const [selectedStyleImage, setSelectedStyleImage] = useState(null);
    const [prediction, setPrediction] = useState(null);

    const loadContentImages = () => {
        DataService.StyleTransferGetContentImages()
            .then(function (response) {
                console.log(response.data);
                setContentImages(shuffle(response.data));
            })
    }
    const loadStyleImages = () => {
        DataService.StyleTransferGetStyleImages()
            .then(function (response) {
                console.log(response.data);
                setStyleImages(shuffle(response.data));
            })
    }
    const applyStyleTransfer = () => {

        setPrediction(null);

        if (selectedStyleImage && selectedContentImage) {
            DataService.StyleTransferApplyStyleTransfer(selectedStyleImage, selectedContentImage)
                .then(function (response) {
                    try {
                        console.log(response.data);
                        setPrediction(response.data);

                    } catch (e) {
                        console.log(e)
                    }
                })
        }

    }

    // Setup Component
    useEffect(() => {
        loadContentImages();
        loadStyleImages();
    }, []);
    useEffect(() => {
        applyStyleTransfer();
    }, [selectedContentImage, selectedStyleImage]);

    // Handlers
    const styleImageClicked = (img) => {
        setSelectedStyleImage(img);
    }
    const contentImageClicked = (img) => {
        setSelectedContentImage(img);
    }

    // Methods
    const shuffle = (data) => {
        return data
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => (a.value))
            .slice(0, numImages)
    }
    const isThumnailHighlited = (image, row) => {
        var style = {};

        var selectedStyle = {
            border: "5px dashed #000000",
            opacity: 1
        }

        if (image && (row == image)) {
            style = selectedStyle
        }

        return style;
    }


    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false} className={classes.container}>
                    <Typography variant="h5" gutterBottom>Style Transfer</Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Typography variant="h5" gutterBottom align="center">
                                Artworks
                            </Typography>
                            <GridList cellHeight={160} className={classes.gridList} cols={3} spacing={3}>
                                {styleImages.map(img => (
                                    <GridListTile key={img}
                                        onClick={(e) => styleImageClicked(img)}
                                        className={classes.thumbnailImage}
                                        style={isThumnailHighlited(selectedStyleImage, img)}>
                                        <img src={DataService.StyleTransferGetImage(img)} />
                                    </GridListTile>
                                ))}
                            </GridList>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h5" gutterBottom align="center">
                                Stylized Photo
                            </Typography>
                            {selectedStyleImage && selectedContentImage && (
                                <Card>
                                    {selectedContentImage && !prediction && (
                                        <CardMedia
                                            className={classes.predictionImage}
                                            image={DataService.StyleTransferGetImage(selectedContentImage)}
                                            title="Original image"
                                        />
                                    )}
                                    {selectedContentImage && !prediction && (
                                        <CircularProgress className={classes.progressBar} />
                                    )}
                                    {prediction && (
                                        <CardMedia
                                            className={classes.media}
                                            image={DataService.StyleTransferGetImage(prediction.stylized_image)}
                                            title="Stylelized image"
                                        />
                                    )}
                                </Card>
                            )}
                            {
                                !selectedStyleImage && !selectedContentImage && (
                                    <CardContent>
                                        <Typography align="center" variant="body2">
                                            <strong>Select an artwork and photo to see the style of the artwork get applied to the photo</strong>
                                        </Typography>
                                    </CardContent>
                                )
                            }
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="h5" gutterBottom align="center">
                                Photos
                            </Typography>
                            <GridList cellHeight={160} className={classes.gridList} cols={3} spacing={3}>
                                {contentImages.map(img => (
                                    <GridListTile key={img}
                                        onClick={(e) => contentImageClicked(img)}
                                        className={classes.thumbnailImage}
                                        style={isThumnailHighlited(selectedContentImage, img)}>
                                        <img src={DataService.StyleTransferGetImage(img)} />
                                    </GridListTile>
                                ))}
                            </GridList>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(StyleTransfer);