import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";

import {
    FaArrowLeft,
    FaBuilding,
    FaSave,
    FaPlus,
    FaTrash
} from "react-icons/fa";

import Swal from "sweetalert2";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const NewClient = () => {

    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [loading, setLoading] = useState(false);

    const [organizations, setOrganizations] = useState([]);

    const [formData, setFormData] = useState({

        organizationName: "",

        parentOrganizationId: "",

        clientCode: "",

        organizationType: "Corporate",

        industry: "",

        website: "",

        address: "",

        city: "",

        country: "Bangladesh",

        postalCode: "",

        notes: "",

        createdBy: user?.email

    });

    /* ==============================
        Multiple Contact Person
    =============================== */

    const [contacts, setContacts] = useState([

        {

            contactPerson: "",

            designation: "",

            mobile: "",

            phone: "",

            email: ""

        }

    ]);

    /* ==============================
        Multiple Documents
    =============================== */

    const [documents, setDocuments] = useState([

        {

            fileName: "",

            file: null

        }

    ]);

    /* ==============================
        Load Organizations
    =============================== */

    const loadOrganizations = async () => {

        try {

            const { data } =
                await axiosSecure.get("/organizations");

            setOrganizations(data.data || []);

        }
        catch (error) {

            console.log(error);

        }

    };

    /* ==============================
        Generate Client Code
    =============================== */

    const loadClientCode = async () => {

        try {

            const { data } =
                await axiosSecure.get("/generate-client-code");

            setFormData(prev => ({

                ...prev,

                clientCode: data.clientCode

            }));

        }
        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        loadOrganizations();

        loadClientCode();

    }, []);

    /* ==============================
        Form Change
    =============================== */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };

    /* ==============================
        Submit
    =============================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.organizationName.trim()) {

            return Swal.fire({
                icon: "warning",
                title: "Organization Name Required"
            });

        }

        if (contacts.length === 0) {

            return Swal.fire({
                icon: "warning",
                title: "At least one contact person is required."
            });

        }

        try {

            setLoading(true);

            const submitData = new FormData();

            submitData.append(
                "organizationName",
                formData.organizationName
            );

            submitData.append(
                "parentOrganizationId",
                formData.parentOrganizationId
            );

            submitData.append(
                "clientCode",
                formData.clientCode
            );

            submitData.append(
                "organizationType",
                formData.organizationType
            );

            submitData.append(
                "industry",
                formData.industry
            );

            submitData.append(
                "website",
                formData.website
            );

            submitData.append(
                "country",
                formData.country
            );

            submitData.append(
                "city",
                formData.city
            );

            submitData.append(
                "postalCode",
                formData.postalCode
            );

            submitData.append(
                "address",
                formData.address
            );

            submitData.append(
                "notes",
                formData.notes
            );

            submitData.append(
                "createdBy",
                user.email
            );

            submitData.append(
                "contacts",
                JSON.stringify(contacts)
            );

            documents.forEach((doc, index) => {

                submitData.append(
                    `documentNames`,
                    doc.fileName
                );

                if (doc.file) {

                    submitData.append(
                        `documents`,
                        doc.file
                    );

                }

            });

            const { data } = await axiosSecure.post(

                "/create-client",

                submitData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            if (data.insertedId) {

                Swal.fire({

                    icon: "success",

                    title: "Organization Created",

                    timer: 1800,

                    showConfirmButton: false

                });

                navigate("/clients");

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Failed",

                text: "Unable to create organization."

            });

        }
        finally {

            setLoading(false);

        }

    };

    /* ==============================
    Contact Person Functions
============================== */

    const handleContactChange = (index, e) => {

        const { name, value } = e.target;

        const updatedContacts = [...contacts];

        updatedContacts[index][name] = value;

        setContacts(updatedContacts);

    };

    const addContact = () => {

        setContacts([
            ...contacts,
            {
                contactPerson: "",
                designation: "",
                mobile: "",
                phone: "",
                email: ""
            }
        ]);

    };

    const removeContact = (index) => {

        if (contacts.length === 1) return;

        const updatedContacts = contacts.filter(
            (_, i) => i !== index
        );

        setContacts(updatedContacts);

    };

    /* ==============================
    Document Functions
============================== */

    const handleDocumentChange = (index, e) => {

        const { name, value, files } = e.target;

        const updatedDocuments = [...documents];

        if (name === "file") {
            updatedDocuments[index].file = files[0];
        } else {
            updatedDocuments[index][name] = value;
        }

        setDocuments(updatedDocuments);

    };

    const addDocument = () => {

        setDocuments([
            ...documents,
            {
                fileName: "",
                file: null
            }
        ]);

    };

    const removeDocument = (index) => {

        if (documents.length === 1) return;

        const updatedDocuments = documents.filter(
            (_, i) => i !== index
        );

        setDocuments(updatedDocuments);

    };

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Create Organization</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold">

                        Create Organization

                    </h2>

                    <p className="text-gray-500">

                        Register a new organization into the CRM.

                    </p>

                </div>

                <Link
                    to="/clients"
                    className="btn btn-outline"
                >

                    <FaArrowLeft />

                    Back

                </Link>

            </div>

            <form onSubmit={handleSubmit}>

                {/* ==========================================
                        Organization Information
                ========================================== */}

                <div className="card bg-base-100 border shadow-md">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-4">

                            <FaBuilding />

                            Organization Information

                        </h2>

                        <div className="grid lg:grid-cols-2 gap-5">

                            {/* Organization Name */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Organization Name

                                        <span className="text-error">

                                            *

                                        </span>

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="organizationName"
                                    className="input input-bordered w-full"
                                    placeholder="Enter organization name"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Client Code */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Client Code

                                    </span>

                                </label>

                                <input
                                    type="text"
                                    name="clientCode"
                                    className="input input-bordered w-full bg-base-200 font-semibold"
                                    value={formData.clientCode}
                                    readOnly
                                />

                            </div>

                            {/* Parent Organization */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Parent Organization

                                    </span>

                                </label>

                                <select
                                    name="parentOrganizationId"
                                    className="select select-bordered w-full"
                                    value={formData.parentOrganizationId}
                                    onChange={handleChange}
                                >

                                    <option value="">

                                        No Parent Organization

                                    </option>

                                    {

                                        organizations.map(org => (

                                            <option
                                                key={org._id}
                                                value={org._id}
                                            >

                                                {org.organizationName}

                                            </option>

                                        ))

                                    }

                                </select>

                                <label className="label">

                                    <span className="label-text-alt text-gray-500">

                                        Leave empty to create a main organization.

                                    </span>

                                </label>

                            </div>

                            {/* Organization Type */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Organization Type

                                    </span>

                                </label>

                                <select
                                    name="organizationType"
                                    className="select select-bordered w-full"
                                    value={formData.organizationType}
                                    onChange={handleChange}
                                >

                                    <option value="Corporate">

                                        Corporate

                                    </option>

                                    <option value="Government">

                                        Government

                                    </option>

                                    <option value="NGO">

                                        NGO

                                    </option>

                                    <option value="Educational">

                                        Educational

                                    </option>

                                    <option value="Hospital">

                                        Hospital

                                    </option>

                                    <option value="Manufacturing">

                                        Manufacturing

                                    </option>

                                    <option value="Software">

                                        Software

                                    </option>

                                    <option value="Retail">

                                        Retail

                                    </option>

                                    <option value="Bank">

                                        Bank

                                    </option>

                                    <option value="Others">

                                        Others

                                    </option>

                                </select>

                            </div>

                            {/* Industry */}

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
                                    placeholder="Software, Textile, Pharma..."
                                    value={formData.industry}
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Website */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Website

                                    </span>

                                </label>

                                <input
                                    type="url"
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
                        Contact Persons
                ========================================== */}

                <div className="card bg-base-100 border shadow-md mt-6">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="card-title text-primary">

                                👤 Contact Persons

                            </h2>

                            <button
                                type="button"
                                onClick={addContact}
                                className="btn btn-primary btn-sm"
                            >

                                <FaPlus />

                                Add Contact

                            </button>

                        </div>

                        {

                            contacts.map((contact, index) => (

                                <div
                                    key={index}
                                    className="border rounded-xl p-5 mb-5 bg-base-200"
                                >

                                    <div className="flex justify-between items-center mb-4">

                                        <h3 className="font-bold">

                                            Contact Person #{index + 1}

                                        </h3>

                                        {

                                            contacts.length > 1 &&

                                            <button
                                                type="button"
                                                onClick={() => removeContact(index)}
                                                className="btn btn-error btn-sm"
                                            >

                                                <FaTrash />

                                            </button>

                                        }

                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-5">

                                        {/* Contact Person */}

                                        <div>

                                            <label className="label">

                                                <span className="label-text">

                                                    Contact Person

                                                </span>

                                            </label>

                                            <input
                                                type="text"
                                                name="contactPerson"
                                                className="input input-bordered w-full"
                                                value={contact.contactPerson}
                                                onChange={(e) =>
                                                    handleContactChange(index, e)
                                                }
                                            />

                                        </div>

                                        {/* Designation */}

                                        <div>

                                            <label className="label">

                                                <span className="label-text">

                                                    Designation

                                                </span>

                                            </label>

                                            <input
                                                type="text"
                                                name="designation"
                                                className="input input-bordered w-full"
                                                value={contact.designation}
                                                onChange={(e) =>
                                                    handleContactChange(index, e)
                                                }
                                            />

                                        </div>

                                        {/* Mobile */}

                                        <div>

                                            <label className="label">

                                                <span className="label-text">

                                                    Mobile

                                                </span>

                                            </label>

                                            <input
                                                type="text"
                                                name="mobile"
                                                className="input input-bordered w-full"
                                                value={contact.mobile}
                                                onChange={(e) =>
                                                    handleContactChange(index, e)
                                                }
                                            />

                                        </div>

                                        {/* Phone */}

                                        <div>

                                            <label className="label">

                                                <span className="label-text">

                                                    Phone

                                                </span>

                                            </label>

                                            <input
                                                type="text"
                                                name="phone"
                                                className="input input-bordered w-full"
                                                value={contact.phone}
                                                onChange={(e) =>
                                                    handleContactChange(index, e)
                                                }
                                            />

                                        </div>

                                        {/* Email */}

                                        <div className="lg:col-span-2">

                                            <label className="label">

                                                <span className="label-text">

                                                    Email

                                                </span>

                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                className="input input-bordered w-full"
                                                value={contact.email}
                                                onChange={(e) =>
                                                    handleContactChange(index, e)
                                                }
                                            />

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                </div>

                {/* ==========================================
                        Documents
                ========================================== */}

                <div className="card bg-base-100 border shadow-md mt-6">

                    <div className="card-body">

                        <div className="flex justify-between items-center mb-5">

                            <h2 className="card-title text-primary">

                                📎 Documents

                            </h2>

                            <button
                                type="button"
                                onClick={addDocument}
                                className="btn btn-primary btn-sm"
                            >
                                <FaPlus />
                                Add Document
                            </button>

                        </div>

                        {

                            documents.map((doc, index) => (

                                <div
                                    key={index}
                                    className="border rounded-xl p-5 mb-5 bg-base-200"
                                >

                                    <div className="flex justify-between items-center mb-4">

                                        <h3 className="font-bold">

                                            Document #{index + 1}

                                        </h3>

                                        {

                                            documents.length > 1 &&

                                            <button
                                                type="button"
                                                className="btn btn-error btn-sm"
                                                onClick={() => removeDocument(index)}
                                            >

                                                <FaTrash />

                                            </button>

                                        }

                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-5">

                                        {/* File Name */}

                                        <div>

                                            <label className="label">

                                                <span className="label-text">

                                                    Document Name

                                                </span>

                                            </label>

                                            <input
                                                type="text"
                                                name="fileName"
                                                className="input input-bordered w-full"
                                                placeholder="Trade License"
                                                value={doc.fileName}
                                                onChange={(e) =>
                                                    handleDocumentChange(index, e)
                                                }
                                            />

                                        </div>

                                        {/* Upload */}

                                        <div>

                                            <label className="label">

                                                <span className="label-text">

                                                    Upload File

                                                </span>

                                            </label>

                                            <input
                                                type="file"
                                                name="file"
                                                className="file-input file-input-bordered w-full"
                                                onChange={(e) =>
                                                    handleDocumentChange(index, e)
                                                }
                                            />

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                </div>

                {/* ==========================================
                        Address Information
                ========================================== */}

                <div className="card bg-base-100 border shadow-md mt-6">

                    <div className="card-body">

                        <h2 className="card-title text-primary">

                            📍 Address Information

                        </h2>

                        <div className="grid lg:grid-cols-2 gap-5">

                            <div>

                                <label className="label">

                                    Country

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

                                    City

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

                                    Postal Code

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

                                    Address

                                </label>

                                <textarea
                                    rows="4"
                                    name="address"
                                    className="textarea textarea-bordered w-full"
                                    value={formData.address}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Notes
                ========================================== */}

                <div className="card bg-base-100 border shadow-md mt-6">

                    <div className="card-body">

                        <h2 className="card-title text-primary">

                            📝 Notes

                        </h2>

                        <textarea
                            rows="5"
                            name="notes"
                            className="textarea textarea-bordered w-full"
                            placeholder="Additional information..."
                            value={formData.notes}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline btn-error"
                    >

                        Cancel

                    </button>

                    <button
                        type="reset"
                        className="btn btn-outline"
                    >

                        Reset

                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >

                        {

                            loading ?

                                <span className="loading loading-spinner loading-sm"></span>

                                :

                                <>

                                    <FaSave />

                                    Save Organization

                                </>

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default NewClient;