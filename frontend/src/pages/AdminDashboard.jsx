import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAdminStats, fetchAdminSubmissions, approveSubmission, rejectSubmission, fetchAdminReports, resolveReport, fetchAllIdols, deleteIdol, fetchAdminActivities, approveActivity, deleteActivity } from '../services/api';
import { ShieldCheck, MapPin, Trash2, RefreshCw, Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import CrowdBadge from '../components/CrowdBadge';
import GaneshIcon from '../components/GaneshIcon';

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'activities', 'reports', 'idols'
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [adminActivities, setAdminActivities] = useState([]);
  const [reports, setReports] = useState([]);
  const [idols, setIdols] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const statsData = await fetchAdminStats();
      setStats(statsData);

      const subsData = await fetchAdminSubmissions('pending');
      setSubmissions(subsData);

      const actsData = await fetchAdminActivities();
      setAdminActivities(actsData);

      const reportsData = await fetchAdminReports();
      setReports(reportsData);

      const idolsData = await fetchAllIdols();
      setIdols(idolsData);
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubmission = async (subId) => {
    setActionLoading(true);
    setMsg('');
    try {
      await approveSubmission(subId);
      setMsg('✅ Submission approved successfully! Now live on public map.');
      setSelectedSub(null);
      loadAllAdminData();
    } catch (err) {
      setMsg('Error approving submission.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmission = async (subId) => {
    setActionLoading(true);
    setMsg('');
    try {
      await rejectSubmission(subId, 'Rejected by admin verification check.');
      setMsg('Submission rejected.');
      setSelectedSub(null);
      loadAllAdminData();
    } catch (err) {
      setMsg('Error rejecting submission.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveActivity = async (actId) => {
    try {
      await approveActivity(actId);
      setMsg('✅ Seva activity approved!');
      loadAllAdminData();
    } catch (err) {
      console.error("Approve activity error:", err);
    }
  };

  const handleDeleteActivity = async (actId) => {
    if (!window.confirm("Delete this activity?")) return;
    try {
      await deleteActivity(actId);
      loadAllAdminData();
    } catch (err) {
      console.error("Delete activity error:", err);
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      await resolveReport(reportId, action);
      loadAllAdminData();
    } catch (err) {
      console.error("Report resolve error:", err);
    }
  };

  const handleDeleteIdol = async (idolId) => {
    if (!window.confirm("Are you sure you want to delete this verified Lord Ganesh idol?")) return;
    try {
      await deleteIdol(idolId);
      loadAllAdminData();
    } catch (err) {
      console.error("Delete idol error:", err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-900">Admin Access Required</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Please sign in with an Administrator account to access the verification dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded">
            Admin Verification Control Center
          </span>
          <h1 className="font-heading font-black text-3xl text-slate-900 mt-1 flex items-center gap-2">
            <GaneshIcon className="w-8 h-8 text-orange-600" />
            GaneshMap Admin Dashboard
          </h1>
        </div>

        <button
          onClick={loadAllAdminData}
          className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center gap-1.5 border border-orange-200 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-emerald-600 font-bold">×</button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Verified Idols</span>
          <span className="block font-heading font-black text-2xl text-emerald-600">{stats?.total_verified_idols || 0}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending Idols</span>
          <span className="block font-heading font-black text-2xl text-amber-600">{stats?.pending_submissions || 0}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending Sevas</span>
          <span className="block font-heading font-black text-2xl text-purple-600">{stats?.pending_activities || 0}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Rejected</span>
          <span className="block font-heading font-black text-2xl text-rose-600">{stats?.rejected_submissions || 0}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending Reports</span>
          <span className="block font-heading font-black text-2xl text-red-600">{stats?.pending_reports || 0}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Registered Users</span>
          <span className="block font-heading font-black text-2xl text-blue-600">{stats?.registered_users || 0}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📋 Pending Idols ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'activities'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🎉 Seva Activities ({adminActivities.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🚩 User Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('idols')}
          className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'idols'
              ? 'border-orange-500 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🛕 Active Idols ({idols.length})
        </button>
      </div>

      {/* TAB 1: PENDING SUBMISSIONS TABLE */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden space-y-4 p-6">
          <h3 className="font-heading font-extrabold text-lg text-slate-900">
            Pending Submissions Awaiting Admin Verification
          </h3>

          {submissions.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-slate-500 bg-slate-50 rounded-2xl">
              🎉 No pending idol submissions! All community Ganesh idols are verified.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-extrabold border-b border-slate-200">
                    <th className="p-3">Idol Photo</th>
                    <th className="p-3">Name & Area</th>
                    <th className="p-3">AI Vision Score</th>
                    <th className="p-3">Submitted By</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-orange-50/40">
                      <td className="p-3">
                        <img
                          src={sub.image_url || 'https://images.unsplash.com/photo-1567591377030-de198b9d5186?auto=format&fit=crop&w=800&q=80'}
                          alt={sub.idol_name}
                          className="w-14 h-12 rounded-lg object-cover bg-slate-100"
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{sub.idol_name}</span>
                        <span className="text-slate-500 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-500" /> {sub.area} ({sub.address})
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-amber-600" />
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            sub.is_ai_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {Math.round((sub.ai_confidence || 0) * 100)}% ({sub.is_ai_verified ? 'Likely Idol' : 'Not Clear'})
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">{sub.submitter_name || 'Anonymous Devotee'}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 uppercase">
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button onClick={() => setSelectedSub(sub)} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold">View</button>
                        <button onClick={() => handleApproveSubmission(sub.id)} disabled={actionLoading} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold">Approve</button>
                        <button onClick={() => handleRejectSubmission(sub.id)} disabled={actionLoading} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FESTIVAL ACTIVITIES TABLE */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-slate-900">
            Seva Activities Verification Manager
          </h3>

          {adminActivities.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-slate-500 bg-slate-50 rounded-2xl">
              No activity submissions.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase font-extrabold border-b border-slate-200">
                    <th className="p-3">Type</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Pandal / Idol</th>
                    <th className="p-3">Timing</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {adminActivities.map((act) => (
                    <tr key={act.id}>
                      <td className="p-3 uppercase font-extrabold text-orange-700">{act.activity_type}</td>
                      <td className="p-3 font-bold text-slate-900">{act.title}</td>
                      <td className="p-3 text-slate-600">{act.idol_name || `Idol #${act.idol_id}`}</td>
                      <td className="p-3 text-slate-600">{act.date} • {act.start_time}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          act.verification_status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {act.verification_status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {act.verification_status !== 'approved' && (
                          <button onClick={() => handleApproveActivity(act.id)} className="px-3 py-1 rounded bg-emerald-600 text-white font-bold">Approve</button>
                        )}
                        <button onClick={() => handleDeleteActivity(act.id)} className="px-3 py-1 rounded bg-rose-600 text-white font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REPORTS TABLE */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-slate-900">User Issue Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-extrabold border-b border-slate-200">
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Idol ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reports.map((rep) => (
                  <tr key={rep.id}>
                    <td className="p-3 font-mono font-bold">#{rep.id}</td>
                    <td className="p-3 font-bold text-orange-600">Idol #{rep.idol_id}</td>
                    <td className="p-3 font-bold text-rose-600">{rep.report_type}</td>
                    <td className="p-3 text-slate-600">{rep.description || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button onClick={() => handleResolveReport(rep.id, 'resolved')} className="px-3 py-1 rounded bg-emerald-600 text-white font-bold">Resolve</button>
                      <button onClick={() => handleResolveReport(rep.id, 'dismissed')} className="px-3 py-1 rounded bg-slate-200 text-slate-700 font-bold">Dismiss</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: VERIFIED IDOLS TABLE */}
      {activeTab === 'idols' && (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-slate-900">Active Verified Lord Ganesh Idols</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-extrabold border-b border-slate-200">
                  <th className="p-3">Photo</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Crowd Level</th>
                  <th className="p-3">Eco Material</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {idols.map((idol) => (
                  <tr key={idol.id}>
                    <td className="p-3">
                      <img src={idol.image_url} alt={idol.name} className="w-12 h-10 rounded-lg object-cover bg-slate-100" />
                    </td>
                    <td className="p-3 font-bold text-slate-900">{idol.name}</td>
                    <td className="p-3 text-slate-600">{idol.area}</td>
                    <td className="p-3"><CrowdBadge status={idol.crowd_status} /></td>
                    <td className="p-3 text-emerald-700 font-bold">{idol.eco_status}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDeleteIdol(idol.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100" title="Delete Idol">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspector Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-extrabold text-xl text-slate-900">
              Inspect Submission: {selectedSub.idol_name}
            </h3>

            <div className="h-56 w-full rounded-2xl overflow-hidden bg-slate-100">
              <img src={selectedSub.image_url} alt="Idol" className="w-full h-full object-cover" />
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs space-y-1.5">
              <div><strong>Area:</strong> {selectedSub.area}</div>
              <div><strong>Address:</strong> {selectedSub.address}</div>
              <div><strong>GPS Coordinates:</strong> {selectedSub.latitude}, {selectedSub.longitude}</div>
              <div><strong>Submitter:</strong> {selectedSub.submitter_name}</div>
              <div><strong>AI Vision Confidence:</strong> {Math.round(selectedSub.ai_confidence * 100)}%</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setSelectedSub(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">Close</button>
              <button onClick={() => handleRejectSubmission(selectedSub.id)} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold">Reject</button>
              <button onClick={() => handleApproveSubmission(selectedSub.id)} className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Approve & Publish Live</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
