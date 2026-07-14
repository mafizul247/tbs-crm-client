import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router";
import {
    FaArrowLeft,
    FaEdit,
    FaEnvelope,
    FaUserTag,
    FaCalendarAlt,
    FaSignInAlt,
    FaClock
} from "react-icons/fa";

import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DetailsUser = () => {

    const { id } = useParams();

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    /* ==========================================
            Load User
    ========================================== */

    useEffect(() => {

        const loadUser = async () => {

            try {

                setLoading(true);

                const { data } = await axiosSecure.get(`/users/${id}`);

                setUser(data);

            }
            catch (error) {

                console.log(error);

                Swal.fire({

                    icon: "error",

                    title: "Failed to Load User",

                    text: error.message

                });

                navigate("/users");

            }
            finally {

                setLoading(false);

            }

        };

        loadUser();

    }, [id, axiosSecure, navigate]);

    /* ==========================================
            Loading State
    ========================================== */

    if (loading) {

        return (

            <div className="flex justify-center items-center py-20">

                <span className="loading loading-spinner loading-lg text-primary"></span>

            </div>

        );

    }

    if (!user) {

        return null;

    }

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || User Details</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold">

                        User Details

                    </h2>

                    <p className="text-gray-500">

                        View complete user information.

                    </p>

                </div>

                <div className="flex gap-3">

                    <Link
                        to={`/update-user/${user._id}`}
                        className="btn btn-warning text-white"
                    >

                        <FaEdit />

                        Edit User

                    </Link>

                    <Link
                        to="/users"
                        className="btn btn-outline"
                    >

                        <FaArrowLeft />

                        User List

                    </Link>

                </div>

            </div>

            {/* Profile Card */}

            <div className="card bg-base-100 shadow border">

                <div className="card-body">

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Left: Avatar + Basic */}

                        <div className="flex flex-col items-center lg:items-start lg:w-1/3">

                            <div className="avatar">

                                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">

                                    <img
                                        src={

                                            user.photo

                                                ? `${import.meta.env.VITE_API_BASE_URL}${user.photo}`

                                                : "https://i.ibb.co/4pDNDk1/avatar.png"

                                        }
                                        alt={user.name}
                                    />

                                </div>

                            </div>

                            <h3 className="text-2xl font-bold mt-4 text-center lg:text-left">

                                {user.name}

                            </h3>

                            <div className="flex gap-2 mt-2">

                                <span className="badge badge-primary badge-outline">

                                    {user.role}

                                </span>

                                <span
                                    className={`badge ${user.status === "Active"
                                        ? "badge-success"
                                        : "badge-error"
                                        }`}
                                >

                                    {user.status}

                                </span>

                            </div>

                        </div>

                        {/* Right: Details Grid */}

                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Email */}

                            <div className="flex items-start gap-3">

                                <FaEnvelope className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">

                                        Email Address

                                    </p>

                                    <p className="font-semibold">

                                        {user.email}

                                    </p>

                                </div>

                            </div>

                            {/* Role */}

                            <div className="flex items-start gap-3">

                                <FaUserTag className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">

                                        Role

                                    </p>

                                    <p className="font-semibold">

                                        {user.role}

                                    </p>

                                </div>

                            </div>

                            {/* Created At */}

                            <div className="flex items-start gap-3">

                                <FaCalendarAlt className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">

                                        Joined On

                                    </p>

                                    <p className="font-semibold">

                                        {

                                            user.createdAt

                                                ? new Date(user.createdAt).toLocaleDateString("en-US", {

                                                    year: "numeric",

                                                    month: "long",

                                                    day: "numeric"

                                                })

                                                : "-"

                                        }

                                    </p>

                                </div>

                            </div>

                            {/* Last Login */}

                            <div className="flex items-start gap-3">

                                <FaSignInAlt className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">

                                        Last Login

                                    </p>

                                    <p className="font-semibold">

                                        {

                                            user.lastLogin

                                                ? new Date(user.lastLogin).toLocaleString("en-US")

                                                : "Never logged in"

                                        }

                                    </p>

                                </div>

                            </div>

                            {/* Login Count */}

                            <div className="flex items-start gap-3">

                                <FaClock className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">

                                        Total Logins

                                    </p>

                                    <p className="font-semibold">

                                        {user.loginCount ?? 0}

                                    </p>

                                </div>

                            </div>

                            {/* Updated At */}

                            <div className="flex items-start gap-3">

                                <FaCalendarAlt className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">

                                        Last Updated

                                    </p>

                                    <p className="font-semibold">

                                        {

                                            user.updatedAt

                                                ? new Date(user.updatedAt).toLocaleDateString("en-US", {

                                                    year: "numeric",

                                                    month: "long",

                                                    day: "numeric"

                                                })

                                                : "-"

                                        }

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default DetailsUser;