import React, {useEffect, useState}  from 'react'
import {Link, useHistory} from 'react-router-dom';
import "./Login.css";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { useFormik } from "formik";
import * as yup from "yup";
import {login} from "../../actions/authActions";
import {clearErrors} from "../../actions/errorActions";
import PropTypes from "prop-types";
import {connect} from "react-redux";


const validationSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required()
});

const Login = (props) => {

  const [msg, setMsg] = useState(null);
  const history = useHistory();
  const {error} = props;

  useEffect(() => {
    if(error.id === "LOGIN_FAIL") {
      setMsg(error.msg.msg);
    }
  }, [error])

  const onSubmit = (values) => {
    const user = {
      username: values.username,
      password: values.password
    }
    props.login(user);
    history.push("/home");
  }

  const formik = useFormik({
    initialValues: { username: "", password: "" },
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
            <p className="login-left-text">Connect with friends and the world around you on Damirsbook</p>
          </div>
        </div>
        <div className="col-12 col-md-7 d-flex justify-content-center align-items-center">
          <div className="login-right">
            <form onSubmit={formik.handleSubmit}>
            <p className="invalid invalid-main">{msg ? msg : ""}</p>
              <Input 
                name="username"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} inputProps={{ 'aria-label': 'description' }} />
                <p className="invalid">{formik.touched.username && formik.errors.username
                  ? formik.errors.username
                  : ""}</p>
              <Input  
                name="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} 
                inputProps={{ 'aria-label': 'description' }} />
                <p className="invalid">{formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : ""}</p>
              <Button type="submit" variant="contained" color="primary" disabled={!formik.isValid}>
              Log in!
              </Button>
                <p>Don't have an account? <Link to="/register">Register now!</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  clearErrors: PropTypes.func.isRequired
}


const mapStateToProps = (state) => ({
  error: state.error,
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login, clearErrors})(Login);