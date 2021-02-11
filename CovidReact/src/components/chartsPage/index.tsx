import React, { useState, useEffect } from 'react';
import * as signalR from "@microsoft/signalr";
import * as constants from '../constants';
import { Grid, Typography } from "@material-ui/core";
import { Styles} from '../styles';
import { Bar } from 'react-chartjs-2';
import { MDBContainer } from 'mdbreact';
import moment from 'moment';
import Controls from "../controls/controls";

const url = `${constants.covidApiUrl}/CovidTests/UpdateChartData`;

const filters = [
	{ id: '0', title: 'Date', method: 'ChartDataByDate' },
	{ id: '1', title: 'Municipality', method: 'ChartDataByMunicipality' },
	{ id: '2', title: 'Gender', method: 'ChartDataByGender' },
	{ id: '3', title: 'Age', method: 'ChartDataByAge' },
]

var chartLabels;
var chartValues;

let chartData = {
  labels: chartLabels,
  datasets: [
	  {
	  data: chartValues,
	  backgroundColor: 'rgba(220,0,80,0.2)',
	  hoverBackgroundColor:'rgba(220,0,80,0.6)',
	  borderColor: 'rgba(220,0,80,0.5)',
	  borderWidth: '1',
	  }
  ]	
  };

const messageSubmit = (typeParam: string, clientIdParam) => {
	if(clientIdParam != null)
	{
		fetch(url, {
		"method": "POST",
		"headers": {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			ClientId: clientIdParam,
			ChartType: typeParam
		})
		});
	}
}

const ChartsPage: React.FC = () => {
  const hubConnection = new signalR.HubConnectionBuilder().withUrl(url).build();
  hubConnection.start()
  .then(() => {
	  console.log(hubConnection);
	  console.log('Connection started! Id: ' + hubConnection.connectionId);
	  messageSubmit(filters[0].title, hubConnection.connectionId);
	});

  interface MessageProps {
    HubConnection: signalR.HubConnection
  }

  const Messages: React.FC<MessageProps> = (messageProps) => {
	const styles = Styles();
	const [date, setDate] = useState<Date>(new Date());
	const [chartType, setChartType] = React.useState(filters[0].id);
	const [hubMethod, setHubMethod] = React.useState(filters[0].method);

    useEffect(() => {
		console.log("useEffect: hubMethod: " + hubMethod);
      messageProps.HubConnection.on(hubMethod, message => {
		  if(message != null)
		  {
			  let content = JSON.stringify(message['value'])
			  let json = JSON.parse(content)
			  chartData.labels = Object.keys(json)
			  chartData.datasets[0].data = Object.values(json)
			  console.log("useEffect: chartData.labels: " + chartData.labels);
			  setDate(new Date());
		  }
      })
    }, [hubMethod]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		messageProps.HubConnection.off(hubMethod);
		let filter = filters[(event.target as HTMLInputElement).value];
		setChartType(filter.id);
		setHubMethod(filter.method);
		messageSubmit(filter.title, hubConnection.connectionId);
	  };
	return <> 
	<Grid container className={styles.root}>
					<Grid item sm={1} md={2} ></Grid>
					<Grid item xs={12} sm={10} md={8} className={styles.body}>
						<Typography className={styles.title} id="tableTitle" component="div">
							Covid-19 Chart
						</Typography>
						<Grid container>
							<Grid item xs>
								Last update: {(moment(date)).format("HH:mm:ss")}
							</Grid>
							<Grid item xs>
									<Controls.RadioGroup
										value={chartType}
										onChange={handleInputChange}
										items={filters}/>
							</Grid>
						</Grid>

						<MDBContainer>
							<Bar
							data={chartData}
							options={{ 
								responsive: true,
								legend: {	
									display: false
							  	},
								scales: {
								xAxes: [{
									gridLines: {
										display: false
									},
									ticks: {
										fontColor: "white", 
									}
								}],
								yAxes: [{
									gridLines: {
										display: true,
										color: "#8f8f8f"
									},
									ticks: {
										fontColor: "white", 
									}
								}]
								}
							}}
							/>
						</MDBContainer>
					</Grid>
					<Grid item sm={1} md={2}></Grid>
				</Grid></>
  }

  return <><Messages HubConnection={hubConnection}></Messages></>
}

export default ChartsPage;