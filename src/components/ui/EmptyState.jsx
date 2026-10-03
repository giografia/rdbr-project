function EmptyState({ message }) {
  return (
    <p
      style={{
        padding: "48px 0",
        color: "var(--color-text-secondary)",
        textAlign: "center",
      }}
    >
      {message}
    </p>
  );
}

export default EmptyState;
