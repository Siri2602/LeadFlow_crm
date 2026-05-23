export const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="skeleton h-4 w-24" />
    <div className="skeleton h-8 w-16" />
    <div className="skeleton h-3 w-32" />
  </div>
);

export const SkeletonPage = () => (
  <div className="space-y-6 animate-pulse">
    <div className="skeleton h-8 w-48 rounded" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="skeleton h-64 rounded-xl" />
      <div className="skeleton h-64 rounded-xl" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <tr>
    <td colSpan="8" className="px-5 py-3">
      <div className="skeleton h-4 w-full rounded" />
    </td>
  </tr>
);
