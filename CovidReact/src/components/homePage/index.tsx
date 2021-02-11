import * as React from "react";
import {  AggregateFunctions,  ColumnDataType,  ColumnSortDirection,  createColumn} from "tubular-common";
import { DataGrid, ToolbarOptions } from "tubular-react";
import { useGridRefresh } from "tubular-react-common";
import { LocalStorage } from "tubular-common";
import * as constants from '../constants';

const columns = [
	createColumn("Id", {
	  label: "Id",
	  dataType: ColumnDataType.Numeric,
	  filterable: true,
	  isKey: true,
	  sortDirection: ColumnSortDirection.Ascending,
	  sortOrder: 1,
	  sortable: true
	}),
	createColumn("XCoordinate", {
	  label: "X",
	  aggregate: AggregateFunctions.Count,
	  filterable: true,
	  searchable: true,
	  sortable: true
	}),
	createColumn("YCoordinate", {
	  label: "Y",
	  dataType: ColumnDataType.String,
	  filterable: true,
	  searchable: true,
	  sortable: true
	}),
	createColumn("CaseCode", {
	  label: "Case Code",
	  dataType: ColumnDataType.String,
	  filterable: true,
	  sortable: true
	}),
	createColumn("ConfirmationDate", {
	  label: "Confirmation Date",
	  dataType: ColumnDataType.String,
	  filterable: true,
	  sortable: true
	}),
	createColumn("MunicipalityCode", {
	  label: "Mun. Code",
	  dataType: ColumnDataType.String,
	  filterable: true,
	  searchable: true
	}),
	createColumn("MunicipalityName", {
	  label: "Municipality Name",
	  dataType: ColumnDataType.String,
	  filterable: true,
	  searchable: true
	}),
	createColumn("AgeBracket", {
	  label: "Age",
	  dataType: ColumnDataType.String,
	  filterable: true,
	  searchable: true
	}),
	createColumn("Gender", {
	  dataType: ColumnDataType.String,
	  filterable: true,
	  searchable: true
	})
  ];

const HomePage: React.FunctionComponent = () => {
  const [refresh] = useGridRefresh();
  var url = `${constants.covidApiUrl}/CovidTests/GridData`;

  const toolbarOptions = new ToolbarOptions({
    title : 'Covid-19'
  });

  return (
    <DataGrid
      gridName="Covid-19"
      columns={[...columns]}
      dataSource={url}
      deps={[refresh]}
      storage={new LocalStorage()}
	  toolbarOptions={toolbarOptions}
    />
  );
};

export default HomePage;
