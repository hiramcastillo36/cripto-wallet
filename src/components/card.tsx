export default function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-xl shadow p-6 border-l-4 border-crimson-blaze">
      {title && (
        <h3 className="text-lg font-semibold text-crimson-blaze">{title}</h3>
      )}

      {title ? (
        <p className="text-3xl font-bold mt-2">{children}</p>
      ) : (
        <p className="text-base">{children}</p>
      )}
    </div>
  );
}
