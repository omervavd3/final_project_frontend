import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";
import AuthAccess from "./AuthAccess";
import Navbar from "./NavBar";
import { useNavigate } from "react-router";

type Post = {
  title: string;
  content: string;
  owner: string;
  ownerName: string;
  date: string;
  photo: string;
  comments: string[];
  likes: number;
  _id: string;
  ownerPhoto: string;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [userName, setUserName] = useState<string>("user");
  useEffect(() => {
    if (!document.cookie.includes("accessToken")) {
      navigate("/");
    } else {
      axios
        .get("http://localhost:3000/posts")
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.error(error);
          setPosts([]);
        });

      axios
        .get("http://localhost:3000/auth/getProfileImageUrlAndName", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        })
        .then((response) => {
          setProfileImage(response.data.profileImageUrl);
          setUserName(response.data.userName);
        })
        .catch((error) => {
          console.error(error);
          setProfileImage("");
        });
    }
  }, []);

  return (
    <div className="container mt-5">
      <AuthAccess where_to_navigate="/" />
      {/* Navbar */}
      <Navbar userName={userName} profileImageUrl={profileImage} />

      {/* Page Title */}
      <div className="text-center mb-4">
        <h1 className="fw-bold">Welcome {userName}</h1>
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
                  likes={post.likes}
                  _id={post._id}
                  userName={userName}
                  ownerPhoto={post.ownerPhoto}
                  ownerName={post.ownerName}
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
