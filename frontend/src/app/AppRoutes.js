import React from "react";
import { Route, Switch } from 'react-router-dom';
import Home from "../components/Home";
import Error404 from '../components/Error/404';
import Blank from "../components/Blank";
import ImageClassification from "../components/ImageClassification";
import Audio2Text from "../components/Audio2Text";
import Text2Audio from "../components/Text2Audio";
import Plots from "../components/Plots";
import Todo from "../components/Todo";
import Chat from "../components/Chat";

const AppRouter = (props) => {

  console.log("================================== AppRouter ======================================");

  return (
    <React.Fragment>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/blank" exact component={Blank} />
        <Route path="/todo" exact component={Todo} />
        <Route path="/imageclassification" exact component={ImageClassification} />
        <Route path="/audio2text" exact component={Audio2Text} />
        <Route path="/text2audio" exact component={Text2Audio} />
        <Route path="/plots" exact component={Plots} />
        <Route path="/test" exact component={Blank} />
        <Route path="/chat" exact component={Chat} />
        <Route component={Error404} />
      </Switch>
    </React.Fragment>
  );
}

export default AppRouter;