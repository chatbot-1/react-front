import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const CreatePost = () => {

  const navigate = useNavigate();

  const { authState } = useContext(AuthContext);

  const initailValues = {
    title: "",
    desc: "",
    // userName: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login")
    }
  }, [])

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    desc: Yup.string().required(),
    // userName: Yup.string().min(3).max(15).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://react-back.azurewebsites.net/posts", data, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
      navigate("/");
      console.log("It worked");
    });
  };

  return (
    <div>
      <Formik
        initialValues={initailValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <div>
            <label htmlFor="">Title: </label>
            <ErrorMessage name="title" component="span" />
            <Field name="title" placeholder="(Title...)" />
          </div>
          <div>
            <label htmlFor="">Content: </label>
            <ErrorMessage name="desc" component="span" />
            <Field name="desc" placeholder="(Description...)" />
          </div>
          {/* <div>
            <label htmlFor="">Username: </label>
            <ErrorMessage name="userName" component="span" />
            <Field name="userName" placeholder="(Username...)" />
          </div> */}
          <button type="submit">Create post</button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreatePost;
