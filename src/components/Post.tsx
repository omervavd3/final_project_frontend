import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import heart_black from "../assets/heart_black.png";
import heart_red from "../assets/heart_red.png";

type PostProps = {
  title: string;
  content: string;
  photo: string;
  likes: number;
  _id: string;
  userName: string;
  ownerName: string;
  ownerPhoto: string;
};

type comment = {
  _id: string;
  comment: string;
  ownerName: string;
};

const Post: FC<PostProps> = ({
  title,
  content,
  photo,
  likes,
  _id,
  userName,
  ownerName,
  ownerPhoto,
}) => {
  const schema = z.object({
    comment: z.string().nonempty("Comment is required"),
  });

  const [liked, setLiked] = useState(false);
  const [heart, setHeart] = useState(heart_black);
  const [numOfLikes, setNumOfLikes] = useState(likes);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [comments, setComments] = useState([]);

  type FormData = z.infer<typeof schema>;

  useEffect(() => {
    fetchComments();
  }, [page]);

  const fetchComments = async () => {
    axios
      .get(`http://localhost:3000/comments/getByPostId/${_id}/${page}/3`, {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setComments(response.data.comments);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (liked) {
      setHeart(heart_red);
    } else {
      setHeart(heart_black);
    }
    if (numOfLikes == 0) {
      setHeart(heart_black);
    }
  }, [liked]);

  const handleLike = () => {
    const value = liked ? -1 : 1;
    setNumOfLikes(numOfLikes + value);
    setLiked(!liked);
    axios
      .post(
        `http://localhost:3000/likes`,
        {
          postId: _id,
          value: value,
        },
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .post(
        `http://localhost:3000/likes/getByUserAndPost`,
        {
          postId: _id,
        },
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          setLiked(false);
          setHeart(heart_black);
        } else {
          setLiked(true);
          setHeart(heart_red);
        }
      })
      .catch((error) => {
        console.error(error);
        setLiked(false);
        setHeart(heart_black);
      });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
    axios
      .post(
        "http://localhost:3000/comments",
        {
          postId: _id,
          comment: data.comment,
          ownerName: userName,
        },
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        fetchComments();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div
      className="card mx-auto shadow-sm border-light"
      style={{ maxWidth: "400px", borderRadius: "15px" }}
    >
      {/* User Info */}
      <div className="d-flex align-items-center p-2">
        <img
          src={ownerPhoto}
          alt="User"
          className="rounded-circle me-2"
          style={{ width: "40px", height: "40px" }}
        />
        <span className="fw-bold">{ownerName}</span>
        <span className="text-muted ms-auto">{title}</span>
      </div>

      {/* Post Image */}
      <div className="text-center">
        <img
          src={photo}
          alt="Post"
          className="img-fluid w-100"
          style={{ borderRadius: "0", objectFit: "cover" }}
        />
      </div>

      {/* Like, Comment, Share Icons */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2">
        <div>
          <img
            src={heart}
            alt="like"
            className="me-2 cursor-pointer"
            onClick={handleLike}
            style={{ width: "24px" }}
          />
        </div>
      </div>

      {/* Likes Count */}
      <p className="px-3 mb-1">
        <strong>Likes: {numOfLikes}</strong>
      </p>

      {/* Post Content */}
      <div className="px-3">
        <strong>
          <p className="mb-1">
            {ownerName} {content}
          </p>
        </strong>
      </div>

      {/* Comments Section */}
      <div className="px-3">
        {comments.map((comment: comment) => (
          <p key={comment._id} className="mb-1">
            <strong>{comment.ownerName}</strong> {comment.comment}
          </p>
        ))}
        {totalPages >= page && 1 < page && (
          <button
            className="btn btn-sm text-muted"
            onClick={() => setPage(page - 1)}
          >
            Load previous
          </button>
        )}
        {totalPages > 1 && totalPages > page && (
          <button
            className="btn btn-sm text-muted"
            onClick={() => setPage(page + 1)}
          >
            Load more
          </button>
        )}
      </div>

      {/* Comment Input */}
      <div className="px-3 py-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex align-items-center"
        >
          <input
            type="text"
            {...register("comment")}
            className={`form-control form-control-sm me-2 ${
              errors.comment ? "is-invalid" : ""
            }`}
            placeholder="Add a comment..."
          />
          {errors.comment && (
            <div className="invalid-feedback">{errors.comment.message}</div>
          )}
          <button type="submit" className="btn btn-sm btn-primary">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
