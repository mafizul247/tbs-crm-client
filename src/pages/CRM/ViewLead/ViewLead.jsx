import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router";

import {
    FaArrowLeft,
    FaClipboardList,
    FaBuilding,
    FaProjectDiagram,
    FaFileAlt,
    FaUserTie
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const ViewLead = () => {

    const { id } = useParams();

    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(true);

    const [lead, setLead] = useState({});

    useEffect(() => {

        loadLead();

    }, [id]);

    const loadLead = async () => {

        try {

            setLoading(true);

            const { data } = await axiosSecure.get(`/leads/${id}`);

            setLead(data);

        }
        catch (error) {

            console.log(error);

        }
        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-[60vh]">

                <span className="loading loading-spinner loading-lg"></span>

            </div>

        );

    }

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || View Lead</title>

            </Helmet>

            {/* ==========================================
                    Header
            ========================================== */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold">

                        Lead Details

                    </h2>

                    <p className="text-gray-500 mt-1">

                        View complete lead information.

                    </p>

                </div>

                <Link
                    to="/leads"
                    className="btn btn-outline"
                >

                    <FaArrowLeft />

                    Back

                </Link>

            </div>

            {/* ==========================================
                    Lead Information
            ========================================== */}

            <div className="card bg-base-100 shadow border">

                <div className="card-body">

                    <h2 className="card-title text-primary mb-6">

                        <FaClipboardList />

                        Lead Information

                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6">

                        {/* Topic */}

                        <div>

                            <label className="font-semibold">

                                Lead Topic

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {lead.topic || "--"}

                            </div>

                        </div>

                        {/* Reference */}

                        <div>

                            <label className="font-semibold">

                                Reference No.

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                <FaFileAlt className="inline mr-2" />

                                {lead.reference || "--"}

                            </div>

                        </div>

                        {/* Organization */}

                        <div>

                            <label className="font-semibold">

                                Organization

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                <FaBuilding className="inline mr-2" />

                                {lead.organization || "--"}

                            </div>

                        </div>

                        {/* Branch */}

                        <div>

                            <label className="font-semibold">

                                Branch

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {lead.branch || "--"}

                            </div>

                        </div>

                        {/* Project */}

                        <div>

                            <label className="font-semibold">

                                Project / Solution

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                <FaProjectDiagram className="inline mr-2" />

                                {lead.project || "--"}

                            </div>

                        </div>

                        {/* Assigned To */}

                        <div>

                            <label className="font-semibold">

                                Assigned To

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                <FaUserTie className="inline mr-2" />

                                {lead.assignTo || "--"}

                            </div>

                        </div>

                        {/* Description */}

                        <div className="lg:col-span-2">

                            <label className="font-semibold">

                                Description

                            </label>

                            <div className="mt-2 p-4 border rounded-lg bg-base-200 min-h-28 whitespace-pre-line">

                                {lead.description || "--"}

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            {/* ==========================================
                    Opportunity Details
            ========================================== */}

            <div className="card bg-base-100 shadow border mt-6">

                <div className="card-body">

                    <h2 className="card-title text-secondary mb-6">

                        🎯 Opportunity Details

                    </h2>

                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* Priority */}

                        <div>

                            <label className="font-semibold">

                                Priority

                            </label>

                            <div className="mt-2">

                                <span
                                    className={`badge badge-lg
                                    ${lead.priority === "High"
                                            ? "badge-success"
                                            : lead.priority === "Medium"
                                                ? "badge-warning"
                                                : lead.priority === "Low"
                                                    ? "badge-error"
                                                    : "badge-secondary"
                                        }`}
                                >
                                    {lead.priority || "--"}
                                </span>

                            </div>

                        </div>

                        {/* Status */}

                        <div>

                            <label className="font-semibold">

                                Lead Status

                            </label>

                            <div className="mt-2">

                                <span
                                    className={`badge badge-lg
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
                                        }`}
                                >

                                    {lead.leadStatus || "--"}

                                </span>

                            </div>

                        </div>

                        {/* Category */}

                        <div>

                            <label className="font-semibold">

                                Category

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {lead.category || "--"}

                            </div>

                        </div>

                        {/* Lead Source */}

                        <div>

                            <label className="font-semibold">

                                Lead Source

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {lead.leadSource || "--"}

                            </div>

                        </div>

                        {/* Lead Started Date */}

                        <div>

                            <label className="font-semibold">

                                Lead Started Date

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {
                                    lead.leadStartDate
                                        ? new Date(
                                            lead.leadStartDate
                                        ).toLocaleDateString()
                                        : "--"
                                }

                            </div>

                        </div>

                        {/* Follow Up */}

                        <div>

                            <label className="font-semibold">

                                Follow-up Date

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {
                                    lead.followUpDate
                                        ? new Date(
                                            lead.followUpDate
                                        ).toLocaleDateString()
                                        : "--"
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                    Financial Information
            ========================================== */}

            <div className="card bg-base-100 shadow border mt-6">

                <div className="card-body">

                    <h2 className="card-title text-success mb-6">

                        💰 Financial Information

                    </h2>

                    <div className="grid lg:grid-cols-3 gap-5">

                        <div className="stat border rounded-lg">

                            <div className="stat-title">

                                Estimated Cost

                            </div>

                            <div className="stat-value text-primary text-2xl">

                                ৳ {Number(
                                    lead.estimatedCost || 0
                                ).toLocaleString()}

                            </div>

                        </div>

                        <div className="stat border rounded-lg">

                            <div className="stat-title">

                                Proposed Cost

                            </div>

                            <div className="stat-value text-warning text-2xl">

                                ৳ {Number(
                                    lead.proposedCost || 0
                                ).toLocaleString()}

                            </div>

                        </div>

                        <div className="stat border rounded-lg">

                            <div className="stat-title">

                                Actual Cost

                            </div>

                            <div className="stat-value text-success text-2xl">

                                ৳ {Number(
                                    lead.actualCost || 0
                                ).toLocaleString()}

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            {/* ==========================================
                    Requirement / Notes
            ========================================== */}

            <div className="card bg-base-100 shadow border mt-6">

                <div className="card-body">

                    <h2 className="card-title text-info mb-6">

                        📝 Requirement / Notes

                    </h2>

                    <div className="p-5 rounded-lg border bg-base-200 min-h-40 whitespace-pre-line">

                        {
                            lead.requirement || "No requirement or notes available."
                        }

                    </div>

                </div>

            </div>


            {/* ==========================================
                    System Information
            ========================================== */}

            <div className="card bg-base-100 shadow border mt-6">

                <div className="card-body">

                    <h2 className="card-title text-accent mb-6">

                        ⚙️ System Information

                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6">

                        {/* Created By */}

                        <div>

                            <label className="font-semibold">

                                Created By

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {lead.createdBy || "--"}

                            </div>

                        </div>

                        {/* Assigned To */}

                        <div>

                            <label className="font-semibold">

                                Assigned To

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {lead.assignTo || "--"}

                            </div>

                        </div>

                        {/* Created Date */}

                        <div>

                            <label className="font-semibold">

                                Created Date

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {

                                    lead.createdAt

                                        ?

                                        new Date(
                                            lead.createdAt
                                        ).toLocaleString()

                                        :

                                        "--"

                                }

                            </div>

                        </div>

                        {/* Updated Date */}

                        <div>

                            <label className="font-semibold">

                                Last Updated

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {

                                    lead.updatedAt

                                        ?

                                        new Date(
                                            lead.updatedAt
                                        ).toLocaleString()

                                        :

                                        "--"

                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                    Lead Conversion
            ========================================== */}

            <div className="card bg-base-100 shadow border mt-6">

                <div className="card-body">

                    <h2 className="card-title text-success mb-6">

                        🔄 Lead Conversion

                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6">

                        <div>

                            <label className="font-semibold">

                                Conversion Status

                            </label>

                            <div className="mt-2">

                                {

                                    lead.isConverted ?

                                        <span className="badge badge-success badge-lg">

                                            Converted

                                        </span>

                                        :

                                        <span className="badge badge-warning badge-lg">

                                            Not Converted

                                        </span>

                                }

                            </div>

                        </div>

                        <div>

                            <label className="font-semibold">

                                Client ID

                            </label>

                            <div className="mt-2 p-3 border rounded-lg bg-base-200">

                                {lead.clientId || "--"}

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                    Action Buttons
            ========================================== */}

            <div className="flex flex-col md:flex-row justify-end gap-3 mt-8">

                <Link
                    to="/leads"
                    className="btn btn-outline"
                >

                    <FaArrowLeft />

                    Back

                </Link>

                <Link
                    to={`/edit-lead/${lead._id}`}
                    className="btn btn-warning"
                >

                    Edit Lead

                </Link>

            </div>

        </div>

    );

};

export default ViewLead;