import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import avatar from "../assets/icons8-avatar-96.png";
import { useNavigate } from "react-router";
import Post from "./Post";

type Post = {
  title: string;
  content: string;
  photo: string;
  likes: number;
  _id: string;
  ownerName: string;
  ownerPhoto: string;
  date: string;
};

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

const schema = z.object({
  email: z.string({ message: "Invalid email" }).email(),
  userName: z.string(),
  previousPassword: z
    .string()
    .nonempty("Previous password is required")
    .min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

const EditUser = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [profileImage, setProfileImage] = useState<string>(avatar);
  const [userName, setUserName] = useState<string>("user");
  const [updateName, setUpdateName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateProfileImage, setUpdateProfileImage] = useState<File | null>(
    null
  );
  const [showPreviousPassword, setShowPreviousPassword] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const togglePreviousPasswordVisibility = () => {
    setShowPreviousPassword((prev) => !prev);
  };

  useEffect(() => {
    if (!document.cookie.includes("accessToken")) {
      navigate("/");
    }
    const loadPageInfo = async () => {
      await axios
        .get("http://localhost:3000/auth/getUserInfo", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("accessToken=")[1].split(";")[0]
            }`,
          },
        })
        .then((response) => {
          console.log(response);
          setProfileImage(response.data.profileImageUrl);
          setUserName(response.data.userName);
          setUpdateName(response.data.userName);
          setUpdateEmail(response.data.email);
        })
        .catch((error) => {
          console.error(error);
          setProfileImage("");
        });

      await axios
        .post(
          "http://localhost:3000/posts/getByUserId",
          {},
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
          setUserPosts(response.data);
        })
        .catch((error) => {
          console.error(error);
          setUserPosts([]);
        });
    };
    loadPageInfo();
  }, []);

  const changeUpdateImage = (e: any) => {
    console.log(e.target.files[0]);
    setUpdateProfileImage(e.target.files[0]);
  };

  const onSubmit = async (data: FormData) => {
    console.log(data);
    reset();
    let url = updateProfileImage;
    console.log(updateProfileImage);
    const formData = new FormData();
    if (
      updateProfileImage &&
      URL.createObjectURL(updateProfileImage) !== profileImage
    ) {
      formData.append("file", updateProfileImage);
      await apiClient
        .post("/file?file=123.jpeg", formData, {
          headers: {
            "Content-Type": "image/jpeg",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status !== 200) {
            alert("An error occurred. Please try again.");
            return;
          }
          url = res.data.url;
        })
        .catch((err) => {
          console.log(err);
          alert("An error occurred. Please try again.");
        });
    }
    await axios
      .put(
        "http://localhost:3000/auth",
        {
          email: data.email,
          userName: data.userName,
          password: data.previousPassword,
          profileImageUrl: url,
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
        console.log(response);
        if (response.status === 200) {
          alert("User updated successfully");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1 className="fw-bold">@{userName}</h1>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Back to home page
        </button>
      </div>

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

      <div className="accordion" id="editProfileAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseProfile"
              aria-expanded="false"
              aria-controls="collapseProfile"
            >
              Edit Profile
            </button>
          </h2>
          <div
            id="collapseProfile"
            className="accordion-collapse collapse"
            data-bs-parent="#editProfileAccordion"
          >
            <div className="accordion-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 text-center">
                  <img
                    src={
                      updateProfileImage
                        ? URL.createObjectURL(updateProfileImage)
                        : profileImage
                    }
                    className="rounded-circle border border-secondary"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <input
                    type="file"
                    className="form-control mt-3"
                    accept="image/jpeg, image/png"
                    onChange={changeUpdateImage}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    User name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={updateName}
                    {...register("userName")}
                    onChange={(e) => setUpdateName(e.target.value)}
                  />
                  {errors.userName && (
                    <div className="invalid-feedback">
                      {errors.userName.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    User email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={updateEmail}
                    {...register("email")}
                    onChange={(e) => setUpdateEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="previousPassword" className="form-label">
                    Enter previous password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPreviousPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.previousPassword ? "is-invalid" : ""
                      }`}
                      id="previousPassword"
                      placeholder="Enter password"
                      {...register("previousPassword")}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={togglePreviousPasswordVisibility}
                    >
                      {showPreviousPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.previousPassword && (
                    <div className="invalid-feedback">
                      {errors.previousPassword.message}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        {userPosts && userPosts.length > 0 ? (
          [...userPosts]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((post, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <div>
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

export default EditUser;
