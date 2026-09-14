import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GaneshMap ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-orange-200 space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-3xl">
              🕉️
            </div>
            <h1 className="text-2xl font-black text-slate-900">GaneshMap</h1>
            <p className="text-sm text-slate-600">
              Welcome to GaneshMap! Click reload to refresh the festival map and discover nearby Lord Ganesh idols.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md hover:bg-orange-700 transition-all"
            >
              🔄 Reload GaneshMap
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
