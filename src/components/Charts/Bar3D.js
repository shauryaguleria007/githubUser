// STEP 1 - Include Dependencies
// Include react
import React from 'react'

// Include the react-fusioncharts component
import ReactFC from 'react-fusioncharts'

// Include the fusioncharts library
import FusionCharts from 'fusioncharts'

// Include the chart type
import Column2D from 'fusioncharts/fusioncharts.charts'

// Include the theme as fusion
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion'

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme)

const Bar3D = ({ data }) => {
  const chartConfigs = {
    type: 'Bar3D', // The chart type
    width: '100%', // Width of the chart
    height: '400', // Height of the chart
    pieRadious: '45%',
    dataFormat: 'json', // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        //Set the chart caption
        decimals: 0,
        caption: 'most forked ',
        //Set the chart subcaption
        //Set the x-axis name
        xAxisName: 'repos',
        //Set the y-axis name
        yAxisName: 'forks',
        numberSuffix: 'K',
        //Set the theme for your chart
        theme: 'fusion',
      },
      // Chart Data
      data,
    },
  }
  return <ReactFC {...chartConfigs} />
}

export default Bar3D
