import { FC } from "react";

type PostProps = { 
    title: string;
    content: string;
    photo: string;
}

const Post: FC<PostProps> = ({ title, content, photo }) => {
  return (
    <div className="card mb-3 shadow-sm border-light mx-auto" style={{ maxWidth: "300px" }}>
  {/* Card Header */}
  <div className="card-header bg-primary text-white p-2 text-center">
    <h5 className="card-title mb-0">{title}</h5>
  </div>

  {/* Card Body */}
  <div className="card-body p-3">
    <p className="card-text text-secondary">{content}</p>
  </div>

  {/* Card Footer with Image */}
  <div className="card-footer text-muted p-2 text-center">
    <img 
      src={photo} 
      alt="Post Image" 
      className="img-fluid rounded" 
      style={{ maxHeight: "150px", objectFit: "cover" }}
    />
  </div>
</div>

  );
};

export default Post;
