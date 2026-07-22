import React from "react";
import HomePathHouseIllustration from "./HomePathHouseIllustration";

export default class HomePathHouseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  componentDidCatch() {
    // The 3D view is decorative/supporting. Fall back quietly without exposing a stack trace.
  }

  render() {
    if (this.state.failed) {
      return <div className="house-fallback-note">
        <p>Interactive view unavailable. Showing the illustrated version.</p>
        <HomePathHouseIllustration {...this.props.fallbackProps} />
      </div>;
    }
    return this.props.children;
  }
}
