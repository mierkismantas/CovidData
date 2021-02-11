import { makeStyles } from '@material-ui/core/styles';
import { withStyles} from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {createStyles, Theme} from '@material-ui/core';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: '#464646',
      color: theme.palette.common.white,
	  fontSize: 'calc(9px + 1vmin)'
    },
    body: {
      fontSize: 'calc(5px + 1vmin)'
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

const Styles = makeStyles((theme: Theme) => ({
	root: {
		width: '100%',
		minHeight: '100vh',
		display: 'table',
	},
	container: {
		maxHeight: 600,
	  },
	title: { 
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 'calc(7px + 3vmin)',
	},
	body: {
		marginTop: '3vh',
		padding: '0% 3% 0% 3%',
		background: 'grey',
		borderRadius: '10px',
		margin: 'auto',
	},
	navbarDisplayFlex: {
		display: `flex`,
		justifyContent: `space-between`,
		background: `grey`
	},
	navDisplayFlex: {
		display: `flex`,
		justifyContent: `space-between`,
		background: `grey`
	},
	linkText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `white`,
		fontSize: 'calc(10px + 1vmin)',
	},
	centered: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
}));

export { Styles, StyledTableCell, StyledTableRow };