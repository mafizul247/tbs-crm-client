import { useEffect, useState } from "react";
import { Link } from "react-router";

import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaTrash,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Clients = () => {
    const axiosSecure = useAxiosSecure();

    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const loadClients = async () => {
        try {
            setLoading(true);

            const res = await axiosSecure.get(`/clients?search=${search}`);

            setClients(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, [search]);

    const handleDelete = async (id) => {
        /* const confirmDelete = window.confirm(
            "Are you sure you want to delete this client?"
        );

        if (!confirmDelete) return;

        try {
            await axiosSecure.delete(`/clients/${id}`);

            loadClients();
        } catch (error) {
            console.log(error);
        } */

        /* Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed)
                try {
                    const { data } = await axiosSecure.delete(`/clients/${id}`);
                    console.log(data)
                    if (data.deletedCount > 0) {

                        Swal.fire({
                            title: "Deleted!",
                            text: "Client has been deleted.",
                            icon: "success"
                        });
                        loadClients();
                    }
                } catch (error) {
                    console.log(error);
                }
        }); */

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {

            if (result.isConfirmed) {

                try {

                    const { data } = await axiosSecure.delete(`/clients/${id}`);

                    if (data.deletedCount > 0) {

                        Swal.fire({
                            title: "Deleted!",
                            text: "Client has been deleted.",
                            icon: "success"
                        });

                        loadClients();
                    }

                } catch (error) {
                    console.log(error);
                }

            }

        });
    };

    return (
        <div className="p-6">
            <title>PMS || Clients</title>

            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

                <h2 className="text-3xl font-bold">
                    Client Management
                </h2>

                <Link
                    to="/create-client"
                    className="btn btn-primary"
                >
                    <FaPlus />
                    Add Client
                </Link>

            </div>

            {/* Search */}

            <div className="card bg-base-100 shadow border mb-6">

                <div className="card-body">

                    <div className="join w-full">

                        <input
                            type="text"
                            className="input input-bordered join-item w-full"
                            placeholder="Search Company, Contact, Email or Mobile..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button className="btn btn-primary join-item">
                            <FaSearch />
                        </button>

                    </div>

                </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto bg-base-100 rounded-xl shadow border">

                <table className="table table-zebra">

                    <thead>

                        <tr>
                            <th>#</th>
                            <th>Company</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th className="text-center">
                                Action
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center py-10"
                                >
                                    <span className="loading loading-spinner loading-lg"></span>
                                </td>
                            </tr>
                        ) : clients.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center py-10"
                                >
                                    No Client Found
                                </td>
                            </tr>
                        ) : (
                            clients.map((client, index) => (
                                <tr key={client._id}>
                                    <td>{index + 1}</td>

                                    <td>{client.companyName}</td>

                                    <td>{client.contactPerson}</td>

                                    <td>{client.email}</td>

                                    <td>{client.mobile}</td>

                                    <td>
                                        <span
                                            className={`badge ${client.status === "Active"
                                                ? "badge-success"
                                                : "badge-error"
                                                }`}
                                        >
                                            {client.status}
                                        </span>
                                    </td>

                                    <td>

                                        <div className="flex justify-center gap-2">

                                            <Link
                                                to={`/clients/${client._id}`}
                                                className="btn btn-sm btn-info text-white"
                                            >
                                                <FaEye />
                                            </Link>

                                            <Link
                                                to={`/update-client/${client._id}`}
                                                className="btn btn-sm btn-warning"
                                            >
                                                <FaEdit />
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(client._id)
                                                }
                                                className="btn btn-sm btn-error text-white"
                                            >
                                                <FaTrash />
                                            </button>

                                        </div>

                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default Clients;