import React, { useState } from 'react';
import { MapPin, Loader2, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { RiskAssessmentInput, PredictionResponse } from '../types';
import { predictRisk } from '../services/api';
import { rockTypeOptions } from '../data/mockData';

const RiskAssessmentForm: React.FC = () => {
  const [formData, setFormData] = useState<RiskAssessmentInput>({
    X: 500,
    Y: 400,
    Z: 50,
    Rock_Type: 'granite',
    Ore_Grade_percent: 35,
    Tonnage: 1200,
    Ore_Value_per_tonne: 50,
    Mining_Cost: 30,
    Processing_Cost: 15
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Rock_Type' ? value : parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await predictRisk(formData);
      setPrediction(result);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isHighRisk = prediction?.prediction?.risk_label?.toLowerCase().includes('high');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Risk Assessment Form
        </h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Coordinates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">X (meters)</label>
              <input
                type="number"
                name="X"
                value={formData.X}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Y (meters)</label>
              <input
                type="number"
                name="Y"
                value={formData.Y}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Z (elevation)</label>
              <input
                type="number"
                name="Z"
                value={formData.Z}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          {/* Rock Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rock Type</label>
            <select
              name="Rock_Type"
              value={formData.Rock_Type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {rockTypeOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Ore Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ore Grade (%)</label>
              <input
                type="number"
                name="Ore_Grade_percent"
                value={formData.Ore_Grade_percent}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tonnage</label>
              <input
                type="number"
                name="Tonnage"
                value={formData.Tonnage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          {/* Economic Factors */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ore Value per Tonne (¥)</label>
              <input
                type="number"
                name="Ore_Value_per_tonne"
                value={formData.Ore_Value_per_tonne}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mining Cost (¥)</label>
                <input
                  type="number"
                  name="Mining_Cost"
                  value={formData.Mining_Cost}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Cost (¥)</label>
                <input
                  type="number"
                  name="Processing_Cost"
                  value={formData.Processing_Cost}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Predict Risk
              </>
            )}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {prediction && (
          <div className="mt-6 space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              isHighRisk 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  {isHighRisk ? (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  {prediction.prediction.risk_label}
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isHighRisk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {(prediction.prediction.confidence * 100).toFixed(1)}% Confidence
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{prediction.explanation}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Key Factors</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {prediction.key_factors.slice(0, 3).map((factor, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Safety Recommendations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {prediction.safety_recommendations.slice(0, 3).map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAssessmentForm;