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
import classnames from "classnames";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { ProjectAnalyticsDto } from "types/ProjectAnalyticsDto";
import { chartOptions } from "variables/charts";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale
);

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
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

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
    onFetchGranularityData?.(timeGranularity);
  }, [timeGranularity, onFetchGranularityData]);

  // Convert analytics -> datasets with {x, y} so time scale can parse properly
  useEffect(() => {
    if (!analytics || analytics.length === 0) {
      setChartData({ labels: [], datasets: [] });
      return;
    }

    // unique, sorted timelabels (ISO-like strings expected)
    const allTimeLabels = Array.from(
      new Set(analytics.map((a) => a.timeLabel))
    ).sort();

    const projectNames = Array.from(
      new Set(analytics.map((a) => a.projectName))
    );

    const datasets = projectNames.map((projName, idx) => {
      const points = allTimeLabels.map((t) => {
        const found = analytics.find(
          (a) => a.projectName === projName && a.timeLabel === t
        );
        return { x: t, y: found ? found.totalPatients : 0 };
      });

      return {
        label: projName,
        data: points, // {x, y} pairs
        borderColor: colorPalette[idx % colorPalette.length],
        backgroundColor: colorPalette[idx % colorPalette.length],
        borderWidth: 2,
        fill: false,
        tension: 0.2,
      };
    });

    // When using {x,y} we don't need labels on root; Chart.js derives from data.x
    setChartData({ datasets });
  }, [analytics, colorPalette]);

  const customChartOptions = useMemo(() => {
    const base = chartOptions?.() || {};

    // choose parser/unit based on granularity
    // daily & weekly: yyyy-MM-dd; monthly: yyyy-MM; yearly: yyyy
    const parser =
      timeGranularity === "yearly"
        ? "yyyy"
        : timeGranularity === "monthly"
        ? "yyyy-MM"
        : "yyyy-MM-dd";

    const unit =
      timeGranularity === "yearly"
        ? "year"
        : timeGranularity === "monthly"
        ? "month"
        : timeGranularity === "weekly"
        ? "week"
        : "day";

    return {
      ...base,
      parsing: true, // we provide {x,y}; Chart.js will read them
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...base.plugins,
        legend: { display: true, position: "bottom" as const },
        tooltip: { mode: "index" as const, intersect: false },
      },
      interaction: { mode: "index" as const, intersect: false },
      scales: {
        x: {
          type: "time",
          time: { unit, parser },
          grid: { display: true },
          ticks: { autoSkip: true, maxRotation: 0 },
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 10 },
          grid: { display: true },
        },
      },
    };
  }, [timeGranularity]);

  const handleGranularityChange = (g: string) => setTimeGranularity(g);

  const hasData =
    chartData?.datasets && chartData.datasets.some((d: any) => d.data?.length);

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
              {["daily", "weekly", "monthly", "yearly"].map((g) => (
                <NavItem key={g}>
                  <NavLink
                    className={classnames("py-2 px-3", {
                      active: timeGranularity === g,
                    })}
                    href="#granularity"
                    onClick={(e) => {
                      e.preventDefault();
                      handleGranularityChange(g);
                    }}
                  >
                    <span className="d-none d-md-block">
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </span>
                    <span className="d-md-none">
                      {g.charAt(0).toUpperCase()}
                    </span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </div>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="chart" style={{ height: 350 }}>
          {hasData ? (
            <Line data={chartData} options={customChartOptions} />
          ) : (
            <p className="text-white m-0">No data available</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default GeneralPatientsAnalyticsChart;
