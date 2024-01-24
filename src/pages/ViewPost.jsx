import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

const ViewPost = () => {
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComments, setNewComments] = useState("");

  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();

  let { id } = useParams();

  useEffect(() => {
    axios.get(`http:react-back.azurewebsites.net/posts/byId/${id}`).then((response) => {
      setPost(response.data);
    });
    axios.get(`http://react-back.azurewebsites.net/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://react-back.azurewebsites.net/comments",
        {
          commentBody: newComments,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          navigate("/login");
        } else {
          const commentToAdd = {
            commentBody: newComments,
            userName: response.data.userName,
          };
          setComments([...comments, commentToAdd]);
          setNewComments("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://react-back.azurewebsites.net/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
        // alert('comment deleted successfully!!')
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://react-back.azurewebsites.net/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        confirm("are you sure you want to delete?")
        navigate("/")
      });
  };

  return (
    <>
      <div>
        {
          <div>
            <div>{post.title}</div>
            <div>{post.desc}</div>
            <div>
              {post.userName}{" "}
              {authState.userName === post.userName && (
                <button
                  onClick={() => {
                    deletePost(post.id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        }
      </div>

      <div className="comments">
        <div className="write-comment">
          <label htmlFor="">comment: </label>
          <textarea
            value={newComments}
            name="commentBody"
            rows="4"
            onChange={(e) => {
              setNewComments(e.target.value);
            }}
          ></textarea>
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="read-comment">
          {comments.map((value, key) => {
            return (
              <div>
                <div key={key}>{value.commentBody}</div>
                <label htmlFor="">@{value.userName}</label>
                {authState.userName === value.userName && (
                  <button
                    onClick={() => {
                      deleteComment(value.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ViewPost;
