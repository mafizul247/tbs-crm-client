import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import {
    FaArrowLeft,
    FaSave,
    FaPlus,
    FaTrash,
    FaBuilding
} from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";
import { useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const organizationTypes = [
    "Client", "Vendor", "Private", "Government", "NGO", "Manufacturer", "Other"
];

const CreateOrganization = () => {

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [parentOptions, setParentOptions] = useState([]);

    /* ==========================================
            Main Form State
    ========================================== */

    const [formData, setFormData] = useState({

        organizationName: "",

        organizationType: "",

        parentOrganization: null, // will hold { value, label }

        website: "",

        organizationCode: "",

        industry: "",

        country: "",

        city: "",

        postalCode: "",

        address: "",

        notes: ""

    });

    /* ==========================================
            Contact Persons (dynamic array)
    ========================================== */

    const [contactPersons, setContactPersons] = useState([

        { contactPerson: "", designation: "", mobile: "", phone: "", email: "" }

    ]);

    /* ==========================================
            Documents (dynamic array)
    ========================================== */

    const [documents, setDocuments] = useState([

        { documentName: "", file: null }

    ]);

    /* ==========================================
            Load Parent Organization Options
    ========================================== */

    useEffect(() => {

        axiosSecure.get("/organizations/dropdown/list")
            .then(({ data }) => {

                const options = data.data.map(org => ({

                    value: org._id,

                    label: org.organizationName

                }));

                setParentOptions(options);

            })
            .catch(error => console.log(error));

    }, [axiosSecure]);

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

            /* ===============================
                Simple Text Fields
            =============================== */

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

            /* ===============================
                Address (object -> JSON string)
            =============================== */

            payload.append("address", JSON.stringify({

                country: formData.country,

                city: formData.city,

                postalCode: formData.postalCode,

                address: formData.address

            }));

            /* ===============================
                Contact Persons (array -> JSON string)
                (Remove empty rows before sending)
            =============================== */

            const validContacts = contactPersons.filter(c => c.contactPerson.trim() !== "");

            payload.append("contactPersons", JSON.stringify(validContacts));

            /* ===============================
                Documents
                - files go in as actual File objects
                - names go in as a JSON string array
                  (order must match file order!)
            =============================== */

            const validDocuments = documents.filter(d => d.file);

            const documentNames = validDocuments.map(d => d.documentName || d.file.name);

            payload.append("documentNames", JSON.stringify(documentNames));

            validDocuments.forEach(d => {

                payload.append("documents", d.file);

            });

            /* ===============================
                Send Request
            =============================== */

            const { data } = await axiosSecure.post(

                "/organizations",

                payload,

                {

                    headers: { "Content-Type": "multipart/form-data" }

                }

            );

            if (data.success) {

                Swal.fire({

                    icon: "success",

                    title: "Organization Created Successfully",

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

                <title>PMS || Create Organization</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaBuilding className="text-primary" />

                        Create Organization

                    </h2>

                    <p className="text-gray-500">

                        Add a new client / organization to the system.

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
                                    placeholder="Organization Name"
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
                                    placeholder="e.g. ORG-0001"
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
                                    placeholder="e.g. Textile, IT, Healthcare"
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
                                    placeholder="https://example.com"
                                    value={formData.website}
                                    onChange={handleChange}
                                />

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
                                    placeholder="e.g. Bangladesh"
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
                                    placeholder="e.g. Dhaka"
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
                                    placeholder="e.g. 1000"
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
                                    placeholder="Details address"
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
                                        placeholder="Document Name (e.g. Trade License)"
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
                            placeholder="Any additional details about this organization..."
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

                                : <><FaSave /> Create Organization</>

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default CreateOrganization;