import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import heart_black from "../assets/heart_black.png";
import heart_red from "../assets/heart_red.png";

type PostProps = {
  title: string;
  content: string;
  photo: string;
  comments: string[];
  likes: number;
  _id: string;
};

const Post: FC<PostProps> = ({
  title,
  content,
  photo,
  comments,
  likes,
  _id,
}) => {
  const schema = z.object({
    comment: z.string().nonempty("Comment is required"),
  });

  const [liked, setLiked] = useState(false);
  const [heart, setHeart] = useState(heart_black);
  const [numOfLikes, setNumOfLikes] = useState(likes);

  type FormData = z.infer<typeof schema>;

  useEffect(() => {
    axios
      .post(
        `http://localhost:3000/comments/getByPostId`,
        { postId: _id },
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
  }, []);

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

  return (
    <div
      className="card mb-3 shadow-sm border-light mx-auto"
      style={{ maxWidth: "300px" }}
    >
      {/* Card Header */}
      <div className="card-header bg-primary text-white p-2 text-center">
        <h5 className="card-title mb-0">{title}</h5>
      </div>

      {/* Card Body */}
      <div className="card-body p-3">
        <p className="card-text text-secondary">{content}</p>
      </div>

      {/* Card Footer with Image */}
      <div className="card-body text-muted p-2 text-center">
        <img
          src={photo}
          alt="Post Image"
          className="img-fluid rounded"
          style={{ maxHeight: "150px", objectFit: "cover" }}
        />
      </div>

      {/* Card Footer with Likes */}
      <div className="card-footer bg-light p-2 text-center">
        <p className="mb-0">Likes: {numOfLikes}</p>
        <img
          src={heart}
          alt="like"
          className="w-25 h-25 cursor-pointer"
          onClick={handleLike}
          style={{ maxWidth: "30px", maxHeight: "30px" }}
        />
      </div>

      {/* Card Footer with Comment Section */}
      <div className="card-footer bg-light p-2 text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="text"
              {...register("comment")}
              className={`form-control ${errors.comment ? "is-invalid" : ""}`}
              placeholder="Add a comment"
            />
            {errors.comment && (
              <div className="invalid-feedback">{errors.comment.message}</div>
            )}
            <button type="submit" className="btn btn-primary ms-2">
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
