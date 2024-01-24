import React, { useContext } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Home = () => {
  const [list, setList] = useState([]);
  const [liked, setLiked] = useState([]);

  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://react-back.azurewebsites.net/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setList(response.data.listOfPosts);
          setLiked(
            response.data.likedPost.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const likePost = (postId) => {
    axios
      .post(
        "http://react-back.azurewebsites.net/like",
        { PostId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        setList(
          list.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likeArray = post.Likes;
                likeArray.pop();
                return { ...post, Likes: likeArray };
              }
            } else {
              return post;
            }
          })
        );
        if (liked.includes(postId)) {
          setLiked(
            liked.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLiked([...liked, postId]);
        }
      });
  };

  return (
    <div>
      {list.map((value, key) => {
        return (
          <div key={key} style={{ marginTop: 50 }}>
            <div>{value.title}</div>
            <div
              onClick={() => {
                navigate(`/view-post/${value.id}`);
              }}
            >
              {value.desc}
            </div>
            <div>{value.userName}</div>

            <ion-icon
              onClick={() => {
                likePost(value.id);
              }}
              name={liked.includes(value.id) ? "heart" : "heart-outline"}
            ></ion-icon>

            <span>{value.Likes.length}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
