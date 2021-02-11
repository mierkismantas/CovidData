import React from 'react'
import { Grid, Typography } from "@material-ui/core";
import Controls from "../controls/controls";
import { Styles } from '../styles';
import * as constants from '../constants';
import * as reducer from '../reducer';
import { useSelector, useDispatch } from "react-redux";

const authenticationUrl = `${constants.covidApiUrl}/Authorization/`;

const initialValues = {
    username: '',
    password: '',
}

const errors = {
    username: '',
    password: '',
}

export default function LoginPage() {
    const styles = Styles();
    const dispatch = useDispatch();
    const stateObjects: reducer.myObject[] = useSelector((state: reducer.AppState) => state.objects);
    let loggedIn = stateObjects[stateObjects.length-1].loggedIn

    const validate = (fieldValues = values) => {
        if ('username' in fieldValues)
			errors.username = fieldValues.username.length >= 4 ? "" : "Minimum of 4 characters is required!"
        if ('password' in fieldValues)
            errors.password = fieldValues.password.length >= 4 ? "" : "Minimum of 4 characters is required!"

        return Object.values(errors).every(x => x === "")
    }

    const getBody = (fieldValues = values) => {
        let username = fieldValues.username;
        let password = btoa(fieldValues.password);
        return JSON.stringify({
            username,
            password
        });
    }

    const {
        values,
        handleInputChange
    } = Controls.Forms.UseForm(initialValues, true, validate);

    const handleLogIn = (fieldValues = values) => {
        fieldValues.username = '';
        fieldValues.password = '';
        dispatch(reducer.addObject(true));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
      ): Promise<void> => {
        e.preventDefault();
    
        if (validate()) {
            await fetch(authenticationUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: getBody(),
                })
                .then((response) => 
                {
                    if(response.status === 200)
                    {
                        handleLogIn();
                    }
                    else
                    {
                        //todo: snackbar would look good here too as in "inputPage"
                        alert("Could not authorize, please check credentials.");
                    }
                })
        }
    };

    return (
    <Grid container className={styles.root}>
		<Grid item xs={2} sm={4} md={4} ></Grid>
		<Grid item xs={8} sm={4} md={4} className={styles.body}>
            {loggedIn && <>
                <Typography className={styles.title} component="div">
                    You are logged in.
                </Typography>
			</>}
            {!loggedIn && <>
                <Typography className={styles.title} variant="h6" id="tableTitle" component="div">
                    Login
                </Typography>
                <Controls.Forms.Form onSubmit={handleSubmit} >
                    <Controls.Input
                        name="username"
                        label="UserName"
                        value={values.username}
                        onChange={handleInputChange}
                        error={errors.username}/>
                    <Controls.Input
                        name="password"
                        label="Password"
                        type="password"
                        value={values.password}
                        onChange={handleInputChange}
                        error={errors.password}/>
                    <div className={styles.centered}>
                        <Controls.Button
                            type="submit"
                            text="Login" />
                    </div>
                </Controls.Forms.Form>
			</>}
        </Grid>
        <Grid item xs={2} sm={4} md={4}></Grid>
    </Grid>
    )
}