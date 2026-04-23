export default async function AdminDashboard() {
  // In real use: fetch from Supabase
  const stats = {
    users: 1240,
    activeSubs: 320,
    revenue: 540000,
  };

  return (
    <div>
      <h1>📊 Admin Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <Card title="Users" value={stats.users} />
        <Card title="Active Subs" value={stats.activeSubs} />
        <Card title="Revenue (NGN)" value={stats.revenue} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ padding: 20, border: "1px solid #ddd" }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
