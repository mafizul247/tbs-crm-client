import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaArrowLeft,
    FaSave,
    FaPlus,
    FaTrash,
    FaBullseye,
    FaSitemap
} from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const priorityOptions = ["Low", "Medium", "High", "Urgent"];

const categoryOptions = ["Category 1", "Category 2", "Category 3", "Category 4"];

const leadStatusOptions = [
    "New", "Contacted", "In Progress", "Proposal Sent", "Negotiation", "Won", "Lost"
];

const leadSourceOptions = [
    "Website", "Referral", "Cold Call", "Social Media", "Email Campaign", "Existing Client", "Other"
];

const CreateLead = () => {

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    /* ==========================================
            Dropdown Data
    ========================================== */

    const [organizationOptions, setOrganizationOptions] = useState([]);

    const [assignToOptions, setAssignToOptions] = useState([]);

    const [availableContacts, setAvailableContacts] = useState([]);

    /* ==========================================
            Main Form State
    ========================================== */

    const [formData, setFormData] = useState({

        /* Lead Information */

        leadTopic: "",

        description: "",

        organization: null,

        /* parentOrganization is now DERIVED
           from the selected organization's own
           parent — not independently selectable */

        parentOrganizationId: "",

        parentOrganizationName: "",

        branch: "",

        project: "",

        referenceNo: "",

        /* Opportunity Details */

        priority: "Medium",

        category: "",

        leadStatus: "New",

        /* Financial Information */

        estimatedCost: "",

        proposedCost: "",

        actualCost: "",

        /* Additional Information */

        leadStartDate: null,

        followUpDate: null,

        assignTo: null,

        leadSource: ""

    });

    /* ==========================================
            Contact List (multi-select, from org)
    ========================================== */

    const [selectedContacts, setSelectedContacts] = useState([]);

    /* ==========================================
            Documents (dynamic array)
    ========================================== */

    const [documents, setDocuments] = useState([

        { documentName: "", file: null }

    ]);

    const [notes, setNotes] = useState("");

    /* ==========================================
            Load Organizations + Assignees
            (organizations now include
            parentOrganization + parentOrganizationName)
    ========================================== */

    useEffect(() => {

        axiosSecure.get("/organizations/dropdown/list")
            .then(({ data }) => {

                const options = data.data.map(org => ({

                    value: org._id,

                    label: org.organizationName,

                    contactPersons: org.contactPersons || [],

                    parentOrganization: org.parentOrganization || null,

                    parentOrganizationName: org.parentOrganizationName || ""

                }));

                setOrganizationOptions(options);

            })
            .catch(error => console.log(error));

        axiosSecure.get("/users/dropdown/list")
            .then(({ data }) => {

                const options = data.data.map(u => ({

                    value: u.email,

                    label: `${u.name} (${u.role})`

                }));

                setAssignToOptions(options);

            })
            .catch(error => console.log(error));

    }, [axiosSecure]);

    /* ==========================================
            When Organization Changes
            -> Load its Contact Persons
            -> Auto-derive its Parent Organization
               (if it has one, show it; if not,
               show "No Parent Organization found")
    ========================================== */

    const handleOrganizationChange = (selected) => {

        setFormData(prev => ({

            ...prev,

            organization: selected,

            parentOrganizationId: selected?.parentOrganization || "",

            parentOrganizationName: selected?.parentOrganizationName || ""

        }));

        setAvailableContacts(

            selected

                ? selected.contactPersons.map((c, index) => ({

                    value: index,

                    label: `${c.contactPerson} (${c.designation || "N/A"}) - ${c.mobile || "-"} - ${c.email || "No Email"}`,

                    ...c

                }))

                : []

        );

        setSelectedContacts([]);

    };

    /* ==========================================
            Input Change
    ========================================== */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

    };

    /* ==========================================
            Handlers - Documents
    ========================================== */

    const handleDocumentNameChange = (index, value) => {

        const updated = [...documents];

        updated[index].documentName = value;

        setDocuments(updated);

    };

    const handleDocumentFileChange = (index, file) => {

        const updated = [...documents];

        updated[index].file = file;

        setDocuments(updated);

    };

    const addDocument = () => {

        setDocuments(prev => [...prev, { documentName: "", file: null }]);

    };

    const removeDocument = (index) => {

        setDocuments(prev => prev.filter((_, i) => i !== index));

    };

    /* ==========================================
            Submit
    ========================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.leadTopic || !formData.organization) {

            return Swal.fire({

                icon: "warning",

                title: "Missing Required Fields",

                text: "Lead Topic and Organization are required."

            });

        }

        try {

            setLoading(true);

            const payload = new FormData();

            /* Lead Information */

            payload.append("leadTopic", formData.leadTopic);

            payload.append("description", formData.description);

            payload.append("organization", formData.organization.value);

            /* Parent Organization is sent as-is from
               the selected organization's own parent —
               user never picks this independently */

            payload.append("parentOrganization", formData.parentOrganizationId || "");

            payload.append("branch", formData.branch);

            payload.append("project", formData.project);

            payload.append("referenceNo", formData.referenceNo);

            /* Opportunity Details */

            payload.append("priority", formData.priority);

            payload.append("category", formData.category);

            payload.append("leadStatus", formData.leadStatus);

            /* Financial Information */

            payload.append("estimatedCost", formData.estimatedCost || 0);

            payload.append("proposedCost", formData.proposedCost || 0);

            payload.append("actualCost", formData.actualCost || 0);

            /* Additional Information */

            payload.append(

                "leadStartDate",

                formData.leadStartDate ? formData.leadStartDate.toISOString() : ""

            );

            payload.append(

                "followUpDate",

                formData.followUpDate ? formData.followUpDate.toISOString() : ""

            );

            payload.append("assignTo", formData.assignTo ? formData.assignTo.value : "");

            payload.append("leadSource", formData.leadSource);

            /* Contact List */

            const contactListData = selectedContacts.map(c => ({

                contactPerson: c.contactPerson,

                designation: c.designation,

                mobile: c.mobile,

                phone: c.phone,

                email: c.email

            }));

            payload.append("contactList", JSON.stringify(contactListData));

            /* Documents */

            const validDocuments = documents.filter(d => d.file);

            const documentNames = validDocuments.map(d => d.documentName || d.file.name);

            payload.append("documentNames", JSON.stringify(documentNames));

            validDocuments.forEach(d => {

                payload.append("documents", d.file);

            });

            /* Notes */

            payload.append("notes", notes);

            const { data } = await axiosSecure.post(

                "/leads",

                payload,

                {

                    headers: { "Content-Type": "multipart/form-data" }

                }

            );

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Lead Created Successfully",

                    timer: 1800,

                    showConfirmButton: false

                });

                navigate("/leads");

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Creation Failed",

                text: error.response?.data?.message || error.message

            });

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Create Lead</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaBullseye className="text-primary" />

                        Create Lead

                    </h2>

                    <p className="text-gray-500">

                        Add a new lead / opportunity.

                    </p>

                </div>

                <Link to="/leads" className="btn btn-outline">

                    <FaArrowLeft />

                    Lead List

                </Link>

            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ==========================================
                        Lead Information
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Lead Information

                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            <div className="lg:col-span-2">

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Lead Topic *

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="leadTopic"
                                    className="input input-bordered w-full"
                                    placeholder="Lead Topic"
                                    value={formData.leadTopic}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="lg:col-span-2">

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Description

                                    </span>

                                </label>

                                <textarea
                                    name="description"
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Write the details of the topic description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Organization *

                                    </span>

                                </label>

                                <Select
                                    options={organizationOptions}
                                    value={formData.organization}
                                    onChange={handleOrganizationChange}
                                    placeholder="Select organization"
                                    classNamePrefix="react-select"
                                    isClearable
                                />

                            </div>

                            {/* ==========================================
                                    Parent Organization
                                    - Auto-derived from selected Organization
                                    - Read-only, NOT independently selectable
                                    - Shows "No Parent Organization found"
                                      when the org has none
                            ========================================== */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        <FaSitemap className="inline mr-1" />

                                        Parent Organization

                                    </span>

                                </label>

                                {

                                    !formData.organization ? (

                                        <div className="input input-bordered w-full flex items-center bg-base-200 text-gray-400">

                                            Select an organization first

                                        </div>

                                    ) : formData.parentOrganizationName ? (

                                        <div className="input input-bordered w-full flex items-center bg-base-200 font-medium">

                                            {formData.parentOrganizationName}

                                        </div>

                                    ) : (

                                        <div className="input input-bordered w-full flex items-center bg-base-200 text-gray-400">

                                            No Parent Organization found

                                        </div>

                                    )

                                }

                            </div>

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
                                    placeholder="e.g. Dhaka Branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Project / Solution

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="project"
                                    className="input input-bordered w-full"
                                    placeholder="Please write your product / solution name"
                                    value={formData.project}
                                    onChange={handleChange}
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Reference No.

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="referenceNo"
                                    className="input input-bordered w-full"
                                    placeholder="Write the reference no."
                                    value={formData.referenceNo}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Opportunity Details
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Opportunity Details

                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Priority</span>

                                </label>

                                <select
                                    name="priority"
                                    className="select select-bordered w-full"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >

                                    {

                                        priorityOptions.map(p => (

                                            <option key={p} value={p}>{p}</option>

                                        ))

                                    }

                                </select>

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Category</span>

                                </label>

                                <select
                                    name="category"
                                    className="select select-bordered w-full"
                                    value={formData.category}
                                    onChange={handleChange}
                                >

                                    <option value="">Select Category</option>

                                    {

                                        categoryOptions.map(c => (

                                            <option key={c} value={c}>{c}</option>

                                        ))

                                    }

                                </select>

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Lead Status</span>

                                </label>

                                <select
                                    name="leadStatus"
                                    className="select select-bordered w-full"
                                    value={formData.leadStatus}
                                    onChange={handleChange}
                                >

                                    {

                                        leadStatusOptions.map(s => (

                                            <option key={s} value={s}>{s}</option>

                                        ))

                                    }

                                </select>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Financial Information
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Financial Information

                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Estimated Cost</span>

                                </label>

                                <input
                                    type="number"
                                    name="estimatedCost"
                                    className="input input-bordered w-full"
                                    value={formData.estimatedCost}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Proposed Cost</span>

                                </label>

                                <input
                                    type="number"
                                    name="proposedCost"
                                    className="input input-bordered w-full"
                                    value={formData.proposedCost}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Actual Cost</span>

                                </label>

                                <input
                                    type="number"
                                    name="actualCost"
                                    className="input input-bordered w-full"
                                    value={formData.actualCost}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Additional Information
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Additional Information

                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            <div>

                                <label className="label mr-3">

                                    <span className="label-text font-semibold">Lead Start Date</span>

                                </label>

                                <DatePicker
                                    selected={formData.leadStartDate}
                                    onChange={(date) =>

                                        setFormData(prev => ({ ...prev, leadStartDate: date }))

                                    }
                                    className="input input-bordered w-full"
                                    placeholderText="Select start date"
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                />

                            </div>

                            <div>

                                <label className="label mr-3">

                                    <span className="label-text font-semibold">Follow-up Date</span>

                                </label>

                                <DatePicker
                                    selected={formData.followUpDate}
                                    onChange={(date) =>

                                        setFormData(prev => ({ ...prev, followUpDate: date }))

                                    }
                                    className="input input-bordered w-full"
                                    placeholderText="Select follow-up date"
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Assign To</span>

                                </label>

                                <Select
                                    options={assignToOptions}
                                    value={formData.assignTo}
                                    onChange={(selected) =>

                                        setFormData(prev => ({ ...prev, assignTo: selected }))

                                    }
                                    isClearable
                                    placeholder="Select team member"
                                    classNamePrefix="react-select"
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Lead Source</span>

                                </label>

                                <select
                                    name="leadSource"
                                    className="select select-bordered w-full"
                                    value={formData.leadSource}
                                    onChange={handleChange}
                                >

                                    <option value="">Select Source</option>

                                    {

                                        leadSourceOptions.map(s => (

                                            <option key={s} value={s}>{s}</option>

                                        ))

                                    }

                                </select>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Contact List
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Contact List

                        </h2>

                        {

                            !formData.organization ? (

                                <p className="text-gray-500">

                                    Select an organization first to choose its contact persons.

                                </p>

                            ) : availableContacts.length === 0 ? (

                                <p className="text-gray-500">

                                    This organization has no contact persons added.

                                </p>

                            ) : (

                                <>

                                    <Select
                                        options={availableContacts}
                                        value={selectedContacts}
                                        onChange={(selected) => setSelectedContacts(selected || [])}
                                        isMulti
                                        placeholder="Select contact person(s)"
                                        classNamePrefix="react-select"
                                    />

                                    {

                                        selectedContacts.length > 0 && (

                                            <div className="overflow-x-auto mt-4">

                                                <table className="table table-sm table-zebra">

                                                    <thead>

                                                        <tr>

                                                            <th>Name</th>

                                                            <th>Designation</th>

                                                            <th>Mobile</th>

                                                            <th>Email</th>

                                                        </tr>

                                                    </thead>

                                                    <tbody>

                                                        {

                                                            selectedContacts.map((c, index) => (

                                                                <tr key={index}>

                                                                    <td>{c.contactPerson}</td>

                                                                    <td>{c.designation || "-"}</td>

                                                                    <td>{c.mobile || "-"}</td>

                                                                    <td>{c.email || "-"}</td>

                                                                </tr>

                                                            ))

                                                        }

                                                    </tbody>

                                                </table>

                                            </div>

                                        )

                                    }

                                </>

                            )

                        }

                    </div>

                </div>

                {/* ==========================================
                        Documents
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="card-title text-primary">

                                Documents

                            </h2>

                            <button
                                type="button"
                                onClick={addDocument}
                                className="btn btn-sm btn-primary"
                            >

                                <FaPlus /> Add Document

                            </button>

                        </div>

                        {

                            documents.map((doc, index) => (

                                <div
                                    key={index}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4 border-b pb-4 last:border-0"
                                >

                                    <input
                                        type="text"
                                        placeholder="Document Name"
                                        className="input input-bordered w-full"
                                        value={doc.documentName}
                                        onChange={(e) => handleDocumentNameChange(index, e.target.value)}
                                    />

                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full"
                                        onChange={(e) => handleDocumentFileChange(index, e.target.files[0])}
                                    />

                                    {

                                        documents.length > 1 && (

                                            <button
                                                type="button"
                                                onClick={() => removeDocument(index)}
                                                className="btn btn-error btn-outline"
                                            >

                                                <FaTrash /> Remove

                                            </button>

                                        )

                                    }

                                </div>

                            ))

                        }

                    </div>

                </div>

                {/* ==========================================
                        Requirement / Notes
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Requirement / Notes

                        </h2>

                        <textarea
                            className="textarea textarea-bordered w-full"
                            rows={4}
                            placeholder="Describe the client's requirement..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline btn-error"
                    >

                        Cancel

                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >

                        {

                            loading

                                ? <span className="loading loading-spinner loading-sm"></span>

                                : <><FaSave /> Create Lead</>

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default CreateLead;