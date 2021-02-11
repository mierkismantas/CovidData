import { Grid, Typography, Table, TableBody, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@material-ui/core";
import React, { useEffect } from "react";
import { Styles, StyledTableCell, StyledTableRow} from '../styles';
import * as constants from '../constants';
import * as commonFunctions from '../commonFunctions';
import moment from 'moment';

//this page is duplicate of 'homePage' - both show table with data
//this was the first steps on rendering table data, for that reason it is not removed

const TablePage = () => {
	const styles = Styles();
	const [loading, setIsLoading] = React.useState<boolean>(false);
	const [tests, setTests] = React.useState<Array<any>>([]);
	const [testCount, setTestCount] = React.useState<number>(0);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const getTestCount = async () => {
		var url = `${constants.covidApiUrl}/CovidTests/Count`;
		const fetchData = await fetch(url);
		setTestCount(await fetchData.json());
	};

	const getTests = async () => {
		var url = `${constants.covidApiUrl}/CovidTests/?page=${page}&size=${rowsPerPage}`;
		const fetchData = await fetch(url);
		setTests(await fetchData.json());
	};

	useEffect(() => {
		setIsLoading(true);
		getTests();
		getTestCount();
		setIsLoading(false);
	}, [page, rowsPerPage]);

	const handleChangePage = (event, newPage) => {
	  setPage(newPage);
	};
  
	const handleChangeRowsPerPage = (event) => {
	  setRowsPerPage(event.target.value);
	  setPage(0);
	};

	return (
	<Grid container className={styles.root}>
		<Grid item sm={1} md={2} ></Grid>
		<Grid item xs={12} sm={10} md={8} className={styles.body}>
			{loading && commonFunctions.GetLoadingAnimation()}
			{!loading  &&
			<>
			<Typography className={styles.title} variant="h6" id="tableTitle" component="div">
				Covid-19
			</Typography>
			<Paper>
				<TableContainer className={styles.container}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow >
								<StyledTableCell>Date</StyledTableCell>
								<StyledTableCell align="right">Id</StyledTableCell>
								<StyledTableCell align="right">Gender</StyledTableCell>
								<StyledTableCell align="right">Age</StyledTableCell>
								<StyledTableCell align="right">Municipality</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{tests.map((row) => (
							<StyledTableRow hover key={row.id}>
								<StyledTableCell component="th" scope="row">
									{(moment(row.confirmationDate)).format("yyyy-MM-DD")}
								</StyledTableCell>
								<StyledTableCell align="right">{row.id}</StyledTableCell>
								<StyledTableCell align="right">{row.gender}</StyledTableCell>
								<StyledTableCell align="right">{row.ageBracket}</StyledTableCell>
								<StyledTableCell align="right">{row.municipalityName}</StyledTableCell>
							</StyledTableRow>
						))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={testCount}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			</>}
		</Grid>
		<Grid item sm={1} md={2}></Grid>
	</Grid>
	);
};

export default TablePage