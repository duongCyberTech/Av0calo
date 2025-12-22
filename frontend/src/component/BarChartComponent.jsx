import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';
import { Box, Typography } from '@mui/material';

const chartSetting = {
  yAxis: [
    {
      label: 'count (number of comments)',
      width: 60,
    },
  ],
  height: 400,
};

export default function BarsDataset({data}) {
  return (
    <Box width="40%">
      <Typography variant="h5" gutterBottom>
        Số lượng phản hồi của từng hạng mục
      </Typography>
      <BarChart
        dataset={data}
        xAxis={[{ dataKey: 'aspect' }]}
        series={[
          { dataKey: 'POS', label: 'positive', valueFormatter },
          { dataKey: 'NEG', label: 'negative', valueFormatter },
        ]}
        {...chartSetting}
      />
    </Box>
  );
}
