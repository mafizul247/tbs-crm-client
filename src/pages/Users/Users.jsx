import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import Swal from "sweetalert2";

import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaTrash,
    FaUsers
} from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const Users = () => {

    const axiosSecure = useAxiosSecure();

    /* ==========================================
            States
    ========================================== */

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [total, setTotal] = useState(0);

    /* ==========================================
            Load Users
    ========================================== */

    const loadUsers = async () => {

        try {

            setLoading(true);

            const { data } = await axiosSecure.get("/users", {

                params: {

                    page,

                    limit,

                    search

                }

            });

            // console.log(data)

            setUsers(data.data);

            setTotal(data.total);

        }
        catch (error) {

            console.log(error);

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadUsers();

    }, [page, search]);

    /* ==========================================
            Search
    ========================================== */

    const handleSearch = (e) => {

        setSearch(e.target.value);

        setPage(1);

    };

    /* ==========================================
            Pagination
    ========================================== */

    const totalPages = Math.ceil(total / limit);

    const handlePrevious = () => {

        if (page > 1) {

            setPage(page - 1);

        }

    };

    const handleNext = () => {

        if (page < totalPages) {

            setPage(page + 1);

        }

    };

    /* ==========================================
            Delete User
    ========================================== */

    const handleDelete = async (id) => {

        Swal.fire({

            title: "Are you sure?",

            text: "You won't be able to revert this!",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel"

        }).then(async (result) => {

            if (!result.isConfirmed) return;

            try {

                const { data } = await axiosSecure.delete(`/users/${id}`);

                if (data.deletedCount > 0) {

                    Swal.fire({

                        icon: "success",

                        title: "Deleted",

                        text: "User deleted successfully.",

                        timer: 1500,

                        showConfirmButton: false

                    });

                    loadUsers();

                }

            }
            catch (error) {

                console.log(error);

            }

        });

    };

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Users</title>

            </Helmet>

            {/* ==========================================
                    Page Header
            ========================================== */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaUsers className="text-primary" />

                        Users

                    </h2>

                    <p className="text-gray-500 mt-1">

                        Manage all system users from one place.

                    </p>

                </div>

                <Link
                    to="/register"
                    className="btn btn-primary"
                >

                    <FaPlus />

                    Add New User

                </Link>

            </div>


            {/* ==========================================
                    Search Card
            ========================================== */}

            <div className="card bg-base-100 border shadow mb-6">

                <div className="card-body">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-end">

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">

                                    Search User

                                </span>

                            </label>

                            <label className="input input-bordered flex items-center gap-3">

                                <FaSearch className="text-gray-500" />

                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Search by Name, Email, Role or Status..."
                                    value={search}
                                    onChange={handleSearch}
                                />

                            </label>

                        </div>

                        <div className="flex justify-end">

                            <div className="stats shadow border">

                                <div className="stat py-4">

                                    <div className="stat-title">

                                        Total Users

                                    </div>

                                    <div className="stat-value text-primary">

                                        {total}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                    User Table
            ========================================== */}

            <div className="overflow-x-auto bg-base-100 border rounded-xl shadow">

                <table className="table table-zebra">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Image</th>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Role</th>

                            <th>Status</th>

                            <th className="text-center">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            loading ?

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center py-12"
                                    >

                                        <span className="loading loading-spinner loading-lg text-primary"></span>

                                    </td>

                                </tr>

                                :

                                users.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center py-12 text-gray-500"
                                        >

                                            No users found.

                                        </td>

                                    </tr>

                                    :

                                    users.map((user, index) => (

                                        <tr key={user._id}>

                                            {/* SL */}

                                            <td>

                                                {(page - 1) * limit + index + 1}

                                            </td>

                                            {/* Image */}

                                            <td>

                                                <div className="flex items-center gap-3">

                                                    <div className="avatar">

                                                        <div className="w-12 rounded-full">

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

                                                </div>

                                            </td>

                                            {/* Name  */}
                                            <td>
                                                <div>

                                                    <div className="font-bold">

                                                        {user.name}

                                                    </div>

                                                    {/* <div className="text-xs text-gray-500">

                                                        {user.createdAt ?

                                                            new Date(user.createdAt).toLocaleDateString()

                                                            :

                                                            "-"

                                                        }

                                                    </div> */}

                                                </div>
                                            </td>

                                            {/* Email */}

                                            <td>

                                                {user.email}

                                            </td>

                                            {/* Role */}

                                            <td>

                                                <span className="badge badge-primary badge-outline">

                                                    {user.role}

                                                </span>

                                            </td>

                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={`badge ${user.status === "Active"
                                                        ? "badge-success"
                                                        : "badge-error"
                                                        }`}
                                                >

                                                    {user.status}

                                                </span>

                                            </td>

                                            {/* Action */}

                                            <td>

                                                <div className="flex justify-center gap-2">

                                                    {/* View  */}

                                                    <Link
                                                        to={`/users/${user._id}`}
                                                        className="btn btn-info btn-sm text-white"
                                                    >

                                                        <FaEye />

                                                    </Link>

                                                    {/* Update  */}

                                                    <Link
                                                        to={`/update-user/${user._id}`}
                                                        className="btn btn-warning btn-sm text-white"
                                                    >

                                                        <FaEdit />

                                                    </Link>
                                                  

                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="btn btn-error btn-sm"
                                                    >

                                                        <FaTrash />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                        }

                    </tbody>

                </table>

            </div>

            {/* ==========================================
                    Pagination
            ========================================== */}

            {
                total > 0 && (

                    <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-4">

                        {/* Showing */}

                        <div className="text-sm text-gray-500">

                            Showing

                            <span className="font-semibold mx-1">

                                {total === 0
                                    ? 0
                                    : ((page - 1) * limit) + 1}

                            </span>

                            -

                            <span className="font-semibold mx-1">

                                {

                                    Math.min(page * limit, total)

                                }

                            </span>

                            of

                            <span className="font-semibold mx-1">

                                {total}

                            </span>

                            Users

                        </div>

                        {/* Pagination */}

                        <div className="join">

                            <button
                                className="join-item btn"
                                onClick={handlePrevious}
                                disabled={page === 1}
                            >

                                Previous

                            </button>

                            {

                                [...Array(totalPages).keys()].map(number => (

                                    <button
                                        key={number}
                                        onClick={() => setPage(number + 1)}
                                        className={`join-item btn ${page === number + 1
                                            ? "btn-primary"
                                            : ""
                                            }`}
                                    >

                                        {number + 1}

                                    </button>

                                ))

                            }

                            <button
                                className="join-item btn"
                                onClick={handleNext}
                                disabled={page === totalPages}
                            >

                                Next

                            </button>

                        </div>

                    </div>

                )

            }

        </div>

    );

};

export default Users;