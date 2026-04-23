export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: 250, padding: 20, background: "#111", color: "#fff" }}>
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Users</li>
          <li>Revenue</li>
          <li>Subscriptions</li>
        </ul>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}
