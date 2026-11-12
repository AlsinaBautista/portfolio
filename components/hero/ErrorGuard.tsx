"use client";

import { Component, type ReactNode } from "react";

/** Si WebGL o el modelo fallan, no se rompe la página: queda el póster. */
export default class ErrorGuard extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
