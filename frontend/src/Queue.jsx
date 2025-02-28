import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
const URLSOCKET = import.meta.env.VITE_API_URLSOCKET;
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl_img = import.meta.env.VITE_API_IMG;
import Layout from "./components/Layout";

const Queue = () => {
  const { token, user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [position, setPosition] = useState(null);
  const [wsError, setWsError] = useState(false);

  useEffect(() => {
    const fetchUserQueue = async () => {
      try {
        if (!user?.user_id || !token) return;
        const response = await fetch(`${apiUrl}/bookings/queue/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setQueue(data);
        const userBookingsFiltered = data.filter(
          (q) => q.customer.id === user.user_id
        );
        setUserBookings(userBookingsFiltered);
        if (userBookingsFiltered.length > 0) {
          setSelectedBooking(userBookingsFiltered[0]);
          const employeeQueues = data.filter(
            (q) =>
              q.employee.id === userBookingsFiltered[0].employee.id &&
              q.status === "pending"
          );
          const userPosition =
            employeeQueues.findIndex(
              (q) => q.id === userBookingsFiltered[0].id
            ) + 1;
          setPosition(userPosition > 0 ? userPosition : null);
        }
      } catch (error) {
        console.error("Error fetching queue from API:", error);
      }
    };

    fetchUserQueue();
  }, [user, token]);

  useEffect(() => {
    let newSocket;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      newSocket = new WebSocket(`${URLSOCKET}/ws/queue/`);

      newSocket.onopen = () => {
        console.log("Connected to WebSocket");
        setWsError(false);
        reconnectAttempts = 0;
        if (user?.user_id) {
          newSocket.send(
            JSON.stringify({ action: "fetch_queue", user_id: user.user_id })
          );
        } else {
          console.warn("User not authenticated, skipping WebSocket data fetch");
        }
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket data received:", data);
          if (Array.isArray(data)) {
            setQueue(data);
            const updatedUserBookings =
              user && user.user_id
                ? data.filter((q) => q.customer.id === user.user_id)
                : [];
            setUserBookings(updatedUserBookings);

            if (updatedUserBookings.length > 0) {
              let newSelected = selectedBooking
                ? data.find((q) => q.id === selectedBooking.id) ||
                  updatedUserBookings[0]
                : updatedUserBookings[0];
              setSelectedBooking(newSelected);

              if (newSelected) {
                const employeeQueues = data.filter(
                  (q) =>
                    q.employee.id === newSelected.employee.id &&
                    q.status === "pending"
                );
                const userPosition =
                  employeeQueues.findIndex((q) => q.id === newSelected.id) + 1;
                setPosition(userPosition > 0 ? userPosition : null);
              } else {
                setPosition(null);
              }
            } else {
              setSelectedBooking(null);
              setPosition(null);
            }
          } else if (data.delete) {
            setQueue((prev) => prev.filter((q) => q.id !== data.delete));
            const updatedUserBookings = userBookings.filter(
              (q) => q.id !== data.delete
            );
            setUserBookings(updatedUserBookings);

            if (updatedUserBookings.length > 0) {
              let newSelected =
                selectedBooking && selectedBooking.id === data.delete
                  ? updatedUserBookings[0]
                  : selectedBooking;
              setSelectedBooking(newSelected);

              if (newSelected) {
                const employeeQueues = queue.filter(
                  (q) =>
                    q.employee.id === newSelected.employee.id &&
                    q.status === "pending"
                );
                const userPosition =
                  employeeQueues.findIndex((q) => q.id === newSelected.id) + 1;
                setPosition(userPosition > 0 ? userPosition : null);
              } else {
                setPosition(null);
              }
            } else {
              setSelectedBooking(null);
              setPosition(null);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      newSocket.onclose = () => {
        console.log("WebSocket closed, attempting to reconnect...");
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts++;
            connectWebSocket();
          }, 3000);
        } else {
          console.error(
            "Max reconnect attempts reached. Please check backend WebSocket server."
          );
          setWsError(true);
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsError(true);
      };
    };

    if (user) {
      connectWebSocket();
    }

    return () => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [user]);

  const handleCancelBooking = (bookingId) => {
    fetch(`${apiUrl}/bookings/${bookingId}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        console.log(
          `Booking ${bookingId} cancelled, waiting for WebSocket update`
        );
      })
      .catch((error) => console.error("Error cancelling booking:", error));
  };

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    const employeeQueues = queue.filter(
      (q) => q.employee.id === booking.employee.id && q.status === "pending"
    );
    const userPosition =
      employeeQueues.findIndex((q) => q.id === booking.id) + 1;
    setPosition(userPosition > 0 ? userPosition : null);
  };

  const getEmployeeQueue = () => {
    if (!selectedBooking) {
      return [];
    }
    const employeeId = selectedBooking.employee.id;
    return queue
      .filter(
        (q) =>
          q.employee.id === employeeId &&
          (q.status === "pending" || q.status === "In_progress")
      )
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto mt-24 px-4 text-center text-white">
          <h1 className="text-2xl md:text-3xl font-bold">
            กรุณาล็อกอินเพื่อดูคิวของคุณ
          </h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto mt-16 md:mt-24 px-4">
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center md:text-left">
            Queue
          </h1>
          <div className="flex flex-col md:flex-row justify-between mt-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 border-b-4 border-black w-full md:w-1/2 mb-2 md:mb-0 md:mr-2 text-center md:text-left">
              Your booking queue
            </h2>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 border-b-4 border-black w-full md:w-1/2 text-center md:text-left">
              Queue Position
            </h2>
          </div>
        </header>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-[#242529] text-white p-4 rounded-lg h-auto overflow-auto">
            <div className="flex justify-between border-b-2 mb-4 pb-2">
              <h3 className="text-base md:text-lg font-bold">รายการที่จอง</h3>
            </div>

            {userBookings.length > 0 ? (
              userBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-2 mb-2 rounded-lg cursor-pointer ${
                    selectedBooking && selectedBooking.id === booking.id
                      ? "bg-[#3a3f47]"
                      : "bg-[#242529]"
                  }`}
                  onClick={() => handleSelectBooking(booking)}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-white mb-2 gap-2">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={booking.service?.image_url || "/src/img/14.jpg"}
                        alt="Service"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <p className="text-sm md:text-base font-bold">
                        บริการ: <span>{booking.service?.name}</span>
                      </p>
                      <p className="text-sm md:text-base font-bold">
                        รายละเอียด:{" "}
                        <span>{booking.service?.description || "ไม่ระบุ"}</span>
                      </p>
                      <p className="text-sm md:text-base font-bold">
                        เวลาบริการ:{" "}
                        <span>{booking.service?.duration || 30} นาที</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center text-white mb-2 gap-2">
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={booking.employee?.profile || "/src/img/14.jpg"}
                        alt="Barber"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <p className="text-sm md:text-base font-bold">
                        ช่าง:{" "}
                        <span>
                          {booking.employee?.first_name}{" "}
                          {booking.employee?.last_name}
                        </span>
                      </p>
                      <p className="text-sm md:text-base font-bold">
                        ชื่อเล่น:{" "}
                        <span>{booking.employee?.nickname || "ไม่ระบุ"}</span>
                      </p>
                      <p className="text-sm md:text-base font-bold">
                        เพศ:{" "}
                        <span>{booking.employee?.gender || "ไม่ระบุ"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between border-b-2 mb-2 pb-2">
                    <h3 className="text-sm md:text-lg font-bold">รายละเอียด</h3>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base font-bold">วันที่</p>
                      <p className="text-sm md:text-base font-bold">
                        {new Date(booking.start_time).toLocaleDateString(
                          "th-TH"
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm md:text-base font-bold">เวลา</p>
                      <p className="text-sm md:text-base font-bold">
                        {new Date(booking.start_time).toLocaleTimeString(
                          "th-TH",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm md:text-base font-bold">
                        ค่าบริการ
                      </p>
                      <p className="text-sm md:text-base font-bold">
                        {booking.service?.price || 500} บาท
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between mt-1 gap-2">
                      <p className="text-sm md:text-base font-bold">
                        Status:{" "}
                        <span
                          className={
                            booking.status === "pending"
                              ? "text-[#FBBC05]"
                              : "text-green-500"
                          }
                        >
                          {booking.status}
                        </span>
                      </p>
                      <button
                        className="font-semibold text-white capitalize bg-[#CC2F22] py-1 px-2 rounded-lg hover:bg-red-700 duration-300 ease-in-out text-sm md:text-base"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelBooking(booking.id);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm md:text-base">
                คุณยังไม่มีคิวที่จอง
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-white">
            {wsError && (
              <p className="text-red-500 text-center mb-2 text-sm md:text-base">
                ไม่สามารถเชื่อมต่อ WebSocket ได้
                กรุณาตรวจสอบการเชื่อมต่อหรือรอสักครู่
              </p>
            )}
            <div
              key="queue-header"
              className="flex flex-col sm:flex-row justify-between bg-[#242529] p-2 rounded-lg items-center gap-2"
            >
              <div className="flex items-center">
                <h3 className="text-lg md:text-2xl font-bold text-center sm:text-left">
                  ลำดับคิวของคุณ
                  {selectedBooking
                    ? ` (การจอง ${selectedBooking.service?.name} - ${new Date(
                        selectedBooking.start_time
                      ).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })})`
                    : ""}
                </h3>
              </div>
              <div
                className={`${
                  position === 1
                    ? "bg-green-500"
                    : position === 2
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                } w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white rounded-lg border-white border-2`}
              >
                <span className="text-2xl md:text-3xl font-bold">
                  {position !== null ? position : "-"}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-base md:text-lg font-bold mb-2 text-center md:text-left">
                ลำดับคิวของช่าง{" "}
                {selectedBooking
                  ? selectedBooking.employee?.first_name
                  : "ยังไม่เลือก"}
              </h4>
              {userBookings.length > 0 && selectedBooking ? (
                getEmployeeQueue().map((q) => {
                  const queueIndex =
                    getEmployeeQueue().findIndex((item) => item.id === q.id) +
                    1;
                  const bgColor =
                    queueIndex === 1
                      ? "bg-green-500"
                      : queueIndex === 2
                      ? "bg-yellow-500"
                      : "bg-gray-500";

                  return (
                    <div
                      key={q.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center bg-[#242529] px-3 py-2 rounded-lg text-white w-full mb-2 gap-2"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden">
                        {q.customer && q.customer.profile ? (
                          <img
                            src={`${apiUrl_img}${q.customer.profile}`}
                            alt="Profile"
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex-shrink-0 rounded-md overflow-hidden object-cover">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-full h-full object-cover"
                              viewBox="0 0 448 512"
                              fill="currentColor"
                            >
                              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-grow">
                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                          <p className="text-sm md:text-base font-bold">
                            ลูกค้า:{" "}
                            <span className="text-gray-300">
                              {q.customer?.first_name} {q.customer?.last_name}
                            </span>
                          </p>
                          <p className="text-sm md:text-base font-bold">
                            เวลา:{" "}
                            <span className="text-gray-300">
                              {new Date(q.start_time).toLocaleTimeString(
                                "th-TH",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between mt-1 gap-2">
                          <p className="text-sm md:text-base font-bold">
                            สถานะ:{" "}
                            <span
                              className={
                                q.status === "pending"
                                  ? "text-[#FBBC05]"
                                  : "text-green-500"
                              }
                            >
                              {q.status}
                            </span>
                          </p>
                          <p className="text-sm md:text-base font-bold">
                            บริการ:{" "}
                            <span className="text-gray-300">
                              {q.service?.name}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={`${bgColor} w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-white rounded-lg text-xl md:text-3xl font-bold border-white border`}
                      >
                        {queueIndex}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-black text-sm md:text-base">
                  ไม่มีคิวที่รอสำหรับการจองของคุณ
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 md:py-[20rem]"></div>
    </Layout>
  );
};

export default Queue;
