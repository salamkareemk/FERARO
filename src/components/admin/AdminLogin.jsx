import { useState } from "react";
import { Link } from "react-router";

import { supabase } from "../../lib/supabaseClient.js";

/*=============== ADMIN LOGIN ===============*/
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (signInError) setError("Incorrect email or password.");
  };

  return (
    <section className="admin admin-center">
      <form className="admin_card admin_login" onSubmit={handleSubmit}>
        <i className="ri-cake-3-line admin_login-icon"></i>
        <h1 className="admin_title">FERARO Admin</h1>
        <p className="admin_text">Sign in to manage the cake photos.</p>

        <label className="admin_field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="admin_field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="admin_error">{error}</p>}

        <button className="admin_button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>

        <Link to="/" className="admin_link">
          <i className="ri-arrow-left-line"></i> Back to website
        </Link>
      </form>
    </section>
  );
};

export default AdminLogin;
