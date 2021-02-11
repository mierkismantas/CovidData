import React from 'react'
import { Grid, Typography } from "@material-ui/core";
import Controls from "../controls/controls";
import { Styles } from '../styles';
import { useSelector } from "react-redux";
import * as reducer from '../reducer';
import * as constants from '../constants';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const apiUrl = `${constants.covidApiUrl}/CovidTests/`;

export const getAgeCollection = ()=>([
    { id: '0', title: 'nenustatyta' },
    { id: '1', title: '0-9' },
    { id: '2', title: '10-19' },
    { id: '3', title: '20-29' },
    { id: '4', title: '30-39' },
    { id: '5', title: '40-49' },
    { id: '6', title: '50-59' },
    { id: '7', title: '60-69' },
    { id: '8', title: '70-79' },
    { id: '9', title: 'Virš 80' },
])

const genderItems = [
    { id: 'nenustatyta', title: 'nenustatyta' },
    { id: 'Moteris', title: 'Moteris' },
    { id: 'Vyras', title: 'Vyras' },
]

const initialValues = {
    x: '',
    y: '',
    caseCode: '',
    confirmationDate: new Date(),
    municipalityCode: 'XX',
    municipalityName: 'nenustatyta',
	gender: genderItems[0].id,
    ageBracket: getAgeCollection()[0].id,
}

const errors = {
    caseCode: '',
    municipalityCode: '',
}

function isNumberOrXX(value: string | number): boolean
{
	if(value === 'XX')
		return true;

   	return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function InputPage() {
	const styles = Styles();
	const stateObjects: reducer.myObject[] = useSelector((state: reducer.AppState) => state.objects);
	const loggedIn = stateObjects[stateObjects.length-1].loggedIn
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);
	const [snackbarText, setSnackbarText] = React.useState('');

	//todo: add more validation
    const validate = (fieldValues = values) => {
        if ('municipalityCode' in fieldValues)
		{
			errors.municipalityCode = fieldValues.municipalityCode.length === 2 &&
                                      isNumberOrXX(fieldValues.municipalityCode) ? "" : "Number with 2 digits is required! (default: XX)"
		}
        if ('caseCode' in fieldValues)
		{
            errors.caseCode = fieldValues.caseCode.length === 64 ? "" : "64 characters are required!"
		}
        return Object.values(errors).every(x => x === "")
    }

    const getBody = (fieldValues = values) => {
        return JSON.stringify({
            x : fieldValues.x,
			y : fieldValues.y,
			caseCode : fieldValues.caseCode,
			confirmationDate : fieldValues.confirmationDate,
			municipalityCode : fieldValues.municipalityCode,
			municipalityName : fieldValues.municipalityName,
			gender : fieldValues.gender,
			ageBracket : getAgeCollection()[fieldValues.ageBracket].title
        });
    }

    const {
        values,
        handleInputChange,
        resetForm
    } = Controls.Forms.UseForm(initialValues, true, validate);

    const resetFormFields = (fieldValues = values) => {
        fieldValues.x = '';
        fieldValues.y = '';
		fieldValues.caseCode = '';
        fieldValues.confirmationDate = new Date();
		fieldValues.municipalityCode = 'XX';
        fieldValues.municipalityName = 'nenustatyta';
		fieldValues.gender = genderItems[0].id;
        fieldValues.ageBracket = getAgeCollection()[0].id;
    };

	const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
      ): Promise<void> => {
        e.preventDefault();
        if (validate()) {
            await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: getBody(),
                })
                .then(response => response.json())
				.then(data => {
					resetFormFields();
					setSnackbarText(`Entry ${data.id} has been added`);
					setSnackbarOpen(true);
				})
				.catch((error) => {
					console.error('Error:', error);
					alert("Error occured, please try later.");
				});
        }
		else
		{
			handleInputChange(e);
		}
    };

	const handleSnackbarClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
		if (reason === 'clickaway') {
		  return;
		}
	
		setSnackbarOpen(false);
	  };

    return (
	<Grid container className={styles.root}>
		<Grid item sm={2} md={3} ></Grid>
		<Grid item xs={12} sm={8} md={6} className={styles.body}>
			{!loggedIn && <>
			<Typography className={styles.title} component="div">
				Please Log In to Access This Page
			</Typography>
			</>}
			{loggedIn  && <>
			<Typography className={styles.title} id="tableTitle" component="div">
				Add Data
			</Typography>

			<Controls.Forms.Form onSubmit={handleSubmit}>
				<Controls.Input
					name="x"
					label="X Coordinate"
					value={values.x}
					onChange={handleInputChange}/>
				<Controls.Input
					name="y"
					label="Y Coordinate"
					value={values.y}
					onChange={handleInputChange}/>
				<Controls.Input
					name="caseCode"
					label="Case Code"
					value={values.caseCode}
					onChange={handleInputChange}
					error={errors.caseCode}/>
				<Controls.DatePicker
					name="confirmationDate"
					label="Confirmation Date"
					value={values.confirmationDate}
					onChange={handleInputChange}/>
				<Controls.Input
					name="municipalityCode"
					label="Municipality Code"
					value={values.municipalityCode}
					onChange={handleInputChange}
					error={errors.municipalityCode}/>
				<Controls.Input
					name="municipalityName"
					label="Municipality Name"
					value={values.municipalityName}
					onChange={handleInputChange}/>
				<Controls.RadioGroup
					name="gender"
					label="Gender"
					value={values.gender}
					onChange={handleInputChange}
					items={genderItems}/>
				<Controls.Select
					name="ageBracket"
					label="Age Bracket"
					value={values.ageBracket}
					onChange={handleInputChange}
					options={getAgeCollection()}/>
				<div className={styles.centered}>
					<Controls.Button
						type="submit"
						text="Submit" />
					<Controls.Button
						text="Reset"
						color="default"
						onClick={resetForm} />
				</div>
			</Controls.Forms.Form>
			</>}
			<Snackbar
				anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
				}}
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
				action={
				<React.Fragment>
					<IconButton size="medium" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
					<CloseIcon fontSize="small" />
					</IconButton>
				</React.Fragment>
				}
			>
				<Alert onClose={handleSnackbarClose} severity="success">
					{snackbarText}
				</Alert>
			</Snackbar>
		</Grid>
		<Grid item sm={2} md={3}></Grid>
	</Grid>
    )
}