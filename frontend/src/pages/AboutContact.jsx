// ─── About Page ───────────────────────────────────────────────────────────────
export const About = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
    <div className="text-center mb-14">
      <h1 className="font-display text-5xl text-dark mb-4">About MedSync</h1>
      <p className="text-muted text-lg max-w-xl mx-auto">
        A modern healthcare appointment platform built with the MERN stack.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
      <div className="card">
        <h2 className="font-display text-2xl text-dark mb-3">Our Mission</h2>
        <p className="text-muted leading-relaxed">
          MedSync was built to eliminate the friction in healthcare scheduling. We replace phone calls and paper notebooks with an intelligent, real-time booking platform that connects patients directly with verified specialists.
        </p>
      </div>
      <div className="card">
        <h2 className="font-display text-2xl text-dark mb-3">Technology</h2>
        <p className="text-muted leading-relaxed">
          Built on the MERN stack (MongoDB, Express.js, React.js, Node.js) with JWT-based authentication, Cloudinary image storage, and PayPal payment integration. Secure, fast, and scalable.
        </p>
      </div>
    </div>

    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl text-center py-12 px-8 shadow-xl shadow-teal-500/20">
      <h2 className="font-display text-3xl text-white mb-3">Role-Based Access Control</h2>
      <p className="text-white/80 mb-8 max-w-lg mx-auto">Three distinct portals — each tailored to its users</p>
      <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
        {[['👤', 'Patient', 'Book & manage appointments'], ['👨‍⚕️', 'Doctor', 'Manage schedule & earnings'], ['⚙️', 'Admin', 'Full platform oversight']].map(([icon, role, desc]) => (
          <div key={role} className="bg-white/10 rounded-2xl p-4">
            <div className="text-3xl mb-2">{icon}</div>
            <p className="font-semibold text-white text-sm">{role}</p>
            <p className="text-white/70 text-xs mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Contact Page ─────────────────────────────────────────────────────────────
export const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you shortly.');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-5xl text-dark mb-3">Contact Us</h1>
        <p className="text-muted">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[['📧', 'Email', 'support@medsync.com'], ['📞', 'Phone', '+48 123-456789'], ['📍', 'Location', 'Warsaw, Poland']].map(([icon, label, val]) => (
          <div key={label} className="card text-center py-5">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-muted text-xs">{label}</p>
            <p className="text-dark text-xs font-medium mt-1">{val}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h3 className="text-lg font-semibold text-dark">Send a Message</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Name</label>
            <input type="text" required placeholder="Your name" className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" required placeholder="your@email.com" className="input-field" />
          </div>
        </div>
        <div>
          <label className="label">Subject</label>
          <input type="text" required placeholder="How can we help?" className="input-field" />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea required rows={4} placeholder="Tell us more…" className="input-field resize-none" />
        </div>
        <button type="submit" className="btn-primary w-full py-3">Send Message</button>
      </form>
    </div>
  );
};
