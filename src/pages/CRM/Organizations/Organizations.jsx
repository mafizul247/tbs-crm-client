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
    FaBuilding,
    FaGlobe
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";



const Organizations = () => {

    const axiosSecure = useAxiosSecure();

    /* ==========================================
            States
    ========================================== */

    const [organizations, setOrganizations] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [total, setTotal] = useState(0);

    /* ==========================================
            Load Organizations
    ========================================== */

    const loadOrganizations = async () => {

        try {

            setLoading(true);

            const { data } = await axiosSecure.get("/organizations", {

                params: { page, limit, search }

            });

            setOrganizations(data.data);

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

        loadOrganizations();

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

        if (page > 1) setPage(page - 1);

    };

    const handleNext = () => {

        if (page < totalPages) setPage(page + 1);

    };

    /* ==========================================
            Delete Organization
    ========================================== */

    const handleDelete = async (id) => {

        Swal.fire({

            title: "Are you sure?",

            text: "This will permanently delete the organization and all its data!",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel",

            confirmButtonColor: "#d33"

        }).then(async (result) => {

            if (!result.isConfirmed) return;

            try {

                const { data } = await axiosSecure.delete(`/organizations/${id}`);

                if (data.deletedCount > 0) {

                    Swal.fire({

                        icon: "success",

                        title: "Deleted",

                        text: "Organization deleted successfully.",

                        timer: 1500,

                        showConfirmButton: false

                    });

                    loadOrganizations();

                }

            }
            catch (error) {

                console.log(error);

                Swal.fire({

                    icon: "error",

                    title: "Delete Failed",

                    text: error.response?.data?.message || error.message

                });

            }

        });

    };

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Organizations</title>

            </Helmet>

            {/* ==========================================
                    Page Header
            ========================================== */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaBuilding className="text-primary" />

                        Organizations

                    </h2>

                    <p className="text-gray-500 mt-1">

                        Manage all clients and organizations from one place.

                    </p>

                </div>

                <Link
                    to="/create-organization"
                    className="btn btn-primary"
                >

                    <FaPlus />

                    Add New Organization

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

                                    Search Organization

                                </span>

                            </label>

                            <label className="input input-bordered flex items-center gap-3">

                                <FaSearch className="text-gray-500" />

                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Search by Name, Code or Industry..."
                                    value={search}
                                    onChange={handleSearch}
                                />

                            </label>

                        </div>

                        <div className="flex justify-end">

                            <div className="stats shadow border">

                                <div className="stat py-4">

                                    <div className="stat-title">

                                        Total Organizations

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
                    Organization Table
            ========================================== */}

            <div className="overflow-x-auto bg-base-100 border rounded-xl shadow">

                <table className="table table-zebra">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Organization</th>

                            <th>Type</th>

                            <th>Industry</th>

                            <th>Contact Person</th>

                            <th>Website</th>

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

                                    <td colSpan="8" className="text-center py-12">

                                        <span className="loading loading-spinner loading-lg text-primary"></span>

                                    </td>

                                </tr>

                                :

                                organizations.length === 0 ?

                                    <tr>

                                        <td colSpan="8" className="text-center py-12 text-gray-500">

                                            No organizations found.

                                        </td>

                                    </tr>

                                    :

                                    organizations.map((org, index) => {

                                        const primaryContact = org.contactPersons?.[0];

                                        return (

                                            <tr key={org._id}>

                                                {/* SL */}

                                                <td>

                                                    {(page - 1) * limit + index + 1}

                                                </td>

                                                {/* Organization Name + Code */}

                                                <td>

                                                    <div className="font-bold">

                                                        {org.organizationName}

                                                    </div>

                                                    {

                                                        org.organizationCode && (

                                                            <div className="text-xs text-gray-500">

                                                                {org.organizationCode}

                                                            </div>

                                                        )

                                                    }

                                                </td>

                                                {/* Type */}

                                                <td>

                                                    <span className="badge badge-primary badge-outline">

                                                        {org.organizationType}

                                                    </span>

                                                </td>

                                                {/* Industry */}

                                                <td>

                                                    {org.industry || "-"}

                                                </td>

                                                {/* Contact Person */}

                                                <td>

                                                    {

                                                        primaryContact ? (

                                                            <div>

                                                                <div className="font-medium">

                                                                    {primaryContact.contactPerson}

                                                                </div>

                                                                <div className="text-xs text-gray-500">

                                                                    {primaryContact.mobile}

                                                                </div>

                                                            </div>

                                                        ) : (

                                                            <span className="text-gray-400">-</span>

                                                        )

                                                    }

                                                    {

                                                        org.contactPersons?.length > 1 && (

                                                            <span className="badge badge-sm badge-ghost ml-1">

                                                                +{org.contactPersons.length - 1} more

                                                            </span>

                                                        )

                                                    }

                                                </td>

                                                {/* Website */}

                                                <td>

                                                    {

                                                        org.website ? (

                                                            <Link
                                                                to={org.website}
                                                                target="_blank"
                                                                reloadDocument
                                                                className="link link-primary flex items-center gap-1"
                                                            >

                                                                <FaGlobe />

                                                                Visit

                                                            </Link>

                                                        ) : (

                                                            <span className="text-gray-400">-</span>

                                                        )

                                                    }

                                                </td>

                                                {/* Status */}

                                                <td>

                                                    <span
                                                        className={`badge ${org.status === "Active"
                                                            ? "badge-success"
                                                            : "badge-error"
                                                            }`}
                                                    >

                                                        {org.status}

                                                    </span>

                                                </td>

                                                {/* Action */}

                                                <td>

                                                    <div className="flex justify-center gap-2">

                                                        <Link
                                                            to={`/organizations/${org._id}`}
                                                            className="btn btn-info btn-sm text-white"
                                                        >

                                                            <FaEye />

                                                        </Link>

                                                        <Link
                                                            to={`/organizations/update/${org._id}`}
                                                            className="btn btn-warning btn-sm text-white"
                                                        >

                                                            <FaEdit />

                                                        </Link>

                                                        <button
                                                            onClick={() => handleDelete(org._id)}
                                                            className="btn btn-error btn-sm"
                                                        >

                                                            <FaTrash />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })

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

                        <div className="text-sm text-gray-500">

                            Showing

                            <span className="font-semibold mx-1">

                                {total === 0 ? 0 : ((page - 1) * limit) + 1}

                            </span>

                            -

                            <span className="font-semibold mx-1">

                                {Math.min(page * limit, total)}

                            </span>

                            of

                            <span className="font-semibold mx-1">

                                {total}

                            </span>

                            Organizations

                        </div>

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
                                        className={`join-item btn ${page === number + 1 ? "btn-primary" : ""}`}
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

export default Organizations;