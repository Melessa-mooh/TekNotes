import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Menu,
  Upload,
  Bell,
  User,
  Send,
  Paperclip,
  Download,
  X,
  Users,
  FileText,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ApiService from "../services/api";
import Swal from "sweetalert2";
import "../styles/dashboard.css";

export default function GroupChat() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("teknotesUser");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    const userId = user.id || user.userId;
    setCurrentUserId(userId);
    
    // Check if user is member before loading
    if (userId) {
      checkAccessAndLoad(userId);
    }
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      if (group) {
        loadMessages();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [groupId, navigate]);

  const checkAccessAndLoad = async (userId) => {
    try {
      const groupData = await ApiService.getGroupById(groupId);
      setGroup(groupData);
      
      // Check if user is already a member
      const userGroups = await ApiService.getUserGroups(userId);
      const isMember = userGroups.some(g => g.groupId === parseInt(groupId));
      
      if (!isMember) {
        // Show password prompt
        const { value: password } = await Swal.fire({
          title: 'Enter Group Password',
          text: 'This group is password protected. Please enter the password (course code or instructor name).',
          input: 'text',
          inputPlaceholder: 'Enter password',
          showCancelButton: true,
          confirmButtonText: 'Enter',
          inputValidator: (value) => {
            if (!value) {
              return 'Password is required';
            }
          }
        });

        if (password) {
          try {
            await ApiService.joinGroup(groupId, userId, password);
            await loadGroupData();
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Access Denied',
              text: error.message || 'Invalid password',
            }).then(() => {
              navigate('/groups');
            });
          }
        } else {
          navigate('/groups');
        }
      } else {
        await loadGroupData();
      }
    } catch (error) {
      console.error("Error checking access:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load group',
      }).then(() => {
        navigate('/groups');
      });
    }
  };

  const loadGroupData = async () => {
    try {
      setLoading(true);
      const [groupData, messagesData, filesData] = await Promise.all([
        ApiService.getGroupById(groupId),
        ApiService.getMessagesByGroup(groupId),
        ApiService.getSharedFilesByGroup(groupId),
      ]);
      setGroup(groupData);
      setMessages(messagesData || []);
      setSharedFiles(filesData || []);
    } catch (error) {
      console.error("Error loading group data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load group chat",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const messagesData = await ApiService.getMessagesByGroup(groupId);
      setMessages(messagesData || []);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await ApiService.sendMessage({
        userId: currentUserId,
        groupId: parseInt(groupId),
        content: newMessage.trim(),
      });
      setNewMessage("");
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to send message",
      });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("groupId", groupId);
      formData.append("userId", currentUserId);

      await ApiService.uploadSharedFile(formData);
      Swal.fire({
        icon: "success",
        title: "File Uploaded!",
        text: "File has been shared in the group",
        timer: 1500,
        showConfirmButton: false,
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await loadGroupData();
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to upload file",
      });
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      // Get userId from localStorage if currentUserId is not set
      let userId = currentUserId;
      if (!userId) {
        const storedUser = localStorage.getItem("teknotesUser");
        if (!storedUser) {
          Swal.fire({
            icon: "warning",
            title: "Please Login",
            text: "You need to login to download files",
          });
          navigate("/login");
          return;
        }
        const user = JSON.parse(storedUser);
        userId = user.id || user.userId;
        if (!userId) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Could not identify user",
          });
          return;
        }
      }

      console.log("Downloading file:", {
        userId,
        fileUrl: file.fileUrl,
        fileName: file.fileName,
        uploadedByUserId: file.uploadedByUserId
      });

      // Track the download in the backend
      try {
        await ApiService.createDownloadFromSharedFile(
          userId,
          file.fileUrl,
          file.fileName,
          file.uploadedByUserId
        );
        console.log("Download tracked successfully");
      } catch (trackError) {
        console.error("Error tracking download:", trackError);
        // Continue with download even if tracking fails
      }

      // Trigger actual file download
      const fileUrl = file.fileUrl.startsWith('http') 
        ? file.fileUrl 
        : `http://localhost:8080${file.fileUrl}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        icon: "success",
        title: "Download Started",
        text: "File has been added to your downloads",
        timer: 1500,
        showConfirmButton: false,
      });

      // Trigger event to refresh downloads page if open
      window.dispatchEvent(new CustomEvent('downloadCompleted'));
    } catch (error) {
      console.error("Error downloading file:", error);
      // Still allow download even if tracking fails
      const fileUrl = file.fileUrl.startsWith('http') 
        ? file.fileUrl 
        : `http://localhost:8080${file.fileUrl}`;
      window.open(fileUrl, "_blank");
      
      Swal.fire({
        icon: "warning",
        title: "Download Started",
        text: error.message || "File download started, but could not track in downloads",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading chat...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="main-content">
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Group not found</p>
            <button onClick={() => navigate("/groups")}>Back to Groups</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />
      <main className="main-content" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} showSearch={false} />
        <div style={{ padding: "20px 20px 0 20px" }}>
          <div className="page-header-text" style={{ marginBottom: "20px" }}>
            <h1>{group?.chatName || "Loading..."}</h1>
            <p>{group?.memberCount || 0} members • {group?.messageCount || 0} messages</p>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Chat Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                background: "#f8fafc",
              }}
            >
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.messageId}
                    style={{
                      marginBottom: "15px",
                      display: "flex",
                      flexDirection:
                        message.userId === currentUserId ? "row-reverse" : "row",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        background:
                          message.userId === currentUserId ? "#5C0000" : "#fff",
                        color: message.userId === currentUserId ? "#fff" : "#0f172a",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          marginBottom: "4px",
                          opacity: 0.9,
                        }}
                      >
                        {message.userId === currentUserId ? "You" : message.userName}
                      </div>
                      <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                        {message.content}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          opacity: 0.7,
                          marginTop: "4px",
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div
              style={{
                padding: "15px 20px",
                background: "#fff",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              {selectedFile && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    background: "#f1f5f9",
                    borderRadius: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <FileText size={16} />
                  <span style={{ flex: 1, fontSize: "14px" }}>
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px" }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: "10px",
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: "10px 15px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />
                {selectedFile ? (
                  <button
                    type="button"
                    onClick={handleUploadFile}
                    className="upload-btn"
                    style={{ padding: "10px 20px" }}
                  >
                    Upload File
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="upload-btn"
                    style={{ padding: "10px 20px" }}
                  >
                    <Send size={18} />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar - Shared Files */}
          <div
            style={{
              width: "300px",
              background: "#fff",
              borderLeft: "1px solid #e2e8f0",
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>Shared Files</h3>
            {sharedFiles.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px" }}>No files shared yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {sharedFiles.map((file) => (
                  <div
                    key={file.fileId}
                    style={{
                      padding: "12px",
                      background: "#f8fafc",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <FileText size={16} color="#64748b" />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.fileName}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#94a3b8",
                        marginBottom: "8px",
                      }}
                    >
                      by {file.uploadedByName}
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => window.open(`http://localhost:8080${file.fileUrl}`, "_blank")}
                        style={{
                          flex: 1,
                          padding: "6px",
                          background: "#5C0000",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        style={{
                          flex: 1,
                          padding: "6px",
                          background: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

