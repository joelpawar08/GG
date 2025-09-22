import { RecentAssessment, ChartData, LocationData } from '../types';

export const riskDistributionData: ChartData[] = [
  { name: 'High Risk', value: 35, color: '#DC3545' },
  { name: 'Low Risk', value: 65, color: '#28A745' }
];

export const timelineData = [
  { name: 'Jan', operations: 45 },
  { name: 'Feb', operations: 52 },
  { name: 'Mar', operations: 48 },
  { name: 'Apr', operations: 61 },
  { name: 'May', operations: 55 },
  { name: 'Jun', operations: 67 },
  { name: 'Jul', operations: 73 },
  { name: 'Aug', operations: 69 },
  { name: 'Sep', operations: 78 },
  { name: 'Oct', operations: 82 },
  { name: 'Nov', operations: 75 },
  { name: 'Dec', operations: 71 }
];

export const rockTypeData = [
  { name: 'Granite', highRisk: 12, lowRisk: 28 },
  { name: 'Limestone', highRisk: 8, lowRisk: 35 },
  { name: 'Sandstone', highRisk: 15, lowRisk: 22 },
  { name: 'Shale', highRisk: 22, lowRisk: 18 },
  { name: 'Quartzite', highRisk: 6, lowRisk: 25 },
  { name: 'Basalt', highRisk: 18, lowRisk: 15 }
];

export const locationData: LocationData[] = [
  { x: 450, y: 320, risk: 'High', location: 'Jharia Coal Field' },
  { x: 680, y: 280, risk: 'Low', location: 'Korba Coalfield' },
  { x: 520, y: 410, risk: 'High', location: 'Singareni Collieries' },
  { x: 720, y: 350, risk: 'Low', location: 'Mahanadi Coalfield' },
  { x: 380, y: 290, risk: 'High', location: 'Raniganj Coalfield' },
  { x: 590, y: 380, risk: 'Low', location: 'Godavari Valley' },
  { x: 430, y: 360, risk: 'High', location: 'Wardha Valley' },
  { x: 650, y: 320, risk: 'Low', location: 'Talcher Coalfield' },
  { x: 480, y: 340, risk: 'High', location: 'Bokaro Coalfield' },
  { x: 700, y: 290, risk: 'Low', location: 'IB Valley Coalfield' }
];

export const economicData = [
  { name: 'Q1 2024', miningCost: 28, oreValue: 52, tonnage: 850 },
  { name: 'Q2 2024', miningCost: 31, oreValue: 48, tonnage: 920 },
  { name: 'Q3 2024', miningCost: 29, oreValue: 55, tonnage: 780 },
  { name: 'Q4 2024', miningCost: 33, oreValue: 58, tonnage: 1050 }
];

export const recentAssessments: RecentAssessment[] = [
  {
    id: '1',
    location: 'Jharia Coal Field',
    coordinates: '(450, 320, 45)',
    rockType: 'granite',
    riskLevel: 'High Risk',
    confidence: 94.5,
    date: '2024-12-15',
    tonnage: 1200
  },
  {
    id: '2',
    location: 'Korba Coalfield',
    coordinates: '(680, 280, 52)',
    rockType: 'limestone',
    riskLevel: 'Low Risk',
    confidence: 87.2,
    date: '2024-12-14',
    tonnage: 850
  },
  {
    id: '3',
    location: 'Singareni Collieries',
    coordinates: '(520, 410, 38)',
    rockType: 'sandstone',
    riskLevel: 'High Risk',
    confidence: 91.8,
    date: '2024-12-13',
    tonnage: 1450
  },
  {
    id: '4',
    location: 'Mahanadi Coalfield',
    coordinates: '(720, 350, 41)',
    rockType: 'shale',
    riskLevel: 'Low Risk',
    confidence: 89.3,
    date: '2024-12-12',
    tonnage: 750
  },
  {
    id: '5',
    location: 'Raniganj Coalfield',
    coordinates: '(380, 290, 48)',
    rockType: 'quartzite',
    riskLevel: 'High Risk',
    confidence: 92.7,
    date: '2024-12-11',
    tonnage: 1100
  }
];

export const rockTypeOptions = [
  'granite',
  'limestone',
  'sandstone',
  'shale',
  'quartzite',
  'slate',
  'marble',
  'basalt',
  'andesite',
  'other'
];