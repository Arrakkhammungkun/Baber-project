import { useState, useEffect, useRef } from "react";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";
import Layout from "./components/Layout";
import Swal from "sweetalert2";

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl_img = import.meta.env.VITE_API_IMG;

const ProfilePage = () => {
  const [nick_name, setName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user, fetchUser } = useAuth();
  const inputFile = useRef(null);

  useEffect(() => {
    if (user) {
      
      setName(user.nick_name || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setProfileImage(user.profile_image || "");
      console.log("Profile image URL:", `${apiUrl_img}${user.profile_image}`);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleImageError = () => {
    console.error("Failed to load profile image");
    setError("Could not load profile image");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("nick_name", nick_name);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    if (file) {
      formData.append("profile_image", file);
      
    }

    try {
      const response = await axios.post(`${apiUrl}/upload-profile/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
     
      const { user: updatedUser } = response.data;
      setName(updatedUser.nick_name || "");
      setFirstName(updatedUser.first_name || "");
      setLastName(updatedUser.last_name || "");
      setProfileImage(updatedUser.profile_image || "");
      setFile(null);
      setFileUrl(null);
      fetchUser(updatedUser);
      Swal.fire({
        icon: "success",
        title: "Profile updated successfully!",
        confirmButtonText: "OK",
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Upload failed");
        console.log("Error response:", err.response.data);
        Swal.fire({
          icon: "error",
          title: "Failed to update profile",
          text: err.response.data.error || "Please try again.",
          confirmButtonText: "OK",
        });
      } else {
        setError("An error occurred. Please try again.");
        console.log("Error:", err.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred.",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-[url(/src/img/welcome.jpg)] bg-cover bg-center min-h-screen flex items-center justify-center p-4">
        <div className="container mx-auto max-w-7xl w-full">
          <header className="mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white p-2 mt-14">
              Profile
            </h1>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white p-2 pb-5 capitalize">
              Your Profile
            </h1>
            <hr className="bg-white border-white border-2 w-full" />
          </header>

          <div className="flex flex-col mt-[-6rem] lg:flex-row gap-4 sm:gap-6 md:gap-10 justify-center items-center min-h-[calc(100vh-200px)] relative">
            <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 pl-2 sm:pl-4">
              <div className="flex flex-col items-center justify-center">
                {["S", "T", "Y", "L", "E", "X"].map((char, index) => (
                  <h1
                    key={index}
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white p-1 sm:p-2 md:p-3 leading-tight"
                  >
                    {char}
                  </h1>
                ))}
              </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 sm:gap-6 pl-0 sm:pl-12 md:pl-16">
              <div className="w-full bg-white bg-opacity-85 p-4 sm:p-6 rounded-xl border border-gray-400 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-10">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-3 sm:mb-4">
                    Edit Name & Picture
                  </h2>
                  <form onSubmit={handleSave} className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <h2 className="text-xs sm:text-sm md:text-base font-bold w-20 sm:w-24 text-black">
                        Name:
                      </h2>
                      <input
                        className="placeholder:text-black border p-1 sm:p-2 flex-1 rounded-lg w-full"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        placeholder={nick_name}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <h2 className="text-xs sm:text-sm md:text-base font-bold w-20 sm:w-24 text-black">
                        First Name:
                      </h2>
                      <input
                        className="placeholder:text-black border p-1 sm:p-2 flex-1 rounded-lg w-full"
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={first_name}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <h2 className="text-xs sm:text-sm md:text-base font-bold w-20 sm:w-24 text-black">
                        Last Name:
                      </h2>
                      <input
                        className="placeholder:text-black border p-1 sm:p-2 flex-1 rounded-lg w-full"
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={last_name}
                      />
                    </div>

                    {error && (
                      <div className="mt-2 text-red-500 text-sm">{error}</div>
                    )}

                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`bg-white text-green-500 px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-lg border-2 border-green-500 hover:bg-green-500 hover:text-white ease-in-out duration-300 ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md bg-white bg-opacity-85 rounded-lg shadow-lg flex flex-col items-center p-4 sm:p-6">
              <div className="relative w-32 sm:w-40 md:w-52 h-32 sm:h-40 md:h-52 mb-3 sm:mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md">
                  {file ? (
                    <img
                      src={fileUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : profileImage ? (
                    <img
                      src={`${apiUrl_img}${profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => console.error("Failed to load image:", `${apiUrl_img}${profileImage}`)}
                    />
                  ) : (
                    <div className="w-full h-full flex justify-center items-center bg-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-500"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                      >
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 md:gap-8 w-full justify-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={inputFile}
                  onChange={handleImageChange}
                  hidden
                />
                <button
                  type="button"
                  onClick={() => {
                    inputFile.current?.click();
                  }}
                  className="bg-white text-blue-500 px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-lg border-2 border-blue-500 hover:bg-blue-500 hover:text-white ease-in-out duration-300"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;