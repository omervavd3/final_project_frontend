import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import avatar from "../assets/icons8-avatar-96.png";
import { useNavigate } from "react-router";

type Post = {
  title: string;
  content: string;
  photo: string;
  likes: number;
  _id: string;
  ownerName: string;
  ownerPhoto: string;
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
        console.log(response)
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
      .get("http://localhost:3000/posts/getByUserId", {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("accessToken=")[1].split(";")[0]
          }`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setUserPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
        setUserPosts([]);
      });
    }
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
    <div>
      <div className="text-center mb-4">
        <h1 className="fw-bold">Hi {userName}</h1>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={
                updateProfileImage
                  ? URL.createObjectURL(updateProfileImage)
                  : profileImage
              }
              style={{ width: "200px", height: "200px", alignSelf: "center" }}
            />
          </div>
          <input
            onChange={changeUpdateImage}
            type="file"
            className="mb-3"
            accept="image/jpeg, image/png"
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
          ></input>
          {errors.userName && (
            <div className="invalid-feedback">{errors.userName.message}</div>
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
          ></input>
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Change password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="password"
            placeholder="Enter password"
            {...register("password")}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPassword"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <label className="form-check-label" htmlFor="showPassword">
              Show Password
            </label>
          </div>
        </div> */}

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Enter previous password
          </label>
          <input
            type={showPreviousPassword ? "text" : "password"}
            className={`form-control ${
              errors.previousPassword ? "is-invalid" : ""
            }`}
            id="previousPassword"
            placeholder="Enter password"
            {...register("previousPassword")}
          />
          {errors.previousPassword && (
            <div className="invalid-feedback">
              {errors.previousPassword.message}
            </div>
          )}
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPreviousPassword"
              checked={showPreviousPassword}
              onChange={togglePreviousPasswordVisibility}
            />
            <label className="form-check-label" htmlFor="showPassword">
              Show Password
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditUser;
