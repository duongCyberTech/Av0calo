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

const classes = ["Đóng gói", "Giao hàng", "Bơ", "Dầu", "Snack"];

// Define colors for each class
const classColors = {
  'Đóng gói': '#fa938e',
  'Giao hàng': '#98bf45',
  'Bơ': '#51cbcf',
  "Dầu": '#d397ff',
  "Snack": '#5999eeff'
};

// Different opacity based on class
const opacityMap = {
  'Đóng gói': 0.9,
  'Giao hàng': 0.7,
  'Bơ': 0.5,
  "Dầu": 0.3,
  "Snack": 0.1
};

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

export default function TitanicPie({ data = [] }) {
  const [view, setView] = React.useState('class');
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Transform analysisData to titanicData format
  const titanicData = React.useMemo(() => {
    const result = [];
    data.forEach((item) => {
      if (item.POS && item.POS > 0) {
        result.push({
          Class: item.aspect,
          Survived: 'Positive',
          Count: item.POS
        });
      }
      if (item.NEG && item.NEG > 0) {
        result.push({
          Class: item.aspect,
          Survived: 'Negative',
          Count: item.NEG
        });
      }
      if (item.NEU && item.NEU > 0) {
        result.push({
          Class: item.aspect,
          Survived: 'Neural',
          Count: item.NEU
        });
      }
    });
    return result;
  }, [data]);

  // Calculate total count
  const totalCount = React.useMemo(() => {
    return titanicData.reduce((sum, item) => sum + item.Count, 0);
  }, [titanicData]);

  // Calculate classData
  const classData = React.useMemo(() => {
    return classes.map((pClass) => {
      const classTotal = titanicData
        .filter((item) => item.Class === pClass)
        .reduce((acc, item) => acc + item.Count, 0);
      return {
        id: pClass,
        label: `${pClass} Class:`,
        value: classTotal,
        percentage: totalCount > 0 ? (classTotal / totalCount) * 100 : 0,
        color: classColors[pClass],
      };
    }).filter(item => item.percentage > 0);
  }, [titanicData, totalCount]);

  // Calculate classSurvivalData
  const classSurvivalData = React.useMemo(() => {
    return classes.flatMap((pClass) => {
      const classTotal = classData.find((d) => d.id === pClass)?.value ?? 0;
      const baseColor = classColors[pClass];
      return titanicData
        .filter((item) => item.Class === pClass)
        .sort((a, b) => (a.Survived > b.Survived ? 1 : -1))
        .map((item) => ({
          id: `${pClass}-${item.Survived}`,
          label: item.Survived,
          value: item.Count,
          percentage: classTotal > 0 ? (item.Count / classTotal) * 100 : 0,
          color: item.Survived === 'Positive' ? baseColor : (item.Survived === 'Neural' ? `${baseColor}80` : `${baseColor}50`),
        })).filter(item => item.percentage > 0);
    });
  }, [titanicData, classData]);

  // Calculate survivalData
  const survivalData = React.useMemo(() => {
    const yesTotal = titanicData
      .filter((item) => item.Survived === 'Positive')
      .reduce((sum, item) => sum + item.Count, 0);
    const noTotal = titanicData
      .filter((item) => item.Survived === 'Negative')
      .reduce((sum, item) => sum + item.Count, 0);
    const neuralTotal = titanicData
      .filter((item) => item.Survived === 'Neural')
      .reduce((sum, item) => sum + item.Count, 0);
    return [
      {
        id: 'Positive',
        label: 'Positive sum:',
        value: yesTotal,
        percentage: totalCount > 0 ? (yesTotal / totalCount) * 100 : 0,
        color: classColors['Sản phẩm'] || '#98bf45',
      },
      {
        id: 'Negative',
        label: 'Negative sum:',
        value: noTotal,
        percentage: totalCount > 0 ? (noTotal / totalCount) * 100 : 0,
        color: classColors['Sản phẩm'] || '#fa938e',
      },
      {
        id: 'Neural',
        label: 'Neural Sum:',
        value: neuralTotal,
        percentage: totalCount > 0 ? (neuralTotal / totalCount) * 100 : 0,
        color: classColors['Sản phẩm'] || '#e4d61bff',
      },
    ];
  }, [titanicData, totalCount]);

  // Calculate survivalClassData
  const survivalClassData = React.useMemo(() => {
    return [...titanicData]
      .sort((a) => (a.Survived === 'Positive' ? -1 : (a.Survived === 'Neural' ? 0 : 1)))
      .map((item) => {
        const baseColor = survivalData.find((d) => d.id === item.Survived)?.color || '#fa938e';
        return {
          id: `${item.Class}-${item.Survived}`,
          label: `${item.Class} class:`,
          value: item.Count,
          percentage:
            (item.Survived === 'Positive'
              ? (survivalData[0]?.value > 0 ? (item.Count / survivalData[0].value) * 100 : 0)
              : (item.Survived === 'Negative' ? (survivalData[1]?.value > 0 ? (item.Count / survivalData[1].value) * 100 : 0)
              : (survivalData[2]?.value > 0 ? (item.Count / survivalData[1].value) * 100 : 0)
            )),
          color: hexToRgba(baseColor, opacityMap[item.Class] || 1),
        };
      });
  }, [titanicData, survivalData]);

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
        <ToggleButton value="class">View by Category</ToggleButton>
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
                  totalCount > 0 ? `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)` : `${value}`,
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
                  totalCount > 0 ? `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)` : `${value}`,
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
            <PieCenterLabel>Category</PieCenterLabel>
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
                  totalCount > 0 ? `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)` : `${value}`,
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
                  totalCount > 0 ? `${value} out of ${totalCount} (${((value / totalCount) * 100).toFixed(0)}%)` : `${value}`,
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
            <PieCenterLabel>Sentiment</PieCenterLabel>
          </PieChart>
        )}
      </Box>
    </Box>
  );
}
