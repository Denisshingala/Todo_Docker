import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import styles from "./RegisterPage.module.css";
import axios from "axios";
import AlertPopUp from "../AlertPopUp/AlertPopUp";

const RegisterPage = () => {
    // create form data
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // alert pop-up
    const [alert, setAlert] = useState({
        open: false,
        type: "",
        message: ""
    });

    // form fields error
    const [errors, setErrors] = useState({});

    // generate form validation schema
    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required!"),
        email: Yup.string()
            .required("Email Id is required!")
            .email("Please enter valid email!"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Password must contain at least one symbol"
            )
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .required("Password is required!"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Re-password must be same as password")
            .required("Re-password is required"),
    });

    // set the form value
    const setValue = (e) => {
        setErrors((errors) => {
            return { ...errors, [e.target.name]: "" };
        });
        setFormData((data) => {
            return { ...data, [e.target.name]: e.target.value };
        });
    };

    // to handle the registration form request
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // validate the form data using YUP
        try {
            await validationSchema.validate(formData, { abortEarly: false });

            // register the user
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/register`, formData)
                .then((data) => {
                    let response = data.data;
                    if (response.status === "success") {
                        setAlert({
                            open: true,
                            type: 1, // success
                            message: "User has been created!"
                        });
                        setFormData({
                            username: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
                        });
                    } else {
                        setAlert({
                            open: true,
                            type: 0, // error
                            message: "Something went wrong on server!!"
                        });
                    }
                })
                .catch((err) => {
                    setAlert({
                        open: true,
                        type: 0, // error
                        message: err
                    });
                });
        } catch (error) {
            if (error.inner) {
                error.inner.forEach((err) => {
                    setErrors((errors) => {
                        return { ...errors, [err.path]: err.message };
                    });
                });
            }
        }
    };

    return (
        <>
            <AlertPopUp type={alert.type} message={alert.message} openIt={alert.open} />
            <div className={`form-wrapper ${styles.registerPage}`}>
                <div className={styles.formHorizontal}>
                    <h2 className={styles.registerFormHeader}>Register</h2>
                    <form
                        method="post"
                        className={styles.formHorizontal}
                        id="register-form"
                        onSubmit={handleFormSubmit}
                    >
                        <div className={`form-group ${styles.formGroup}`}>
                            <label
                                htmlFor="username"
                                className={`control-label ${styles.controlLabel}`}
                            >
                                Username
                            </label>
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={setValue}
                                    id="username"
                                    className="form-control"
                                />
                                <span className="text-danger" id="usernameError">
                                    {errors?.username}
                                </span>
                            </div>
                        </div>

                        <div className={`form-group ${styles.formGroup}`}>
                            <label
                                htmlFor="email"
                                className={`control-label ${styles.controlLabel}`}
                            >
                                Email
                            </label>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={setValue}
                                    id="email"
                                    className={`form-control`}
                                />
                                <span className="text-danger" id="emailError">
                                    {errors?.email}
                                </span>
                            </div>
                        </div>

                        <div className={`form-group ${styles.formGroup}`}>
                            <label
                                htmlFor="password"
                                className={`control-label ${styles.controlLabel}`}
                            >
                                Password
                            </label>
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={setValue}
                                    id="password"
                                    className={`form-control`}
                                />
                                <span className="text-danger" id="passwordError">
                                    {errors?.password}
                                </span>
                            </div>
                        </div>

                        <div className={`form-group ${styles.formGroup}`}>
                            <label
                                htmlFor="confirmPassword"
                                className={`control-label ${styles.controlLabel}`}
                            >
                                Re-Password
                            </label>
                            <div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={setValue}
                                    className={`form-control`}
                                />
                                <span className="text-danger" id="confirmPasswordError">
                                    {errors?.confirmPassword}
                                </span>
                            </div>
                        </div>

                        <div className={`form-group ${styles.formGroup}`}>
                            <div>
                                <center>
                                    <button
                                        type="submit"
                                        className={`form-control btn btn-primary ${styles.btnPrimary}`}
                                    >
                                        Register
                                    </button>
                                </center>
                            </div>
                        </div>

                        <div className={`form-group ${styles.formGroup}`}>
                            <p className={styles.registerPageParagraph}>
                                Already have an account?{" "}
                                <Link className={styles.registerPageLink} to={"/login"}>
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
