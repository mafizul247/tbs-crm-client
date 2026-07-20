import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import {
    FaArrowLeft,
    FaEye,
    FaEyeSlash,
    FaSave,
    FaUser,
    FaEnvelope,
    FaLock,
    FaUserTag,
    FaImage
} from "react-icons/fa";

import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {

    const { createUser } = useAuth();

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        password: "",

        confirmPassword: "",

        role: "User",

        status: "Active",

        profilePicture: null

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
            Image Change
    ========================================== */

    const handleImage = (e) => {

        setFormData(prev => ({

            ...prev,

            profilePicture: e.target.files[0]

        }));

    };

    /* ==========================================
            Submit
            (Part 2)
    ========================================== */

    const handleRegister = async (e) => {

        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {

            return Swal.fire({
                icon: "warning",
                title: "Password Mismatch",
                text: "Password and Confirm Password must be the same."
            });

        }

        if (formData.password.length < 6) {

            return Swal.fire({
                icon: "warning",
                title: "Weak Password",
                text: "Password must be at least 6 characters."
            });

        }

        try {

            setLoading(true);

            // Step 1 : Create Firebase User

            const result = await createUser(
                formData.email,
                formData.password
            );

            const firebaseUser = result.user;

            let photoURL = "";

            // Step 2 : Upload Profile Picture

            if (formData.profilePicture) {

                const imageData = new FormData();

                imageData.append(
                    "image",
                    formData.profilePicture
                );

                const uploadResponse = await axiosSecure.post(

                    "/upload-user-image",

                    imageData,

                    {

                        headers: {

                            "Content-Type": "multipart/form-data"

                        }

                    }

                );

                photoURL = uploadResponse.data.imageUrl;

            }

            // Step 3 : Save User Information

            const userInfo = {

                uid: firebaseUser.uid,

                name: formData.name,

                email: formData.email,

                photo: photoURL,

                role: formData.role,

                status: formData.status,

                createdAt: new Date()

            };

            // console.log(userInfo)

            const { data } = await axiosSecure.post(

                "/users",

                userInfo

            );

            if (data.insertedId) {

                Swal.fire({

                    icon: "success",

                    title: "User Created Successfully",

                    timer: 1800,

                    showConfirmButton: false

                });

                handleReset();

                navigate("/users");

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Registration Failed",

                text: error.message

            });

        }
        finally {

            setLoading(false);

        }

    };

    const handleReset = () => {

        setFormData({

            name: "",

            email: "",

            password: "",

            confirmPassword: "",

            role: "",

            status: "",

            profilePicture: null

        });

        setShowPassword(false);

        setShowConfirmPassword(false);

        // Clear file input
        const fileInput = document.querySelector('input[type="file"]');

        if (fileInput) {

            fileInput.value = "";

        }

    };

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Create User</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold">

                        Create User

                    </h2>

                    <p className="text-gray-500">

                        Create a new system user.

                    </p>

                </div>

                <Link
                    to="/users"
                    className="btn btn-outline"
                >

                    <FaArrowLeft />

                    User List

                </Link>

            </div>

            <form onSubmit={handleRegister}>

                {/* ==========================================
                        Personal Information
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Personal Information

                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            {/* Full Name */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Full Name

                                    </span>

                                </label>

                                <div className="relative">

                                    <FaUser className="absolute left-4 top-4 text-gray-400" />

                                    <input
                                        type="text"
                                        name="name"
                                        className="input input-bordered w-full pl-6"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            {/* User Role */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        User Role

                                    </span>

                                </label>

                                <div className="relative">

                                    <FaUserTag className="absolute left-4 top-4 text-gray-400" />

                                    <select
                                        name="role"
                                        className="select select-bordered w-full pl-6"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >

                                        <option>User</option>
                                        <option>Admin</option>
                                        <option>Super Admin</option>
                                        <option>Employee</option>
                                        <option>Sales Executive</option>
                                        <option>HR</option>
                                        <option>Accounts</option>
                                        <option>Manager</option>

                                    </select>

                                </div>

                            </div>

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
                                        className="input input-bordered w-full pl-6"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            {/* Status */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Status

                                    </span>

                                </label>

                                <select
                                    name="status"
                                    className="select select-bordered w-full pl-6"
                                    value={formData.status}
                                    onChange={handleChange}
                                >

                                    <option value="Active">
                                        Active
                                    </option>
                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                </select>

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
                                        className="input input-bordered w-full pl-6 pr-12"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Entry your password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="absolute right-4 top-4"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >

                                        {

                                            showPassword ?

                                                <FaEyeSlash />

                                                :

                                                <FaEye />

                                        }

                                    </button>

                                </div>

                            </div>

                            {/* Confirm Password */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Confirm Password

                                    </span>

                                </label>

                                <div className="relative">

                                    <FaLock className="absolute left-4 top-4 text-gray-400" />

                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className="input input-bordered w-full pl-6 pr-12"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Entry your confirm password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="absolute right-4 top-4"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {
                                            showConfirmPassword
                                                ? <FaEyeSlash />
                                                : <FaEye />
                                        }
                                    </button>

                                </div>

                            </div>

                            {/* Profile Picture */}

                            <div className="lg:col-span-2">

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        <FaImage className="inline mr-2" />

                                        Profile Picture

                                    </span>

                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input file-input-bordered w-full"
                                    onChange={handleImage}
                                />

                                <label className="label">

                                    <span className="label-text-alt text-gray-500">

                                        JPG, JPEG or PNG (Maximum 2MB)

                                    </span>

                                </label>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline btn-error"
                    >

                        Cancel

                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-outline"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >

                        {

                            loading

                                ?

                                <span className="loading loading-spinner loading-sm"></span>

                                :

                                <>

                                    <FaSave />

                                    Create User

                                </>

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default Register;