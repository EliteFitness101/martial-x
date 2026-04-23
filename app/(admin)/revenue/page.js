export default function RevenuePage() {
  const revenue = [
    { month: "Jan", amount: 120000 },
    { month: "Feb", amount: 180000 },
    { month: "Mar", amount: 240000 },
  ];

  return (
    <div>
      <h1>💰 Revenue Overview</h1>

      {revenue.map((r, i) => (
        <p key={i}>
          {r.month}: ₦{r.amount}
        </p>
      ))}
    </div>
  );
}
