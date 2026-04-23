export default function RevenuePage() {
  const data = [
    { month: "Jan", amount: 120000 },
    { month: "Feb", amount: 180000 },
    { month: "Mar", amount: 240000 },
  ];

  const total = data.reduce((a, b) => a + b.amount, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>💰 Revenue</h1>
      <h2>Total: ₦{total}</h2>

      {data.map((r, i) => (
        <p key={i}>
          {r.month}: ₦{r.amount}
        </p>
      ))}
    </div>
  );
}
