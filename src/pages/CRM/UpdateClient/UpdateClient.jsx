import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const UpdateClient = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(true);

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
        clientType: "",
        status: "",
        source: "",
        notes: "",
    });

    useEffect(() => {
        loadClient();
    }, []);

    const loadClient = async () => {

        try {

            const res = await axiosSecure.get(`/clients/${id}`);

            setFormData(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const { data } = await axiosSecure.patch(`/clients/${id}`, formData);

            // console.log(data)
            if (data.modifiedCount > 0) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Client updated has been saved",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate("/clients");
            }



        } catch (err) {

            console.log(err);

        }

    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (

        <div className="p-6">
            <title>PMS || Update Client</title>

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-3xl font-bold">
                        Update Client
                    </h2>

                    <p className="text-gray-500">
                        Edit client information
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

            <form
                onSubmit={handleSubmit}
                className="bg-base-100 rounded-xl shadow border"
            >

                <div className="p-8">

                    {/* Replace this section with the same form fields from CreateClient */}

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>

                            <label className="label">
                                Company Name
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

                        <div>

                            <label className="label">
                                Client Code
                            </label>

                            <input
                                type="text"
                                name="clientCode"
                                className="input input-bordered w-full"
                                value={formData.clientCode}
                                onChange={handleChange}
                            />

                        </div>

                        <div>

                            <label className="label">
                                Contact Person
                            </label>

                            <input
                                type="text"
                                name="contactPerson"
                                className="input input-bordered w-full"
                                value={formData.contactPerson}
                                onChange={handleChange}
                            />

                        </div>

                        <div>

                            <label className="label">
                                Designation
                            </label>

                            <input
                                type="text"
                                name="designation"
                                className="input input-bordered w-full"
                                value={formData.designation}
                                onChange={handleChange}
                            />

                        </div>

                        <div>

                            <label className="label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="input input-bordered w-full"
                                value={formData.email}
                                onChange={handleChange}
                            />

                        </div>

                        <div>

                            <label className="label">
                                Mobile
                            </label>

                            <input
                                type="text"
                                name="mobile"
                                className="input input-bordered w-full"
                                value={formData.mobile}
                                onChange={handleChange}
                            />

                        </div>

                        <div>

                            <label className="label">
                                Website
                            </label>

                            <input
                                type="text"
                                name="website"
                                className="input input-bordered w-full"
                                value={formData.website}
                                onChange={handleChange}
                            />

                        </div>

                        {/* <div>

                            <label className="label">
                                Industry
                            </label>

                            <input
                                type="text"
                                name="industry"
                                className="input input-bordered w-full"
                                value={formData.industry}
                                onChange={handleChange}
                            />

                        </div> */}

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

                        {/* Status  */}
                        <div>

                            <label className="label">
                                Status
                            </label>

                            <select
                                name="status"
                                className="select select-bordered w-full"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>

                        </div>

                    </div>

                    <div className="mt-5">

                        <label className="label">
                            Address
                        </label>

                        <textarea
                            rows="3"
                            name="address"
                            className="textarea textarea-bordered w-full"
                            value={formData.address}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="mt-5">

                        <label className="label">
                            Notes
                        </label>

                        <textarea
                            rows="4"
                            name="notes"
                            className="textarea textarea-bordered w-full"
                            value={formData.notes}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <div className="border-t p-5 flex justify-end">

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        <FaSave />
                        Update Client
                    </button>

                </div>

            </form>

        </div>

    );

};

export default UpdateClient;