import { use, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Providers/AuthContext";
import useAuth from "../../hooks/useAuth";
import {
    FaEye,
    FaEyeSlash,
    FaProjectDiagram,
    FaUser,
    FaEnvelope,
    FaLock,
} from "react-icons/fa";

const Register = () => {
    const { createUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        console.log(name, email, password);
        createUser(email, password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser)
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
                        Create Account
                    </h2>

                    <p className="text-center text-base-content/70">
                        Register to access PMS ERP
                    </p>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-4 mt-6"
                    >

                        {/* Full Name */}

                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Full Name
                                </span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

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

                        {/* Login */}

                        <button
                            className="btn btn-primary w-full mt-2"
                        >
                            Create Account
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Register;