import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router";
import {
    FaArrowLeft,
    FaEdit,
    FaBuilding,
    FaGlobe,
    FaMapMarkerAlt,
    FaIndustry,
    FaHashtag,
    FaSitemap,
    FaUser,
    FaPhone,
    FaMobileAlt,
    FaEnvelope,
    FaFileAlt,
    FaDownload,
    FaStickyNote
} from "react-icons/fa";

import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const DetailsOrganization = () => {

    const { id } = useParams();

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const [organization, setOrganization] = useState(null);

    const [loading, setLoading] = useState(true);

    /* ==========================================
            Load Organization
    ========================================== */

    useEffect(() => {

        const loadOrganization = async () => {

            try {

                setLoading(true);

                const { data } = await axiosSecure.get(`/organizations/${id}`);

                setOrganization(data.data);

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

                setLoading(false);

            }

        };

        loadOrganization();

    }, [id, axiosSecure, navigate]);

    /* ==========================================
            Loading State
    ========================================== */

    if (loading) {

        return (

            <div className="flex justify-center items-center py-20">

                <span className="loading loading-spinner loading-lg text-primary"></span>

            </div>

        );

    }

    if (!organization) {

        return null;

    }

    return (

        <div className="p-6">

            <Helmet>

                <title>PMS || Organization Details</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold flex items-center gap-3">

                        <FaBuilding className="text-primary" />

                        {organization.organizationName}

                    </h2>

                    <p className="text-gray-500 mt-1">

                        Complete organization information.

                    </p>

                </div>

                <div className="flex gap-3">

                    <Link
                        to={`/organizations/update/${organization._id}`}
                        className="btn btn-warning text-white"
                    >

                        <FaEdit />

                        Edit Organization

                    </Link>

                    <Link
                        to="/organizations"
                        className="btn btn-outline"
                    >

                        <FaArrowLeft />

                        Organization List

                    </Link>

                </div>

            </div>

            <div className="space-y-6">

                {/* ==========================================
                        Basic Information
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">

                            <h2 className="card-title text-primary">

                                Basic Information

                            </h2>

                            <span
                                className={`badge ${organization.status === "Active"
                                    ? "badge-success"
                                    : "badge-error"
                                    }`}
                            >

                                {organization.status}

                            </span>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            <div className="flex items-start gap-3">

                                <FaBuilding className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">Organization Type</p>

                                    <p className="font-semibold">

                                        {organization.organizationType}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-3">

                                <FaHashtag className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">Organization Code</p>

                                    <p className="font-semibold">

                                        {organization.organizationCode || "-"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-3">

                                <FaSitemap className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">Parent Organization</p>

                                    <p className="font-semibold">

                                        {

                                            organization.parentOrganization

                                                ? (

                                                    <Link
                                                        to={`/organizations/${organization.parentOrganization}`}
                                                        className="link link-primary"
                                                    >

                                                        View Parent

                                                    </Link>

                                                )

                                                : "-"

                                        }

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-3">

                                <FaIndustry className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">Industry</p>

                                    <p className="font-semibold">

                                        {organization.industry || "-"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-3">

                                <FaGlobe className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">Website</p>

                                    <p className="font-semibold">

                                        {

                                            organization.website ? (

                                                <Link
                                                    to={organization.website}
                                                    target="_blank"
                                                    reloadDocument
                                                    className="link link-primary"
                                                >

                                                    {organization.website}

                                                </Link>

                                            ) : "-"

                                        }

                                    </p>

                                </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                            <div className="flex items-start gap-3">

                                <FaMapMarkerAlt className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">Country</p>

                                    <p className="font-semibold">

                                        {organization.address?.country || "-"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-3">

                                <FaMapMarkerAlt className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">City</p>

                                    <p className="font-semibold">

                                        {organization.address?.city || "-"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-3">

                                <FaMapMarkerAlt className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">Postal Code</p>

                                    <p className="font-semibold">

                                        {organization.address?.postalCode || "-"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-3 md:col-span-2 lg:col-span-3">

                                <FaMapMarkerAlt className="text-primary mt-1" />

                                <div>

                                    <p className="text-sm text-gray-500">Full Address</p>

                                    <p className="font-semibold">

                                        {organization.address?.address || "-"}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                        Contact Persons
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Contact Persons

                            <span className="badge badge-neutral">

                                {organization.contactPersons?.length || 0}

                            </span>

                        </h2>

                        {

                            !organization.contactPersons || organization.contactPersons.length === 0 ? (

                                <p className="text-gray-500 text-center py-6">

                                    No contact persons added.

                                </p>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="table table-zebra">

                                        <thead>

                                            <tr>

                                                <th>#</th>

                                                <th>Contact Person</th>

                                                <th>Designation</th>

                                                <th>Mobile</th>

                                                <th>Phone</th>

                                                <th>Email</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {

                                                organization.contactPersons.map((contact, index) => (

                                                    <tr key={index}>

                                                        <td>{index + 1}</td>

                                                        <td className="font-semibold">

                                                            <FaUser className="inline text-primary mr-2" />

                                                            {contact.contactPerson}

                                                        </td>

                                                        <td>{contact.designation || "-"}</td>

                                                        <td>

                                                            {

                                                                contact.mobile && (

                                                                    <span className="flex items-center gap-1">

                                                                        <FaMobileAlt className="text-gray-400" />

                                                                        {contact.mobile}

                                                                    </span>

                                                                )

                                                            }

                                                        </td>

                                                        <td>

                                                            {

                                                                contact.phone && (

                                                                    <span className="flex items-center gap-1">

                                                                        <FaPhone className="text-gray-400" />

                                                                        {contact.phone}

                                                                    </span>

                                                                )

                                                            }

                                                        </td>

                                                        <td>

                                                            {

                                                                contact.email && (

                                                                    <span className="flex items-center gap-1">

                                                                        <FaEnvelope className="text-gray-400" />

                                                                        {contact.email}

                                                                    </span>

                                                                )

                                                            }

                                                        </td>

                                                    </tr>

                                                ))

                                            }

                                        </tbody>

                                    </table>

                                </div>

                            )

                        }

                    </div>

                </div>

                {/* ==========================================
                        Documents
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Documents

                            <span className="badge badge-neutral">

                                {organization.documents?.length || 0}

                            </span>

                        </h2>

                        {

                            !organization.documents || organization.documents.length === 0 ? (

                                <p className="text-gray-500 text-center py-6">

                                    No documents uploaded.

                                </p>

                            ) : (

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                    {

                                        organization.documents.map((doc, index) => (

                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-3 border rounded-lg p-4"
                                            >

                                                <div className="flex items-center gap-3 overflow-hidden">

                                                    <FaFileAlt className="text-primary text-xl shrink-0" />

                                                    <span className="font-medium truncate">

                                                        {doc.documentName}

                                                    </span>

                                                </div>

                                                <Link
                                                    to={`${import.meta.env.VITE_API_BASE_URL}${doc.fileUrl}`}
                                                    target="_blank"
                                                    reloadDocument
                                                    className="btn btn-sm btn-outline btn-primary shrink-0"
                                                >

                                                    <FaDownload />

                                                </Link>

                                            </div>

                                        ))

                                    }

                                </div>

                            )

                        }

                    </div>

                </div>

                {/* ==========================================
                        Notes
                ========================================== */}

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            <FaStickyNote />

                            Notes

                        </h2>

                        <p className="text-gray-700 whitespace-pre-line">

                            {organization.notes || "No notes added."}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default DetailsOrganization;