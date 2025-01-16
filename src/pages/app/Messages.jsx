import _ from "lodash";
import React, { useCallback, useState, useEffect, useContext } from "react";
import { FiLoader, FiSearch } from "react-icons/fi";
import { IoCheckmarkDone } from "react-icons/io5";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  getFirestore,
  getDocs,
} from "firebase/firestore";
import Cookies from "js-cookie";
import { firestore, auth, db } from "../../firebase/firebase"; // Import your Firestore and Auth instance
import { AppContext } from "../../context/AppContext";
import { ErrorToast } from "../../components/global/Toaster";
import axios from "../../axios";
import { FaFileImage, FaRegFileAlt } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { useLocation, useParams } from "react-router-dom";

const Messages = () => {
  const { uid, setUid } = useContext(AppContext);

  const { chatId } = useParams();

  const [text, setText] = useState("");

  const [search, setSearch] = useState("");

  // Throttled function using lodash.throttle
  const throttledSearch = useCallback(
    _.throttle((query) => {
      //   getCustomers(query);
    }, 1000),
    []
  );
  const store = Cookies.get("store") ? JSON.parse(Cookies.get("store")) : null;

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    throttledSearch(value); // Call the throttled function
  };

  const [chats, setChats] = useState([]);

  const [messages, setMessages] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState([]);

  const [messageLoading, setMessageLoading] = useState(false);
  const [message, setMessage] = useState("");

  const groupMessagesByDate = (messages) => {
    return messages?.reduce((groups, message) => {
      const date = new Date(message?.timeStamp?.seconds * 1000).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date]?.push(message);
      return groups;
    }, {});
  };

  function scrollToBottom() {
    let divElement = document.getElementById("elem");
    if (divElement) {
      // Scroll smoothly to the bottom of the div
      divElement.scroll({
        top: divElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  const markMessagesAsSeen = async (chatId) => {
    try {
      const firestore = getFirestore(); // Initialize Firestore
      const auth = getAuth(); // Get the current user
      const currentUser = auth.currentUser;

      if (!currentUser) {
        ErrorToast("No authenticated user found.");
        Cookies.remove("token");
        return;
      }

      // Query to get unread messages
      const messagesRef = collection(firestore, "chats", chatId, "messages");
      const unreadMessagesQuery = query(
        messagesRef,
        where("receiverId", "==", currentUser?.uid),
        where("isSeen", "==", false)
      );

      const unreadMessagesSnapshot = await getDocs(unreadMessagesQuery);

      // Update each unread message's 'isSeen' field to true
      unreadMessagesSnapshot.forEach(async (messageDoc) => {
        await updateDoc(messageDoc.ref, { isSeen: true });
      });

      console.log("Messages marked as seen.");
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };
  const getMessages = (docId, setMessages) => {
    setMessageLoading(true);
    // Reference to the messages subcollection
    const messagesRef = collection(doc(db, "chats", docId), "messages");

    const orderedQuery = query(messagesRef, orderBy("timeStamp"));
    // Set up a real-time listener
    const unsubscribe = onSnapshot(orderedQuery, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id, // Firestore document ID
        ...doc.data(), // Document data
      }));
      setMessages(messages);
      setGroupedMessages(messages?.length > 0 && groupMessagesByDate(messages));
      setMessageLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    });

    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  };

  const [sender, setSender] = useState(null);

  const fetchUserDetails = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    return null;
  };

  const [chatLoading, setChatLoading] = useState(false);
  // Main function to fetch chats with user details
  const getUserChatsWithDetails = (setChats) => {
    const userId = store?.uid; // Get the current user's ID

    if (!userId) {
      setChats([]);
      return () => {}; // No-op cleanup
    }
    setChatLoading(true);

    // Query to get chats where the user is a participant, ordered by timestamp
    const chatsQuery = query(
      collection(db, "chats"),
      where("users", "array-contains", userId),
      orderBy("timestamp", "desc")
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatPromises = snapshot.docs.map(async (doc) => {
        const chatData = { id: doc.id, ...doc.data() };

        // Extract the other user's ID
        const otherUserId = chatData.users?.find((id) => id !== userId);

        // Fetch the other user's details if available
        if (otherUserId) {
          const otherUserDetails = await fetchUserDetails(otherUserId);
          if (otherUserDetails) {
            chatData.user = otherUserDetails; // Attach other user details
          }
        }

        return chatData;
      });

      // Wait for all chats to resolve
      const resolvedChats = await Promise.all(chatPromises);
      console.log(resolvedChats);
      setChats(resolvedChats);
      setChatLoading(false);
    });

    return unsubscribe; // Return the unsubscribe function to clean up listener
  };

  const getUnreadCounts = (chats, userId, setUnreadCounts) => {
    const firestore = getFirestore();

    const unsubscribeFunctions = chats.map((chat) => {
      if (!chat?.chatId) return;

      const messagesRef = collection(
        doc(firestore, "chats", chat?.chatId),
        "messages"
      );

      const unreadMessagesQuery = query(
        messagesRef,
        where("receiverId", "==", userId),
        where("isSeen", "==", false)
      );

      const unsubscribe = onSnapshot(unreadMessagesQuery, (snapshot) => {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [chat?.chatId]: snapshot.docs.length,
        }));
      });

      return unsubscribe; // Store unsubscribe function
    });

    return () => {
      // Cleanup all listeners
      unsubscribeFunctions.forEach(
        (unsubscribe) => unsubscribe && unsubscribe()
      );
    };
  };

  const [unreadCounts, setUnreadCounts] = useState({}); // Object to track unread counts by chatId

  useEffect(() => {
    const unsubscribe = getUnreadCounts(chats, store?.uid, setUnreadCounts);

    // Cleanup listeners on unmount
    return () => unsubscribe && unsubscribe();
  }, [chats, messages]);

  useEffect(() => {
    // Only proceed if uid exists
    if (!uid) return;

    // Initialize the listener
    const unsubscribe = getMessages(uid, setMessages);
    setTimeout(() => {
      scrollToBottom();
    }, 200);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    const unsubscribe2 = getUserChatsWithDetails(setChats);

    return () => unsubscribe2();
  }, []);

  useEffect(() => {
    uid && markMessagesAsSeen(uid);
  }, [uid, messages]);

  const sendNotification = async (message, senderUid) => {
    try {
      const response = await axios.post("/notification/send", {
        user: {
          _id: senderUid?._id,
          uid: senderUid?.uid,
          name: senderUid?.name,
          email: senderUid?.email,
          profilePicture: senderUid?.profilePicture,
        },
        title: store?.name,
        description: message?.type == "file" ? "Image File" : message?.content,
        chatId: uid,
      });
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    }
  };

  const [sending, setSending] = useState(false);
  const sendMessages = async (message, chatId, senderUid) => {
    try {
      setSending(true);
      if (!chatId) {
        ErrorToast("Invalid chatId");
        return;
      }

      if (!message) {
        ErrorToast("Message not provided.");
        return;
      }

      if (!message?.content) {
        ErrorToast("Message content not provided.");
        return;
      }

      // If message is an object without the toMap method, use it directly
      const messageData = message.toMap ? message.toMap() : { ...message };
      setText("");

      // Add the message to the "messages" subcollection
      await addDoc(
        collection(doc(db, "chats", chatId), "messages"),
        messageData
      );

      // Update the parent chat document with the last message details
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: message.content || "",
        type: message.type || "text",
        timestamp: serverTimestamp(),
      });

      scrollToBottom();
      // Send notification to the receiver
      sendNotification(message, senderUid);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const [fileSending, setFileSending] = useState(false);

  const sendFile = async (e, chatId, senderUid) => {
    const file = e.target.files[0];
    if (file) {
      setFileSending(true);

      const reader = new FileReader();

      reader.readAsDataURL(file);

      const formdata = new FormData();
      formdata.append("media", file);

      const { data } = await axios.post(`/global/upload`, formdata);

      const message = {
        type: "file",
        timeStamp: serverTimestamp(),
        content: data?.data,
        isSeen: false,
        senderUid: store?.uid,
        receiverId: senderUid?.id,
      };

      try {
        if (!chatId) {
          ErrorToast("Invalid chatId");
          return;
        }

        if (!message) {
          ErrorToast("Message not provided.");
          return;
        }

        if (!message?.content) {
          ErrorToast("Message content not provided.");
          return;
        }

        // If message is an object without the toMap method, use it directly
        const messageData = message.toMap ? message.toMap() : { ...message };
        setText("");

        // Add the message to the "messages" subcollection
        await addDoc(
          collection(doc(db, "chats", chatId), "messages"),
          messageData
        );

        // Update the parent chat document with the last message details
        await updateDoc(doc(db, "chats", chatId), {
          lastMessage: message.content || "",
          type: message.type || "file",
          timestamp: serverTimestamp(),
        });

        scrollToBottom();
        // Send notification to the receiver
        sendNotification(message, senderUid);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setFileSending(false);
      }
    }
  };

  function isValidUrl(str) {
    try {
      new URL(str); // Try to construct a URL
      return true; // If successful, it's a valid URL
    } catch (e) {
      return false; // If an error is thrown, it's not a valid URL
    }
  }

  const convertFirebaseTimestampTo12HourFormat = (firebaseTimestamp) => {
    if (!(firebaseTimestamp instanceof Timestamp)) {
      return "";
    }

    // Convert Firebase Timestamp to JavaScript Date object
    const date = firebaseTimestamp.toDate();

    // Get hours, minutes, and AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12
    const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;

    // Format the time as a string in 12-hour format
    const timeString = `${hours}:${minutesFormatted} ${ampm}`;

    return timeString;
  };

  function getFileNameFromUrl(url) {
    const parsedUrl = new URL(url); // Parse the URL
    const pathname = parsedUrl.pathname; // Get the pathname (e.g., '/path/to/file.jpg')

    // Extract the file name from the pathname (after the last '/')
    const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);

    return fileName;
  }

  // Filter data based on the search term
  const filteredChats = chats?.filter((user) =>
    user?.user?.name?.toLowerCase().includes(search?.toLowerCase())
  );

  useEffect(() => {
    if (chatId && chats?.length > 0) {
      setUid(chatId);
      const chat = chats?.find((item) => item?.chatId === chatId);
      console.log(chat);
      setSender(chat?.user);
    }
  }, [chats]);

  return (
    <>
      <div className="w-full h-[calc(100%-3.5rem)] lg:h-full hidden lg:flex lg:p-2 gap-3   justify-start items-start ">
        <div className="w-full lg:w-[calc(100%-374px)] h-full bg-white  border border-gray-300 shadow rounded-[18px]  flex flex-col justify-start items-start">
          {sender && uid ? (
            <>
              <div className="w-full h-16 px-5 flex justify-start bg-white items-center rounded-t-[18px] border-b">
                <div className="w-auto h-full flex justify-start items-center gap-2">
                  {chatLoading ? (
                    <>
                      <span className="w-[45px] h-[45px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                        <span className="w-[38px] h-[38px]  bg-gray-200 animate-pulse rounded-full" />
                      </span>
                      <div className="w-auto flex flex-col justify-start items-start">
                        <h3 className="text-[14px] w-40 h-8 rounded-lg bg-gray-200 animate-pulse font-semibold text-black leading-[19.1px]"></h3>
                      </div>
                    </>
                  ) : (
                    chats?.length > 0 && (
                      <>
                        <span className="w-[45px] h-[45px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                          <img
                            src={
                              sender?.profilePicture ||
                              "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                            }
                            alt="store_image"
                            className="w-[38px] h-[38px] bg-gray-300 rounded-full"
                          />
                        </span>
                        <div className="w-auto flex flex-col justify-start items-start">
                          <h3 className="text-[14px] font-semibold text-black leading-[19.1px]">
                            {sender?.name}
                          </h3>
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>

              {messageLoading ? (
                <div
                  id="elem"
                  className="w-full h-[calc(100%-9rem)] overflow-y-auto flex p-4 flex-col justify-start items-start"
                >
                  {/* Simulating a loading state */}
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-auto py-2 flex flex-col justify-start items-start animate-pulse"
                    >
                      {/* Sender's bubble */}
                      <div className="w-96 max-w-96 flex flex-col gap-1.5">
                        <div className="w-[70%] h-[28px] bg-gray-200 rounded-lg"></div>
                        <div className="w-[60%] h-[34px] bg-gray-200 rounded-lg"></div>
                        <div className="w-[50%] h-[40px] bg-gray-200 rounded-lg mt-2"></div>
                      </div>
                    </div>
                  ))}

                  {/* Receiver's bubble */}
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-auto py-2 flex flex-col justify-start items-end animate-pulse"
                    >
                      <div className="w-96 max-w-96 flex flex-col gap-1.5 items-end">
                        <div className="w-[70%] h-[28px] bg-gray-200 rounded-lg"></div>
                        <div className="w-[60%] h-[34px] bg-gray-200 rounded-lg"></div>
                        <div className="w-[50%] h-[40px] bg-gray-200 rounded-lg mt-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  id="elem"
                  className="w-full h-[calc(100%-9rem)] overflow-y-auto  flex p-4 flex-col justify-start items-start"
                >
                  {messages?.length > 0 ? (
                    Object.keys(groupedMessages)?.map((date, idx) => (
                      <div key={idx} className="w-full ">
                        <div className="flex items-center justify-center my-2 w-full ">
                          <div className="text-center text-[10px] p-2 text-black/70 bg-[#d0cfce] font-medium   rounded-full mx-2 w-auto">
                            {new Date(date)?.toDateString() ===
                            new Date()?.toDateString()
                              ? "Today"
                              : new Date(date)?.toDateString() ===
                                new Date(Date.now() - 86400000)?.toDateString()
                              ? "Yesterday"
                              : date}
                          </div>
                        </div>

                        {groupedMessages[date]?.map((message, index) => {
                          return message?.senderUid == store?.uid ? (
                            message?.type == "text" ? (
                              <div
                                key={index}
                                className="w-full h-auto py-2 flex flex-col justify-start items-end "
                              >
                                <div className="w-auto max-w-96 flex flex-col gap-1.5 justify-center items-end">
                                  <div className="w-auto h-auto p-3 rounded-l-xl  text-wrap break-words tracking-normal rounded-br-xl bg-orange-500 text-left font-normal text-[#fff] text-[12px] leading-[18px]">
                                    {message?.content}
                                  </div>
                                  <div className="w-auto flex mr-2 justify-end items-center gap-1">
                                    <span className="text-[10px]   font-normal leading-[10px] text-[#797C7B]">
                                      {convertFirebaseTimestampTo12HourFormat(
                                        message?.timeStamp
                                      )}
                                    </span>
                                    <IoCheckmarkDone
                                      className={`text-sm ${
                                        message?.isSeen
                                          ? "text-orange-600"
                                          : "text-gray-800"
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={index}
                                className="w-full h-auto py-2 flex flex-col  justify-start items-end "
                              >
                                <div className="w-auto max-w-96 flex flex-col gap-1.5 justify-center items-end">
                                  <div className="w-auto h-auto p-3 rounded-l-xl  text-wrap break-words tracking-normal rounded-br-xl bg-orange-500 text-left font-normal text-[#fff] text-[12px] leading-[18px]">
                                    <img
                                      src={message?.content}
                                      alt=""
                                      className="w-auto rounded-lg max-h-72"
                                      onClick={() => {
                                        if (message?.content) {
                                          window.open(
                                            message.content,
                                            "_blank"
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="w-auto flex mr-2 justify-end items-center gap-1">
                                    <span className="text-[10px]   font-normal leading-[10px] text-[#797C7B]">
                                      {convertFirebaseTimestampTo12HourFormat(
                                        message?.timeStamp
                                      )}
                                    </span>
                                    <IoCheckmarkDone className="text-sm text-orange-600" />
                                  </div>
                                </div>
                              </div>
                            )
                          ) : message?.type == "text" ? (
                            <div
                              key={index}
                              className="w-full h-auto py-2 flex flex-col justify-start items-start "
                            >
                              <div className="w-auto max-w-96 flex flex-col gap-1.5 justify-center items-end">
                                <div className="w-auto h-auto p-3 rounded-r-xl  text-wrap break-words tracking-normal rounded-bl-xl bg-[#FFE6D8] text-left font-normal text-[#F85E00] text-[12px] leading8[12px]">
                                  {message?.content}
                                </div>
                                <div className="w-auto flex mr-2 justify-end items-center gap-1">
                                  <span className="text-[10px]   font-normal leading-[10px] text-[#797C7B]">
                                    {convertFirebaseTimestampTo12HourFormat(
                                      message?.timeStamp
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              key={index}
                              className="w-full h-auto py-2 flex flex-col justify-start items-start "
                            >
                              <div className="w-auto max-w-96 flex flex-col gap-1.5 justify-center items-end">
                                <div className="w-auto h-auto p-3 rounded-r-xl  text-wrap break-words tracking-normal rounded-bl-xl bg-[#FFE6D8] text-left font-normal text-[#F85E00] text-[12px] leading8[12px]">
                                  <img
                                    src={message?.content}
                                    alt=""
                                    onClick={() => {
                                      if (message?.content) {
                                        window.open(message.content, "_blank");
                                      }
                                    }}
                                    className="w-auto max-h-72 rounded-lg object-contain"
                                  />
                                </div>
                                <div className="w-auto flex mr-2 justify-end items-center gap-1">
                                  <span className="text-[10px]   font-normal leading-[10px] text-[#797C7B]">
                                    {convertFirebaseTimestampTo12HourFormat(
                                      message?.timeStamp
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  ) : (
                    <span className="w-full h-full flex items-center justify-center">
                      No messages available
                    </span>
                  )}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessages(
                    {
                      type: "text",
                      timeStamp: serverTimestamp(),
                      content: text,
                      isSeen: false,
                      senderUid: store?.uid,
                      receiverId: sender?.id,
                    },
                    uid,
                    sender
                  );
                }}
                className="w-full h-20 rounded-b-[18px] flex justify-between px-3 bg-white items-center border-t"
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-[90%] h-[40px] rounded-[12px] outline-none bg-[#F3F6F6] px-3"
                  placeholder="Type your message.."
                />
                <div className="w-auto flex justify-start items-center gap-1">
                  <button
                    type="button"
                    onClick={() => document.getElementById("media").click()}
                    className="w-[40px] h-[40px] rounded-full bg-gray-200 text-gray-800 text-lg flex items-center justify-center"
                  >
                    {fileSending ? (
                      <FiLoader className="animate-spin text-lg text-gray-800" />
                    ) : (
                      <FaRegFileAlt />
                    )}
                  </button>
                  <input
                    type="file"
                    id="media"
                    name="media"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      sendFile(e, uid, sender);
                    }}
                  />
                  <button
                    type="submit"
                    className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#F85E00] to-[#FFA36B] flex items-center justify-center"
                  >
                    {sending ? (
                      <FiLoader className="animate-spin text-lg text-white" />
                    ) : (
                      <img
                        src="/send_btn.png"
                        alt="Send-button-icon"
                        className="w-[24px] h-[24px]"
                      />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <span className="w-full h-full flex items-center justify-center">
              Please select a chat to continue
            </span>
          )}
        </div>
        <div className="w-full lg:w-[374px] h-full bg-white border border-gray-300 shadow   rounded-[18px]  flex flex-col  justify-start items-start">
          <div className="h-[110px] px-8 w-full flex justify-center items-center">
            <div className="relative w-full bg-white h-[49px] flex items-start justify-start rounded-[8px] border border-gray-300">
              <span className="w-[40px] h-full flex items-center justify-center ">
                <FiSearch className="  text-gray-400 text-lg" />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleInputChange}
                className="    text-sm text-gray-700 bg-white focus:outline-none w-[calc(100%-40px)] h-full rounded-r-[8px]" // Increased size
              />
            </div>
          </div>

          <div className="w-full h-[calc(100%-110px)]  flex flex-col overflow-y-auto justify-start items-start ">
            {chatLoading ? (
              [1, 2, 4, 5, 6, 7]?.map((user) => {
                return (
                  <div
                    key={user}
                    className="w-full h-[81px] px-4 flex justify-start items-center animate-pulse"
                  >
                    <div className="w-auto h-full flex justify-start items-center gap-2">
                      <span className="w-[45px] h-[45px] border border-gray-300 rounded-full flex items-center justify-center bg-gray-200"></span>
                      <div className="w-56 flex flex-col justify-start items-start">
                        <div className="h-[19px] bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-[15px] bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="w-16 pr-2 gap-2 flex flex-col justify-start items-end">
                        <div className="h-[18px] bg-gray-200 rounded w-full"></div>
                        {/* Uncomment below if needed */}
                        {/* <span className="w-[30px] h-[18px] rounded-full bg-gray-200"></span> */}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : filteredChats?.length > 0 ? (
              filteredChats?.map((chatUser, index) => (
                <div
                  onClick={() => {
                    setUid(chatUser?.chatId);
                    setSender(chatUser?.user);
                  }}
                  className={`w-full  h-[81px]  cursor-pointer border-b ${
                    uid == chatUser?.chatId && sender && "bg-[#FFF6F0]"
                  } px-4 flex justify-start items-center`}
                >
                  <div className="w-auto h-full flex justify-start items-center gap-2">
                    <span className="w-[45px] h-[45px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                      <img
                        src={
                          chatUser?.user?.profilePicture ||
                          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        alt="store_image"
                        className="w-[38px] h-[38px] bg-gray-300 rounded-full"
                      />
                    </span>
                    <div className="w-56 flex flex-col justify-start items-start">
                      <h3 className="text-[14px] font-semibold text-black leading-[19.1px]">
                        {chatUser?.user?.name}
                      </h3>
                      <p className="text-[12px] leading-[15px] font-normal">
                        {isValidUrl(chatUser?.lastMessage) ? (
                          <div className="w-auto flex items-center  justify-start gap-2">
                            <FaFileImage className="text-sm" />
                            <span className="text-xs">
                              {getFileNameFromUrl(chatUser?.lastMessage)}
                            </span>
                          </div>
                        ) : chatUser?.lastMessage?.length > 35 ? (
                          chatUser?.lastMessage?.slice(0, 35) + "..."
                        ) : (
                          chatUser?.lastMessage
                        )}
                      </p>
                    </div>
                    <div className="w-16 pr-2 gap-2 flex flex-col justify-start items-end">
                      <h3 className="text-[10px] font-normal text-[#333333] leading-[18px]">
                        {convertFirebaseTimestampTo12HourFormat(
                          chatUser?.timestamp
                        )}
                      </h3>
                      {unreadCounts[chatUser?.chatId] > 0 && (
                        <span className="w-[30px] h-[18px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#F85E00] to-[#FFA36B] text-white text-[12px] leading-[18px] font-bold">
                          {unreadCounts[chatUser?.chatId]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                No User's available to chat
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-full lg:hidden flex lg:p-2 gap-3   justify-start items-start ">
        {uid && sender && (
          <div className="w-full lg:w-[calc(100%-374px)] h-full bg-white  lg:border border-gray-300 shadow lg:rounded-[18px]  flex flex-col justify-start items-start">
            {sender ? (
              <>
                <div className="w-full h-16 px-5 flex justify-between bg-white items-center rounded-t-[18px] border-b">
                  <div className="w-auto h-full flex justify-start items-center gap-2">
                    {chatLoading ? (
                      <>
                        <span className="w-[45px] h-[45px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                          <span className="w-[38px] h-[38px] bg-gray-300 bg-gray-200 animate-pulse rounded-full" />
                        </span>
                        <div className="w-auto flex flex-col justify-start items-start">
                          <h3 className="text-[14px] w-40 h-8 rounded-lg bg-gray-200 animate-pulse font-semibold text-black leading-[19.1px]"></h3>
                        </div>
                      </>
                    ) : (
                      chats?.length > 0 && (
                        <>
                          <span className="w-[45px] h-[45px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                            <img
                              src={sender?.profilePicture}
                              alt="store_image"
                              className="w-[38px] h-[38px] bg-gray-300 rounded-full"
                            />
                          </span>
                          <div className="w-auto flex flex-col justify-start items-start">
                            <h3 className="text-[14px] font-semibold text-black leading-[19.1px]">
                              {sender?.name}
                            </h3>
                          </div>
                        </>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUid(null);
                      setSender(null);
                    }}
                    className="w-auto px-3 h-7 bg-orange-500 text-white rounded-xl flex items-center justify-center"
                  >
                    Back
                  </button>
                </div>

                {messageLoading ? (
                  <div
                    id="elem"
                    className="w-full h-[calc(100%-9rem)] overflow-y-auto flex p-4 flex-col justify-start items-start"
                  >
                    {/* Simulating a loading state */}
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="w-full h-auto py-2 flex flex-col justify-start items-start animate-pulse"
                      >
                        {/* Sender's bubble */}
                        <div className="w-96 max-w-96 flex flex-col gap-1.5">
                          <div className="w-[70%] h-[28px] bg-gray-200 rounded-lg"></div>
                          <div className="w-[60%] h-[34px] bg-gray-200 rounded-lg"></div>
                          <div className="w-[50%] h-[40px] bg-gray-200 rounded-lg mt-2"></div>
                        </div>
                      </div>
                    ))}

                    {/* Receiver's bubble */}
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="w-full h-auto py-2 flex flex-col justify-start items-end animate-pulse"
                      >
                        <div className="w-96 max-w-96 flex flex-col gap-1.5 items-end">
                          <div className="w-[70%] h-[28px] bg-gray-200 rounded-lg"></div>
                          <div className="w-[60%] h-[34px] bg-gray-200 rounded-lg"></div>
                          <div className="w-[50%] h-[40px] bg-gray-200 rounded-lg mt-2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    id="elem"
                    className="w-full h-[calc(100%-9rem)] overflow-y-auto  flex p-4 flex-col justify-start items-start"
                  >
                    {messages?.length > 0 ? (
                      Object.keys(groupedMessages)?.map((date, idx) => (
                        <div key={idx} className="w-full ">
                          <div className="flex items-center justify-center my-2 w-full ">
                            <div className="text-center text-[10px] p-2 text-black/70 bg-[#d0cfce] font-medium   rounded-full mx-2 w-auto">
                              {new Date(date)?.toDateString() ===
                              new Date()?.toDateString()
                                ? "Today"
                                : new Date(date)?.toDateString() ===
                                  new Date(
                                    Date.now() - 86400000
                                  )?.toDateString()
                                ? "Yesterday"
                                : date}
                            </div>
                          </div>

                          {groupedMessages[date]?.map((message, index) => {
                            return message?.senderUid == store?.uid ? (
                              message?.type == "text" ? (
                                <div
                                  key={index}
                                  className="w-full h-auto py-2 flex flex-col justify-start items-end "
                                >
                                  <div className="w-auto max-w-96 flex flex-col gap-1.5 justify-center items-end">
                                    <div className="w-auto h-auto p-3 rounded-l-xl  text-wrap break-words tracking-normal rounded-br-xl bg-orange-500 text-left font-normal text-[#fff] text-[12px] leading-[18px]">
                                      {message?.content}
                                    </div>
                                    <div className="w-auto flex mr-2 justify-end items-center gap-1">
                                      <span className="text-[10px]   font-normal leading-[10px] text-[#797C7B]">
                                        {convertFirebaseTimestampTo12HourFormat(
                                          message?.timeStamp
                                        )}
                                      </span>
                                      <IoCheckmarkDone
                                        className={`text-sm ${
                                          message?.isSeen
                                            ? "text-orange-600"
                                            : "text-gray-800"
                                        }`}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  key={index}
                                  className="w-full h-auto py-2 flex flex-col  justify-start items-end "
                                >
                                  <div className="w-auto max-w-96 flex flex-col gap-1.5 justify-center items-end">
                                    <div className="w-auto h-auto p-3 rounded-l-xl  text-wrap break-words tracking-normal rounded-br-xl bg-orange-500 text-left font-normal text-[#fff] text-[12px] leading-[18px]">
                                      <img
                                        src={message?.content}
                                        alt=""
                                        className="w-auto rounded-lg max-h-72"
                                        onClick={() => {
                                          if (message?.content) {
                                            window.open(
                                              message.content,
                                              "_blank"
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="w-auto flex mr-2 justify-end items-center gap-1">
                                      <span className="text-[10px]   font-normal leading-[10px] text-[#797C7B]">
                                        {convertFirebaseTimestampTo12HourFormat(
                                          message?.timeStamp
                                        )}
                                      </span>
                                      <IoCheckmarkDone className="text-sm text-orange-600" />
                                    </div>
                                  </div>
                                </div>
                              )
                            ) : message?.type == "text" ? (
                              <div
                                key={index}
                                className="w-full h-auto py-2 flex flex-col justify-start items-start "
                              >
                                <div className="w-auto max-w-96 flex flex-col gap-1.5 justify-center items-end">
                                  <div className="w-auto h-auto p-3 rounded-r-xl  text-wrap break-words tracking-normal rounded-bl-xl bg-[#FFE6D8] text-left font-normal text-[#F85E00] text-[12px] leading8[12px]">
                                    {message?.content}
                                  </div>
                                  <div className="w-auto flex mr-2 justify-end items-center gap-1">
                                    <span className="text-[10px]   font-normal leading-[10px] text-[#797C7B]">
                                      {convertFirebaseTimestampTo12HourFormat(
                                        message?.timeStamp
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={index}
                                className="w-full h-auto py-2 flex flex-col justify-start items-start "
                              >
                                <div className="w-auto max-w-96 flex flex-col gap-1.5 justify-center items-end">
                                  <div className="w-auto h-auto p-3 rounded-r-xl  text-wrap break-words tracking-normal rounded-bl-xl bg-[#FFE6D8] text-left font-normal text-[#F85E00] text-[12px] leading8[12px]">
                                    <img
                                      src={message?.content}
                                      alt=""
                                      onClick={() => {
                                        if (message?.content) {
                                          window.open(
                                            message.content,
                                            "_blank"
                                          );
                                        }
                                      }}
                                      className="w-auto max-h-72 rounded-lg object-contain"
                                    />
                                  </div>
                                  <div className="w-auto flex mr-2 justify-end items-center gap-1">
                                    <span className="text-[10px]   font-normal leading-[10px] text-[#797C7B]">
                                      {convertFirebaseTimestampTo12HourFormat(
                                        message?.timeStamp
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))
                    ) : (
                      <span className="w-full h-full flex items-center justify-center">
                        No messages available
                      </span>
                    )}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessages(
                      {
                        type: "text",
                        timeStamp: serverTimestamp(),
                        content: text,
                        isSeen: false,
                        senderUid: store?.uid,
                        receiverId: sender?.id,
                      },
                      uid,
                      sender
                    );
                  }}
                  className="w-full h-20 rounded-b-[18px] flex justify-between px-3 bg-white items-center border-t"
                >
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-[90%] h-[40px] rounded-[12px] outline-none bg-[#F3F6F6] px-3"
                    placeholder="Type your message.."
                  />
                  <div className="w-auto flex justify-start items-center gap-1">
                    <button
                      type="button"
                      onClick={() => document.getElementById("media").click()}
                      className="w-[40px] h-[40px] rounded-full bg-gray-200 text-gray-800 text-lg flex items-center justify-center"
                    >
                      {fileSending ? (
                        <FiLoader className="animate-spin text-lg text-gray-800" />
                      ) : (
                        <FaRegFileAlt />
                      )}
                    </button>
                    <input
                      type="file"
                      id="media"
                      name="media"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        sendFile(e, uid, sender);
                      }}
                    />
                    <button
                      type="submit"
                      className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#F85E00] to-[#FFA36B] flex items-center justify-center"
                    >
                      {sending ? (
                        <FiLoader className="animate-spin text-lg text-white" />
                      ) : (
                        <img
                          src="/send_btn.png"
                          alt="Send-button-icon"
                          className="w-[24px] h-[24px]"
                        />
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <span className="w-full h-full flex items-center justify-center">
                Please select a chat to continue
              </span>
            )}
          </div>
        )}
        {!uid && !sender && (
          <div className="w-full lg:w-[374px] h-full bg-white lg:border border-gray-300 shadow   lg:rounded-[18px]  flex flex-col  justify-start items-start">
            <div className="h-[110px] px-8 w-full flex justify-center items-center">
              <div className="relative w-full bg-white h-[49px] flex items-start justify-start rounded-[8px] border border-gray-300">
                <span className="w-[40px] h-full flex items-center justify-center ">
                  <FiSearch className="  text-gray-400 text-lg" />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={handleInputChange}
                  className="    text-sm text-gray-700 bg-white focus:outline-none w-[calc(100%-40px)] h-full rounded-r-[8px]" // Increased size
                />
              </div>
            </div>

            <div className="w-full h-[calc(100%-110px)]  grid grid-cols-1 flex-col overflow-y-auto justify-start items-start ">
              {chatLoading ? (
                [1, 2, 4, 5, 6, 7]?.map((user) => {
                  return (
                    <div
                      key={user}
                      className="w-full h-[81px] px-4 flex justify-start items-center animate-pulse"
                    >
                      <div className="w-auto h-full flex justify-start items-center gap-2">
                        <span className="w-[45px] h-[45px] border border-gray-300 rounded-full flex items-center justify-center bg-gray-200"></span>
                        <div className="w-56 flex flex-col justify-start items-start">
                          <div className="h-[19px] bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-[15px] bg-gray-200 rounded w-5/6"></div>
                        </div>
                        <div className="w-16 pr-2 gap-2 flex flex-col justify-start items-end">
                          <div className="h-[18px] bg-gray-200 rounded w-full"></div>
                          {/* Uncomment below if needed */}
                          {/* <span className="w-[30px] h-[18px] rounded-full bg-gray-200"></span> */}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : filteredChats?.length > 0 ? (
                filteredChats?.map((chatUser, index) => (
                  <div
                    onClick={() => {
                      setUid(chatUser?.chatId);
                      setSender(chatUser?.user);
                    }}
                    className={`w-full  h-[81px]  cursor-pointer border-b ${
                      uid == chatUser?.chatId && "bg-[#FFF6F0]"
                    } px-4 flex justify-start items-center`}
                  >
                    <div className="w-auto h-full flex justify-start items-center gap-2">
                      <span className="w-[45px] h-[45px] border border-[#F85E00] rounded-full flex items-center justify-center ">
                        <img
                          src={
                            chatUser?.user?.profilePicture ||
                            "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                          }
                          alt="store_image"
                          className="w-[38px] h-[38px] bg-gray-300 rounded-full"
                        />
                      </span>
                      <div className="w-56 flex flex-col justify-start items-start">
                        <h3 className="text-[14px] font-semibold text-black leading-[19.1px]">
                          {chatUser?.user?.name}
                        </h3>
                        <p className="text-[12px] leading-[15px] font-normal">
                          {isValidUrl(chatUser?.lastMessage) ? (
                            <div className="w-auto flex items-center  justify-start gap-2">
                              <FaFileImage className="text-sm" />
                              <span className="text-xs">
                                {getFileNameFromUrl(chatUser?.lastMessage)}
                              </span>
                            </div>
                          ) : chatUser?.lastMessage?.length > 35 ? (
                            chatUser?.lastMessage?.slice(0, 35) + "..."
                          ) : (
                            chatUser?.lastMessage
                          )}
                        </p>
                      </div>
                      <div className="w-16 pr-2 gap-2 flex flex-col justify-start items-end">
                        <h3 className="text-[10px] font-normal text-[#333333] leading-[18px]">
                          {convertFirebaseTimestampTo12HourFormat(
                            chatUser?.timestamp
                          )}
                        </h3>
                        {unreadCounts[chatUser?.chatId] > 0 && (
                          <span className="w-[30px] h-[18px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#F85E00] to-[#FFA36B] text-white text-[12px] leading-[18px] font-bold">
                            {unreadCounts[chatUser?.chatId]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  No User's available to chat
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Messages;
