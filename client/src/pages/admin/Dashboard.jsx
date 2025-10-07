// import React, { useEffect, useState } from "react";
// import { assets } from "../../assets/assets";
// import BlogTableItem from "../../components/admin/BlogTableItem";
// import { useAppContext } from "../../context/AppContext";
// import toast from "react-hot-toast";

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState({
//     blogs: 0,
//     comments: 0,
//     drafts: 0,
//     recentBlogs: [],
//   });
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const limit = 10; // Number of blogs per page

//   const { axios } = useAppContext();

//   const fetchDashboardData = async (pageNum = 1) => {
//     try {
//       const { data } = await axios.get(`/api/blog/dashboard?page=${pageNum}&limit=${limit}`);
//       if (data.success) {
//         const newBlogs = data.dashboard.recentBlogs.reverse(); // Reverse to show latest blog first
//         setDashboardData((prev) => ({
//           ...data.dashboard,
//           recentBlogs: pageNum === 1 ? newBlogs : [...prev.recentBlogs, ...newBlogs],
//         }));
//         setHasMore(data.dashboard.recentBlogs.length === limit); // Check if more pages exist
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData(page);
//   }, [page]);

//   const loadMore = () => {
//     if (hasMore) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
//       {/* Top Stats */}
//       <div className="flex flex-wrap gap-4">
//         <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
//           <img alt="blogs" src={assets.dashboard_icon_1} />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {dashboardData.blogs}
//             </p>
//             <p className="text-gray-400 font-light">Blogs</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
//           <img alt="comments" src={assets.dashboard_icon_2} />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {dashboardData.comments}
//             </p>
//             <p className="text-gray-400 font-light">Comments</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
//           <img alt="drafts" src={assets.dashboard_icon_3} />
//           <div>
//             <p className="text-xl font-semibold text-gray-600">
//               {dashboardData.drafts}
//             </p>
//             <p className="text-gray-400 font-light">Drafts</p>
//           </div>
//         </div>
//       </div>

//       {/* Latest Blogs */}
//       <div>
//         <div className="flex items-center gap-3 m-4 mt-6 text-gray-600">
//           <img src={assets.dashboard_icon_4} alt="recent" />
//           <p>Latest Blogs</p>
//         </div>
//         <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
//           <table className="w-full text-sm text-gray-500">
//             <thead className="text-xs text-gray-600 text-left uppercase">
//               <tr>
//                 <th className="px-2 py-4 xl:px-6">#</th>
//                 <th className="px-2 py-4">Blog Title</th>
//                 <th className="px-2 py-4 max-sm:hidden">Date</th>
//                 <th className="px-2 py-4 max-sm-hidden">Status</th>
//                 <th className="px-2 py-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dashboardData.recentBlogs.map((blog, index) => (
//                 <BlogTableItem
//                   key={blog._id}
//                   blog={blog}
//                   fetchBlogs={fetchDashboardData}
//                   index={index + 1}
//                 />
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {hasMore && (
//           <button
//             onClick={loadMore}
//             className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
//           >
//             Load More
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });
  const [page] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5; // Number of blogs per page

  const { axios } = useAppContext();

  const fetchDashboardData = async (pageNum = 1) => {
    try {
      const { data } = await axios.get(
        `/api/blog/dashboard?page=${pageNum}&limit=${limit}`
      );
      if (data.success) {
        setDashboardData((prev) => ({
          ...data.dashboard,
          recentBlogs:
            pageNum === 1
              ? data.dashboard.recentBlogs
              : [...prev.recentBlogs, ...data.dashboard.recentBlogs],
        }));
        setHasMore(data.dashboard.recentBlogs.length === limit); // Check if more pages exist
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboardData(page);
  }, [page]);

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      {/* Top Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img alt="blogs" src={assets.dashboard_icon_1} />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashboardData.blogs}
            </p>
            <p className="text-gray-400 font-light">Blogs</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img alt="comments" src={assets.dashboard_icon_2} />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashboardData.comments}
            </p>
            <p className="text-gray-400 font-light">Comments</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img alt="drafts" src={assets.dashboard_icon_3} />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashboardData.drafts}
            </p>
            <p className="text-gray-400 font-light">Drafts</p>
          </div>
        </div>
      </div>

      {/* Latest Blogs */}
      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-gray-600">
          <img src={assets.dashboard_icon_4} alt="recent" />
          <p>Latest Blogs</p>
        </div>
        <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white mb-6">
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs text-gray-600 text-left uppercase">
              <tr>
                <th className="px-2 py-4 xl:px-6">#</th>
                <th className="px-2 py-4">Blog Title</th>
                <th className="px-2 py-4 max-sm-hidden">Date</th>
                <th className="px-2 py-4 max-sm-hidden">Status</th>
                <th className="px-2 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBlogs.map((blog, index) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={fetchDashboardData}
                  index={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
