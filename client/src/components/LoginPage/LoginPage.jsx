import React, { useContext, useEffect, useState } from 'react'
import styles from './LoginPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import AlertPopUp from '../AlertPopUp/AlertPopUp';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../Loading/Loading';

const LoginPage = () => {
    const { isAuthenticated, isLoading, setIsAuthenticated, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/todo');
        }
    }, [isAuthenticated, navigate]);

    // create form data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login_check`, formData)
                .then((response) => {
                    if (response.data.code === 401) {
                        setAlert({
                            open: true,
                            type: 0, // error
                            message: "Something went wrong on server!!"
                        });
                    } else {
                        localStorage.setItem("token", response.data.token);
                        setIsAuthenticated(true);
                        setToken(response.data.token);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
                        navigate("/todo");
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

    if (isLoading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <AlertPopUp type={alert.type} message={alert.message} openIt={alert.open} />
            <div className={`form-wrapper ${styles.loginPage}`}>
                <div className={`${styles.formHorizontal}`}>
                    <h2 className={styles.loginPageHeader}>Login</h2>
                    <form method="post" id="loginform" onSubmit={handleFormSubmit}>
                        <div className={`form-group ${styles.formGroup}`}>
                            <label htmlFor="email" className={`control-label ${styles.controlLabel}`}>Email</label>
                            <input type="text" name="email" id="email" value={formData.email} onChange={setValue} className={`form-control ${styles.formControl}`} required />
                            <span className="text-danger" id="emailError">
                                {errors?.email}
                            </span>
                        </div>

                        <div className={`form-group ${styles.formGroup}`}>
                            <label htmlFor="password" className={`control-label ${styles.controlLabel}`}>Password</label>
                            <input type="password" name="password" id="password" value={formData.password} onChange={setValue} className={`form-control ${styles.formControl}`} required />
                            <span className="text-danger" id="passwordError">
                                {errors?.password}
                            </span>
                        </div>

                        <div className={`form-group ${styles.formGroup}`}>
                            <center><button type="submit" className={`btn btn-primary form-control ${styles.btnPrimary}`}>Login</button></center>
                        </div>

                        <div className={`form-group ${styles.formGroup}`}>
                            <p className={styles.loginPageParagraph}>Don't have an account? <Link to={"/register"} className={styles.loginPageLink}>Register</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginPage