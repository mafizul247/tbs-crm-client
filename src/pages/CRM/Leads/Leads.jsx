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
    FaBullseye,
    FaComments
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const statusBadgeColor = {

    "New": "badge-info",

    "Contacted": "badge-primary",

    "In Progress": "badge-warning",

    "Proposal Sent": "badge-secondary",

    "Negotiation": "badge-accent",

    "Won": "badge-success",

    "Lost": "badge-error"

};

const priorityBadgeColor = {

    "Low": "badge-secondary",

    "Medium": "badge-info",

    "High": "badge-warning",

    "Urgent": "badge-error"

};


const Leads = () => {

    const axiosSecure = useAxiosSecure();

    const [leads, setLeads] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [total, setTotal] = useState(0);

    const loadLeads = async () => {

        try {

            setLoading(true);

            const { data } = await axiosSecure.get("/leads", {

                params: { page, limit, search }

            });

            setLeads(data.data);

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

        loadLeads();

    }, [page, search]);

    const handleSearch = (e) => {

        setSearch(e.target.value);

        setPage(1);

    };

    const totalPages = Math.ceil(total / limit);

    const handlePrevious = () => {

        if (page > 1) setPage(page - 1);

    };

    const handleNext = () => {

        if (page < totalPages) setPage(page + 1);

    };

    const handleDelete = async (id) => {

        Swal.fire({

            title: "Are you sure?",

            text: "This will permanently delete the lead and all its interactions/submissions!",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel",

            confirmButtonColor: "#d33"

        }).then(async (result) => {

            if (!result.isConfirmed) return;

            try {

                const { data } = await axiosSecure.delete(`/leads/${id}`);

                if (data.deletedCount > 0) {

                    Swal.fire({

                        icon: "success",

                        title: "Deleted",

                        text: "Lead deleted successfully.",

                        timer: 1500,

                        showConfirmButton: false

                    });

                    loadLeads();

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

    const formatCurrency = (value) => {

        if (!value) return "-";

        return new Intl.NumberFormat("en-US", {

            style: "currency",

            currency: "USD"

        }).format(value);

    };

    const formatDate = (value) => {

        if (!value) return "-";

        return new Date(value).toLocaleDateString("en-US", {

            year: "numeric",

            month: "short",

            day: "numeric"

        });

    };

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Leads</title>

            </Helmet>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaBullseye className="text-primary" />

                        Leads

                    </h2>

                    <p className="text-gray-500 mt-1">

                        Manage all leads and opportunities from one place.

                    </p>

                </div>

                <Link to="/create-lead" className="btn btn-primary">

                    <FaPlus />

                    Add New Lead

                </Link>

            </div>

            <div className="card bg-base-100 border shadow mb-6">

                <div className="card-body">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-end">

                        <div>

                            <label className="label">

                                <span className="label-text font-semibold">

                                    Search Lead

                                </span>

                            </label>

                            <label className="input input-bordered flex items-center gap-3">

                                <FaSearch className="text-gray-500" />

                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Search by Topic, Reference No, Project or Status..."
                                    value={search}
                                    onChange={handleSearch}
                                />

                            </label>

                        </div>

                        <div className="flex justify-end">

                            <div className="stats shadow border">

                                <div className="stat py-4">

                                    <div className="stat-title">

                                        Total Leads

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

            <div className="overflow-x-auto bg-base-100 border rounded-xl shadow">

                <table className="table table-zebra">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Lead Topic</th>

                            <th>Organization</th>

                            <th>Priority</th>

                            <th>Status</th>

                            <th>Estimated Cost</th>

                            <th>Last Follow-up</th>

                            <th>Interactions</th>

                            <th className="text-center">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            loading ?

                                <tr>

                                    <td colSpan="9" className="text-center py-12">

                                        <span className="loading loading-spinner loading-lg text-primary"></span>

                                    </td>

                                </tr>

                                :

                                leads.length === 0 ?

                                    <tr>

                                        <td colSpan="9" className="text-center py-12 text-gray-500">

                                            No leads found.

                                        </td>

                                    </tr>

                                    :

                                    leads.map((lead, index) => (

                                        <tr key={lead._id}>

                                            <td>

                                                {(page - 1) * limit + index + 1}

                                            </td>

                                            <td>

                                                <div className="font-bold">

                                                    {lead.leadTopic}

                                                </div>

                                                {

                                                    lead.referenceNo && (

                                                        <div className="text-xs text-gray-500">

                                                            Ref: {lead.referenceNo}

                                                        </div>

                                                    )

                                                }

                                            </td>

                                            <td>

                                                {

                                                    lead.organizationInfo?.organizationName || (

                                                        <span className="text-gray-400">-</span>

                                                    )

                                                }

                                            </td>

                                            <td>

                                                <span
                                                    className={`badge ${priorityBadgeColor[lead.priority] || "badge-ghost"}`}
                                                >

                                                    {lead.priority}

                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={`${statusBadgeColor[lead.leadStatus] || "badge-ghost"}`}
                                                >

                                                    {lead.leadStatus}

                                                </span>

                                            </td>

                                            <td>

                                                {formatCurrency(lead.estimatedCost)}

                                            </td>

                                            {/* ==========================================
                                                    Last Follow-up
                                                    - dynamically computed on the backend
                                                      from the latest Interaction
                                                    - falls back to the Lead's initial
                                                      follow-up date if no Interactions
                                                      have been logged yet
                                            ========================================== */}

                                            <td>

                                                {formatDate(lead.lastFollowUpDate)}

                                            </td>

                                            {/* Interactions Count */}

                                            <td>

                                                <span className="badge badge-outline flex items-center gap-1 w-fit">

                                                    <FaComments />

                                                    {lead.totalInteractions || 0}

                                                </span>

                                            </td>

                                            <td>

                                                <div className="flex justify-center gap-2">

                                                    <Link
                                                        to={`/leads/${lead._id}`}
                                                        className="btn btn-info btn-sm text-white"
                                                    >

                                                        <FaEye />

                                                    </Link>

                                                    <Link
                                                        to={`/leads/update/${lead._id}`}
                                                        className="btn btn-warning btn-sm text-white"
                                                    >

                                                        <FaEdit />

                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(lead._id)}
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

                            Leads

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

export default Leads;