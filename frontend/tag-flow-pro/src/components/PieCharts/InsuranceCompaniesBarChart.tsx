import React, { useMemo } from "react";
import { Card, CardHeader, CardBody, Col } from "reactstrap";
import { Bar } from "react-chartjs-2";
import { InsuranceCompanyPatientAnalyticsDto } from "types/OverviewDto";

interface InsuranceCompaniesBarChartProps {
  insuranceAnalytics: InsuranceCompanyPatientAnalyticsDto[];
}

const InsuranceCompaniesBarChart: React.FC<InsuranceCompaniesBarChartProps> = ({
  insuranceAnalytics,
}) => {
  const MAX_LABEL_LENGTH = 40;

  const fullCompanyNames = useMemo(
    () => insuranceAnalytics.map((item) => item.insuranceCompany.trim()),
    [insuranceAnalytics]
  );

  const truncatedLabels = useMemo(
    () =>
      insuranceAnalytics.map((item) => {
        const arabicName = item.insuranceCompany.split("/")[0].trim();
        return arabicName.length > MAX_LABEL_LENGTH
          ? arabicName.slice(0, MAX_LABEL_LENGTH) + "..."
          : arabicName;
      }),
    [insuranceAnalytics]
  );

  const chartData = useMemo(() => {
    const colorPalette = [
      "#5e72e4",
      "#11cdef",
      "#2dce89",
      "#fb6340",
      "#f5365c",
      "#ffd600",
      "#9c27b0",
      "#ff9800",
      "#009688",
      "#795548",
    ];
    return {
      labels: truncatedLabels,
      datasets: [
        {
          label: "Total Patients",
          data: insuranceAnalytics.map((item) => item.insuredPatients),
          backgroundColor: insuranceAnalytics.map(
            (_, index) => colorPalette[index % colorPalette.length]
          ),
        },
      ],
    };
  }, [insuranceAnalytics, truncatedLabels]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: false,
            minRotation: 45,
            maxRotation: 45,
            fontSize: 12,
            padding: 5,
            // The truncated label is used on the axis
            callback: function (label: string) {
              return label;
            },
          },
          gridLines: { display: true, color: "#ccc" },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 5, // Ticks: 0, 5, 10, 15, etc.
            fontSize: 12,
          },
          gridLines: { display: true, color: "#ccc" },
        },
      ],
    },
    legend: { display: false },
    tooltips: {
      backgroundColor: "#333",
      titleFontSize: 12,
      titleFontColor: "#fff",
      bodyFontSize: 12,
      bodyFontColor: "#fff",
      xPadding: 10,
      yPadding: 10,
      callbacks: {
        // Show the full company name (Arabic and English) on hover
        title: function (tooltipItems: any, data: any) {
          const idx = tooltipItems[0].index;
          return fullCompanyNames[idx];
        },
        label: function (tooltipItem: any, data: any) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const value = dataset.data[tooltipItem.index];
          return `Total Patients: ${value}`;
        },
      },
    },
  };

  return (
    <Col xl="12">
      <Card className="shadow">
        <CardHeader className="bg-transparent">
          <h3 className="mb-0">Total Patients Per Payer Bar Chart</h3>
        </CardHeader>
        <CardBody style={{ overflowX: "auto" }}>
          {/* Set a minWidth to enable horizontal scrolling if needed */}
          <div style={{ minWidth: "800px", height: "400px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default InsuranceCompaniesBarChart;
