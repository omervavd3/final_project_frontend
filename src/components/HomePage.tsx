import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";
import AuthAccess from "./AuthAccess";
import Logout from "./Logout";
import { useNavigate } from "react-router";
import Navbar from "./NavBar";

type Post = {
  title: string;
  content: string;
  owner: string;
  date: string;
  photo: string;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/posts")
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
        setPosts([]);
      });

    axios
      .get("http://localhost:3000/auth/profileImageUrl", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileImage(response.data);
      })
      .catch((error) => {
        console.error(error);
        setProfileImage(null);
      });
  }, []);
  return (
    <div className="container mt-5">
      {/* Navbar */}
      <Navbar />

      {/* Page Title */}
      <div className="text-center mb-4">
        <h1 className="fw-bold">Home Page</h1>
      </div>

      {/* Profile Image */}
      {profileImage && (
        <div className="text-center mb-3">
          <img
            src={profileImage}
            alt="Profile"
            className="img-fluid rounded-circle border border-secondary"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Posts Section */}
      <div className="row">
        {posts && posts.length > 0 ? (
          [...posts]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((post, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <Post
                  title={post.title}
                  content={post.content}
                  photo={post.photo}
                />
              </div>
            ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
