export function PostListSkeleton() {
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th className="w-12">#</th>
            <th>제목</th>
            <th className="hidden md:table-cell">태그</th>
            <th className="hidden sm:table-cell whitespace-nowrap">작성일</th>
            <th className="text-right">조회</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td>
                <div className="skeleton h-4 w-6"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-48 mb-2"></div>
                <div className="skeleton h-3 w-32 md:hidden"></div>
              </td>
              <td className="hidden md:table-cell">
                <div className="flex gap-1">
                  <div className="skeleton h-5 w-12"></div>
                  <div className="skeleton h-5 w-16"></div>
                  <div className="skeleton h-5 w-14"></div>
                </div>
              </td>
              <td className="hidden sm:table-cell">
                <div className="skeleton h-4 w-24"></div>
              </td>
              <td className="text-right">
                <div className="skeleton h-4 w-8 ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
