import axios from "axios";
import { useEffect, useState } from "react";

const ViewPost = () => {
    const [userNames, setUserNames] = useState<string[]>([]);
    const [postContent, setPostContent] = useState<string>("");
    const [postTitle, setPostTitle] = useState<string>("");
    const [postPhoto, setPostPhoto] = useState<string>("");
    const [postLikes, setPostLikes] = useState<number>(0);
    const [postOwnerName, setPostOwnerName] = useState<string>("");
    const [postOwnerPhoto, setPostOwnerPhoto] = useState<string>("");
    const [comments, setComments] = useState<string[]>([]);
  useEffect(() => {
    if (!document.cookie.includes("accessToken")) {
      window.location.href = "/";
    }
    const postId = window.location.pathname.split("/")[2];
    axios
      .get(`http://localhost:3000/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setPostContent(response.data.content);
        setPostTitle(response.data.title);
        setPostPhoto(response.data.photo);
        setPostLikes(response.data.likes);
        setPostOwnerName(response.data.ownerName);
        setPostOwnerPhoto(response.data.ownerPhoto);
      })
      .catch((error) => {
        console.error(error);
      });

    // axios
    //   .get(`http://localhost:3000/comments/getByPostId/${postId}/1/3`, {
  }, []);

  return (
    <div>
      <h1>View Post</h1>
    </div>
  );
};

export default ViewPost;
