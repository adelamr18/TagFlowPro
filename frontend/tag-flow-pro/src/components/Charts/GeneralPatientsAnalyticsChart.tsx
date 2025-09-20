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

// ✅ Chart.js v4 imports + registration
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";

import { ProjectAnalyticsDto } from "types/ProjectAnalyticsDto";

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler
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

  // Normalize labels to ISO strings so TimeScale can parse them
  const normalizeLabel = (label: string) => {
    // daily: "YYYY-MM-DD"
    // weekly: you send a representative date "YYYY-MM-DD"
    // monthly: "YYYY-MM" -> make it first day-of-month
    // yearly: "YYYY" -> make it Jan 1
    if (/^\d{4}-\d{2}-\d{2}$/.test(label)) return label; // ISO date
    if (/^\d{4}-\d{2}$/.test(label)) return `${label}-01`;
    if (/^\d{4}$/.test(label)) return `${label}-01-01`;
    // fallback: let adapter try to parse
    return label;
  };

  useEffect(() => {
    if (analytics && analytics.length > 0) {
      const allLabels = Array.from(
        new Set(analytics.map((a) => normalizeLabel(a.timeLabel)))
      ).sort();

      const projectNames = Array.from(
        new Set(analytics.map((a) => a.projectName))
      );

      const datasets = projectNames.map((projName, idx) => {
        const dataPoints = allLabels.map((lbl) => {
          const original = analytics.find(
            (a) =>
              a.projectName === projName && normalizeLabel(a.timeLabel) === lbl
          );
          return original ? original.totalPatients : 0;
        });

        return {
          label: projName,
          data: dataPoints,
          borderColor: colorPalette[idx % colorPalette.length],
          backgroundColor: colorPalette[idx % colorPalette.length],
          tension: 0.25,
          borderWidth: 2,
          pointRadius: 2,
          fill: false,
        };
      });

      setChartData({ labels: allLabels, datasets });
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  }, [analytics, colorPalette]);

  const customChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "top" as const },
        tooltip: { mode: "index" as const, intersect: false },
      },
      interaction: { mode: "nearest" as const, intersect: false },
      // ✅ v3/v4 scale syntax
      scales: {
        x: {
          type: "time" as const,
          time: {
            // Adjust unit based on granularity; Chart.js will still auto if omitted
            unit:
              timeGranularity === "daily"
                ? "day"
                : timeGranularity === "weekly"
                ? "week"
                : timeGranularity === "monthly"
                ? "month"
                : "year",
            tooltipFormat: "PP",
          },
          ticks: { autoSkip: true, maxTicksLimit: 12 },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 10 },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    }),
    [timeGranularity]
  );

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
              {["daily", "weekly", "monthly", "yearly"].map((g) => (
                <NavItem key={g}>
                  <NavLink
                    className={classnames("py-2 px-3", {
                      active: timeGranularity === g,
                    })}
                    href="#"
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
          {chartData.labels?.length ? (
            <Line data={chartData} options={customChartOptions} />
          ) : (
            <p className="text-white mb-0">No data available</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default GeneralPatientsAnalyticsChart;
