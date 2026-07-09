import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
    FaArrowLeft,
    FaBuilding,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaGlobe,
    FaMapMarkerAlt,
    FaIdCard,
    FaFileInvoice,
    FaStickyNote,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const ViewClient = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClient();
    }, [id]);

    const loadClient = async () => {
        try {
            setLoading(true);

            const res = await axiosSecure.get(`/clients/${id}`);

            setClient(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    console.log(client)

    return (
        <div className="p-6">
            <title>PMS || View Client</title>

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-3xl font-bold">
                        Client Details
                    </h2>

                    <p className="text-gray-500">
                        View complete client information
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

            <div className="bg-base-100 rounded-xl shadow border">

                <div className="p-8">

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <FaBuilding />
                                Company Name
                            </label>

                            <p className="mt-1">
                                {client.companyName || "-"}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <FaIdCard />
                                Client Code
                            </label>

                            <p className="mt-1">
                                {client.clientCode || "-"}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <FaUser />
                                Contact Person
                            </label>

                            <p className="mt-1">
                                {client.contactPerson || "-"}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold">
                                Designation
                            </label>

                            <p className="mt-1">
                                {client.designation || "-"}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <FaEnvelope />
                                Email
                            </label>

                            <p className="mt-1">
                                {client.email || "-"}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <FaPhone />
                                Phone
                            </label>

                            <p className="mt-1">
                                {client.phone || "-"}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold">
                                Mobile
                            </label>

                            <p className="mt-1">
                                {client.mobile || "-"}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold flex items-center gap-2">
                                <FaGlobe />
                                Website
                            </label>

                            <p className="mt-1">
                                {client.website || "-"}
                            </p>
                        </div>

                        {/* <div>
                            <label className="font-semibold">
                                Industry
                            </label>

                            <p className="mt-1">
                                {client.industry || "-"}
                            </p>
                        </div> */}

                        <div>
                            <label className="font-semibold">
                                Client Type
                            </label>

                            <p className="mt-1">
                                {client.clientType || "-"}
                            </p>
                        </div>

                        {/* <div>
                            <label className="font-semibold">
                                Tax Number
                            </label>

                            <p className="mt-1">
                                {client.taxNumber || "-"}
                            </p>
                        </div> */}

                        {/* <div>
                            <label className="font-semibold">
                                Trade License
                            </label>

                            <p className="mt-1">
                                {client.tradeLicense || "-"}
                            </p>
                        </div> */}

                        {/* <div>
                            <label className="font-semibold flex items-center gap-2">
                                <FaMapMarkerAlt />
                                City
                            </label>

                            <p className="mt-1">
                                {client.city || "-"}
                            </p>
                        </div> */}

                        {/* <div>
                            <label className="font-semibold">
                                Country
                            </label>

                            <p className="mt-1">
                                {client.country || "-"}
                            </p>
                        </div> */}

                        {/* <div>
                            <label className="font-semibold">
                                Postal Code
                            </label>

                            <p className="mt-1">
                                {client.postalCode || "-"}
                            </p>
                        </div> */}

                        <div>
                            <label className="font-semibold">
                                Lead Source
                            </label>

                            <p className="mt-1">
                                {client.source || "-"}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold">
                                Status
                            </label>

                            <p className="mt-2">

                                <span
                                    className={`badge ${client.status === "Active"
                                        ? "badge-success"
                                        : "badge-error"
                                        }`}
                                >
                                    {client.status}
                                </span>

                            </p>
                        </div>

                    </div>

                    <div className="divider"></div>

                    <div>

                        <label className="font-semibold flex items-center gap-2">
                            <FaMapMarkerAlt />
                            Address
                        </label>

                        <p className="mt-2">
                            {client.address || "-"}
                        </p>

                    </div>

                    <div className="mt-6">

                        <label className="font-semibold flex items-center gap-2">
                            <FaStickyNote />
                            Notes
                        </label>

                        <p className="mt-2 whitespace-pre-line">
                            {client.notes || "-"}
                        </p>

                    </div>

                    <div className="divider"></div>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>

                            <label className="font-semibold">
                                Created By
                            </label>

                            <p className="mt-1">
                                {client.createdBy || "-"}
                            </p>

                        </div>

                        <div>

                            <label className="font-semibold">
                                Created At
                            </label>

                            <p className="mt-1">
                                {client.createdAt
                                    ? new Date(client.createdAt).toLocaleString()
                                    : "-"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ViewClient;