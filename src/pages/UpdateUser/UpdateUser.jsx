import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router";
import {
    FaArrowLeft,
    FaSave,
    FaUser,
    FaEnvelope,
    FaUserTag,
    FaImage
} from "react-icons/fa";

import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UpdateUser = () => {

    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [newImage, setNewImage] = useState(null);

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        role: "User",
        status: "Active",
        photo: ""

    });

    /* ==========================================
            Load Existing User
    ========================================== */

    useEffect(() => {

        const loadUser = async () => {

            try {

                setFetching(true);

                const { data } = await axiosSecure.get(`/users/${id}`);
                console.log(data)
                setFormData({

                    name: data.name || "",
                    email: data.email || "",
                    role: data.role || "User",
                    status: data.status || "Active",
                    photo: data.photo || ""

                });

            }
            catch (error) {

                console.log(error);

                Swal.fire({
                    icon: "error",
                    title: "Failed to Load User",
                    text: error.message
                });

            }
            finally {

                setFetching(false);

            }

        };

        loadUser();

    }, [id, axiosSecure]);

    /* ==========================================
            Input Change
    ========================================== */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };

    /* ==========================================
            Image Change
    ========================================== */

    const handleImage = (e) => {

        setNewImage(e.target.files[0]);

    };

    /* ==========================================
            Submit
    ========================================== */

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            let photoURL = formData.photo;

            // Step 1 : Upload New Image (if selected)

            if (newImage) {

                const imageData = new FormData();

                imageData.append("image", newImage);

                const uploadResponse = await axiosSecure.post(

                    "/upload-user-image",

                    imageData,

                    {

                        headers: {

                            "Content-Type": "multipart/form-data"

                        }

                    }

                );

                photoURL = uploadResponse.data.imageUrl;

            }

            // Step 2 : Update User Info

            const updatedInfo = {

                name: formData.name,

                role: formData.role,

                status: formData.status,

                photo: photoURL

            };

            const { data } = await axiosSecure.patch(

                `/users/${id}`,

                updatedInfo

            );

            if (data.modifiedCount > 0 || data.matchedCount > 0) {

                Swal.fire({

                    icon: "success",

                    title: "User Updated Successfully",

                    timer: 1800,

                    showConfirmButton: false

                });

                navigate("/users");

            }

        }
        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Update Failed",

                text: error.message

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

                <title>PMS || Update User</title>

            </Helmet>

            {/* Header */}

            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

                <div>

                    <h2 className="text-3xl font-bold">

                        Update User

                    </h2>

                    <p className="text-gray-500">

                        Edit user information.

                    </p>

                </div>

                <Link
                    to="/users"
                    className="btn btn-outline"
                >

                    <FaArrowLeft />

                    User List

                </Link>

            </div>

            <form onSubmit={handleUpdate}>

                <div className="card bg-base-100 shadow border">

                    <div className="card-body">

                        <h2 className="card-title text-primary mb-5">

                            Personal Information

                        </h2>

                        {/* Current Photo Preview */}

                        <div className="flex items-center gap-4 mb-3">

                            <div className="avatar">

                                <div className="w-16 rounded-full">

                                    <img
                                        src={

                                            newImage

                                                ? URL.createObjectURL(newImage)

                                                : formData.photo

                                                    ? `${import.meta.env.VITE_API_BASE_URL}${formData.photo}`

                                                    : "https://i.ibb.co/4pDNDk1/avatar.png"

                                        }
                                        alt={formData.name}
                                    />

                                </div>

                            </div>

                            <span className="text-sm text-gray-500">

                                Current profile photo

                            </span>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            {/* Full Name */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Full Name

                                    </span>

                                </label>

                                <div className="relative">

                                    <FaUser className="absolute left-4 top-4 text-gray-400" />

                                    <input
                                        type="text"
                                        name="name"
                                        className="input input-bordered w-full pl-6"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            {/* User Role */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        User Role

                                    </span>

                                </label>

                                <div className="relative">

                                    <FaUserTag className="absolute left-4 top-4 text-gray-400" />

                                    <select
                                        name="role"
                                        className="select select-bordered w-full pl-6"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >

                                        <option>User</option>
                                        <option>Admin</option>
                                        <option>Super Admin</option>
                                        <option>Employee</option>
                                        <option>Sales Executive</option>
                                        <option>HR</option>
                                        <option>Accounts</option>
                                        <option>Manager</option>

                                    </select>

                                </div>

                            </div>

                            {/* Email (Read-only) */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Email Address

                                    </span>

                                </label>

                                <div className="relative">

                                    <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

                                    <input
                                        type="email"
                                        name="email"
                                        className="input input-bordered w-full pl-6"
                                        value={formData.email}
                                        disabled
                                        title="Email cannot be changed here (tied to login account)"
                                    />

                                </div>

                            </div>

                            {/* Status */}

                            <div>

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        Status

                                    </span>

                                </label>

                                <select
                                    name="status"
                                    className="select select-bordered w-full pl-6"
                                    value={formData.status}
                                    onChange={handleChange}
                                >

                                    <option value="Active">
                                        Active
                                    </option>
                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                            {/* Profile Picture */}

                            <div className="lg:col-span-2">

                                <label className="label">

                                    <span className="label-text font-semibold">

                                        <FaImage className="inline mr-2" />

                                        Change Profile Picture

                                    </span>

                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input file-input-bordered w-full"
                                    onChange={handleImage}
                                />

                                <label className="label">

                                    <span className="label-text-alt text-gray-500">

                                        Leave empty to keep current photo. JPG, JPEG or PNG (Maximum 2MB)

                                    </span>

                                </label>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 mt-6">

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

                                ?

                                <span className="loading loading-spinner loading-sm"></span>

                                :

                                <>

                                    <FaSave />

                                    Update User

                                </>

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default UpdateUser;