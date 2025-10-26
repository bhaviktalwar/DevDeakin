import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Optionally log to monitoring service
    // console.error('ErrorBoundary caught', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32 }}>
          <h3>Something went wrong.</h3>
          <div style={{ color: '#6b7280', fontSize: 13 }}>Try refreshing the page. If the issue persists, please report it.</div>
        </div>
      );
    }
    return this.props.children;
  }
}
