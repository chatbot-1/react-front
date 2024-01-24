import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const initailValues = {
    userName: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    userName: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(6).max(15).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://react-back.azurewebsites.net/user", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        navigate("/login");
      }
      console.log("It worked");
    });
  };

  return (
    <div>
      <div>
        <Formik
          initialValues={initailValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div>
              <label htmlFor="">Username: </label>
              <ErrorMessage name="userName" component="span" />
              <Field name="userName" placeholder="(Username...)" />
            </div>
            <div>
              <label htmlFor="">Password: </label>
              <ErrorMessage name="password" component="span" />
              <Field
                name="password"
                type="password"
                placeholder="(Password...)"
              />
            </div>
            <button type="submit">SignUp</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
