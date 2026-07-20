import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import {
    FaSearch,
    FaBell,
    FaClock,
    FaExclamationTriangle,
    FaCalendarCheck,
    FaEdit,
    FaEye,
    FaUserTag,
    FaPhoneAlt
} from "react-icons/fa";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const dueStatusTabs = [

    { value: "", label: "All" },

    { value: "overdue", label: "Overdue" },

    { value: "today", label: "Today" },

    { value: "upcoming", label: "Upcoming" }

];

const priorityBadgeColor = {

    "Low": "badge-secondary",

    "Medium": "badge-info",

    "High": "badge-warning",

    "Urgent": "badge-error"

};

const statusBadgeColor = {

    "New": "badge-info",

    "Contacted": "badge-primary",

    "In Progress": "badge-warning",

    "Proposal Sent": "badge-secondary",

    "Negotiation": "badge-accent",

    "Won": "badge-success",

    "Lost": "badge-error"

};

const FollowUpList = () => {

    const axiosSecure = useAxiosSecure();

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [dueStatus, setDueStatus] = useState("");

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [total, setTotal] = useState(0);

    /* ==========================================
            Load Follow-Up List
    ========================================== */

    const loadFollowUps = async () => {

        try {

            setLoading(true);

            const { data } = await axiosSecure.get("/leads/follow-up-list", {

                params: { page, limit, search, dueStatus }

            });

            setRows(data.data);

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

        loadFollowUps();

        // eslint-disable-next-line
    }, [page, search, dueStatus]);

    /* ==========================================
            Search / Tabs / Pagination
    ========================================== */

    const handleSearch = (e) => {

        setSearch(e.target.value);

        setPage(1);

    };

    const handleTabChange = (value) => {

        setDueStatus(value);

        setPage(1);

    };

    const totalPages = Math.ceil(total / limit);

    const handlePrevious = () => {

        if (page > 1) setPage(page - 1);

    };

    const handleNext = () => {

        if (page < totalPages) setPage(page + 1);

    };

    /* ==========================================
            Helpers
    ========================================== */

    const formatDate = (value) => {

        if (!value) return "-";

        return new Date(value).toLocaleDateString("en-US", {

            year: "numeric",

            month: "short",

            day: "numeric"

        });

    };

    /* ==========================================
            Due Badge
            (Overdue / Today / Upcoming — computed
            client-side from nextFollowUpDate so the
            colored pill matches the actual date)
    ========================================== */

    const getDueInfo = (dateValue) => {

        if (!dateValue) return { label: "-", color: "badge-ghost" };

        const due = new Date(dateValue);

        const now = new Date();

        const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {

            return { label: `Overdue ${Math.abs(diffDays)}d`, color: "badge-error" };

        }

        if (diffDays === 0) {

            return { label: "Due Today", color: "badge-warning" };

        }

        return { label: `In ${diffDays}d`, color: "badge-success" };

    };

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Follow-Up List</title>

            </Helmet>

            {/* ==========================================
                    Page Header
            ========================================== */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaBell className="text-primary" />

                        Follow-Up List

                    </h2>

                    <p className="text-gray-500 mt-1">

                        Companies due for a call or email, soonest first.

                    </p>

                </div>

                <div className="stats shadow border">

                    <div className="stat py-4">

                        <div className="stat-title">Total Due</div>

                        <div className="stat-value text-primary">{total}</div>

                    </div>

                </div>

            </div>

            {/* ==========================================
                    Filter Card
            ========================================== */}

            <div className="card bg-base-100 border shadow mb-6">

                <div className="card-body">

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                        {/* Due Status Tabs */}

                        <div className="join">

                            {

                                dueStatusTabs.map(tab => (

                                    <button
                                        key={tab.value}
                                        onClick={() => handleTabChange(tab.value)}
                                        className={`join-item btn btn-sm ${dueStatus === tab.value ? "btn-primary" : "btn-outline"}`}
                                    >

                                        {tab.label}

                                    </button>

                                ))

                            }

                        </div>

                        {/* Search */}

                        <label className="input input-bordered flex items-center gap-3 w-full lg:w-80">

                            <FaSearch className="text-gray-500" />

                            <input
                                type="text"
                                className="grow"
                                placeholder="Search by client, project, contact..."
                                value={search}
                                onChange={handleSearch}
                            />

                        </label>

                    </div>

                </div>

            </div>

            {/* ==========================================
                    Follow-Up Table
            ========================================== */}

            <div className="overflow-x-auto bg-base-100 border rounded-xl shadow">

                <table className="table table-zebra">

                    <thead>

                        <tr>

                            <th>Due Days</th>

                            <th>Client</th>

                            <th>Project / Solution</th>

                            <th>Priority</th>

                            <th>Category</th>

                            <th>Status</th>

                            <th>Last Follow-up</th>

                            <th>Next Follow-up</th>

                            <th>Contact Person</th>

                            <th>Assigned</th>

                            <th className="text-center">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            loading ?

                                <tr>

                                    <td colSpan="11" className="text-center py-12">

                                        <span className="loading loading-spinner loading-lg text-primary"></span>

                                    </td>

                                </tr>

                                :

                                rows.length === 0 ?

                                    <tr>

                                        <td colSpan="11" className="text-center py-12 text-gray-500">

                                            <FaCalendarCheck className="mx-auto text-3xl mb-2 opacity-40" />

                                            Nothing due — all caught up!

                                        </td>

                                    </tr>

                                    :

                                    rows.map((row) => {

                                        const dueInfo = getDueInfo(row.nextFollowUpDate);

                                        return (

                                            <tr key={row._id}>

                                                {/* Due */}

                                                <td>

                                                    <span className={` ${dueInfo.color} gap-1`}>

                                                        {

                                                            dueInfo.color === "badge-error" && <FaExclamationTriangle />

                                                        }

                                                        {dueInfo.label}

                                                    </span>

                                                </td>

                                                {/* Client */}

                                                <td className="font-bold">

                                                    {row.organizationInfo?.organizationName || "-"}

                                                </td>

                                                {/* Project */}

                                                <td>

                                                    <div>{row.project || "-"}</div>

                                                    {/* {

                                                        row.leadTopic && (

                                                            <div className="text-xs text-gray-500">{row.leadTopic}</div>

                                                        )

                                                    } */}

                                                </td>

                                                {/* Priority */}

                                                <td>

                                                    <span className={`badge ${priorityBadgeColor[row.priority] || "badge-ghost"}`}>

                                                        {row.priority || "-"}

                                                    </span>

                                                </td>

                                                {/* Category */}

                                                <td>{row.category || "-"}</td>

                                                {/* Status */}

                                                <td>

                                                    <span className={`${statusBadgeColor[row.leadStatus] || "badge-ghost"}`}>

                                                        {row.leadStatus || "-"}

                                                    </span>

                                                </td>

                                                {/* Last Follow-up */}

                                                <td>

                                                    <div className="text-sm">{formatDate(row.lastInteractionDate)}</div>

                                                    <div className="text-xs text-gray-500">

                                                        {row.lastMethod || "-"}

                                                        {row.lastResult ? ` • ${row.lastResult}` : ""}

                                                    </div>

                                                </td>

                                                {/* Next Follow-up */}

                                                <td>

                                                    <div className="text-sm font-medium">{formatDate(row.nextFollowUpDate)}</div>

                                                    <div className="text-xs text-gray-500 flex items-center gap-1">

                                                        <FaPhoneAlt className="text-[10px]" />

                                                        {row.nextMethod || "-"}

                                                    </div>

                                                </td>

                                                {/* Contact Person */}

                                                <td>{row.followUpContactPerson || "-"}</td>

                                                {/* Assigned To */}

                                                <td>

                                                    <span className="flex items-center gap-1">

                                                        <FaUserTag className="text-gray-400" />

                                                        {row.followUpAssignedTo || "-"}

                                                    </span>

                                                </td>

                                                {/* Action */}

                                                <td>

                                                    <div className="flex justify-center gap-2">

                                                        <Link
                                                            to={`/leads/${row._id}`}
                                                            className="btn btn-info btn-sm text-white"
                                                            title="View Lead"
                                                        >

                                                            <FaEye />

                                                        </Link>

                                                        <Link
                                                            to={`/leads/update/${row._id}`}
                                                            className="btn btn-warning btn-sm text-white"
                                                            title="Update Lead"
                                                        >

                                                            <FaEdit />

                                                        </Link>

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

                        <div className="text-sm text-gray-500 flex items-center gap-2">

                            <FaClock />

                            Showing

                            <span className="font-semibold">

                                {total === 0 ? 0 : ((page - 1) * limit) + 1}

                            </span>

                            -

                            <span className="font-semibold">

                                {Math.min(page * limit, total)}

                            </span>

                            of

                            <span className="font-semibold">{total}</span>

                            follow-ups

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

export default FollowUpList;
