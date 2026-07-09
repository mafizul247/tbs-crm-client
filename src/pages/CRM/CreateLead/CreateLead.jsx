import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import {
    FaArrowLeft,
    FaClipboardList,
    FaBuilding,
    FaProjectDiagram,
    FaFileAlt,
    FaUsers,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";


const CreateLead = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({

        topic: "",
        description: "",
        organization: "",
        branch: "",
        project: "",
        reference: "",
        priority: "",
        category: "",
        leadStatus: "",
        estimatedCost: "",
        proposedCost: "",
        actualCost: "",
        leadStartDate: "",
        followUpDate: "",
        assignTo: "",
        leadSource: "",
        requirement: "",

    });

    const loadClients = async () => {
        setLoading(true)
        const { data } = await axiosSecure.get('/clients')
        setClients(data.data);
        setLoading(false)
    }

    useEffect(() => {
        loadClients();
    }, [])

    /*  useEffect(() => {
         fetch("http://localhost:5000/organization")
             .then(res => res.json())
             .then(data => {
                 setClients(data)
             })
     }, []) */


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData)

        if (!formData.topic.trim()) {
            return Swal.fire({
                icon: "warning",
                title: "Lead Topic Required",
                text: "Please enter the lead topic.",
            });
        }

        if (!formData.organization) {
            return Swal.fire({
                icon: "warning",
                title: "Organization Required",
                text: "Please select an organization.",
            });
        }

        if (!formData.project) {
            return Swal.fire({
                icon: "warning",
                title: "Project Required",
                text: "Please select a project/solution.",
            });
        }

        try {
            setLoading(true);

            const leadData = {
                ...formData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const { data } = await axiosSecure.post("/create-lead", leadData);
            console.log(data)
            if (data.insertedId || data.success) {

                Swal.fire({
                    icon: "success",
                    title: "Lead Created",
                    text: "Lead has been created successfully.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                setFormData({
                    topic: "",
                    description: "",

                    organization: "",

                    branch: "",

                    project: "",

                    reference: "",

                    priority: "",
                    category: "",
                    leadStatus: "",

                    estimatedCost: "",
                    proposedCost: "",
                    actualCost: "",

                    leadStartDate: "",
                    followUpDate: "",

                    assignTo: "",
                    leadSource: "",

                    requirement: "",
                });
            }
        } catch (error) {

            console.log(error);

            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.response?.data?.message || "Something went wrong.",
            });

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="p-6">

            <Helmet>
                <title>PMS || Create Lead</title>
            </Helmet>

            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold">
                        Create New Lead
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Create a new sales opportunity for your CRM pipeline.
                    </p>

                </div>

                {/* <Link
                    to="/leads"
                    className="btn btn-outline"
                >
                    <FaArrowLeft />
                    Back
                </Link> */}

                <Link
                    to="/leads"
                    className="btn btn-primary btn-outline "
                >
                    <FaArrowLeft />
                    Leads
                </Link>

            </div>

            <form onSubmit={handleSubmit}>

                {/* ======================================================
                        Lead Information
                ======================================================= */}

                <div className="card bg-base-100 border shadow-md">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-4">

                            <FaClipboardList />

                            Lead Information

                        </h2>

                        <div className="grid lg:grid-cols-2 gap-5">

                            {/* Topic */}

                            <div className="lg:col-span-2">

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Lead Topic
                                        <span className="text-error"> *</span>

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="topic"
                                    className="input input-bordered w-full"
                                    placeholder="Enter lead topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Description */}

                            <div className="lg:col-span-2">

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Description

                                    </span>

                                </label>

                                <textarea
                                    rows="4"
                                    name="description"
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Write a short description..."
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>

                            </div>

                            {/* Organization */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        <FaBuilding className="inline mr-2" />

                                        Organization

                                    </span>

                                </label>

                                <select
                                    name="organization"
                                    className="select select-bordered w-full"
                                    value={formData.organization}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Organization
                                    </option>

                                    {
                                        clients?.map(client =>
                                            <option key={client._id} value={client.companyName}>
                                                {client.companyName}
                                            </option>
                                        )
                                    }

                                </select>

                            </div>

                            {/* Branch */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Branch

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="branch"
                                    className="input input-bordered w-full"
                                    placeholder="Branch Name"
                                    value={formData.branch}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Project */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        <FaProjectDiagram className="inline mr-2" />

                                        Project / Solution

                                    </span>

                                </label>

                                <select
                                    name="project"
                                    className="select select-bordered w-full"
                                    value={formData.project}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Project
                                    </option>

                                    <option value="ERP">
                                        ERP System
                                    </option>

                                    <option value="HRM">
                                        HR Management
                                    </option>

                                    <option value="Accounting">
                                        Accounting Software
                                    </option>

                                    <option value="CRM">
                                        CRM
                                    </option>

                                    <option value="Website">
                                        Website Development
                                    </option>

                                    <option value="Mobile App">
                                        Mobile App
                                    </option>

                                    <option value="Other">
                                        Others
                                    </option>

                                </select>

                            </div>

                            {/* Reference */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        <FaFileAlt className="inline mr-2" />

                                        Reference No.

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="reference"
                                    className="input input-bordered w-full"
                                    placeholder="Enter reference number"
                                    value={formData.reference}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>

                </div>
                {/* ======================================================
                        Opportunity Details
                ======================================================= */}

                <div className="card bg-base-100 border shadow-md mt-6">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-4">

                            🎯 Opportunity Details

                        </h2>

                        <div className="grid lg:grid-cols-3 gap-5">

                            {/* Priority */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        🔥 Priority

                                    </span>

                                </label>

                                <select
                                    name="priority"
                                    className="select select-bordered w-full"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Priority
                                    </option>

                                    <option value="High">
                                        🟢 High
                                    </option>

                                    <option value="Medium">
                                        🟡 Medium
                                    </option>

                                    <option value="Low">
                                        🟠 Low
                                    </option>

                                    <option value="Critical">
                                        🔴 Critical
                                    </option>

                                </select>

                            </div>

                            {/* Category */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        📂 Category

                                    </span>

                                </label>

                                <select
                                    name="category"
                                    className="select select-bordered w-full"
                                    value={formData.category}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="Category 1">
                                        Category 1
                                    </option>

                                    <option value="Category 2">
                                        Category 2
                                    </option>

                                    <option value="Category 3">
                                        Category 3
                                    </option>

                                    <option value="Category 4">
                                        Category 4
                                    </option>

                                </select>

                            </div>

                            {/* Lead Status */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        📌 Lead Status

                                    </span>

                                </label>

                                <select
                                    name="leadStatus"
                                    className="select select-bordered w-full"
                                    value={formData.leadStatus}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Status
                                    </option>

                                    <option value="New">
                                        New
                                    </option>

                                    <option value="Qualified">
                                        Qualified
                                    </option>

                                    <option value="Proposal Sent">
                                        Proposal Sent
                                    </option>

                                    <option value="Negotiation">
                                        Negotiation
                                    </option>

                                    <option value="Won">
                                        Won
                                    </option>

                                    <option value="Lost">
                                        Lost
                                    </option>

                                    <option value="Ongoing">
                                        Ongoing
                                    </option>

                                    <option value="On Hold">
                                        On Hold
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ======================================================
                        Financial Information
                ======================================================= */}

                <div className="card bg-base-100 border shadow-md mt-6">

                    <div className="card-body">

                        <h2 className="card-title text-success mb-4">

                            💰 Financial Information

                        </h2>

                        <div className="grid lg:grid-cols-3 gap-5">

                            {/* Estimated Cost */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Estimated Cost

                                    </span>

                                </label>

                                <input
                                    type="number"
                                    name="estimatedCost"
                                    className="input input-bordered w-full"
                                    placeholder="0.00"
                                    value={formData.estimatedCost}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Proposed Cost */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Proposed Cost

                                    </span>

                                </label>

                                <input
                                    type="number"
                                    name="proposedCost"
                                    className="input input-bordered w-full"
                                    placeholder="0.00"
                                    value={formData.proposedCost}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Actual Cost */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Actual Cost

                                    </span>

                                </label>

                                <input
                                    type="number"
                                    name="actualCost"
                                    className="input input-bordered w-full"
                                    placeholder="0.00"
                                    value={formData.actualCost}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        {/* Summary */}

                        <div className="stats shadow border mt-8 w-full">

                            <div className="stat">

                                <div className="stat-title">
                                    Estimated
                                </div>

                                <div className="stat-value text-primary text-2xl">

                                    ৳ {formData.estimatedCost || 0}

                                </div>

                            </div>

                            <div className="stat">

                                <div className="stat-title">
                                    Proposed
                                </div>

                                <div className="stat-value text-secondary text-2xl">

                                    ৳ {formData.proposedCost || 0}

                                </div>

                            </div>

                            <div className="stat">

                                <div className="stat-title">
                                    Actual
                                </div>

                                <div className="stat-value text-success text-2xl">

                                    ৳ {formData.actualCost || 0}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
                {/* ======================================================
                        Additional Information
                ======================================================= */}

                <div className="card bg-base-100 border shadow-md mt-6">

                    <div className="card-body">

                        <h2 className="card-title text-accent mb-4">

                            📝 Additional Information

                        </h2>

                        <div className="grid lg:grid-cols-2 gap-5">

                            {/* Expected Closing Date */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        📅 Lead Start Date

                                    </span>

                                </label>

                                <input
                                    type="date"
                                    name="leadStartDate"
                                    className="input input-bordered w-full"
                                    value={formData.leadStartDate || ""}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Follow Up Date */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        📞 Follow-up Date

                                    </span>

                                </label>

                                <input
                                    type="date"
                                    name="followUpDate"
                                    className="input input-bordered w-full"
                                    value={formData.followUpDate || ""}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Assign To */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        👤 Assign To

                                    </span>

                                </label>

                                <select
                                    name="assignTo"
                                    className="select select-bordered w-full"
                                    value={formData.assignTo || ""}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select User
                                    </option>

                                    <option value="Admin">
                                        Admin
                                    </option>

                                    <option value="Sales Manager">
                                        Sales Manager
                                    </option>

                                    <option value="Business Executive">
                                        Business Executive
                                    </option>

                                    <option value="Marketing Officer">
                                        Marketing Officer
                                    </option>

                                </select>

                            </div>

                            {/* Lead Source */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        🌐 Lead Source

                                    </span>

                                </label>

                                <select
                                    name="leadSource"
                                    className="select select-bordered w-full"
                                    value={formData.leadSource || ""}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Source
                                    </option>

                                    <option value="Website">
                                        Website
                                    </option>

                                    <option value="Facebook">
                                        Facebook
                                    </option>

                                    <option value="LinkedIn">
                                        LinkedIn
                                    </option>

                                    <option value="Email">
                                        Email
                                    </option>

                                    <option value="Phone Call">
                                        Phone Call
                                    </option>

                                    <option value="Referral">
                                        Referral
                                    </option>

                                    <option value="Existing Client">
                                        Existing Client
                                    </option>

                                    <option value="Exhibition">
                                        Exhibition
                                    </option>

                                    <option value="Tender">
                                        Tender
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ======================================================
                        Requirement / Notes
                ======================================================= */}

                <div className="card bg-base-100 border shadow-md mt-6">

                    <div className="card-body">

                        <h2 className="card-title text-info mb-4">

                            📄 Requirement / Notes

                        </h2>

                        <textarea
                            rows="6"
                            name="requirement"
                            className="textarea textarea-bordered w-full"
                            placeholder="Write lead requirements, meeting summary, client expectations, project scope or any important notes..."
                            value={formData.requirement}
                            onChange={handleChange}
                        ></textarea>

                    </div>

                </div>


                {/* ======================================================
                        Action Buttons
                ======================================================= */}

                <div className="flex flex-col md:flex-row justify-end gap-3 mt-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline btn-error"
                    >
                        Cancle
                    </button>

                    {/* <button
                        type="reset"
                        className="btn btn-outline"
                    >
                        Reset
                    </button> */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >

                        {
                            loading ?

                                <span className="loading loading-spinner loading-sm"></span>

                                :

                                "Save Lead"

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default CreateLead;