import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
  }

  render() {
    // if (this.state.hasError) {
    //   return <h1>Oops, we done goofed up</h1>;
    // }
    return this.props.children;
  }
}

export default ErrorBoundary;
