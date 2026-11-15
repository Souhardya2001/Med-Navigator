export default function HospitalCard({ hospital }) {
  const directions = hospital.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.latitude},${hospital.location.longitude}`
    : null;
  return (
    <article className="mt-3 max-w-lg rounded-2xl border border-teal-100 bg-white p-4 shadow-card">
      <h4 className="font-bold text-navy">{hospital.name}</h4>
      {hospital.specialties?.length > 0 && (
        <p className="mt-1 text-sm text-aqua">
          {hospital.specialties.join(" • ")}
        </p>
      )}
      {hospital.distance != null && (
        <p className="mt-2 text-sm font-medium text-ink">
          {hospital.distance} km away
        </p>
      )}
      {hospital.address && (
        <p className="mt-1 text-sm text-slate-500">{hospital.address}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {hospital.website && (
          <a
            className="btn-secondary px-3 py-2 text-xs"
            href={hospital.website}
            target="_blank"
            rel="noreferrer"
          >
            View details
          </a>
        )}
        {directions && (
          <a
            className="btn-primary px-3 py-2 text-xs"
            href={directions}
            target="_blank"
            rel="noreferrer"
          >
            Get directions
          </a>
        )}
        {hospital.phone && (
          <a
            className="btn-secondary px-3 py-2 text-xs"
            href={`tel:${hospital.phone}`}
          >
            Call
          </a>
        )}
      </div>
    </article>
  );
}
