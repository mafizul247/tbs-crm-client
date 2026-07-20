import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaArrowLeft,
    FaSave,
    FaPlus,
    FaTrash,
    FaBullseye,
    FaSitemap,
    FaFileAlt
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

const UpdateLead = () => {

    const { id } = useParams();

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [fetching, setFetching] = useState(true);

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

        /* parentOrganization is DERIVED from the
           selected organization's own parent —
           not independently selectable, same as
           CreateLead */

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
            Contact List
            - existingContacts: already attached
              to this lead (from lead.contactList)
            - selectedNewContacts: additional ones
              picked from the organization's current
              contact persons (not already attached)
    ========================================== */

    const [existingContacts, setExistingContacts] = useState([]);

    const [selectedNewContacts, setSelectedNewContacts] = useState([]);

    /* ==========================================
            Documents
            - existingDocuments: already uploaded
            - newDocuments: new files to upload now
    ========================================== */

    const [existingDocuments, setExistingDocuments] = useState([]);

    const [newDocuments, setNewDocuments] = useState([

        { documentName: "", file: null }

    ]);

    const [notes, setNotes] = useState("");

    /* ==========================================
            Load Organizations + Assignees
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
            Load Existing Lead
            (waits for organizationOptions so the
            Organization <Select> can be pre-filled
            with the correct label + parent info)
    ========================================== */

    useEffect(() => {

        if (organizationOptions.length === 0) return;

        const loadLead = async () => {

            try {

                setFetching(true);

                const { data } = await axiosSecure.get(`/leads/${id}`);

                const lead = data.data;

                const matchedOrg = organizationOptions.find(

                    org => org.value === lead.organization

                ) || null;

                setFormData({

                    leadTopic: lead.leadTopic || "",

                    description: lead.description || "",

                    organization: matchedOrg,

                    parentOrganizationId: matchedOrg?.parentOrganization || "",

                    parentOrganizationName: matchedOrg?.parentOrganizationName || "",

                    branch: lead.branch || "",

                    project: lead.project || "",

                    referenceNo: lead.referenceNo || "",

                    priority: lead.priority || "Medium",

                    category: lead.category || "",

                    leadStatus: lead.leadStatus || "New",

                    estimatedCost: lead.estimatedCost || "",

                    proposedCost: lead.proposedCost || "",

                    actualCost: lead.actualCost || "",

                    leadStartDate: lead.leadStartDate ? new Date(lead.leadStartDate) : null,

                    followUpDate: lead.followUpDate ? new Date(lead.followUpDate) : null,

                    assignTo: lead.assignTo
                        ? (assignToOptions.find(u => u.value === lead.assignTo) || { value: lead.assignTo, label: lead.assignTo })
                        : null,

                    leadSource: lead.leadSource || ""

                });

                setExistingContacts(lead.contactList || []);

                setAvailableContacts(

                    matchedOrg

                        ? matchedOrg.contactPersons

                            .filter(c => !(lead.contactList || []).some(ec => ec.email === c.email))

                            .map((c, index) => ({

                                value: index,

                                label: `${c.contactPerson} (${c.designation || "N/A"}) - ${c.mobile || "-"} - ${c.email || "No Email"}`,

                                ...c

                            }))

                        : []

                );

                setExistingDocuments(lead.documents || []);

                setNotes(lead.notes || "");

            }
            catch (error) {

                console.log(error);

                Swal.fire({

                    icon: "error",

                    title: "Failed to Load Lead",

                    text: error.response?.data?.message || error.message

                });

                navigate("/leads");

            }
            finally {

                setFetching(false);

            }

        };

        loadLead();

        // eslint-disable-next-line
    }, [id, organizationOptions]);

    /* ==========================================
            When Organization Changes
            -> Re-derive its Parent Organization
            -> Reset available contacts to that
               organization's own contact persons
               (existingContacts stays as-is; user
               can remove stale ones manually if the
               organization was actually changed)
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

                ? selected.contactPersons

                    .filter(c => !existingContacts.some(ec => ec.email === c.email))

                    .map((c, index) => ({

                        value: index,

                        label: `${c.contactPerson} (${c.designation || "N/A"}) - ${c.mobile || "-"} - ${c.email || "No Email"}`,

                        ...c

                    }))

                : []

        );

        setSelectedNewContacts([]);

    };

    /* ==========================================
            Input Change
    ========================================== */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

    };

    /* ==========================================
            Handlers - Existing Contacts
    ========================================== */

    const removeExistingContact = (index) => {

        const removed = existingContacts[index];

        setExistingContacts(prev => prev.filter((_, i) => i !== index));

        /* Put it back into "available to add" if it
           belongs to the currently selected organization */

        if (formData.organization && removed) {

            const stillBelongs = formData.organization.contactPersons.some(

                c => c.email === removed.email

            );

            if (stillBelongs) {

                setAvailableContacts(prev => [

                    ...prev,

                    {

                        value: prev.length,

                        label: `${removed.contactPerson} (${removed.designation || "N/A"}) - ${removed.mobile || "-"} - ${removed.email || "No Email"}`,

                        ...removed

                    }

                ]);

            }

        }

    };

    /* ==========================================
            Handlers - Documents
    ========================================== */

    const removeExistingDocument = (index) => {

        setExistingDocuments(prev => prev.filter((_, i) => i !== index));

    };

    const handleNewDocNameChange = (index, value) => {

        const updated = [...newDocuments];

        updated[index].documentName = value;

        setNewDocuments(updated);

    };

    const handleNewDocFileChange = (index, file) => {

        const updated = [...newDocuments];

        updated[index].file = file;

        setNewDocuments(updated);

    };

    const addNewDocument = () => {

        setNewDocuments(prev => [...prev, { documentName: "", file: null }]);

    };

    const removeNewDocument = (index) => {

        setNewDocuments(prev => prev.filter((_, i) => i !== index));

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

            /* Contact List
               (existing ones kept/removed by the user,
               plus any newly selected from the org) */

            const newContactsData = selectedNewContacts.map(c => ({

                contactPerson: c.contactPerson,

                designation: c.designation,

                mobile: c.mobile,

                phone: c.phone,

                email: c.email

            }));

            const finalContactList = [...existingContacts, ...newContactsData];

            payload.append("contactList", JSON.stringify(finalContactList));

            /* Documents */

            payload.append("existingDocuments", JSON.stringify(existingDocuments));

            const validNewDocuments = newDocuments.filter(d => d.file);

            const newDocumentNames = validNewDocuments.map(d => d.documentName || d.file.name);

            payload.append("documentNames", JSON.stringify(newDocumentNames));

            validNewDocuments.forEach(d => {

                payload.append("documents", d.file);

            });

            /* Notes */

            payload.append("notes", notes);

            const { data } = await axiosSecure.patch(

                `/leads/${id}`,

                payload,

                {

                    headers: { "Content-Type": "multipart/form-data" }

                }

            );

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Lead Updated Successfully",

                    timer: 1800,

                    showConfirmButton: false

                });

                navigate(`/leads/${id}`);

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Update Failed",

                text: error.response?.data?.message || error.message

            });

        }
        finally {

            setLoading(false);

        }

    };

    if (fetching) {

        return (

            <div className="flex justify-center items-center py-20">

                <span className="loading loading-spinner loading-lg text-primary"></span>

            </div>

        );

    }

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Update Lead</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaBullseye className="text-primary" />

                        Update Lead

                    </h2>

                    <p className="text-gray-500">

                        Edit lead / opportunity information.

                    </p>

                </div>

                <Link to={`/leads/${id}`} className="btn btn-outline">

                    <FaArrowLeft />

                    Back to Lead Details

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
                                />

                            </div>

                            {/* ==========================================
                                    Parent Organization
                                    - Auto-derived, read-only, same
                                      behavior as CreateLead
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

                                    {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}

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

                                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}

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

                                    {leadStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}

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

                                <label className="label">

                                    <span className="label-text font-semibold">Lead Start Date</span>

                                </label>

                                <DatePicker
                                    selected={formData.leadStartDate}
                                    onChange={(date) => setFormData(prev => ({ ...prev, leadStartDate: date }))}
                                    className="input input-bordered w-full"
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Follow-up Date</span>

                                </label>

                                <DatePicker
                                    selected={formData.followUpDate}
                                    onChange={(date) => setFormData(prev => ({ ...prev, followUpDate: date }))}
                                    className="input input-bordered w-full"
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
                                    onChange={(selected) => setFormData(prev => ({ ...prev, assignTo: selected }))}
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

                                    {leadSourceOptions.map(s => <option key={s} value={s}>{s}</option>)}

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

                            existingContacts.length === 0 ? (

                                <p className="text-gray-500 mb-4">

                                    No contacts currently attached.

                                </p>

                            ) : (

                                <div className="overflow-x-auto mb-5">

                                    <table className="table table-sm table-zebra">

                                        <thead>

                                            <tr>

                                                <th>Name</th>

                                                <th>Designation</th>

                                                <th>Mobile</th>

                                                <th>Email</th>

                                                <th></th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {

                                                existingContacts.map((c, index) => (

                                                    <tr key={index}>

                                                        <td className="font-semibold">{c.contactPerson}</td>

                                                        <td>{c.designation || "-"}</td>

                                                        <td>{c.mobile || "-"}</td>

                                                        <td>{c.email || "-"}</td>

                                                        <td>

                                                            <button
                                                                type="button"
                                                                onClick={() => removeExistingContact(index)}
                                                                className="btn btn-xs btn-error btn-outline"
                                                            >

                                                                <FaTrash />

                                                            </button>

                                                        </td>

                                                    </tr>

                                                ))

                                            }

                                        </tbody>

                                    </table>

                                </div>

                            )

                        }

                        {

                            !formData.organization ? null : availableContacts.length === 0 ? (

                                <p className="text-sm text-gray-500">

                                    No more contacts available to add from this organization.

                                </p>

                            ) : (

                                <div>

                                    <label className="label">

                                        <span className="label-text font-semibold">Add More Contacts</span>

                                    </label>

                                    <Select
                                        options={availableContacts}
                                        value={selectedNewContacts}
                                        onChange={(selected) => setSelectedNewContacts(selected || [])}
                                        isMulti
                                        placeholder="Select contact person(s) to add"
                                        classNamePrefix="react-select"
                                    />

                                </div>

                            )

                        }

                    </div>

                </div>

                {/* ==========================================
                        Existing Documents
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Existing Documents

                        </h2>

                        {

                            existingDocuments.length === 0 ? (

                                <p className="text-gray-500 mb-2">

                                    No existing documents.

                                </p>

                            ) : (

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">

                                    {

                                        existingDocuments.map((doc, index) => (

                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-3 border rounded-lg p-4"
                                            >

                                                <div className="flex items-center gap-3 overflow-hidden">

                                                    <FaFileAlt className="text-primary text-xl shrink-0" />

                                                    <Link
                                                        to={`${import.meta.env.VITE_API_BASE_URL}${doc.fileUrl}`}
                                                        target="_blank"
                                                        reloadDocument
                                                        className="font-medium truncate link"
                                                    >

                                                        {doc.documentName}

                                                    </Link>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingDocument(index)}
                                                    className="btn btn-error btn-sm btn-square shrink-0"
                                                >

                                                    <FaTrash />

                                                </button>

                                            </div>

                                        ))

                                    }

                                </div>

                            )

                        }

                        <p className="text-xs text-gray-500">

                            Removing a document here will delete it permanently after you save.

                        </p>

                    </div>

                </div>

                {/* ==========================================
                        Add New Documents
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="card-title text-primary">

                                Add New Documents

                            </h2>

                            <button
                                type="button"
                                onClick={addNewDocument}
                                className="btn btn-sm btn-primary"
                            >

                                <FaPlus /> Add Document

                            </button>

                        </div>

                        {

                            newDocuments.map((doc, index) => (

                                <div
                                    key={index}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4 border-b pb-4 last:border-0"
                                >

                                    <input
                                        type="text"
                                        placeholder="Document Name"
                                        className="input input-bordered w-full"
                                        value={doc.documentName}
                                        onChange={(e) => handleNewDocNameChange(index, e.target.value)}
                                    />

                                    <input
                                        type="file"
                                        className="file-input file-input-bordered w-full"
                                        onChange={(e) => handleNewDocFileChange(index, e.target.files[0])}
                                    />

                                    {

                                        newDocuments.length > 1 && (

                                            <button
                                                type="button"
                                                onClick={() => removeNewDocument(index)}
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

                                : <><FaSave /> Update Lead</>

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default UpdateLead;