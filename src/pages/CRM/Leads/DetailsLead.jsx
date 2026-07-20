import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import Swal from "sweetalert2";
import {
    FaArrowLeft,
    FaEdit,
    FaPen,
    FaPlus,
    FaTimes,
    FaFileAlt,
    FaComments,
    FaEye,
    FaTrash,
    FaMoneyBillWave,
    FaBullseye,
    FaFolderOpen,
    FaThumbtack,
    FaCalendarAlt,
    FaUsers
} from "react-icons/fa";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

/* ==========================================
        Small Reusable Modal
========================================== */

const Modal = ({ title, onClose, children, wide }) => (

    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">

        <div className={`bg-base-100 rounded-xl shadow-xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}>

            <div className="flex justify-between items-center px-6 py-4 border-b">

                <h3 className="font-bold text-lg">{title}</h3>

                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">

                    <FaTimes />

                </button>

            </div>

            <div className="p-6">

                {children}

            </div>

        </div>

    </div>

);

const priorityOptions = ["Low", "Medium", "High", "Urgent"];

const categoryOptions = ["Category 1", "Category 2", "Category 3", "Category 4"];

const leadStatusOptions = [
    "New", "Contacted", "In Progress", "Proposal Sent", "Negotiation", "Won", "Lost"
];

const submissionTypeOptions = [
    "EOI", "RFP", "TP", "FP", "Both TP & FP", "Tender Document", "Contract", "Other"
];

const communicationMethods = [
    "Call", "Email", "In-Person Meeting", "Video Call", "WhatsApp", "SMS", "Letter", "Other"
];

const purposeOptions = [
    "Proposal Update", "Technical Meeting", "Cost Discussion", "Requirement Gathering",
    "Contract Discussion", "Follow-up Call", "Site Visit", "Other"
];

const resultOptions = [
    "Completed", "Need More Discussion", "No Response", "Reschedule", "Cancelled", "Other"
];

const decisionStatusOptions = [
    "Pending", "In Progress", "Positive", "Need Approval", "Not Interested", "On Hold", "Other"
];

const reminderOptions = [
    "1 Hour Before", "1 Day Before", "3 Days Before", "7 Days Before", "30 Days Before", "No Reminder"
];


const DetailsLead = () => {

    const { id } = useParams();

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const [lead, setLead] = useState(null);

    const [interactions, setInteractions] = useState([]);

    const [submissions, setSubmissions] = useState([]);

    const [loading, setLoading] = useState(true);

    /* ==========================================
            Which Modal Is Open
    ========================================== */

    const [activeModal, setActiveModal] = useState(null);

    const [saving, setSaving] = useState(false);

    /* ==========================================
            Quick Edit Form State
    ========================================== */

    const [quickForm, setQuickForm] = useState({});

    /* ==========================================
            Interaction Form State
    ========================================== */

    const [interactionForm, setInteractionForm] = useState({

        /* Follow-up */

        contactPerson: null,

        method: "",

        interactionDate: new Date(),

        interactionTime: "",

        purpose: "",

        result: "",

        decisionStatus: "",

        note: "",

        /* Next Follow-up Schedule */

        nextContactPerson: null,

        assignedTo: null,

        nextFollowUpDate: null,

        nextFollowUpTime: "",

        nextMethod: "",

        nextPurpose: "",

        reminder: "",

        actionNote: ""

    });

    const [viewingInteraction, setViewingInteraction] = useState(null);

    /* ==========================================
            Submission Form State
    ========================================== */

    const [submissionForm, setSubmissionForm] = useState({

        type: "",

        submitDate: null,

        dateSubmitted: null,

        remarks: ""

    });

    /* ==========================================
            Attachment Form State
    ========================================== */

    const [attachmentForm, setAttachmentForm] = useState({

        documentName: "",

        file: null

    });

    /* ==========================================
            Contact Form State
    ========================================== */

    const [selectedContact, setSelectedContact] = useState(null);

    const [remarks, setRemarks] = useState([]);

    const [newRemarkText, setNewRemarkText] = useState("");

    const [assignToOptions, setAssignToOptions] = useState([]);


    /* ==========================================
            Load Everything
    ========================================== */

    const loadLead = async () => {

        const { data } = await axiosSecure.get(`/leads/${id}`);

        setLead(data.data);

    };

    const loadInteractions = async () => {

        const { data } = await axiosSecure.get(`/interactions/lead/${id}`);

        setInteractions(data.data);

    };

    const loadSubmissions = async () => {

        const { data } = await axiosSecure.get(`/submissions/lead/${id}`);

        setSubmissions(data.data);

    };

    const loadRemarks = async () => {

        const { data } = await axiosSecure.get(`/remarks/lead/${id}`);

        setRemarks(data.data);

    };

    const loadAll = async () => {

        try {

            setLoading(true);

            await Promise.all([loadLead(), loadInteractions(), loadSubmissions(), loadRemarks()]);

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

            setLoading(false);

        }

    };

    useEffect(() => {

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

    useEffect(() => {

        loadAll();

        // eslint-disable-next-line
    }, [id]);

    /* ==========================================
        Contact Person options for Interaction
        (comes from THIS lead's Contact List,
        not the whole organization)
    ========================================== */

    const leadContactOptions = (lead?.contactList || []).map((c, index) => ({

        value: index,

        label: `${c.contactPerson} (${c.designation || "N/A"})`,

        contactPerson: c.contactPerson,

        email: c.email

    }));

    /* ==========================================
            Open Quick Edit Modal
    ========================================== */

    const openQuickEdit = (type) => {

        if (type === "costing") {

            setQuickForm({

                estimatedCost: lead.estimatedCost || 0,

                proposedCost: lead.proposedCost || 0,

                actualCost: lead.actualCost || 0

            });

        }
        else if (type === "priority") {

            setQuickForm({ priority: lead.priority || "Medium" });

        }
        else if (type === "category") {

            setQuickForm({ category: lead.category || "" });

        }
        else if (type === "status") {

            setQuickForm({ leadStatus: lead.leadStatus || "New" });

        }
        else if (type === "leadStart") {

            setQuickForm({

                leadStartDate: lead.leadStartDate ? new Date(lead.leadStartDate) : null

            });

        }

        setActiveModal(type);

    };

    /* ==========================================
            Save Quick Edit
    ========================================== */

    const saveQuickEdit = async () => {

        try {

            setSaving(true);

            const payload = { ...quickForm };

            if (payload.leadStartDate instanceof Date) {

                payload.leadStartDate = payload.leadStartDate.toISOString();

            }

            const { data } = await axiosSecure.patch(`/leads/quick-update/${id}`, payload);

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Updated",

                    timer: 1200,

                    showConfirmButton: false

                });

                setActiveModal(null);

                loadLead();

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

            setSaving(false);

        }

    };

    /* ==========================================
            Add Interaction
    ========================================== */

    const submitInteraction = async () => {

        if (!interactionForm.method || !interactionForm.contactPerson) {

            return Swal.fire({

                icon: "warning",

                title: "Contact Person and Method are required."

            });

        }

        try {

            setSaving(true);

            const payload = {

                leadId: id,

                contactPerson: interactionForm.contactPerson.contactPerson,

                contactPersonEmail: interactionForm.contactPerson.email,

                method: interactionForm.method,

                interactionDate: interactionForm.interactionDate
                    ? interactionForm.interactionDate.toISOString()
                    : null,

                interactionTime: interactionForm.interactionTime,

                purpose: interactionForm.purpose,

                result: interactionForm.result,

                decisionStatus: interactionForm.decisionStatus,

                note: interactionForm.note,

                nextContactPerson: interactionForm.nextContactPerson?.contactPerson || "",

                nextContactPersonEmail: interactionForm.nextContactPerson?.email || "",

                assignedTo: interactionForm.assignedTo?.value || "",

                nextFollowUpDate: interactionForm.nextFollowUpDate
                    ? interactionForm.nextFollowUpDate.toISOString()
                    : null,

                nextFollowUpTime: interactionForm.nextFollowUpTime,

                nextMethod: interactionForm.nextMethod,

                nextPurpose: interactionForm.nextPurpose,

                reminder: interactionForm.reminder,

                actionNote: interactionForm.actionNote

            };

            const { data } = await axiosSecure.post("/interactions", payload);

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Interaction Added",

                    timer: 1200,

                    showConfirmButton: false

                });

                setActiveModal(null);

                setInteractionForm({

                    contactPerson: null,

                    method: "",

                    interactionDate: new Date(),

                    interactionTime: "",

                    purpose: "",

                    result: "",

                    decisionStatus: "",

                    note: "",

                    nextContactPerson: null,

                    assignedTo: null,

                    nextFollowUpDate: null,

                    nextFollowUpTime: "",

                    nextMethod: "",

                    nextPurpose: "",

                    reminder: "",

                    actionNote: ""

                });

                loadInteractions();

                loadLead();

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Failed to Add Interaction",

                text: error.response?.data?.message || error.message

            });

        }
        finally {

            setSaving(false);

        }

    };

    /* ==========================================
            View Interaction
            (opens the details modal for one
            interaction from the table)
    ========================================== */

    const openViewInteraction = (interaction) => {

        setViewingInteraction(interaction);

        setActiveModal("viewInteraction");

    };

    /* ==========================================
            Delete Interaction
    ========================================== */

    const deleteInteraction = async (interactionId) => {

        Swal.fire({

            title: "Delete this interaction?",

            text: "This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Delete",

            cancelButtonText: "Cancel",

            confirmButtonColor: "#d33"

        }).then(async (result) => {

            if (!result.isConfirmed) return;

            try {

                const { data } = await axiosSecure.delete(`/interactions/${interactionId}`);

                if (data.success) {

                    Swal.fire({

                        icon: "success",

                        title: "Deleted",

                        text: "Interaction deleted successfully.",

                        timer: 1200,

                        showConfirmButton: false

                    });

                    loadInteractions();

                    loadLead();

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

    /* ==========================================
            Add Submission
    ========================================== */

    const submitSubmission = async () => {

        if (!submissionForm.type) {

            return Swal.fire({

                icon: "warning",

                title: "Submission Type is required."

            });

        }

        try {

            setSaving(true);

            const payload = {

                leadId: id,

                type: submissionForm.type,

                submitDate: submissionForm.submitDate
                    ? submissionForm.submitDate.toISOString()
                    : null,

                dateSubmitted: submissionForm.dateSubmitted
                    ? submissionForm.dateSubmitted.toISOString()
                    : null,

                remarks: submissionForm.remarks

            };

            const { data } = await axiosSecure.post("/submissions", payload);

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Submission Added",

                    timer: 1200,

                    showConfirmButton: false

                });

                setActiveModal(null);

                setSubmissionForm({

                    type: "",

                    submitDate: null,

                    dateSubmitted: null,

                    remarks: ""

                });

                loadSubmissions();

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Failed to Add Submission",

                text: error.response?.data?.message || error.message

            });

        }
        finally {

            setSaving(false);

        }

    };

    /* ==========================================
            Add Attachment
    ========================================== */

    const submitAttachment = async () => {

        if (!attachmentForm.file) {

            return Swal.fire({

                icon: "warning",

                title: "Please select a file."

            });

        }

        try {

            setSaving(true);

            const payload = new FormData();

            payload.append("attachment", attachmentForm.file);

            payload.append("documentName", attachmentForm.documentName || attachmentForm.file.name);

            const { data } = await axiosSecure.post(

                `/leads/${id}/attachment`,

                payload,

                { headers: { "Content-Type": "multipart/form-data" } }

            );

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Attachment Added",

                    timer: 1200,

                    showConfirmButton: false

                });

                setActiveModal(null);

                setAttachmentForm({ documentName: "", file: null });

                loadLead();

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Upload Failed",

                text: error.response?.data?.message || error.message

            });

        }
        finally {

            setSaving(false);

        }

    };

    /* ==========================================
            Add Contact
    ========================================== */

    const submitContact = async () => {

        if (!selectedContact) {

            return Swal.fire({

                icon: "warning",

                title: "Please select a contact."

            });

        }

        try {

            setSaving(true);

            const { data } = await axiosSecure.post(`/leads/${id}/contact`, {

                contactPerson: selectedContact.contactPerson,

                designation: selectedContact.designation,

                mobile: selectedContact.mobile,

                phone: selectedContact.phone,

                email: selectedContact.email

            });

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Contact Added",

                    timer: 1200,

                    showConfirmButton: false

                });

                setActiveModal(null);

                setSelectedContact(null);

                loadLead();

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Failed to Add Contact",

                text: error.response?.data?.message || error.message

            });

        }
        finally {

            setSaving(false);

        }

    };

    /* ==========================================
            Add Remark
    ========================================== */

    const submitRemark = async () => {

        if (!newRemarkText.trim()) {

            return Swal.fire({

                icon: "warning",

                title: "Remark text is required."

            });

        }

        try {

            setSaving(true);

            const { data } = await axiosSecure.post("/remarks", {

                leadId: id,

                text: newRemarkText.trim()

            });

            if (data.success) {

                setActiveModal(null);

                setNewRemarkText("");

                loadRemarks();

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Failed to Add Remark",

                text: error.response?.data?.message || error.message

            });

        }
        finally {

            setSaving(false);

        }

    };

    /* ==========================================
            Delete Remark
    ========================================== */

    const deleteRemark = async (remarkId) => {

        Swal.fire({

            title: "Delete this remark?",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Delete",

            confirmButtonColor: "#d33"

        }).then(async (result) => {

            if (!result.isConfirmed) return;

            try {

                const { data } = await axiosSecure.delete(`/remarks/${remarkId}`);

                if (data.success) {

                    loadRemarks();

                }

            }
            catch (error) {

                console.log(error);

            }

        });

    };

    /* ==========================================
            Remove Contact
    ========================================== */

    const removeContact = async (index) => {

        Swal.fire({

            title: "Remove this contact?",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Yes, Remove",

            confirmButtonColor: "#d33"

        }).then(async (result) => {

            if (!result.isConfirmed) return;

            try {

                const { data } = await axiosSecure.delete(`/leads/${id}/contact/${index}`);

                if (data.success) {

                    loadLead();

                }

            }
            catch (error) {

                console.log(error);

            }

        });

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

    const formatCurrency = (value) => {

        if (!value) return "0";

        return new Intl.NumberFormat("en-US").format(value);

    };

    const daysBetween = (date) => {

        if (!date) return null;

        const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

        return diff;

    };

    if (loading || !lead) {

        return (

            <div className="flex justify-center items-center py-20">

                <span className="loading loading-spinner loading-lg text-primary"></span>

            </div>

        );

    }

    /* ==========================================
            Available Contacts To Add
    ========================================== */

    const orgContacts = lead.organizationInfo?.contactPersons || [];

    const alreadyAddedEmails = (lead.contactList || []).map(c => c.email);

    const availableContactOptions = orgContacts

        .filter(c => !alreadyAddedEmails.includes(c.email))

        .map((c, index) => ({

            value: index,

            label: `${c.contactPerson} (${c.designation || "N/A"}) - ${c.email || "No Email"}`,

            ...c

        }));

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Lead Details</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <h2 className="text-3xl font-bold flex items-center gap-3">

                    <FaBullseye className="text-primary" />

                    Lead Details

                </h2>

                <div className="flex gap-3">

                    <Link to={`/leads/update/${id}`} className="btn btn-warning text-white">

                        <FaEdit /> Full Edit

                    </Link>

                    <Link to="/leads" className="btn btn-outline">

                        <FaArrowLeft /> Lead List

                    </Link>

                </div>

            </div>

            {/* ==========================================
                    Top Read-Only Summary
            ========================================== */}

            <div className="card bg-base-100 shadow border mb-4">

                <div className="card-body">

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <div>

                            <p className="text-xl text-gray-500">Topic</p>

                            <p className="font-bold text-lg">{lead.leadTopic}</p>

                        </div>

                        <div>

                            <p className="text-xl text-gray-500 ">Project</p>

                            <p className="font-bold text-lg">{lead.project || "-"}</p>

                        </div>

                        <div>

                            <p className="text-xl text-gray-500 ">Reference</p>

                            <p className="font-bold text-lg">{lead.referenceNo || "-"}</p>

                        </div>

                        <div>

                            <p className="text-xl text-gray-500 ">Client</p>

                            <p className="font-bold text-lg">

                                {lead.organizationInfo?.organizationName || "-"}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==========================================
                    Editable Info Cards
            ========================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

                <div className="card bg-base-100 shadow border">

                    <div className="card-body p-4">

                        <div className="flex justify-between items-start">

                            <div className="flex items-center gap-2 text-gray-500">

                                <FaMoneyBillWave />

                                <span className="text-sm">Costing</span>

                            </div>

                            <button onClick={() => openQuickEdit("costing")} className="btn btn-xs btn-ghost btn-circle">

                                <FaPen className="text-xs" />

                            </button>

                        </div>

                        <p className="text-sm mt-2">

                            Est: {formatCurrency(lead.estimatedCost)} &nbsp;

                            Prop: {formatCurrency(lead.proposedCost)}

                        </p>

                        <p className="text-xs text-gray-500">

                            Actual: {lead.actualCost ? formatCurrency(lead.actualCost) : "-"}

                        </p>

                    </div>

                </div>

                <div className="card bg-base-100 shadow border">

                    <div className="card-body p-4">

                        <div className="flex justify-between items-start">

                            <div className="flex items-center gap-2 text-gray-500">

                                <FaThumbtack />

                                <span className="text-sm">Priority</span>

                            </div>

                            <button onClick={() => openQuickEdit("priority")} className="btn btn-xs btn-ghost btn-circle">

                                <FaPen className="text-xs" />

                            </button>

                        </div>

                        <p className="font-bold text-lg mt-2">{lead.priority}</p>

                    </div>

                </div>

                <div className="card bg-base-100 shadow border">

                    <div className="card-body p-4">

                        <div className="flex justify-between items-start">

                            <div className="flex items-center gap-2 text-gray-500">

                                <FaFolderOpen />

                                <span className="text-sm">Category</span>

                            </div>

                            <button onClick={() => openQuickEdit("category")} className="btn btn-xs btn-ghost btn-circle">

                                <FaPen className="text-xs" />

                            </button>

                        </div>

                        <p className="font-bold text-lg mt-2">{lead.category || "-"}</p>

                    </div>

                </div>

                <div className="card bg-base-100 shadow border">

                    <div className="card-body p-4">

                        <div className="flex justify-between items-start">

                            <div className="flex items-center gap-2 text-gray-500">

                                <FaThumbtack />

                                <span className="text-sm">Status</span>

                            </div>

                            <button onClick={() => openQuickEdit("status")} className="btn btn-xs btn-ghost btn-circle">

                                <FaPen className="text-xs" />

                            </button>

                        </div>

                        <p className="font-bold text-lg mt-2">{lead.leadStatus}</p>

                    </div>

                </div>

                <div className="card bg-base-100 shadow border">

                    <div className="card-body p-4">

                        <div className="flex justify-between items-start">

                            <div className="flex items-center gap-2 text-gray-500">

                                <FaCalendarAlt />

                                <span className="text-sm">Lead Start</span>

                            </div>

                            <button onClick={() => openQuickEdit("leadStart")} className="btn btn-xs btn-ghost btn-circle">

                                <FaPen className="text-xs" />

                            </button>

                        </div>

                        <p className="font-bold text-lg mt-2">{formatDate(lead.leadStartDate)}</p>

                        {

                            lead.leadStartDate && (

                                <p className="text-xs text-gray-500">

                                    {daysBetween(lead.leadStartDate)} day(s)

                                </p>

                            )

                        }

                    </div>

                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* ==========================================
                        Interaction (spans 2 columns)
                ========================================== */}

                <div className="card bg-base-100 shadow border lg:col-span-2">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-4">

                            <h3 className="card-title text-primary flex items-center gap-2">

                                <FaComments /> Interaction

                                <span className="badge badge-ghost">{interactions.length} Records</span>

                            </h3>

                            <button
                                onClick={() => setActiveModal("addInteraction")}
                                className="btn btn-sm btn-primary"
                            >

                                <FaPlus /> New Interaction

                            </button>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="table table-sm table-zebra">

                                <thead>

                                    <tr>

                                        <th>SL</th>

                                        <th>Date</th>

                                        <th>Method</th>

                                        <th>Follow-up</th>

                                        <th>Result</th>

                                        <th></th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        interactions.length === 0 ? (

                                            <tr>

                                                <td colSpan="6" className="text-center py-6 text-gray-500">

                                                    No interactions yet.

                                                </td>

                                            </tr>

                                        ) : (

                                            interactions.map((it, index) => (

                                                <tr key={it._id}>

                                                    <td>{index + 1}</td>

                                                    <td>{formatDate(it.interactionDate)}</td>

                                                    <td>{it.method || "-"}</td>

                                                    <td>{formatDate(it.nextFollowUpDate)}</td>

                                                    <td>{it.result || "-"}</td>

                                                    <td>

                                                        <div className="flex justify-center gap-1">

                                                            <button
                                                                onClick={() => openViewInteraction(it)}
                                                                className="btn btn-info btn-xs text-white"
                                                                title="View"
                                                            >

                                                                <FaEye />

                                                            </button>

                                                            <button
                                                                onClick={() => deleteInteraction(it._id)}
                                                                className="btn btn-error btn-xs"
                                                                title="Delete"
                                                            >

                                                                <FaTrash />

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))

                                        )

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Other Remarks
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-4">

                            <h3 className="card-title text-primary">Other Remarks</h3>

                            <button
                                onClick={() => setActiveModal("addRemark")}
                                className="btn btn-xs btn-primary"
                            >

                                <FaPlus className="text-xs" />

                            </button>

                        </div>

                        <div className="space-y-3 max-h-64 overflow-y-auto">

                            {

                                remarks.length === 0 ? (

                                    <p className="text-sm text-gray-500 text-center py-4">

                                        No remarks added.

                                    </p>

                                ) : (

                                    remarks.map((r) => (

                                        <div
                                            key={r._id}
                                            className="border rounded-lg p-2 relative"
                                        >

                                            <p className="text-sm whitespace-pre-line pr-6">

                                                {r.text}

                                            </p>

                                            {/* <p className="text-xs text-gray-400 mt-2">

                                                {r.createdBy} • {formatDate(r.createdAt)}

                                            </p> */}

                                            <button
                                                onClick={() => deleteRemark(r._id)}
                                                className="btn btn-xs btn-ghost btn-circle absolute top-2 right-2"
                                            >

                                                <FaTimes className="text-xs text-error" />

                                            </button>

                                        </div>

                                    ))

                                )

                            }

                        </div>

                    </div>

                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* ==========================================
                        Submission
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-4">

                            <h3 className="card-title text-primary">Submission</h3>

                            <button
                                onClick={() => setActiveModal("addSubmission")}
                                className="btn btn-sm btn-primary"
                            >

                                <FaPlus /> Add New

                            </button>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="table table-sm table-zebra">

                                <thead>

                                    <tr>

                                        <th>Type</th>

                                        <th>Submit Date</th>

                                        <th>Date Submitted</th>

                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        submissions.length === 0 ? (

                                            <tr>

                                                <td colSpan="4" className="text-center py-6 text-gray-500">

                                                    No submissions yet.

                                                </td>

                                            </tr>

                                        ) : (

                                            submissions.map((sub) => (

                                                <tr key={sub._id}>

                                                    <td className="font-semibold">{sub.type}</td>

                                                    <td>{formatDate(sub.submitDate)}</td>

                                                    <td>{formatDate(sub.dateSubmitted)}</td>

                                                    <td>

                                                        <span
                                                            className={`badge ${sub.status === "Submitted" ? "badge-success" : "badge-warning"}`}
                                                        >

                                                            {sub.status}

                                                        </span>

                                                    </td>

                                                </tr>

                                            ))

                                        )

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Attachments
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-4">

                            <h3 className="card-title text-primary flex items-center gap-2">

                                <FaFileAlt /> Attachments

                            </h3>

                            <button
                                onClick={() => setActiveModal("addAttachment")}
                                className="btn btn-sm btn-primary"
                            >

                                <FaPlus /> New Attachment

                            </button>

                        </div>

                        {

                            (!lead.documents || lead.documents.length === 0) ? (

                                <p className="text-center py-6 text-gray-500">

                                    No attachments yet.

                                </p>

                            ) : (

                                <div className="space-y-2">

                                    {

                                        lead.documents.map((doc, index) => (

                                            <div
                                                key={index}
                                                className="flex justify-between items-center border rounded-lg p-3"
                                            >

                                                <span className="font-medium truncate">

                                                    {doc.documentName}

                                                </span>

                                                <Link
                                                    to={`${import.meta.env.VITE_API_BASE_URL}${doc.fileUrl}`}
                                                    target="_blank"
                                                    reloadDocument
                                                    className="btn btn-xs btn-outline btn-primary"
                                                >

                                                    Open

                                                </Link>

                                            </div>

                                        ))

                                    }

                                </div>

                            )

                        }

                    </div>

                </div>

            </div>

            {/* ==========================================
                    Contact List
            ========================================== */}

            <div className="card bg-base-100 shadow border">

                <div className="card-body">

                    <div className="flex justify-between items-center mb-4">

                        <h3 className="card-title text-primary flex items-center gap-2">

                            <FaUsers /> Contact List

                        </h3>

                        <button
                            onClick={() => setActiveModal("addContact")}
                            className="btn btn-sm btn-primary"
                        >

                            <FaPlus /> New Contact

                        </button>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="table table-sm table-zebra">

                            <thead>

                                <tr>

                                    <th>Name</th>

                                    <th>Position</th>

                                    <th>Email</th>

                                    <th>Mobile</th>
                                    <th></th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    (!lead.contactList || lead.contactList.length === 0) ? (

                                        <tr>

                                            <td colSpan="4" className="text-center py-6 text-gray-500">

                                                No contacts added.

                                            </td>

                                        </tr>

                                    ) : (

                                        lead.contactList.map((c, index) => (

                                            <tr key={index}>

                                                <td className="font-semibold">{c.contactPerson}</td>

                                                <td>{c.designation || "-"}</td>

                                                <td>{c.email || "-"}</td>
                                                <td>{c.mobile || "-"}</td>

                                                <td>

                                                    <button
                                                        onClick={() => removeContact(index)}
                                                        className="btn btn-xs btn-error btn-outline"
                                                    >

                                                        <FaTimes />

                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    )

                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* ============================================================
                    MODALS
            ============================================================ */}

            {/* ------------ Costing ------------ */}

            {

                activeModal === "costing" && (

                    <Modal title="Edit Costing" onClose={() => setActiveModal(null)}>

                        <div className="space-y-4">

                            <div>

                                <label className="label"><span className="label-text">Estimated Cost</span></label>

                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={quickForm.estimatedCost}
                                    onChange={(e) => setQuickForm(prev => ({ ...prev, estimatedCost: e.target.value }))}
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Proposed Cost</span></label>

                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={quickForm.proposedCost}
                                    onChange={(e) => setQuickForm(prev => ({ ...prev, proposedCost: e.target.value }))}
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Actual Cost</span></label>

                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={quickForm.actualCost}
                                    onChange={(e) => setQuickForm(prev => ({ ...prev, actualCost: e.target.value }))}
                                />

                            </div>

                            <button onClick={saveQuickEdit} disabled={saving} className="btn btn-primary w-full">

                                {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save"}

                            </button>

                        </div>

                    </Modal>

                )

            }

            {/* ------------ Priority ------------ */}

            {

                activeModal === "priority" && (

                    <Modal title="Edit Priority" onClose={() => setActiveModal(null)}>

                        <select
                            className="select select-bordered w-full mb-4"
                            value={quickForm.priority}
                            onChange={(e) => setQuickForm({ priority: e.target.value })}
                        >

                            {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}

                        </select>

                        <button onClick={saveQuickEdit} disabled={saving} className="btn btn-primary w-full">

                            {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save"}

                        </button>

                    </Modal>

                )

            }

            {/* ------------ Category ------------ */}

            {

                activeModal === "category" && (

                    <Modal title="Edit Category" onClose={() => setActiveModal(null)}>

                        <select
                            className="select select-bordered w-full mb-4"
                            value={quickForm.category}
                            onChange={(e) => setQuickForm({ category: e.target.value })}
                        >

                            <option value="">Select Category</option>

                            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}

                        </select>

                        <button onClick={saveQuickEdit} disabled={saving} className="btn btn-primary w-full">

                            {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save"}

                        </button>

                    </Modal>

                )

            }

            {/* ------------ Status ------------ */}

            {

                activeModal === "status" && (

                    <Modal title="Edit Lead Status" onClose={() => setActiveModal(null)}>

                        <select
                            className="select select-bordered w-full mb-4"
                            value={quickForm.leadStatus}
                            onChange={(e) => setQuickForm({ leadStatus: e.target.value })}
                        >

                            {leadStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}

                        </select>

                        <button onClick={saveQuickEdit} disabled={saving} className="btn btn-primary w-full">

                            {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save"}

                        </button>

                    </Modal>

                )

            }

            {/* ------------ Lead Start Date ------------ */}

            {

                activeModal === "leadStart" && (

                    <Modal title="Edit Lead Start Date" onClose={() => setActiveModal(null)}>

                        <DatePicker
                            selected={quickForm.leadStartDate}
                            onChange={(date) => setQuickForm({ leadStartDate: date })}
                            className="input input-bordered w-full mb-4"
                            dateFormat="dd/MM/yyyy"
                            isClearable
                        />

                        <button onClick={saveQuickEdit} disabled={saving} className="btn btn-primary w-full">

                            {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save"}

                        </button>

                    </Modal>

                )

            }

            {/* ------------ Add Remark ------------ */}

            {

                activeModal === "addRemark" && (

                    <Modal title="Add Remark" onClose={() => setActiveModal(null)}>

                        <textarea
                            className="textarea textarea-bordered w-full mb-4"
                            rows={4}
                            placeholder="e.g. EOI requires ISO 9001 certification..."
                            value={newRemarkText}
                            onChange={(e) => setNewRemarkText(e.target.value)}
                            autoFocus
                        ></textarea>

                        <button onClick={submitRemark} disabled={saving} className="btn btn-primary w-full">

                            {saving ? <span className="loading loading-spinner loading-sm"></span> : "Add Remark"}

                        </button>

                    </Modal>

                )

            }

            {/* ------------ Add Interaction ------------ */}

            {

                activeModal === "addInteraction" && (

                    <Modal title="New Interaction" onClose={() => setActiveModal(null)} wide>

                        <h4 className="font-bold text-primary mb-3">Follow-up</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                            <div>

                                <label className="label"><span className="label-text">Contact Person *</span></label>

                                <Select
                                    options={leadContactOptions}
                                    value={interactionForm.contactPerson}
                                    onChange={(selected) => setInteractionForm(prev => ({ ...prev, contactPerson: selected }))}
                                    placeholder="Select contact person"
                                    classNamePrefix="react-select"
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Communication Method *</span></label>

                                <select
                                    className="select select-bordered w-full"
                                    value={interactionForm.method}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, method: e.target.value }))}
                                >

                                    <option value="">-- Select --</option>

                                    {communicationMethods.map(m => <option key={m} value={m}>{m}</option>)}

                                </select>

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Date</span></label>

                                <DatePicker
                                    selected={interactionForm.interactionDate}
                                    onChange={(date) => setInteractionForm(prev => ({ ...prev, interactionDate: date }))}
                                    className="input input-bordered w-full"
                                    dateFormat="dd/MM/yyyy"
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Time</span></label>

                                <input
                                    type="time"
                                    className="input input-bordered w-full"
                                    value={interactionForm.interactionTime}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, interactionTime: e.target.value }))}
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Purpose</span></label>

                                <select
                                    className="select select-bordered w-full"
                                    value={interactionForm.purpose}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, purpose: e.target.value }))}
                                >

                                    <option value="">-- Select --</option>

                                    {purposeOptions.map(p => <option key={p} value={p}>{p}</option>)}

                                </select>

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Result</span></label>

                                <select
                                    className="select select-bordered w-full"
                                    value={interactionForm.result}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, result: e.target.value }))}
                                >

                                    <option value="">-- Select --</option>

                                    {resultOptions.map(r => <option key={r} value={r}>{r}</option>)}

                                </select>

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Decision Status</span></label>

                                <select
                                    className="select select-bordered w-full"
                                    value={interactionForm.decisionStatus}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, decisionStatus: e.target.value }))}
                                >

                                    <option value="">-- Select --</option>

                                    {decisionStatusOptions.map(d => <option key={d} value={d}>{d}</option>)}

                                </select>

                            </div>

                            <div className="md:col-span-2">

                                <label className="label"><span className="label-text">Note</span></label>

                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                    value={interactionForm.note}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, note: e.target.value }))}
                                ></textarea>

                            </div>

                        </div>

                        <h4 className="font-bold text-primary mb-3">Next Follow-up Schedule</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>

                                <label className="label"><span className="label-text">Contact Person</span></label>

                                <Select
                                    options={leadContactOptions}
                                    value={interactionForm.nextContactPerson}
                                    onChange={(selected) => setInteractionForm(prev => ({ ...prev, nextContactPerson: selected }))}
                                    placeholder="Select contact person"
                                    classNamePrefix="react-select"
                                    isClearable
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Assigned To</span></label>

                                <Select
                                    options={assignToOptions}
                                    value={interactionForm.assignedTo}
                                    onChange={(selected) => setInteractionForm(prev => ({ ...prev, assignedTo: selected }))}
                                    placeholder="Select team member"
                                    classNamePrefix="react-select"
                                    isClearable
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Date</span></label>

                                <DatePicker
                                    selected={interactionForm.nextFollowUpDate}
                                    onChange={(date) => setInteractionForm(prev => ({ ...prev, nextFollowUpDate: date }))}
                                    className="input input-bordered w-full"
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Time</span></label>

                                <input
                                    type="time"
                                    className="input input-bordered w-full"
                                    value={interactionForm.nextFollowUpTime}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, nextFollowUpTime: e.target.value }))}
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Method</span></label>

                                <select
                                    className="select select-bordered w-full"
                                    value={interactionForm.nextMethod}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, nextMethod: e.target.value }))}
                                >

                                    <option value="">-- Select --</option>

                                    {communicationMethods.map(m => <option key={m} value={m}>{m}</option>)}

                                </select>

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Purpose</span></label>

                                <select
                                    className="select select-bordered w-full"
                                    value={interactionForm.nextPurpose}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, nextPurpose: e.target.value }))}
                                >

                                    <option value="">-- Select --</option>

                                    {purposeOptions.map(p => <option key={p} value={p}>{p}</option>)}

                                </select>

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Reminder</span></label>

                                <select
                                    className="select select-bordered w-full"
                                    value={interactionForm.reminder}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, reminder: e.target.value }))}
                                >

                                    <option value="">-- Select --</option>

                                    {reminderOptions.map(r => <option key={r} value={r}>{r}</option>)}

                                </select>

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Action Note</span></label>

                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows={1}
                                    value={interactionForm.actionNote}
                                    onChange={(e) => setInteractionForm(prev => ({ ...prev, actionNote: e.target.value }))}
                                ></textarea>

                            </div>

                        </div>

                        <button onClick={submitInteraction} disabled={saving} className="btn btn-primary w-full mt-5">

                            {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save Interaction"}

                        </button>

                    </Modal>

                )

            }

            {/* ------------ View Interaction ------------ */}

            {

                activeModal === "viewInteraction" && viewingInteraction && (

                    <Modal title="Interaction Details" onClose={() => setActiveModal(null)} wide>

                        <div className="space-y-5 text-sm">

                            <div>

                                <h4 className="font-bold text-primary mb-2">Follow-up</h4>

                                <div className="grid grid-cols-2 gap-3">

                                    <p><span className="font-semibold">Contact Person:</span> {viewingInteraction.contactPerson || "-"}</p>

                                    <p><span className="font-semibold">Method:</span> {viewingInteraction.method || "-"}</p>

                                    <p><span className="font-semibold">Date:</span> {formatDate(viewingInteraction.interactionDate)}</p>

                                    <p><span className="font-semibold">Time:</span> {viewingInteraction.interactionTime || "-"}</p>

                                    <p><span className="font-semibold">Purpose:</span> {viewingInteraction.purpose || "-"}</p>

                                    <p><span className="font-semibold">Result:</span> {viewingInteraction.result || "-"}</p>

                                    <p><span className="font-semibold">Decision Status:</span> {viewingInteraction.decisionStatus || "-"}</p>

                                </div>

                                <p className="mt-2"><span className="font-semibold">Note:</span> {viewingInteraction.note || "-"}</p>

                            </div>

                            {

                                (viewingInteraction.nextFollowUpDate || viewingInteraction.assignedTo) && (

                                    <div className="border-t pt-4">

                                        <h4 className="font-bold text-primary mb-2">Next Follow-up Schedule</h4>

                                        <div className="grid grid-cols-2 gap-3">

                                            <p><span className="font-semibold">Contact Person:</span> {viewingInteraction.nextContactPerson || "-"}</p>

                                            <p><span className="font-semibold">Assigned To:</span> {viewingInteraction.assignedTo || "-"}</p>

                                            <p><span className="font-semibold">Date:</span> {formatDate(viewingInteraction.nextFollowUpDate)}</p>

                                            <p><span className="font-semibold">Time:</span> {viewingInteraction.nextFollowUpTime || "-"}</p>

                                            <p><span className="font-semibold">Method:</span> {viewingInteraction.nextMethod || "-"}</p>

                                            <p><span className="font-semibold">Purpose:</span> {viewingInteraction.nextPurpose || "-"}</p>

                                            <p><span className="font-semibold">Reminder:</span> {viewingInteraction.reminder || "-"}</p>

                                        </div>

                                        <p className="mt-2"><span className="font-semibold">Action Note:</span> {viewingInteraction.actionNote || "-"}</p>

                                    </div>

                                )

                            }

                        </div>

                    </Modal>

                )

            }

            {/* ------------ Add Submission ------------ */}

            {

                activeModal === "addSubmission" && (

                    <Modal title="Add Submission" onClose={() => setActiveModal(null)}>

                        <div className="space-y-4">

                            <div>

                                <label className="label"><span className="label-text">Type *</span></label>

                                <select
                                    className="select select-bordered w-full"
                                    value={submissionForm.type}
                                    onChange={(e) => setSubmissionForm(prev => ({ ...prev, type: e.target.value }))}
                                >

                                    <option value="">Select Type</option>

                                    {submissionTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}

                                </select>

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Submit Date (Due)</span></label>

                                <DatePicker
                                    selected={submissionForm.submitDate}
                                    onChange={(date) => setSubmissionForm(prev => ({ ...prev, submitDate: date }))}
                                    className="input input-bordered w-full"
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Date Submitted (Actual)</span></label>

                                <DatePicker
                                    selected={submissionForm.dateSubmitted}
                                    onChange={(date) => setSubmissionForm(prev => ({ ...prev, dateSubmitted: date }))}
                                    className="input input-bordered w-full"
                                    dateFormat="dd/MM/yyyy"
                                    isClearable
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">Remarks</span></label>

                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                    value={submissionForm.remarks}
                                    onChange={(e) => setSubmissionForm(prev => ({ ...prev, remarks: e.target.value }))}
                                ></textarea>

                            </div>

                            <button onClick={submitSubmission} disabled={saving} className="btn btn-primary w-full">

                                {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save Submission"}

                            </button>

                        </div>

                    </Modal>

                )

            }

            {/* ------------ Add Attachment ------------ */}

            {

                activeModal === "addAttachment" && (

                    <Modal title="New Attachment" onClose={() => setActiveModal(null)}>

                        <div className="space-y-4">

                            <div>

                                <label className="label"><span className="label-text">Document Name</span></label>

                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Sales Proposal"
                                    value={attachmentForm.documentName}
                                    onChange={(e) => setAttachmentForm(prev => ({ ...prev, documentName: e.target.value }))}
                                />

                            </div>

                            <div>

                                <label className="label"><span className="label-text">File</span></label>

                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    onChange={(e) => setAttachmentForm(prev => ({ ...prev, file: e.target.files[0] }))}
                                />

                            </div>

                            <button onClick={submitAttachment} disabled={saving} className="btn btn-primary w-full">

                                {saving ? <span className="loading loading-spinner loading-sm"></span> : "Upload"}

                            </button>

                        </div>

                    </Modal>

                )

            }

            {/* ------------ Add Contact ------------ */}

            {

                activeModal === "addContact" && (

                    <Modal title="New Contact" onClose={() => setActiveModal(null)}>

                        {

                            availableContactOptions.length === 0 ? (

                                <p className="text-gray-500 text-center py-4">

                                    All organization contacts have already been added, or the organization has no contacts.

                                </p>

                            ) : (

                                <>

                                    <Select
                                        options={availableContactOptions}
                                        value={selectedContact}
                                        onChange={setSelectedContact}
                                        placeholder="Select a contact person"
                                        classNamePrefix="react-select"
                                    />

                                    <button onClick={submitContact} disabled={saving} className="btn btn-primary w-full mt-4">

                                        {saving ? <span className="loading loading-spinner loading-sm"></span> : "Add Contact"}

                                    </button>

                                </>

                            )

                        }

                    </Modal>

                )

            }

        </div>

    );

};

export default DetailsLead;