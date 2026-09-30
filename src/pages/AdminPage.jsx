import { useEffect, useState } from "react";

import AdminLogin from "../components/admin/AdminLogin.jsx";
import AdminDashboard from "../components/admin/AdminDashboard.jsx";
import { supabase } from "../lib/supabaseClient.js";

/*=============== ADMIN PAGE ===============*/
const AdminPage = () => {
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(Boolean(supabase));

  useEffect(() => {
    document.title = "Admin | FERARO";

    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsChecking(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) =>
      setSession(nextSession),
    );

    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <section className="admin admin-center">
        <div className="admin_card">
          <h1 className="admin_title">Admin not set up yet</h1>
          <p className="admin_text">
            Add <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code>{" "}
            (and to Vercel&apos;s environment variables), then restart the dev
            server. See <code>supabase/README.md</code>.
          </p>
        </div>
      </section>
    );
  }

  if (isChecking) return <p className="admin_loading">Loading…</p>;

  return session ? (
    <AdminDashboard user={session.user} />
  ) : (
    <AdminLogin />
  );
};

export default AdminPage;
