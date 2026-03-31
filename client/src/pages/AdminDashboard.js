import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { adminAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';
import { FaUsers, FaFileAlt, FaCertificate, FaClipboardList, FaDatabase } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchAnalytics()]);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load dashboard statistics' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data.data);
    } catch (_) {
      // analytics section stays null, handled gracefully
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-500">No data available</div>
      </DashboardLayout>
    );
  }

  // Data for charts
  const gradeStatusData = Object.entries(stats.gradesByStatus || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  const employabilityData = Object.entries(stats.employabilityDistribution || {}).map(([key, value]) => ({
    name: key.replace('_', ' '),
    value,
  }));

  const COLORS = ['#16a34a', '#2563eb', '#ca8a04', '#ea580c', '#dc2626'];
  const LEVEL_ORDER = ['excellent', 'very_good', 'good', 'average', 'needs_improvement'];
  const sortedEmployabilityData = LEVEL_ORDER
    .filter(lvl => stats.employabilityDistribution?.[lvl] !== undefined)
    .map(lvl => ({ name: lvl.replace('_', ' '), value: stats.employabilityDistribution[lvl] }));

  const componentData = [
    { component: 'Academic (30%)', score: stats.componentAverages?.academic || 0, weight: 30 },
    { component: 'Skills (25%)', score: stats.componentAverages?.skills || 0, weight: 25 },
    { component: 'Certs (20%)', score: stats.componentAverages?.certification || 0, weight: 20 },
    { component: 'Soft Skills (25%)', score: stats.componentAverages?.softSkills || 0, weight: 25 },
  ];

  const radarData = [
    { subject: 'Academic', avg: stats.componentAverages?.academic || 0, fullMark: 100 },
    { subject: 'Skills', avg: stats.componentAverages?.skills || 0, fullMark: 100 },
    { subject: 'Certs', avg: stats.componentAverages?.certification || 0, fullMark: 100 },
    { subject: 'Soft Skills', avg: stats.componentAverages?.softSkills || 0, fullMark: 100 },
  ];

  return (
    <DashboardLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your system overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          {
            label: 'Total Students',
            value: stats.summary.totalStudents,
            icon: FaUsers,
            color: 'bg-blue-100 text-blue-600',
          },
          {
            label: 'Grades Uploaded',
            value: stats.summary.totalGrades,
            icon: FaFileAlt,
            color: 'bg-green-100 text-green-600',
          },
          {
            label: 'Certifications',
            value: stats.summary.totalCertifications,
            icon: FaCertificate,
            color: 'bg-purple-100 text-purple-600',
          },
          {
            label: 'Surveys Completed',
            value: stats.summary.totalSurveysCompleted,
            icon: FaClipboardList,
            color: 'bg-yellow-100 text-yellow-600',
          },
          {
            label: 'Datasets Loaded',
            value: stats.summary.totalDatasets,
            icon: FaDatabase,
            color: 'bg-maroon opacity-10 text-maroon',
          },
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-elegant p-6 hover:shadow-premium transition-smooth">
            <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center mb-4`}>
              <metric.icon size={24} />
            </div>
            <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Algorithm Verification Charts */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Algorithm Verification</h2>
        <p className="text-sm text-gray-500">Charts below show how the scoring algorithm is performing across all students.</p>
      </div>

      {/* Row 1: Component Averages + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Average Component Scores Bar Chart */}
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Avg Component Scores</h3>
          <p className="text-xs text-gray-400 mb-4">How students score on each of the 4 weighted factors (out of 100)</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={componentData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="component" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="score" name="Avg Score" fill="#800000" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart: Cohort Average */}
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Cohort Radar Profile</h3>
          <p className="text-xs text-gray-400 mb-4">Average score per component across all students — ideal shape is a filled circle</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
              <Radar name="Avg Score" dataKey="avg" stroke="#800000" fill="#800000" fillOpacity={0.35} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Score Distribution + Employability Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Score Distribution Histogram */}
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Score Distribution</h3>
          <p className="text-xs text-gray-400 mb-4">How many students fall in each employability score range</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.scoreDistribution || []} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Students" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employability Level Distribution Pie */}
        <div className="bg-white rounded-xl shadow-elegant p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Employability Levels</h3>
          <p className="text-xs text-gray-400 mb-4">Breakdown of students per predicted employability level</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sortedEmployabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                dataKey="value"
              >
                {sortedEmployabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profile Completion Stats */}
      <div className="bg-white rounded-xl shadow-elegant p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Completion Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600 text-sm">Average Completion</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {Math.round(stats.profileCompletion.avgCompletion)}%
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600 text-sm">Complete Profiles</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stats.profileCompletion.completeProfiles} students
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-gray-600 text-sm">Incomplete Profiles</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {stats.profileCompletion.incompleteProfiles} students
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-elegant p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                <div className="w-2 h-2 bg-maroon rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {activity.adminId.firstName} {activity.adminId.lastName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>

      {/* ───── Algorithm Analytics ───── */}
      {analytics && (
        <>
          <div className="mt-10 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Algorithm Analytics</h2>
            <p className="text-sm text-gray-500">
              Live results from the GMM (EM algorithm) and ECLAT association rule mining running on all {analytics.eclat.totalTransactions} students.
            </p>
          </div>

          {/* GMM Cluster Distribution */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              GMM – Cluster Distribution
              <span className="ml-2 text-xs font-normal text-gray-400">{analytics.gmm.description}</span>
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Each bar = how many students belong to a GMM cluster. Cluster means show what a "typical" student in that cluster looks like.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar chart */}
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics.gmm.clusters} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="clusterLabel" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Students" fill="#800000" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Cluster detail cards */}
              <div className="space-y-3">
                {analytics.gmm.clusters.map((c) => (
                  <div key={c.clusterId} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-800 text-sm">
                        Cluster {c.clusterId}: {c.clusterLabel}
                      </span>
                      <span className="text-xs bg-maroon text-white px-2 py-0.5 rounded-full">
                        {c.count} students · {c.weight}% weight
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-xs text-gray-500">
                      {['Academic', 'Skills', 'Certs', 'Soft Skills'].map((label, i) => (
                        <div key={label} className="text-center">
                          <div className="font-medium text-gray-700">{c.meanScores[i]}%</div>
                          <div>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ECLAT Rules */}
          <div className="bg-white rounded-xl shadow-elegant p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              ECLAT – Mined Association Rules
              <span className="ml-2 text-xs font-normal text-gray-400">{analytics.eclat.description}</span>
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {analytics.eclat.totalFrequentItemsets} frequent itemsets found across {analytics.eclat.totalTransactions} student transactions.
              Rules shown predict a student's employability outcome.
            </p>
            {analytics.eclat.rules.length === 0 ? (
              <p className="text-gray-400 text-center py-6">Not enough data to mine rules yet (need ≥ 3 students).</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-left">
                      <th className="px-4 py-2 font-semibold">IF (Antecedent)</th>
                      <th className="px-4 py-2 font-semibold">THEN (Consequent)</th>
                      <th className="px-4 py-2 font-semibold text-right">Support</th>
                      <th className="px-4 py-2 font-semibold text-right">Confidence</th>
                      <th className="px-4 py-2 font-semibold text-right">Lift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.eclat.rules.map((rule, i) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 text-blue-700 font-mono text-xs">
                          {rule.antecedent.join(' ∧ ')}
                        </td>
                        <td className="px-4 py-2 text-green-700 font-mono text-xs">
                          {rule.consequent.join(' ∧ ')}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {(rule.support * 100).toFixed(0)}%
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className={`font-bold ${rule.confidence >= 0.9 ? 'text-green-600' : rule.confidence >= 0.75 ? 'text-yellow-600' : 'text-gray-600'}`}>
                            {(rule.confidence * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">{rule.lift.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
