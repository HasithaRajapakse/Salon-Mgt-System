import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Createservice() {
  const initialValues = {
    servicename: "",
    description: "",
    price: "",
  };

  const validationSchema = Yup.object().shape({
    servicename: Yup.string().required("You must input a service!"),
    description: Yup.string().required(),
    price: Yup.string().min(2).max(5).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/services", data).then((response) => {
      console.log("IT WORKED");
    });
  };
  return (
    <div className="createservicePage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Service: </label>
          <ErrorMessage name="servicename" component="span" />
          <Field
            autocomplete="off"
            id="inputCreateService"
            name="servicename"
            placeholder="(Ex. service...)"
          />
          <label>:Description </label>
          <ErrorMessage name="description" component="span" />
          <Field
            autocomplete="off"
            id="inputCreateService"
            name="description"
            placeholder="(Ex. description...)"
          />
          <label>Price: </label>
          <ErrorMessage name="price" component="span" />
          <Field
            autocomplete="off"
            id="inputCreateService"
            name="price"
            placeholder="(Ex. price...)"
          />

          <button type="submit"> Create Service</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Createservice;