import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import styles from './layout.module.scss'
import { Link } from 'react-router-dom';


export default function Side() {
    const [state, setState] = React.useState({ right: false });
    const [sideStste, setsideStste] = React.useState(false);

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
        setsideStste(true);
    };

    const list = (anchor) => (
        <Box
            className={styles.side}
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List className={styles.item}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <Link to='categories' className='nav-link' >
                            categories
                        </Link>
                    </ListItemButton>
                </ListItem>
            </List>
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <Link to='product' className='nav-link' >
                            product
                        </Link>
                    </ListItemButton>
                </ListItem>
            </List>
            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <Link to='order' className='nav-link' >
                            order
                        </Link>
                    </ListItemButton>
                </ListItem>
            </List>

            <Divider />
        </Box>
    );

    return (
        <div>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button className={styles.Button} variant="contained" onClick={toggleDrawer(anchor, true)}>{sideStste == 'open' ? '<' : '>'}</Button>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}