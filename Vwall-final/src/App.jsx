// import React, { useEffect, useState } from "react";
// import { Routes, Route, useNavigate, Navigate, Link } from "react-router-dom";
// import Navbar from "./components/Common/Navbar";
// import FloatingButton from "./components/Common/FloatingButton";
// import Home from "./components/Dashboard/Home";
// import Pinned from "./components/Dashboard/Pinned";
// import Profile from "./components/Dashboard/Profile";
// import UploadModal from "./components/Dashboard/UploadModal";
// import AuthLogin from "./components/Auth/AuthLogin"; 
// import AuthRegister from "./components/Auth/AuthRegister";
// import "./css/theme.css";
// import "./css/bottomnav.css";
// import { HomeIcon, BookmarkIcon, UserIcon } from "lucide-react";

// const STORAGE_KEYS = {
//   POSTS: "vwall_posts_v1",
//   USER: "user",
//   PINS_PREFIX: "vwall_pins_v1_",
// };

// // ✅ Removed placeholder.com URLs to avoid network errors
// const samplePosts = [
//   {
//     id: "p1",
//     title: "Cloud Computing Workshop",
//     description:
//       "A 3-day hands-on workshop on cloud fundamentals and DevOps practices. Limited seats.",
//     fileName: "cloud_workshop.png",
//     fileType: "image",
//     url: "",
//     category: "Events",
//     date: new Date().toLocaleString(),
//     pinnedBy: [],
//   },
//   {
//     id: "p2",
//     title: "Midterm Circular",
//     description:
//       "Midterm exam schedule released. Check dates and venue. Please contact your class teacher for queries.",
//     fileName: "midterm.pdf",
//     fileType: "pdf",
//     url: "",
//     category: "Circulars",
//     date: new Date().toLocaleString(),
//     pinnedBy: [],
//   },
// ];

// function App() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(() => {
//     const raw = localStorage.getItem(STORAGE_KEYS.USER);
//     return raw ? JSON.parse(raw) : null;
//   });

//   const [posts, setPosts] = useState(() => {
//     const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
//     return raw ? JSON.parse(raw) : samplePosts;
//   });

//   const [isUploadOpen, setUploadOpen] = useState(false);

//   // ✅ Persist posts to localStorage
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
//   }, [posts]);

//   // ✅ Persist user info
//   useEffect(() => {
//     if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
//     else localStorage.removeItem(STORAGE_KEYS.USER);
//   }, [user]);

//   // ✅ Handle login
//  const handleLogin = (userObj) => {
//   setUser(userObj);
//   const pinsKey = STORAGE_KEYS.PINS_PREFIX + userObj.email;
//   if (!localStorage.getItem(pinsKey)) {
//     localStorage.setItem(pinsKey, JSON.stringify([]));
//   }
// };

// // ✅ Redirect to home only *after* user state updates
// useEffect(() => {
//   if (user && (window.location.pathname === "/" || window.location.pathname === "/register")) {
//     navigate("/home");
//   }
// }, [user, navigate]);



//   // ✅ Handle logout
//   const handleLogout = () => {
//     setUser(null);
//     navigate("/");
//   };

//   // ✅ Handle new uploads with file preview
//   const handleUpload = (uploadData) => {
//     const fileUrl = uploadData.file
//       ? URL.createObjectURL(uploadData.file)
//       : "";

//     const newPost = {
//       id: "p" + Date.now(),
//       title: uploadData.title,
//       description: uploadData.description,
//       fileName: uploadData.file?.name || "",
//       fileType: uploadData.file?.type?.startsWith("image") ? "image" : "file",
//       url: fileUrl, // ✅ Local preview URL
//       category: uploadData.category || "Circulars",
//       date: new Date().toLocaleString(),
//       pinnedBy: [],
//     };

//     setPosts((prev) => [newPost, ...prev]);
//   };

//   // ✅ Toggle pin/unpin
//   const togglePin = (postId) => {
//     if (!user) return alert("Please login to pin posts.");
//     const pinsKey = STORAGE_KEYS.PINS_PREFIX + user.email;
//     const existing = JSON.parse(localStorage.getItem(pinsKey) || "[]");
//     const idx = existing.indexOf(postId);
//     if (idx === -1) existing.unshift(postId);
//     else existing.splice(idx, 1);
//     localStorage.setItem(pinsKey, JSON.stringify(existing));

//     setPosts((p) =>
//       p.map((post) =>
//         post.id === postId
//           ? {
//               ...post,
//               pinnedBy:
//                 post.pinnedBy && post.pinnedBy.includes(user.email)
//                   ? post.pinnedBy.filter((e) => e !== user.email)
//                   : [...(post.pinnedBy || []), user.email],
//             }
//           : post
//       )
//     );
//   };

//   // ✅ Get pinned posts for user
//   const getPinnedForUser = (u) => {
//     if (!u) return [];
//     const pinsKey = STORAGE_KEYS.PINS_PREFIX + u.email;
//     const existing = JSON.parse(localStorage.getItem(pinsKey) || "[]");
//     return posts.filter((p) => existing.includes(p.id));
//   };

//   // ✅ Delete post (admin only)
//   const handleDeletePost = (postId) => {
//     if (!user || user.role !== "admin")
//       return alert("Only admin can delete posts.");
//     if (!confirm("Delete this post?")) return;
//     setPosts((p) => p.filter((x) => x.id !== postId));
//     Object.keys(localStorage).forEach((k) => {
//       if (k.startsWith(STORAGE_KEYS.PINS_PREFIX)) {
//         const arr = JSON.parse(localStorage.getItem(k) || "[]").filter(
//           (id) => id !== postId
//         );
//         localStorage.setItem(k, JSON.stringify(arr));
//       }
//     });
//   };

//   // ✅ Default login/register routes (if not logged in)
//   if (!user) {
//     return (
//    <Routes>
//   <Route path="/" element={<AuthLogin onLogin={handleLogin} />} />
//   <Route path="/register" element={<AuthRegister />} />
//   <Route path="*" element={<Navigate to="/" />} />
// </Routes>


//     );
//   }


//   // ✅ Dashboard view (after login)
//   return (
//     <div className="app-root">
//       <Navbar user={user} onLogout={handleLogout} />

//       <Routes>
//         <Route
//           path="/home"
//           element={
//             <Home
//               posts={posts}
//               onTogglePin={togglePin}
//               onOpenUpload={() => setUploadOpen(true)}
//               onDelete={handleDeletePost}
//               user={user}
//             />
//           }
//         />
//         <Route
//           path="/pinned"
//           element={
//             <Pinned
//               pinnedPosts={getPinnedForUser(user)}
//               onTogglePin={togglePin}
//               user={user}
//             />
//           }
//         />
//         <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
//         <Route path="*" element={<Navigate to="/home" />} />
//       </Routes>

//       {/* ✅ Floating Upload for Admins */}
//       {user?.role === "admin" && (
//         <FloatingButton onClick={() => setUploadOpen(true)} title="Upload" />
//       )}

//       {/* ✅ Upload Modal */}
//       <UploadModal
//         isOpen={isUploadOpen}
//         onClose={() => setUploadOpen(false)}
//         onUpload={handleUpload}
//       />

//       {/* ✅ Bottom Navigation */}
//       <nav className="bottom-nav">
//         <Link to="/home" className="nav-item" title="Home">
//           <HomeIcon size={24} />
//         </Link>
//         <Link to="/pinned" className="nav-item" title="Pinned">
//           <BookmarkIcon size={24} />
//         </Link>
//         <Link to="/profile" className="nav-item" title="Profile">
//           <UserIcon size={24} />
//         </Link>
//       </nav>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import FloatingButton from "./components/Common/FloatingButton";
import Home from "./components/Dashboard/Home";
import Pinned from "./components/Dashboard/Pinned";
import Profile from "./components/Dashboard/Profile";
import UploadModal from "./components/Dashboard/UploadModal";
import AuthLogin from "./components/Auth/AuthLogin";
import AuthRegister from "./components/Auth/AuthRegister";
import "./css/theme.css";
import "./css/bottomnav.css";
import { HomeIcon, BookmarkIcon, UserIcon, PlusIcon } from "lucide-react";

const STORAGE_KEYS = {
  POSTS: "vwall_posts_v1",
  USER: "user",
  PINS_PREFIX: "vwall_pins_v1_",
};

// ✅ Default placeholder posts
const samplePosts = [
  {
    id: "p1",
    title: "Cloud Computing Workshop",
    description:
      "A 3-day hands-on workshop on cloud fundamentals and DevOps practices. Limited seats.",
    fileName: "cloud_workshop.png",
    fileType: "image",
    url: "",
    category: "Events",
    date: new Date().toLocaleString(),
    pinnedBy: [],
  },
  {
    id: "p2",
    title: "Midterm Circular",
    description:
      "Midterm exam schedule released. Check dates and venue. Please contact your class teacher for queries.",
    fileName: "midterm.pdf",
    fileType: "pdf",
    url: "",
    category: "Circulars",
    date: new Date().toLocaleString(),
    pinnedBy: [],
  },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Load user and posts from localStorage
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  });

  const [posts, setPosts] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    return raw ? JSON.parse(raw) : samplePosts;
  });

  const [isUploadOpen, setUploadOpen] = useState(false);

  // ✅ Persist posts
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  // ✅ Persist user
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  }, [user]);

  // ✅ Handle login
  const handleLogin = (userObj) => {
    setUser(userObj);
    const pinsKey = STORAGE_KEYS.PINS_PREFIX + userObj.email;
    if (!localStorage.getItem(pinsKey)) {
      localStorage.setItem(pinsKey, JSON.stringify([]));
    }
  };

  // ✅ Redirect after login
  useEffect(() => {
    if (
      user &&
      (window.location.pathname === "/" || window.location.pathname === "/register")
    ) {
      navigate("/home");
    }
  }, [user, navigate]);

  // ✅ Logout
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // ✅ Upload new post
  const handleUpload = (uploadData) => {
    const fileUrl = uploadData.file ? URL.createObjectURL(uploadData.file) : "";

    const newPost = {
      id: "p" + Date.now(),
      title: uploadData.title,
      description: uploadData.description,
      fileName: uploadData.file?.name || "",
      fileType: uploadData.file?.type?.startsWith("image") ? "image" : "file",
      url: fileUrl,
      category: uploadData.category || "Circulars",
      date: new Date().toLocaleString(),
      pinnedBy: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  // ✅ Toggle pin/unpin
  const togglePin = (postId) => {
    if (!user) return alert("Please login to pin posts.");
    const pinsKey = STORAGE_KEYS.PINS_PREFIX + user.email;
    const existing = JSON.parse(localStorage.getItem(pinsKey) || "[]");
    const idx = existing.indexOf(postId);
    if (idx === -1) existing.unshift(postId);
    else existing.splice(idx, 1);
    localStorage.setItem(pinsKey, JSON.stringify(existing));

    setPosts((p) =>
      p.map((post) =>
        post.id === postId
          ? {
              ...post,
              pinnedBy:
                post.pinnedBy && post.pinnedBy.includes(user.email)
                  ? post.pinnedBy.filter((e) => e !== user.email)
                  : [...(post.pinnedBy || []), user.email],
            }
          : post
      )
    );
  };

  // ✅ Get pinned posts
  const getPinnedForUser = (u) => {
    if (!u) return [];
    const pinsKey = STORAGE_KEYS.PINS_PREFIX + u.email;
    const existing = JSON.parse(localStorage.getItem(pinsKey) || "[]");
    return posts.filter((p) => existing.includes(p.id));
  };

  // ✅ Delete post
  const handleDeletePost = (postId) => {
    if (!user || user.role !== "admin")
      return alert("Only admin can delete posts.");
    if (!confirm("Delete this post?")) return;

    setPosts((p) => p.filter((x) => x.id !== postId));
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_KEYS.PINS_PREFIX)) {
        const arr = JSON.parse(localStorage.getItem(k) || "[]").filter(
          (id) => id !== postId
        );
        localStorage.setItem(k, JSON.stringify(arr));
      }
    });
  };

  // ✅ Auth Routes (Login/Register)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<AuthLogin onLogin={handleLogin} />} />
        <Route path="/register" element={<AuthRegister />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // ✅ Dashboard View
  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/home"
          element={
            <Home
              posts={posts}
              onTogglePin={togglePin}
              onOpenUpload={() => setUploadOpen(true)}
              onDelete={handleDeletePost}
              user={user}
            />
          }
        />
        <Route
          path="/pinned"
          element={
            <Pinned
              pinnedPosts={getPinnedForUser(user)}
              onTogglePin={togglePin}
              user={user}
            />
          }
        />
        <Route
          path="/profile"
          element={<Profile user={user} onLogout={handleLogout} />}
        />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>

      {/* ✅ Floating Upload (for Admins) */}
      {user?.role === "admin" && (
        <button
          className="upload-btn"
          onClick={() => setUploadOpen(true)}
          title="Upload"
        >
          <PlusIcon size={28} />
        </button>
      )}

      {/* ✅ Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* ✅ Bottom Navigation */}
      <nav className="bottom-nav">
        <Link
          to="/home"
          className={`nav-item ${
            location.pathname === "/home" ? "active" : ""
          }`}
          title="Home"
        >
          <HomeIcon size={24} />
        </Link>

        <Link
          to="/pinned"
          className={`nav-item ${
            location.pathname === "/pinned" ? "active" : ""
          }`}
          title="Pinned"
        >
          <BookmarkIcon size={24} />
        </Link>

        <Link
          to="/profile"
          className={`nav-item ${
            location.pathname === "/profile" ? "active" : ""
          }`}
          title="Profile"
        >
          <UserIcon size={24} />
        </Link>
      </nav>
    </div>
  );
}

export default App;


// import React, { useEffect, useState } from "react";
// import {
//   Routes,
//   Route,
//   useNavigate,
//   Navigate,
//   Link,
//   useLocation,
// } from "react-router-dom";
// import Navbar from "./components/Common/Navbar";
// import FloatingButton from "./components/Common/FloatingButton";
// import Home from "./components/Dashboard/Home";
// import Pinned from "./components/Dashboard/Pinned";
// import Profile from "./components/Dashboard/Profile";
// import UploadModal from "./components/Dashboard/UploadModal";
// import AuthLogin from "./components/Auth/AuthLogin";
// import AuthRegister from "./components/Auth/AuthRegister";
// import "./css/theme.css";
// import "./css/bottomnav.css";
// import { HomeIcon, BookmarkIcon, UserIcon, PlusIcon } from "lucide-react";

// const STORAGE_KEYS = {
//   POSTS: "vwall_posts_v1",
//   USER: "user",
//   PINS_PREFIX: "vwall_pins_v1_",
// };

// // ✅ Default placeholder posts
// const samplePosts = [
//   {
//     id: "p1",
//     title: "Cloud Computing Workshop",
//     description:
//       "A 3-day hands-on workshop on cloud fundamentals and DevOps practices. Limited seats.",
//     fileName: "cloud_workshop.png",
//     fileType: "image",
//     url: "",
//     category: "Events",
//     date: new Date().toLocaleString(),
//     pinnedBy: [],
//   },
//   {
//     id: "p2",
//     title: "Midterm Circular",
//     description:
//       "Midterm exam schedule released. Check dates and venue. Please contact your class teacher for queries.",
//     fileName: "midterm.pdf",
//     fileType: "pdf",
//     url: "",
//     category: "Circulars",
//     date: new Date().toLocaleString(),
//     pinnedBy: [],
//   },

// ];

// function App() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Load user and posts from localStorage
//   const [user, setUser] = useState(() => {
//     const raw = localStorage.getItem(STORAGE_KEYS.USER);
//     return raw ? JSON.parse(raw) : { name: "Guest User", role: "guest" }; // 👈 default guest user
//   });

//   const [posts, setPosts] = useState(() => {
//     const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
//     return raw ? JSON.parse(raw) : samplePosts;
//   });

//   const [isUploadOpen, setUploadOpen] = useState(false);

//   // ✅ Persist posts
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
//   }, [posts]);

//   // ✅ Persist user
//   useEffect(() => {
//     if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
//     else localStorage.removeItem(STORAGE_KEYS.USER);
//   }, [user]);

//   // ✅ Handle login
//   const handleLogin = (userObj) => {
//     setUser(userObj);
//     const pinsKey = STORAGE_KEYS.PINS_PREFIX + userObj.email;
//     if (!localStorage.getItem(pinsKey)) {
//       localStorage.setItem(pinsKey, JSON.stringify([]));
//     }
//   };

//   // ✅ Handle logout
//   const handleLogout = () => {
//     setUser({ name: "Guest User", role: "guest" });
//     navigate("/home");
//   };

//   // ✅ Handle uploads
//   const handleUpload = (uploadData) => {
//     const fileUrl = uploadData.file ? URL.createObjectURL(uploadData.file) : "";

//     const newPost = {
//       id: "p" + Date.now(),
//       title: uploadData.title,
//       description: uploadData.description,
//       fileName: uploadData.file?.name || "",
//       fileType: uploadData.file?.type?.startsWith("image") ? "image" : "file",
//       url: fileUrl,
//       category: uploadData.category || "Circulars",
//       date: new Date().toLocaleString(),
//       pinnedBy: [],
//     };

//     setPosts((prev) => [newPost, ...prev]);
//   };

//   // ✅ Toggle pin/unpin
//   const togglePin = (postId) => {
//     const pinsKey = STORAGE_KEYS.PINS_PREFIX + (user?.email || "guest");
//     const existing = JSON.parse(localStorage.getItem(pinsKey) || "[]");
//     const idx = existing.indexOf(postId);
//     if (idx === -1) existing.unshift(postId);
//     else existing.splice(idx, 1);
//     localStorage.setItem(pinsKey, JSON.stringify(existing));

//     setPosts((p) =>
//       p.map((post) =>
//         post.id === postId
//           ? {
//               ...post,
//               pinnedBy:
//                 post.pinnedBy && post.pinnedBy.includes(user.email)
//                   ? post.pinnedBy.filter((e) => e !== user.email)
//                   : [...(post.pinnedBy || []), user.email],
//             }
//           : post
//       )
//     );
//   };

//   // ✅ Get pinned posts
//   const getPinnedForUser = (u) => {
//     const pinsKey = STORAGE_KEYS.PINS_PREFIX + (u?.email || "guest");
//     const existing = JSON.parse(localStorage.getItem(pinsKey) || "[]");
//     return posts.filter((p) => existing.includes(p.id));
//   };

//   // ✅ Delete post
//   const handleDeletePost = (postId) => {
//     if (!confirm("Delete this post?")) return;
//     setPosts((p) => p.filter((x) => x.id !== postId));
//     Object.keys(localStorage).forEach((k) => {
//       if (k.startsWith(STORAGE_KEYS.PINS_PREFIX)) {
//         const arr = JSON.parse(localStorage.getItem(k) || "[]").filter(
//           (id) => id !== postId
//         );
//         localStorage.setItem(k, JSON.stringify(arr));
//       }
//     });
//   };

//   // ✅ Dashboard View (No login restriction)
//   return (
//     <div className="app-root">
//       <Navbar user={user} onLogout={handleLogout} />

//       <Routes>
//         <Route
//           path="/home"
//           element={
//             <Home
//               posts={posts}
//               onTogglePin={togglePin}
//               onOpenUpload={() => setUploadOpen(true)}
//               onDelete={handleDeletePost}
//               user={user}
//             />
//           }
//         />
//         <Route
//           path="/pinned"
//           element={
//             <Pinned
//               pinnedPosts={getPinnedForUser(user)}
//               onTogglePin={togglePin}
//               user={user}
//             />
//           }
//         />
//         <Route
//           path="/profile"
//           element={<Profile user={user} onLogout={handleLogout} />}
//         />
//         <Route
//           path="/"
//           element={<Navigate to="/home" replace />}
//         />
//       </Routes>

//       {/* ✅ Floating Upload (For All Temporarily) */}
//       <button
//         className="upload-btn"
//         onClick={() => setUploadOpen(true)}
//         title="Upload"
//       >
//         <PlusIcon size={28} />
//       </button>

//       {/* ✅ Upload Modal */}
//       <UploadModal
//         isOpen={isUploadOpen}
//         onClose={() => setUploadOpen(false)}
//         onUpload={handleUpload}
//       />

//       {/* ✅ Bottom Navigation */}
//       <nav className="bottom-nav">
//         <Link
//           to="/home"
//           className={`nav-item ${
//             location.pathname === "/home" ? "active" : ""
//           }`}
//           title="Home"
//         >
//           <HomeIcon size={24} />
//         </Link>

//         <Link
//           to="/pinned"
//           className={`nav-item ${
//             location.pathname === "/pinned" ? "active" : ""
//           }`}
//           title="Pinned"
//         >
//           <BookmarkIcon size={24} />
//         </Link>

//         <Link
//           to="/profile"
//           className={`nav-item ${
//             location.pathname === "/profile" ? "active" : ""
//           }`}
//           title="Profile"
//         >
//           <UserIcon size={24} />
//         </Link>
//       </nav>
//     </div>
//   );
// }

// export default App;
