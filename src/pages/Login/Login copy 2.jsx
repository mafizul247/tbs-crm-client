import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

import useAuth from "../../hooks/useAuth";

const Login = () => {

    const { userLogin, logOut } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    /* ==========================================
            Input Change
    ========================================== */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };

    /* ==========================================
            Submit
    ========================================== */

    const handleLogin = async (e) => {
        e.preventDefault();
        try {

            setLoading(true);

            // Step 1 : Firebase Login

            await userLogin(formData.email, formData.password);

            // Step 2 : Check Status + Get JWT

            const { data } = await axios.post(

                `${import.meta.env.VITE_API_BASE_URL}/jwt`,

                { email: formData.email }

            );

            if (data.success) {

                // Step 3 : Save Token

                localStorage.setItem("accessToken", data.token);

                Swal.fire({

                    icon: "success",

                    title: `Welcome back, ${data.user.name}`,

                    timer: 1500,

                    showConfirmButton: false

                });

                navigate("/");

            }

        }
        catch (error) {

            console.log(error);

            /* ==========================================
                    Inactive User - Blocked
            ========================================== */

            if (error.response?.data?.inactive) {

                await logOut();

                Swal.fire({

                    icon: "warning",

                    title: "Account Inactive",

                    text: "Please contact with admin"

                });

            }

            /* ==========================================
                    User Not Found in Database
            ========================================== */

            else if (error.response?.status === 404) {

                await logOut();

                Swal.fire({

                    icon: "error",

                    title: "Account Not Found",

                    text: "Please contact with admin"

                });

            }

            /* ==========================================
                    Firebase Auth Error
                    (wrong password, no such user, etc.)
            ========================================== */

            else {

                Swal.fire({

                    icon: "error",

                    title: "Login Failed",

                    text: "Invalid email or password."

                });

            }

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center p-6">

            <Helmet>

                <title>PMS || Login</title>

            </Helmet>

            <div className="card w-full max-w-md bg-base-100 shadow border">

                <div className="card-body">

                    <h2 className="text-3xl font-bold text-center mb-1">

                        Welcome Back

                    </h2>

                    <p className="text-gray-500 text-center mb-6">

                        Login to access your dashboard.

                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">

                                    Email Address

                                </span>

                            </label>

                            <div className="relative">

                                <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                                <input
                                    type="email"
                                    name="email"
                                    className="input input-bordered w-full pl-11"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        {/* Password */}

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">

                                    Password

                                </span>

                            </label>

                            <div className="relative">

                                <FaLock className="absolute left-4 top-4 text-gray-400" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="input input-bordered w-full pl-11 pr-12"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="absolute right-4 top-4"
                                    onClick={() => setShowPassword(!showPassword)}
                                >

                                    {showPassword ? <FaEyeSlash /> : <FaEye />}

                                </button>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >

                            {

                                loading

                                    ? <span className="loading loading-spinner loading-sm"></span>

                                    : <><FaSignInAlt /> Login</>

                            }

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

};

export default Login;