import React from 'react';
import { CircularProgress, Typography } from "@material-ui/core";

//used when api is taking long to respond
export function GetLoadingAnimation(){
	return <>
	<Typography component={'span'} align="center">
		<CircularProgress size='5rem' thickness={6}/>
	</Typography>
	</>
}