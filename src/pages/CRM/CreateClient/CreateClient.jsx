import React, { useEffect, useState } from "react";
import { FaSave, FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const CreateClient = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: "",
        clientCode: "",
        contactPerson: "",
        designation: "",
        email: "",
        phone: "",
        mobile: "",
        website: "",
        address: "",
        clientType: "Corporate",
        status: "Active",
        source: "",
        notes: "",
        createdBy: user?.email,
    });

    const loadClients = async () => {
        setLoading(true);
        const {data} = await axiosSecure.get("/clients");
        setClients(data.data);
        setLoading(false)
    }

    useEffect(() => {
        loadClients();
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(formData);

        // API Call Here
        /* fetch("http://localhost:5000/create-client", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
            }) */

        const { data } = await axiosSecure.post("/create-client", formData)
        // console.log(data)

        if (data.insertedId) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Client has been saved",
                showConfirmButton: false,
                timer: 1500
            });
            e.target.reset();
        }
    };

    return (
        <div className="p-6">
            <title>PMS || Create Client</title>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold">
                        Create Client
                    </h2>
                    <p className="text-gray-500">
                        Add a new client into CRM
                    </p>
                </div>

                <Link
                    to="/clients"
                    className="btn btn-primary btn-outline "
                >
                    <FaArrowLeft />
                    Clients
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-base-100 rounded-xl shadow border"
            >
                <div className="p-8">

                    <div className="grid lg:grid-cols-2 gap-5">

                        {/* Company Name */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Company Name *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="companyName"
                                className="input input-bordered w-full"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Client Code */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Client Code
                                </span>
                            </label>

                            <input
                                type="text"
                                name="clientCode"
                                className="input input-bordered w-full"
                                value={formData.clientCode}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Contact Person */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Contact Person *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="contactPerson"
                                className="input input-bordered w-full"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                required
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
                                value={formData.designation}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Email
                                </span>
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="input input-bordered w-full"
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Mobile *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="mobile"
                                className="input input-bordered w-full"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="label">
                                <span className="label-text">
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

                        {/* Client Type */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Client Type
                                </span>
                            </label>

                            <select
                                name="clientType"
                                className="select select-bordered w-full"
                                value={formData.clientType}
                                onChange={handleChange}
                            >
                                <option>Corporate</option>
                                <option>Individual</option>
                                <option>Government</option>
                                <option>NGO</option>
                            </select>
                        </div>

                        {/* Status */}
                        {/* <div>
                            <label className="label">
                                <span className="label-text">
                                    Status
                                </span>
                            </label>

                            <select
                                name="status"
                                className="select select-bordered w-full"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Lead</option>
                            </select>
                        </div> */}

                        {/* Source */}
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Lead Source
                                </span>
                            </label>

                            <input
                                type="text"
                                name="source"
                                className="input input-bordered w-full"
                                value={formData.source}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    {/* Address */}
                    <div className="mt-5">
                        <label className="label">
                            <span className="label-text">
                                Address
                            </span>
                        </label>

                        <textarea
                            name="address"
                            rows="3"
                            className="textarea textarea-bordered w-full"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Notes */}
                    <div className="mt-5">
                        <label className="label">
                            <span className="label-text">
                                Notes
                            </span>
                        </label>

                        <textarea
                            name="notes"
                            rows="4"
                            className="textarea textarea-bordered w-full"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="border-t p-5 flex justify-end gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline btn-error"
                    >
                        Cancle
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
                    >
                        <FaSave />
                        Save Client
                    </button>
                </div>

            </form>

        </div>
    );
};

export default CreateClient;