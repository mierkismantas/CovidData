import * as React from "react";
import { AppBar,  Toolbar,  IconButton,  List,  ListItem,  ListItemText,  Container } from "@material-ui/core";
import { Home, Person } from "@material-ui/icons";
import { Styles } from './components/styles';
import { useHistory, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as reducer from './components/reducer';
import { ExitToApp } from "@material-ui/icons";

//todo: use tabs for selection
//todo: add snackBar on signOut
const Header = () => {
  const styles = Styles();
  const history = useHistory();
  const dispatch = useDispatch();
  const stateObjects: reducer.myObject[] = useSelector((state: reducer.AppState) => state.objects);
  let loggedIn = stateObjects[stateObjects.length-1].loggedIn

  const handleLogOut = ()=> {
      dispatch(reducer.addObject(false));
      history.push('/')
  };

  return (
    <AppBar position="static" style={{ background: 'grey' }}>
      <Toolbar >
        <Container maxWidth="md" className={styles.navbarDisplayFlex}>
            <IconButton onClick={() => history.push('/')}>
              <Home fontSize="large" />
            </IconButton>
          <List
            component="nav"
            aria-labelledby="main navigation"
            className={styles.navDisplayFlex}
          >
              <NavLink to={`/table`} className={styles.linkText}>
                <ListItem button>
                  <ListItemText primary={`table`} />
                </ListItem>
              </NavLink>
              <NavLink to={`/charts`} className={styles.linkText}>
                <ListItem button>
                  <ListItemText primary={`chart`} />
                </ListItem>
              </NavLink>
              {loggedIn && <>
                <NavLink to={`/input`} className={styles.linkText}>
                <ListItem button>
                  <ListItemText primary={`add data`} />
                </ListItem>
              </NavLink>
			        </>}
          </List>
          {loggedIn && <>
            <IconButton onClick={handleLogOut}>
              <ExitToApp fontSize="large" />
            </IconButton>
          </>}
          {!loggedIn && <>
            <IconButton onClick={() => history.push('/login')}>
              <Person fontSize="large" />
            </IconButton>
          </>}
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
