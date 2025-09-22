import { WeatherData } from '../types';

// Mock weather service - in production, you'd use a real weather API like OpenWeatherMap
export const getWeatherData = async (lat: number, lng: number, locationName: string): Promise<WeatherData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock weather data based on location
  const mockWeatherConditions = [
    'Clear Sky', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Moderate Rain', 'Sunny', 'Overcast'
  ];
  
  const mockIcons = [
    '☀️', '⛅', '☁️', '🌦️', '🌧️', '🌤️', '☁️'
  ];
  
  const conditionIndex = Math.floor(Math.random() * mockWeatherConditions.length);
  
  return {
    location: locationName,
    temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
    condition: mockWeatherConditions[conditionIndex],
    humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
    windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
    visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
    icon: mockIcons[conditionIndex]
  };
};