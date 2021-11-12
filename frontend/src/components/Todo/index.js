import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import DataService from "../../services/DataService";
import styles from './styles';


const Todo = (props) => {
    const { classes } = props;

    console.log("================================== Todo ======================================");


    // Component States
    const [text, setText] = useState("");
    const [todoItems, setTodoItems] = useState([]);

    // Setup Component
    useEffect(() => {

    }, []);

    // Handlers
    const handleOnAddTodo = () => {
        console.log(text)

        // Read the items from state list
        var items = [...todoItems];
        items.push(text);

        // Set the state
        setTodoItems(items);

        setText("");
    }


    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false} className={classes.container}>
                    <Typography variant="h5" gutterBottom>Todo</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField

                                label="Todo item"
                                multiline
                                maxRows={4}
                                variant="outlined"
                                fullWidth
                                value={text}
                                onChange={(event) => setText(event.target.value)}
                            />
                            <br /><br />
                            <Button variant="contained" color="primary" onClick={() => handleOnAddTodo()}>
                                Add
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <List>
                                {todoItems && todoItems.map((item, idx) =>
                                    <ListItem key={idx}>
                                        <ListItemIcon><Icon>check_box_outline_blank</Icon></ListItemIcon>
                                        <ListItemText primary={item} />
                                    </ListItem>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
};

export default withStyles(styles)(Todo);