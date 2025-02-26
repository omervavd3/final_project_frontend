import { FC } from "react";

type PostProps = { 
    title: string;
    content: string;
    date: string;
}

const Post: FC<PostProps> = ({ title, content, date }) => {
  return (
    <div className="card mb-3 shadow-sm border-light" style={{ maxWidth: "300px" }}>
      <div className="card-header bg-primary text-white p-2">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body p-2">
        <p className="card-text">{content}</p>
      </div>
      <div className="card-footer text-muted text-end p-2">
        <small>{date}</small>
      </div>
    </div>
  );
};

export default Post;
