import { useState } from "react";
import { FaEye, FaEyeSlash, FaProjectDiagram } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";

const Login = () => {
    const { userLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        userLogin(email, password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser)
                navigate(location?.state || '/');
            }).catch(error => {
                console.log(error.message)
            })
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-5">

            <div className="card w-full max-w-md bg-base-100 shadow-2xl">

                <div className="card-body">

                    {/* Logo */}

                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary text-primary-content flex items-center justify-center">
                            <FaProjectDiagram size={38} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-center mt-4">
                        PMS ERP
                    </h2>

                    <p className="text-center text-base-content/70">
                        Sign in to continue
                    </p>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-4 mt-6"
                    >

                        {/* Email */}

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Email Address
                                </span>
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Password */}

                        <div>

                            <label className="label">
                                <span className="label-text">
                                    Password
                                </span>
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    className="input input-bordered w-full pr-12"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* Remember */}

                        <div className="flex justify-between items-center">

                            <label className="label cursor-pointer gap-2">

                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary checkbox-sm"
                                />

                                <span className="label-text">
                                    Remember me
                                </span>

                            </label>

                            <a
                                href="#"
                                className="link link-primary text-sm"
                            >
                                Forgot Password?
                            </a>

                        </div>

                        {/* Login */}

                        <button
                            className="btn btn-primary w-full mt-2"
                        >
                            Sign In
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Login;