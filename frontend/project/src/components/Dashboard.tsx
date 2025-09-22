import React from 'react';
import { User } from '../types';
import RiskAssessmentForm from './RiskAssessmentForm';
import ChartsPanel from './ChartsPanel';
import RecentAssessmentsTable from './RecentAssessmentsTable';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Risk Assessment Form */}
          <div className="space-y-6">
            <RiskAssessmentForm />
          </div>

          {/* Right Panel - Data Visualization */}
          <div className="space-y-6">
            <ChartsPanel />
          </div>
        </div>

        {/* Bottom Section - Recent Assessments */}
        <div className="mt-8">
          <RecentAssessmentsTable />
        </div>
    </main>
  );
};

export default Dashboard;