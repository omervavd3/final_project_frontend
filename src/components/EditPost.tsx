import axios from "axios"
import { useEffect, useState } from "react";
import Post from "./Post";

type Post = {
    title: string;
    content: string;
    ownerName: string;
    date: string;
    photo: string;
    ownerPhoto: string;
    likes: number;
    _id: string;
}

const EditPost = () => {
    const [post, setPost] = useState<Post | null>(null)
    useEffect(() => {
        if (!document.cookie.includes("accessToken")) {
            window.location.href = "/"
        }

        const postId = window.location.pathname.split("/")[2]

        axios.get(`http://localhost:3000/posts/${postId}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${document.cookie.split("accessToken=")[1].split(";")[0]}`
            }
        })
            .then((response) => {
                console.log(response.data)
                if(response.status === 200) {
                    setPost(response.data)
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])
    return (
        <div>
            {post && <Post
                title={post.title}
                content={post.content}
                ownerName={post.ownerName}
                photo={post.photo}
                ownerPhoto={post.ownerPhoto}
                likes={post.likes}
                _id={post._id}
                userName={post.ownerName}
            />}
        </div>
    )
}

export default EditPost