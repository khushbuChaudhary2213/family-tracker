// components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Caught by ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-white text-center">
          Something broke: {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
