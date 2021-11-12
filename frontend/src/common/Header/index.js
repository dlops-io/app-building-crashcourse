import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';


import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';


import styles from './styles';

import TOC from '../../components/TOC';

const Header = (props) => {
    const { classes } = props;

    console.log("================================== Header ======================================");

    // State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const [settingsMenuAnchorEl, setSettingsMenuAnchorEl] = useState(null);

    // Handlers
    const toggleDrawer = (open) => () => {
        setDrawerOpen(open)
    };
    const openSettingsMenu = (event) => {
        setSettingsMenuAnchorEl(event.currentTarget);
    };
    const closeSettingsMenu = (event) => {
        setSettingsMenuAnchorEl(null);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" elevation={0}>
                <Toolbar variant="dense">
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Link to="/" className={classes.appLink}>
                        <Typography className={classes.appTitle} >
                            ⚡ App Building Crash Course
                        </Typography>
                    </Link>

                    <div className={classes.grow} />
                    <div>
                        <IconButton color="inherit" component={Link} to="/">
                            <Icon>home</Icon>
                            <Typography variant="caption">&nbsp;Home</Typography>
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/currentmodel">
                            <Icon>celebration</Icon>
                            <Typography variant="caption">&nbsp;[Tutorial] Style Transfer</Typography>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <div className={classes.list}>
                        <TOC />
                    </div>
                </div>
            </Drawer>
        </div>
    );
}

export default withStyles(styles)(Header);
