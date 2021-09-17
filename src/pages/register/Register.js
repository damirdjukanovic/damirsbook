import React, {useState, useEffect, useRef}  from 'react';
import {Link, useHistory} from 'react-router-dom';
import "./Register.css";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {register} from "../../actions/authActions";
import {loadUser} from "../../actions/authActions";
import {clearErrors} from "../../actions/errorActions";
import { useFormik } from "formik";
import * as yup from "yup";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const validationSchema = yup.object({
  fullname: yup
    .string()
    .min(3, "Please enter you real name")
    .max(30, "Maximum 30 characters")
    .required("full name is required field"),
  email: yup.string().email("Please enter a valid email address").required(),
  username: yup.string().min(4, "Username needs to be at least 4 characters long").max(14, "Username cannot be more than 14 characters long").required(),
  password: yup
    .string()
    .matches(PASSWORD_REGEX, "Password needs to be 6 characters long and it needs to include at least one letter and a number")
    .required(),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup
        .string()
        .oneOf([yup.ref("password")], "Password does not match"),
    }),
});


const Register = (props) => {


  const [msg, setMsg] = useState(null);
  const {error} = props;
  const history = useHistory();

  useEffect(() => {

      if(error.id === "REGISTER_FAIL") {
        setMsg(error.msg.msg);
      }

  }, [error, msg]);


  const onSubmit = (values) => {
    

    const user = {
      username: values.username,
      email: values.email,
      fullname: values.fullname,
      password: values.password
      }

      props.register(user);
      history.push("/home");
      
    }

    const formik = useFormik({
      initialValues: {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validateOnBlur: true,
      onSubmit,
      validationSchema: validationSchema,
    });

  return (
    <div className="Login">
      <div className="row">
        <div className="col-12 col-md-5 d-flex justify-content-center align-items-center">
          <div className="login-left text-align-center">
            <h1>Damirsbook</h1>
            <p className="login-left-text">Connect with friends and the wrold around you on Damirsbook</p>
          </div>
        </div>
        <div className="col-12 col-md-7 d-flex justify-content-center align-items-center">
          <div className="login-right login-right-register">
            <form onSubmit={formik.handleSubmit}>
            <p className="invalid invalid-main">{msg ? msg : ""}</p>
              <Input 
              className="signup-input"
              name="fullname"
              placeholder="Full name" 
              value={formik.values.fullname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} 
              inputProps={{ 'aria-label': 'description' }} />
              <p className="invalid">{formik.touched.fullname && formik.errors.fullname
                ? formik.errors.fullname
                : ""}</p>
              <Input 
              placeholder="Email" 
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} 
              inputProps={{ 'aria-label': 'description' }} />
              <p className="invalid">{formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""}</p>
              <Input 
              placeholder="Username" 
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} 
              inputProps={{ 'aria-label': 'description' }} />
              <p className="invalid">{formik.touched.username && formik.errors.username
                ? formik.errors.username
                : ""}</p>
              <Input 
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} 
              type="password" 
              inputProps={{ 'aria-label': 'description' }} />
              <p className="invalid">{formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ""}</p>
              <Input 
              placeholder="Confirm password"
              name="confirmPassword" 
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} 
              type="password" 
              inputProps={{ 'aria-label': 'description' }} />
              <p className="invalid">{formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ""}</p>

              <Button type="submit" variant="contained" disabled={!formik.isValid} color="primary">
              Sign up!
              </Button>
                <p>Have an account? <Link to="/">Log in!</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


Register.propTypes = {
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});


export default connect(mapStateToProps, {register, clearErrors, loadUser})(Register);