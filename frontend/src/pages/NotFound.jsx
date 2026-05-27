import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
    <div className="text-center animate-slide-up">
      <p className="font-mono text-8xl font-bold gradient-text mb-4">404</p>
      <h1 className="font-display text-4xl text-white mb-3">Page Not Found</h1>
      <p className="text-white/50 mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary px-8 py-3">← Back to Home</Link>
    </div>
  </div>
);

export default NotFound;
