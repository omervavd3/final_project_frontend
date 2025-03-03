import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";
import AuthAccess from "./AuthAccess";
import Logout from "./Logout";

type Post = {
  title: string;
  content: string;
  owner: string;
  date: string;
};

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
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
  }, []);
  return (
    <div>
      <AuthAccess where_to_navigate="/" />
      <h1>Home Page</h1>
      <Logout />
      {posts ? (
        posts.map((post, index) => (
          <Post
            key={index}
            title={post.title}
            content={post.content}
            date={post.date}
          />
        ))
      ) : (
        <p>No posts</p>
      )}
    </div>
  );
};

export default HomePage;
