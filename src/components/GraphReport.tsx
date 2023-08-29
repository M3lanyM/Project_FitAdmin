import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Ganancias',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Ingresos',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Cancelar',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
];

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';

  render() {
    return (
      <ResponsiveContainer width="95%" height="95%" className="graph2">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 3,
            left: 1,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
