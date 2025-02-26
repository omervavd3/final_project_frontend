import axios from "axios";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router";

type AuthAccessProps = {
  where_to_navigate: string;
};

const AuthAccess: FC<AuthAccessProps> = ({ where_to_navigate }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (document.cookie.includes("accessToken") && document.cookie.includes("refreshToken")) {
      navigate("/home");
    } else if (document.cookie.includes("refreshToken")) {
      axios
        .post(
          "http://localhost:3000/auth/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${
                document.cookie.split("refreshToken=")[1].split(";")[0]
              }`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            navigate("/home");
          }
        })
        .catch((error) => {
          console.error(error);
          navigate(`${where_to_navigate}`);
        });
    } else {
        navigate(`${where_to_navigate}`);
    }
  }, []);
  return <></>;
};

export default AuthAccess;
