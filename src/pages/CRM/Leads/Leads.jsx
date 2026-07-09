import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

import {
    FaPlus,
    FaSearch,
    FaSyncAlt,
    FaClipboardList,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaEye,
    FaEdit,
    FaTrash,
    FaAngleLeft,
    FaAngleRight
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const Leads = () => {

    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(true);

    const [leads, setLeads] = useState([]);

    const [search, setSearch] = useState("");

    const [statistics, setStatistics] = useState({
        total: 0,
        newLead: 0,
        won: 0,
        lost: 0
    });
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const totalPages = Math.ceil(leads.length / itemsPerPage);

    const paginatedLeads = leads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const loadLeads = async () => {

        try {

            setLoading(true);

            const { data } = await axiosSecure.get(
                `/leads?search=${search}`
            );

            setLeads(data.data || []);

            setStatistics({

                total: data.total || 0,

                newLead:
                    data.data?.filter(
                        item => item.leadStatus === "New"
                    ).length || 0,

                won:
                    data.data?.filter(
                        item => item.leadStatus === "Won"
                    ).length || 0,

                lost:
                    data.data?.filter(
                        item => item.leadStatus === "Lost"
                    ).length || 0,

            });

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

    }, [search]);

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: "Delete Lead?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete"
        });

        if (!result.isConfirmed) return;

        try {

            const { data } = await axiosSecure.delete(`/leads/${id}`);

            if (data.deletedCount > 0) {

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
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
                title: "Failed",
                text: "Unable to delete lead."
            });

        }

    };

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Leads</title>

            </Helmet>

            {/* ===========================================
                    Header
            =========================================== */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold">

                        Lead Management

                    </h2>

                    <p className="text-gray-500 mt-1">

                        Manage all sales opportunities from one place.

                    </p>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={loadLeads}
                        className="btn btn-outline"
                    >

                        <FaSyncAlt />

                        Refresh

                    </button>

                    <Link
                        to="/create-lead"
                        className="btn btn-primary"
                    >

                        <FaPlus />

                        Add Lead

                    </Link>

                </div>

            </div>

            {/* ===========================================
                    Statistics
            =========================================== */}

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 mb-6">

                <div className="card bg-primary text-primary-content shadow">

                    <div className="card-body">

                        <div className="flex justify-between items-center">

                            <div>

                                <p>Total Leads</p>

                                <h2 className="text-4xl font-bold">

                                    {statistics.total}

                                </h2>

                            </div>

                            <FaClipboardList size={35} />

                        </div>

                    </div>

                </div>

                <div className="card bg-warning text-white shadow">

                    <div className="card-body">

                        <div className="flex justify-between items-center">

                            <div>

                                <p>New Leads</p>

                                <h2 className="text-4xl font-bold">

                                    {statistics.newLead}

                                </h2>

                            </div>

                            <FaClock size={35} />

                        </div>

                    </div>

                </div>

                <div className="card bg-success text-success-content shadow">

                    <div className="card-body">

                        <div className="flex justify-between items-center">

                            <div>

                                <p>Won</p>

                                <h2 className="text-4xl font-bold">

                                    {statistics.won}

                                </h2>

                            </div>

                            <FaCheckCircle size={35} />

                        </div>

                    </div>

                </div>

                <div className="card bg-error text-error-content shadow">

                    <div className="card-body">

                        <div className="flex justify-between items-center">

                            <div>

                                <p>Lost</p>

                                <h2 className="text-4xl font-bold">

                                    {statistics.lost}

                                </h2>

                            </div>

                            <FaTimesCircle size={35} />

                        </div>

                    </div>

                </div>

            </div>

            {/* ===========================================
                    Search
            =========================================== */}

            <div className="card bg-base-100 border shadow mb-6">

                <div className="card-body">

                    <div className="join w-full">

                        <input
                            type="text"
                            className="input input-bordered join-item w-full"
                            placeholder="Search by Topic, Organization, Project..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button className="btn btn-primary join-item">

                            <FaSearch />

                        </button>

                    </div>

                </div>

            </div>

            {/* Table will start here in Part 2 */}
            {/* ===========================================
                    Leads Table
            =========================================== */}

            <div className="overflow-x-auto bg-base-100 border shadow rounded-xl">

                <table className="table table-zebra">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Lead Topic</th>

                            <th>Organization</th>

                            <th>Project</th>

                            <th>Priority</th>

                            <th>Status</th>

                            <th className="text-right">
                                Estimated Cost
                            </th>

                            <th>Follow-up</th>

                            <th>Assigned To</th>

                            <th>Created</th>

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
                                        colSpan="11"
                                        className="text-center py-20"
                                    >

                                        <span className="loading loading-spinner loading-lg"></span>

                                    </td>

                                </tr>

                                :

                                leads.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="11"
                                            className="text-center py-16"
                                        >

                                            <div className="flex flex-col items-center">

                                                <FaClipboardList
                                                    className="text-6xl text-gray-300 mb-3"
                                                />

                                                <h2 className="text-xl font-semibold">

                                                    No Lead Found

                                                </h2>

                                                <p className="text-gray-500">

                                                    Create your first lead.

                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                    :

                                    paginatedLeads.map((lead, index) => (

                                        <tr key={lead._id}>

                                            {/* SL */}

                                            <td>

                                                {index + 1}

                                            </td>

                                            {/* Topic */}

                                            <td>

                                                <div>

                                                    <h2 className="font-semibold">

                                                        {lead.topic}

                                                    </h2>

                                                    <p className="text-xs text-gray-500">

                                                        {lead.reference || "No Reference"}

                                                    </p>

                                                </div>

                                            </td>

                                            {/* Organization */}

                                            <td>

                                                {lead.organization}

                                            </td>

                                            {/* Project */}

                                            <td>

                                                {lead.project}

                                            </td>

                                            {/* Priority */}

                                            <td>

                                                <span
                                                    className={`badge

                                                        ${lead.priority === "High"
                                                            ? "badge-success"

                                                            : lead.priority === "Medium"
                                                                ? "badge-warning"

                                                                : lead.priority === "Low"
                                                                    ? "badge-error"

                                                                    : "badge-secondary"
                                                        }

                                                    `}
                                                >

                                                    {lead.priority}

                                                </span>

                                            </td>

                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={`badge

                                                        ${lead.leadStatus === "New"
                                                            ? "badge-info"

                                                            : lead.leadStatus === "Qualified"
                                                                ? "badge-primary"

                                                                : lead.leadStatus === "Proposal Sent"
                                                                    ? "badge-warning"

                                                                    : lead.leadStatus === "Negotiation"
                                                                        ? "badge-accent"

                                                                        : lead.leadStatus === "Won"
                                                                            ? "badge-success"

                                                                            : "badge-error"
                                                        }

                                                    `}
                                                >

                                                    {lead.leadStatus}

                                                </span>

                                            </td>

                                            {/* Estimated Cost */}

                                            <td className="text-right">

                                                ৳ {Number(
                                                    lead.estimatedCost || 0
                                                ).toLocaleString()}

                                            </td>

                                            {/* Follow Up */}

                                            <td>

                                                {

                                                    lead.followUpDate

                                                        ?

                                                        new Date(
                                                            lead.followUpDate
                                                        ).toLocaleDateString()

                                                        :

                                                        "--"

                                                }

                                            </td>

                                            {/* Assign */}

                                            <td>

                                                {

                                                    lead.assignTo || "--"

                                                }

                                            </td>

                                            {/* Created */}

                                            <td>

                                                {

                                                    lead.createdAt

                                                        ?

                                                        new Date(
                                                            lead.createdAt
                                                        ).toLocaleDateString()

                                                        :

                                                        "--"

                                                }

                                            </td>

                                            {/* Action */}

                                            <td>

                                                <div className="flex justify-center gap-2">

                                                    <Link
                                                        to={`/leads/${lead._id}`}
                                                        className="btn btn-sm btn-info text-white tooltip"
                                                        data-tip="View"
                                                    >
                                                        <FaEye />
                                                    </Link>

                                                    <Link
                                                        to={`/edit-lead/${lead._id}`}
                                                        className="btn btn-sm btn-warning tooltip"
                                                        data-tip="Edit"
                                                    >
                                                        <FaEdit />
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(lead._id)}
                                                        className="btn btn-sm btn-error text-white tooltip"
                                                        data-tip="Delete"
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

            <div className="flex justify-between items-center mt-6">

                <p className="text-sm text-gray-500">

                    Showing

                    <span className="font-bold mx-1">

                        {paginatedLeads.length}

                    </span>

                    of

                    <span className="font-bold mx-1">

                        {leads.length}

                    </span>

                    leads

                </p>

                <div className="join">

                    <button
                        className="join-item btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <FaAngleLeft />
                    </button>

                    {
                        [...Array(totalPages)].map((_, index) => (

                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`join-item btn ${currentPage === index + 1
                                        ? "btn-primary"
                                        : ""
                                    }`}
                            >

                                {index + 1}

                            </button>

                        ))
                    }

                    <button
                        className="join-item btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <FaAngleRight />
                    </button>

                </div>

            </div>

        </div>

    );
};

export default Leads;
