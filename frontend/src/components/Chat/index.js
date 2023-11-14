import React, { useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Widget, toggleWidget, dropMessages, addResponseMessage } from 'react-chat-widget';

import DataService from "../../services/DataService";
import styles from './styles';
import 'react-chat-widget/lib/styles.css';
import './style.css';


const Chat = (props) => {
    const { classes } = props;

    console.log("================================== Chat ======================================");


    // Component States
    const [chatHistory, setChatHistory] = useState([]);


    // Setup Component
    useEffect(() => {

    }, []);

    // Handlers
    const handleChat = (message) => {
        console.log(message)
        var history = [...chatHistory];

        let chat = {
            "history": history,
            "input_message": message
        }

        // Chat with backend API
        DataService.ChatWithLLM(chat)
            .then(function (response) {
                console.log(response.data);
                let chat_response_list = response.data;
                let chat_response = chat_response_list[chat_response_list.length - 1];
                console.log(chat_response);
                history.push(chat_response);
                addResponseMessage(chat_response[0][1]);
                // history.push(message);
                // history.push(chat_response["response_message"]);

                // // if(history.length > 5){
                // //
                // // }
                // history = history.slice(Math.max(history.length - 5, 0))

                setChatHistory(history);
                console.log(history)
            })
    }


    return (
        <div className={classes.root}>
            <main className={classes.main}>
                <Container maxWidth={false} className={classes.container}>
                    <Typography variant="h5" gutterBottom>Chat with LLM</Typography>
                    <Divider />

                    <div>
                        <Widget
                            title={'Llama-2-7B-Chat'}
                            subtitle={'Ask me anything'}
                            handleNewUserMessage={handleChat}
                        />
                    </div>
                </Container>


            </main>
        </div>
    );
};

export default withStyles(styles)(Chat);