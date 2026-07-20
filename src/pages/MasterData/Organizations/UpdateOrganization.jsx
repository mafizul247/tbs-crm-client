import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router";
import {
    FaArrowLeft,
    FaSave,
    FaPlus,
    FaTrash,
    FaBuilding,
    FaFileAlt
} from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const organizationTypes = [
    "Client", "Vendor", "Private", "Government", "NGO", "Manufacturer", "Other"
];

const UpdateOrganization = () => {

    const { id } = useParams();

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [fetching, setFetching] = useState(true);

    const [parentOptions, setParentOptions] = useState([]);

    /* ==========================================
            Main Form State
    ========================================== */

    const [formData, setFormData] = useState({

        organizationName: "",

        organizationType: "",

        parentOrganization: null,

        website: "",

        organizationCode: "",

        industry: "",

        country: "",

        city: "",

        postalCode: "",

        address: "",

        notes: "",

        status: "Active"

    });

    /* ==========================================
            Contact Persons (dynamic array)
    ========================================== */

    const [contactPersons, setContactPersons] = useState([

        { contactPerson: "", designation: "", mobile: "", phone: "", email: "" }

    ]);

    /* ==========================================
            Documents
            - existingDocuments: already uploaded, from DB
            - newDocuments: new files to upload now
    ========================================== */

    const [existingDocuments, setExistingDocuments] = useState([]);

    const [newDocuments, setNewDocuments] = useState([

        { documentName: "", file: null }

    ]);

    /* ==========================================
            Load Parent Organization Options
    ========================================== */

    useEffect(() => {

        axiosSecure.get("/organizations/dropdown/list")
            .then(({ data }) => {

                const options = data.data

                    .filter(org => org._id !== id) // prevent selecting itself as its own parent

                    .map(org => ({

                        value: org._id,

                        label: org.organizationName

                    }));

                setParentOptions(options);

            })
            .catch(error => console.log(error));

    }, [axiosSecure, id]);

    /* ==========================================
            Load Existing Organization
    ========================================== */

    useEffect(() => {

        const loadOrganization = async () => {

            try {

                setFetching(true);

                const { data } = await axiosSecure.get(`/organizations/${id}`);

                const org = data.data;

                setFormData({

                    organizationName: org.organizationName || "",

                    organizationType: org.organizationType || "",

                    parentOrganization: org.parentOrganization
                        ? { value: org.parentOrganization, label: "Loading..." }
                        : null,

                    website: org.website || "",

                    organizationCode: org.organizationCode || "",

                    industry: org.industry || "",

                    country: org.address?.country || "",

                    city: org.address?.city || "",

                    postalCode: org.address?.postalCode || "",

                    address: org.address?.address || "",

                    notes: org.notes || "",

                    status: org.status || "Active"

                });

                setContactPersons(

                    org.contactPersons?.length > 0

                        ? org.contactPersons

                        : [{ contactPerson: "", designation: "", mobile: "", phone: "", email: "" }]

                );

                setExistingDocuments(org.documents || []);

            }
            catch (error) {

                console.log(error);

                Swal.fire({

                    icon: "error",

                    title: "Failed to Load Organization",

                    text: error.response?.data?.message || error.message

                });

                navigate("/organizations");

            }
            finally {

                setFetching(false);

            }

        };

        loadOrganization();

    }, [id, axiosSecure, navigate]);

    /* ==========================================
            Fix Parent Org Label Once Options Load
    ========================================== */

    useEffect(() => {

        if (formData.parentOrganization?.label === "Loading..." && parentOptions.length > 0) {

            const matched = parentOptions.find(

                opt => opt.value === formData.parentOrganization.value

            );

            if (matched) {

                setFormData(prev => ({ ...prev, parentOrganization: matched }));

            }

        }

    }, [parentOptions, formData.parentOrganization]);

    /* ==========================================
            Handlers - Main Fields
    ========================================== */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

    };

    /* ==========================================
            Handlers - Contact Persons
    ========================================== */

    const handleContactChange = (index, field, value) => {

        const updated = [...contactPersons];

        updated[index][field] = value;

        setContactPersons(updated);

    };

    const addContactPerson = () => {

        setContactPersons(prev => [

            ...prev,

            { contactPerson: "", designation: "", mobile: "", phone: "", email: "" }

        ]);

    };

    const removeContactPerson = (index) => {

        setContactPersons(prev => prev.filter((_, i) => i !== index));

    };

    /* ==========================================
            Handlers - Existing Documents
    ========================================== */

    const removeExistingDocument = (index) => {

        setExistingDocuments(prev => prev.filter((_, i) => i !== index));

    };

    /* ==========================================
            Handlers - New Documents
    ========================================== */

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

        if (!formData.organizationName || !formData.organizationType) {

            return Swal.fire({

                icon: "warning",

                title: "Missing Required Fields",

                text: "Organization Name and Organization Type are required."

            });

        }

        try {

            setLoading(true);

            const payload = new FormData();

            payload.append("organizationName", formData.organizationName);

            payload.append("organizationType", formData.organizationType);

            payload.append(

                "parentOrganization",

                formData.parentOrganization ? formData.parentOrganization.value : ""

            );

            payload.append("website", formData.website);

            payload.append("organizationCode", formData.organizationCode);

            payload.append("industry", formData.industry);

            payload.append("notes", formData.notes);

            payload.append("status", formData.status);

            payload.append("address", JSON.stringify({

                country: formData.country,

                city: formData.city,

                postalCode: formData.postalCode,

                address: formData.address

            }));

            const validContacts = contactPersons.filter(c => c.contactPerson.trim() !== "");

            payload.append("contactPersons", JSON.stringify(validContacts));

            /* ===============================
                Existing Documents (kept ones)
            =============================== */

            payload.append("existingDocuments", JSON.stringify(existingDocuments));

            /* ===============================
                New Documents
            =============================== */

            const validNewDocuments = newDocuments.filter(d => d.file);

            const newDocumentNames = validNewDocuments.map(d => d.documentName || d.file.name);

            payload.append("documentNames", JSON.stringify(newDocumentNames));

            validNewDocuments.forEach(d => {

                payload.append("documents", d.file);

            });

            const { data } = await axiosSecure.patch(

                `/organizations/${id}`,

                payload,

                {

                    headers: { "Content-Type": "multipart/form-data" }

                }

            );

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Organization Updated Successfully",

                    timer: 1800,

                    showConfirmButton: false

                });

                navigate("/organizations");

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

                <title>PMS || Update Organization</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaBuilding className="text-primary" />

                        Update Organization

                    </h2>

                    <p className="text-gray-500">

                        Edit organization information.

                    </p>

                </div>

                <Link to="/organizations" className="btn btn-outline">

                    <FaArrowLeft />

                    Organization List

                </Link>

            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ==========================================
                        Basic Information
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Basic Information

                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Organization Name *

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="organizationName"
                                    className="input input-bordered w-full"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Organization Type *

                                    </span>

                                </label>

                                <select
                                    name="organizationType"
                                    className="select select-bordered w-full"
                                    value={formData.organizationType}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">Select Type</option>

                                    {

                                        organizationTypes.map(type => (

                                            <option key={type} value={type}>

                                                {type}

                                            </option>

                                        ))

                                    }

                                </select>

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Parent Organization

                                    </span>

                                </label>

                                <Select
                                    options={parentOptions}
                                    value={formData.parentOrganization}
                                    onChange={(selected) =>

                                        setFormData(prev => ({

                                            ...prev,

                                            parentOrganization: selected

                                        }))

                                    }
                                    isClearable
                                    placeholder="Select parent organization (optional)"
                                    classNamePrefix="react-select"
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Organization Code

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="organizationCode"
                                    className="input input-bordered w-full"
                                    value={formData.organizationCode}
                                    onChange={handleChange}
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Industry

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="industry"
                                    className="input input-bordered w-full"
                                    value={formData.industry}
                                    onChange={handleChange}
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Website

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="website"
                                    className="input input-bordered w-full"
                                    value={formData.website}
                                    onChange={handleChange}
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Status

                                    </span>

                                </label>

                                <select
                                    name="status"
                                    className="select select-bordered w-full"
                                    value={formData.status}
                                    onChange={handleChange}
                                >

                                    <option value="Active">Active</option>

                                    <option value="Inactive">Inactive</option>

                                </select>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Address Information
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Address Information

                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Country</span>

                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    className="input input-bordered w-full"
                                    value={formData.country}
                                    onChange={handleChange}
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">City</span>

                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    className="input input-bordered w-full"
                                    value={formData.city}
                                    onChange={handleChange}
                                />

                            </div>

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">Postal Code</span>

                                </label>

                                <input
                                    type="text"
                                    name="postalCode"
                                    className="input input-bordered w-full"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="lg:col-span-2">

                                <label className="label">

                                    <span className="label-text font-semibold">Address</span>

                                </label>

                                <textarea
                                    name="address"
                                    className="textarea textarea-bordered w-full"
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleChange}
                                ></textarea>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Contact Persons
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="card-title text-primary">

                                Contact Persons

                            </h2>

                            <button
                                type="button"
                                onClick={addContactPerson}
                                className="btn btn-sm btn-primary"
                            >

                                <FaPlus /> Add Contact

                            </button>

                        </div>

                        {

                            contactPersons.map((contact, index) => (

                                <div
                                    key={index}
                                    className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-4 border-b pb-4 last:border-0"
                                >

                                    <input
                                        type="text"
                                        placeholder="Contact Person"
                                        className="input input-bordered w-full"
                                        value={contact.contactPerson}
                                        onChange={(e) => handleContactChange(index, "contactPerson", e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Designation"
                                        className="input input-bordered w-full"
                                        value={contact.designation}
                                        onChange={(e) => handleContactChange(index, "designation", e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Mobile"
                                        className="input input-bordered w-full"
                                        value={contact.mobile}
                                        onChange={(e) => handleContactChange(index, "mobile", e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        className="input input-bordered w-full"
                                        value={contact.phone}
                                        onChange={(e) => handleContactChange(index, "phone", e.target.value)}
                                    />

                                    <div className="flex gap-2">

                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="input input-bordered w-full"
                                            value={contact.email}
                                            onChange={(e) => handleContactChange(index, "email", e.target.value)}
                                        />

                                        {

                                            contactPersons.length > 1 && (

                                                <button
                                                    type="button"
                                                    onClick={() => removeContactPerson(index)}
                                                    className="btn btn-error btn-square"
                                                >

                                                    <FaTrash />

                                                </button>

                                            )

                                        }

                                    </div>

                                </div>

                            ))

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

                                <p className="text-gray-500 mb-4">

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
                                        placeholder="Document Name (e.g. Trade License)"
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
                        Notes
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Notes

                        </h2>

                        <textarea
                            name="notes"
                            className="textarea textarea-bordered w-full"
                            rows={4}
                            value={formData.notes}
                            onChange={handleChange}
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

                                : <><FaSave /> Update Organization</>

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default UpdateOrganization;