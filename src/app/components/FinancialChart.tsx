"use client";
import { Card, Title, LineChart, AreaChart } from "@tremor/react";
import { formatCurrency } from "../utils/formatter";

interface FinancialData {
  date: string;
  cashOnHand: number;
  cashBurn: number;
  monthlyRevenue: number;
}

interface FinancialChartProps {
  data: FinancialData[];
}

export function FinancialChart({ data }: FinancialChartProps) {
  // Sort data by date in ascending order for proper chart display
  const sortedData = [...data].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );


  return (
    <Card className="py-8">   
      <div className="flex items-center gap-6 mt-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Cash on Hand</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600">Cash Burn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Monthly Revenue</span>
        </div>
      </div>
      
      <AreaChart
        className="h-90"
        data={sortedData}
        index="date"
        customTooltip={
          (props) => {
            const { payload } = props;
            if (!payload || !payload[0]) return null;
            const { date, cashOnHand, cashBurn, monthlyRevenue } = payload[0].payload;
            return (
              <div className="bg-white p-2 rounded-lg shadow-md">
                <p className="text-sm font-semibold text-gray-600">{date}</p>
                <p className="text-sm text-gray-600">Cash on Hand: {formatCurrency(cashOnHand)}</p>
                <p className="text-sm text-gray-600">Cash Burn: {formatCurrency(cashBurn)}</p>
                <p className="text-sm text-gray-600">Monthly Revenue: {formatCurrency(monthlyRevenue)}</p>
              </div>
            );
          }
        }

        categories={["cashOnHand", "cashBurn", "monthlyRevenue"]}
        valueFormatter={(value) => 
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value)
        }
        yAxisWidth={90}
        showLegend={false}
        showXAxis={true}
        showYAxis={true}
        showGridLines={false}
        showAnimation={true}
        curveType="natural"
      />
    </Card>
  );
} 