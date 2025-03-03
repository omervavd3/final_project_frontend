import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import AuthAccess from "./AuthAccess";

const schema = z.object({
  email: z.string().email("Invalid email"),
  userName: z.string().nonempty("Name is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
  profile: z.instanceof(FileList),
});

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState("../assets/icons8-avatar-96.png");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    reset();
    console.log(data);
    axios
      .post("http://localhost:3000/auth/register", data)
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred. Please try again.");
      });
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result); // Set the base64 image result to the state
        }
      };

      reader.readAsDataURL(file); // Read the file as a data URL
      
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light">
      <AuthAccess where_to_navigate="/signup" />
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "10px",
          margin: "0 10px",
        }}
      >
        <h2 className="text-center mb-4 font-weight-bold">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <img
              src={image}
              alt="Profile"
              className="img-fluid mb-3"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "contain",
                margin: "auto",
                display: "block",
              }}
            />
            <input
              type="file"
              {...register("profile")}
              onChange={handleFileChange}
              className="form-control-file"
              id="fileUpload"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              {...register("email")}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              User name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              {...register("userName")}
              className={`form-control ${errors.userName ? "is-invalid" : ""}`}
            />
            {errors.userName && (
              <div className="invalid-feedback">{errors.userName.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
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
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Sign up
          </button>
        </form>
        <div className="text-center mt-3">
          <a
            onClick={() => navigate("/")}
            className="text-decoration-none"
          >
            Have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
