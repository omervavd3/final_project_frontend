import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPost from "./AddPost"; // Import your AddPost component
import Logout from "./Logout";

type NavbarProps = {
  userName: string;
};

const Navbar:FC<NavbarProps> = ({userName}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm rounded mb-4">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">
            My Blog
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => setShowModal(true)} // Open modal
                >
                  Add Post
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => navigate("/editUser")}
                >
                  Edit User
                </button>
              </li>
              <li className="nav-item">
                <Logout />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Bootstrap Modal for AddPost */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <AddPost userName={userName}/>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
