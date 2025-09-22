import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Map, DollarSign } from 'lucide-react';
import { riskDistributionData, timelineData, rockTypeData, locationData, economicData } from '../data/mockData';

const ChartsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Risk Distribution Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <PieChartIcon className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Risk Level Distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={riskDistributionData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {riskDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Mining Operations Timeline */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-accent-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Mining Operations Timeline</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="operations" stroke="#0ea5e9" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rock Type Analysis */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-5 w-5 text-secondary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Rock Type Risk Analysis</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={rockTypeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="highRisk" fill="#DC3545" name="High Risk" />
            <Bar dataKey="lowRisk" fill="#28A745" name="Low Risk" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Location Heat Map */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Map className="h-5 w-5 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Location Risk Heat Map</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="X Coordinate" />
            <YAxis type="number" dataKey="y" name="Y Coordinate" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name, props) => [
                props.payload.location,
                `Risk: ${props.payload.risk}`
              ]}
            />
            <Scatter 
              dataKey="y" 
              fill={(data) => data.risk === 'High' ? '#DC3545' : '#28A745'}
            >
              {locationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.risk === 'High' ? '#DC3545' : '#28A745'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Economic Impact */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <DollarSign className="h-5 w-5 text-secondary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Economic Impact Analysis</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={economicData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="miningCost" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" name="Mining Cost" />
            <Area type="monotone" dataKey="oreValue" stackId="2" stroke="#22c55e" fill="#22c55e" name="Ore Value" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsPanel;