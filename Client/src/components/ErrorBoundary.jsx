import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 grid place-items-center mx-auto mb-6">
                            <span className="text-3xl">⚠</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                        <p className="text-gray-400 mb-6">An unexpected error occurred. Try refreshing the page.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
