import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';

const chartSetting = {
  yAxis: [
    {
      label: 'count (number of comments)',
      width: 60,
    },
  ],
  height: 300,
};

export default function BarsDataset({data}) {
  return (
    <BarChart
      dataset={data}
      xAxis={[{ dataKey: 'aspect' }]}
      series={[
        { dataKey: 'POS', label: 'positive', valueFormatter },
        { dataKey: 'NEG', label: 'negative', valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}
