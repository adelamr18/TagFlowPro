import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Line } from "react-chartjs-2";
import classnames from "classnames";
import { ProjectAnalyticsDto } from "types/ProjectAnalyticsDto";
import { chartOptions } from "variables/charts";

interface GeneralPatientsAnalyticsChartProps {
  analytics: ProjectAnalyticsDto[] | null;
  fromDate: string;
  toDate: string;
  selectedProject: { value: any; label: string } | undefined;
  selectedPatientType: string;
  viewerId?: number;
  onFetchGranularityData?: (granularity: string) => void;
}

const GeneralPatientsAnalyticsChart: React.FC<
  GeneralPatientsAnalyticsChartProps
> = ({ analytics, onFetchGranularityData }) => {
  const [timeGranularity, setTimeGranularity] = useState<string>("monthly");
  const [chartData, setChartData] = useState<any>({});

  const colorPalette = useMemo(
    () => [
      "#f5365c",
      "#5e72e4",
      "#2dce89",
      "#11cdef",
      "#fb6340",
      "#ffd600",
      "#9c27b0",
      "#ff9800",
    ],
    []
  );

  useEffect(() => {
    if (onFetchGranularityData) {
      onFetchGranularityData(timeGranularity);
    }
  }, [timeGranularity, onFetchGranularityData]);

  useEffect(() => {
    if (analytics && analytics.length > 0) {
      const allTimeLabels = Array.from(
        new Set(analytics.map((item) => item.timeLabel))
      ).sort();

      const projectNames = Array.from(
        new Set(analytics.map((item) => item.projectName))
      );

      const datasets = projectNames.map((projName, index) => {
        const dataPoints = allTimeLabels.map((timeLabel) => {
          const found = analytics.find(
            (a) => a.projectName === projName && a.timeLabel === timeLabel
          );
          return found ? found.totalPatients : 0;
        });

        return {
          label: projName,
          data: dataPoints,
          borderColor: colorPalette[index % colorPalette.length],
          backgroundColor: colorPalette[index % colorPalette.length],
          borderWidth: 2,
          fill: false,
        };
      });

      setChartData({
        labels: allTimeLabels,
        datasets,
      });
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  }, [analytics, colorPalette]);

  const customChartOptions = useMemo(() => {
    const baseOptions = chartOptions(); // your existing config

    return {
      ...baseOptions,
      scales: {
        xAxes: [
          {
            type: "time", // Interpret labels as dates
            time: {
              unit: "day", // or 'week', 'month', etc. Adjust as needed
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 10, // Show increments of 10
            },
          },
        ],
      },
    };
  }, []);

  const handleGranularityChange = (granularity: string) => {
    setTimeGranularity(granularity);
  };

  return (
    <Card className="bg-gradient-default shadow">
      <CardHeader className="bg-transparent">
        <Row className="align-items-center">
          <div className="col">
            <h6 className="text-uppercase text-light ls-1 mb-1">
              Detailed Analytics
            </h6>
            <h2 className="text-white mb-0">Number Of Patients Analytics</h2>
          </div>
          <div className="col">
            <Nav className="justify-content-end" pills>
              {["daily", "weekly", "monthly", "yearly"].map((granularity) => (
                <NavItem key={granularity}>
                  <NavLink
                    className={classnames("py-2 px-3", {
                      active: timeGranularity === granularity,
                    })}
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      handleGranularityChange(granularity);
                    }}
                  >
                    <span className="d-none d-md-block">
                      {granularity.charAt(0).toUpperCase() +
                        granularity.slice(1)}
                    </span>
                    <span className="d-md-none">
                      {granularity.charAt(0).toUpperCase()}
                    </span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </div>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="chart">
          {chartData.labels && chartData.labels.length > 0 ? (
            <Line
              data={chartData}
              options={customChartOptions} // merged config
            />
          ) : (
            <p className="text-white">No data available</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default GeneralPatientsAnalyticsChart;
