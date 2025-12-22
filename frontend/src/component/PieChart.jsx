import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

// Convert hex color to rgba with opacity
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const classes = ["Đóng gói", "Sản phẩm", "Bơ", "Dầu", "Snack"];

// Define colors for each class
const classColors = {
  'Đóng gói': '#fa938e',
  'Sản phẩm': '#98bf45',
  'Bơ': '#51cbcf',
  "Dầu": '#d397ff',
  "Snack": '#5999eeff'
};

// Different opacity based on class
const opacityMap = {
  'Đóng gói': 0.9,
  'Sản phẩm': 0.7,
  'Bơ': 0.5,
  "Dầu": 0.3,
  "Snack": 0.1
};

const classData = classes.map((pClass) => {
  const classTotal = titanicData
    .filter((item) => item.Class === pClass)
    .reduce((acc, item) => acc + item.Count, 0);
  return {
    id: pClass,
    label: `${pClass} Class:`,
    value: classTotal,
    percentage: (classTotal / totalCount) * 100,
    color: classColors[pClass],
  };
});

const classSurvivalData = classes.flatMap((pClass) => {
  const classTotal = classData.find((d) => d.id === pClass).value ?? 0;
  const baseColor = classColors[pClass];
  return titanicData
    .filter((item) => item.Class === pClass)
    .sort((a, b) => (a.Survived > b.Survived ? 1 : -1))
    .map((item) => ({
      id: `${pClass}-${item.Survived}`,
      label: item.Survived,
      value: item.Count,
      percentage: (item.Count / classTotal) * 100,
      color: item.Survived === 'Yes' ? baseColor : `${baseColor}80`, // 80 is 50% opacity for 'No'
    }));
});

// Create a simplified dataset that groups all classes together for Yes/No
const survivalData = [
  {
    id: 'Yes',
    label: 'Survived:',
    value: titanicData
      .filter((item) => item.Survived === 'Yes')
      .reduce((sum, item) => sum + item.Count, 0),
    percentage:
      (titanicData
        .filter((item) => item.Survived === 'Yes')
        .reduce((sum, item) => sum + item.Count, 0) /
        totalCount) *
      100,
    color: classColors['3rd'],
  },
  {
    id: 'No',
    label: 'Did not survive:',
    value: titanicData
      .filter((item) => item.Survived === 'No')
      .reduce((sum, item) => sum + item.Count, 0),
    percentage:
      (titanicData
        .filter((item) => item.Survived === 'No')
        .reduce((sum, item) => sum + item.Count, 0) /
        totalCount) *
      100,
    color: classColors['1st'],
  },
];

// Create dataset for class distribution by survival status (Yes first, then No)
const survivalClassData = [...titanicData]
  .sort((a) => (a.Survived === 'Yes' ? -1 : 1))
  .map((item) => {
    const baseColor = survivalData.find((d) => d.id === item.Survived).color;
    return {
      id: `${item.Class}-${item.Survived}`,
      label: `${item.Class} class:`,
      value: item.Count,
      percentage:
        (item.Count /
          (item.Survived === 'Yes'
            ? survivalData[0].value
            : survivalData[1].value)) *
        100,
      color: hexToRgba(baseColor, opacityMap[item.Class] || 1),
    };
  });

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function TitanicPie() {
  const [view, setView] = React.useState('class');
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const innerRadius = 50;
  const middleRadius = 120;

  return (
    <Box sx={{ textAlign: 'center', width: "40%" }}>
      <Typography variant="h5" gutterBottom>
        Phân tích tỉ lệ từng hạng mục
      </Typography>
      <ToggleButtonGroup
        color="primary"
        size="small"
        value={view}
        exclusive
        onChange={handleViewChange}
      >
        <ToggleButton value="class">View by Tag</ToggleButton>
        <ToggleButton value="survival">View by Sentiment</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: 'flex', justifyContent: 'center', height: 400 }}>
        {view === 'class' ? (
          <PieChart
            series={[
              {
                innerRadius,
                outerRadius: middleRadius,
                data: classData,
                arcLabel: (item) => `${item.id} (${item.percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
              {
                innerRadius: middleRadius,
                outerRadius: middleRadius + 20,
                data: classSurvivalData,
                arcLabel: (item) => `${item.label} (${item.percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
                arcLabelRadius: 160,
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontSize: '12px',
              },
            }}
            hideLegend
          >
            <PieCenterLabel>Class</PieCenterLabel>
          </PieChart>
        ) : (
          <PieChart
            series={[
              {
                innerRadius,
                outerRadius: middleRadius,
                data: survivalData,
                arcLabel: (item) => `${item.id} (${item.percentage.toFixed(0)}%)`,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
              {
                innerRadius: middleRadius,
                outerRadius: middleRadius + 20,
                data: survivalClassData,
                arcLabel: (item) => {
                  const id = item.id || '';
                  const percentage = item.percentage || 0;
                  return `${id.split('-')[0]} (${percentage.toFixed(0)}%)`;
                },
                arcLabelRadius: 160,
                valueFormatter: ({ value }) =>
                  `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)`,
                highlightScope: { fade: 'global', highlight: 'item' },
                highlighted: { additionalRadius: 2 },
                cornerRadius: 3,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fontSize: '12px',
              },
            }}
            hideLegend
          >
            <PieCenterLabel>Survived</PieCenterLabel>
          </PieChart>
        )}
      </Box>
    </Box>
  );
}
