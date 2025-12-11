import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Upload,
  Menu,
  Users,
  Plus,
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ApiService from "../services/api";
import Swal from "sweetalert2";
import "../styles/dashboard.css";

export default function StudyGroups() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseCode, setSelectedCourseCode] = useState("All");
  const [selectedTeacher, setSelectedTeacher] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const [newGroup, setNewGroup] = useState({
    chatName: "",
    description: "",
    isVerified: false,
    password: "",
  });
  const [joinPassword, setJoinPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("teknotesUser");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    const userId = user.id || user.userId;
    setCurrentUserId(userId);
    loadGroups();
  }, [navigate]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const [allGroups, myGroups] = await Promise.all([
        ApiService.getAllGroups(),
        currentUserId ? ApiService.getUserGroups(currentUserId) : Promise.resolve([]),
      ]);
      setGroups(allGroups || []);
      setUserGroups(myGroups || []);
    } catch (error) {
      console.error("Error loading groups:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load study groups",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      loadGroups();
    }
  }, [currentUserId]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.chatName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Group name is required",
      });
      return;
    }

    try {
      await ApiService.createGroup({
        chatName: newGroup.chatName,
        description: newGroup.description || "",
        createdByUserId: currentUserId,
        isVerified: newGroup.isVerified,
        password: newGroup.password || null,
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Study group created successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowCreateModal(false);
      setNewGroup({ chatName: "", description: "", isVerified: false, password: "" });
      loadGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create study group",
      });
    }
  };

  const handleJoinClick = (groupId) => {
    setSelectedGroupId(groupId);
    setJoinPassword("");
    setShowPasswordModal(true);
  };

  const handleJoinGroup = async () => {
    if (!selectedGroupId) return;

    try {
      await ApiService.joinGroup(selectedGroupId, currentUserId, joinPassword);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have joined the group",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowPasswordModal(false);
      setSelectedGroupId(null);
      setJoinPassword("");
      loadGroups();
    } catch (error) {
      console.error("Error joining group:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to join group. Please check the password.",
      });
    }
  };

  const handleLeaveGroup = async (groupId) => {
    const result = await Swal.fire({
      title: "Leave Group?",
      text: "Are you sure you want to leave this study group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, leave it!",
    });

    if (result.isConfirmed) {
      try {
        await ApiService.leaveGroup(groupId, currentUserId);
        Swal.fire({
          icon: "success",
          title: "Left Group",
          text: "You have left the study group",
          timer: 1500,
          showConfirmButton: false,
        });
        loadGroups();
      } catch (error) {
        console.error("Error leaving group:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to leave group",
        });
      }
    }
  };

  const isUserInGroup = (groupId) => {
    return userGroups.some((g) => g.groupId === groupId);
  };

  // Extract course codes and teacher names from groups
  const extractCourseCode = (text) => {
    if (!text) return null;
    // Match patterns like CSIT111, CSIT121, ENGL031, MATH031, NSTP111, CSIT104, IT227, PE205, etc.
    // Pattern: 2-6 uppercase letters followed by 3-4 digits
    const courseCodePattern = /\b([A-Z]{2,6}\d{3,4})\b/;
    const match = text.match(courseCodePattern);
    return match ? match[1] : null;
  };

  const extractTeacherName = (text) => {
    if (!text) return null;
    // Try to extract teacher names - common patterns from the course listings
    // Patterns include:
    // 1. "Last, First" format: "BERNUS, JUDY", "Pantaleon, Cheryl Balan"
    // 2. "Last, First Middle" format: "Dejos, Lanelyn Vestil"
    // 3. Names after keywords: "by", "with", "teacher:", "instructor:"
    const patterns = [
      // Last, First format (handles both ALL CAPS and Title Case)
      /\b([A-Z][A-Z\s,]+(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)?),\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      // After keywords
      /(?:by|with|teacher|instructor|professor)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
      // Standalone name patterns
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/,
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        // If it's the Last, First format, combine them
        if (match[2]) {
          return `${match[1]}, ${match[2]}`.trim();
        }
        return match[1].trim();
      }
    }
    return null;
  };

  // Get unique course codes and teacher names from all groups
  const getUniqueCourseCodes = () => {
    const codes = new Set();
    groups.forEach((group) => {
      const code = extractCourseCode(group.chatName) || extractCourseCode(group.description);
      if (code) codes.add(code);
    });
    return Array.from(codes).sort();
  };

  const getUniqueTeacherNames = () => {
    const names = new Set();
    groups.forEach((group) => {
      const name = extractTeacherName(group.chatName) || 
                   extractTeacherName(group.description) ||
                   group.createdByName;
      if (name) names.add(name);
    });
    return Array.from(names).sort();
  };

  const filteredGroups = groups.filter((group) => {
    // Search query filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || (
      group.chatName?.toLowerCase().includes(query) ||
      group.description?.toLowerCase().includes(query) ||
      group.createdByName?.toLowerCase().includes(query)
    );

    // Course code filter
    const groupCourseCode = extractCourseCode(group.chatName) || extractCourseCode(group.description);
    const matchesCourseCode = selectedCourseCode === "All" || 
                              (groupCourseCode && groupCourseCode === selectedCourseCode) ||
                              (!groupCourseCode && selectedCourseCode === "All");

    // Teacher name filter
    const groupTeacher = extractTeacherName(group.chatName) || 
                         extractTeacherName(group.description) ||
                         group.createdByName;
    const matchesTeacher = selectedTeacher === "All" || 
                           (groupTeacher && (
                             groupTeacher.toLowerCase().includes(selectedTeacher.toLowerCase()) ||
                             selectedTeacher.toLowerCase().includes(groupTeacher.toLowerCase())
                           ));

    return matchesSearch && matchesCourseCode && matchesTeacher;
  });

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />
      <main className="main-content">
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} showSearch={false} />
        <div style={{ padding: "20px 20px 0 20px" }}>
          <div className="page-header-text" style={{ marginBottom: "20px" }}>
            <h1>Study Groups</h1>
            <p>Join verified study groups and collaborate</p>
          </div>
        </div>

        <div style={{ padding: "0 20px 20px 20px" }}>
          {/* Search and Filters */}
          <div style={{ marginBottom: "20px" }}>
            {/* Search Bar */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "15px", alignItems: "center" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search
                  size={20}
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search study groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 15px 12px 45px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />
              </div>
              <button
                className="upload-btn"
                onClick={() => setShowCreateModal(true)}
                style={{ whiteSpace: "nowrap" }}
              >
                <Plus size={18} /> Create Group
              </button>
            </div>

            {/* Filter Dropdowns */}
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                  Filter by Course Code
                </label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <option value="All">All Course Codes</option>
                  {getUniqueCourseCodes().map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                  Filter by Teacher Name
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <option value="All">All Teachers</option>
                  {getUniqueTeacherNames().map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              {(selectedCourseCode !== "All" || selectedTeacher !== "All") && (
                <button
                  onClick={() => {
                    setSelectedCourseCode("All");
                    setSelectedTeacher("All");
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginTop: "24px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {!loading && groups.length > 0 && (
            <div style={{ 
              marginBottom: "20px", 
              padding: "10px 15px", 
              background: "#f8fafc", 
              borderRadius: "8px",
              fontSize: "14px",
              color: "#64748b"
            }}>
              Showing {filteredGroups.length} of {groups.length} study groups
              {(selectedCourseCode !== "All" || selectedTeacher !== "All" || searchQuery) && (
                <span style={{ marginLeft: "10px", fontWeight: "600", color: "#5C0000" }}>
                  (filtered)
                </span>
              )}
            </div>
          )}

          {/* Groups Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading study groups...</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Users size={48} style={{ opacity: 0.3, marginBottom: "15px" }} />
              <p style={{ color: "#64748b", marginBottom: "10px" }}>
                {searchQuery || selectedCourseCode !== "All" || selectedTeacher !== "All"
                  ? "No groups found matching your filters"
                  : "No study groups available yet"}
              </p>
              {(searchQuery || selectedCourseCode !== "All" || selectedTeacher !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCourseCode("All");
                    setSelectedTeacher("All");
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "#5C0000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginTop: "10px",
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredGroups.map((group) => (
                <div
                  key={group.groupId}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "12px",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>
                      {group.chatName}
                    </h3>
                    {group.isVerified && (
                      <CheckCircle
                        size={20}
                        color="#16a34a"
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      marginBottom: "15px",
                      minHeight: "40px",
                    }}
                  >
                    {group.description || "No description"}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: "15px",
                    }}
                  >
                    <span>
                      <Users size={14} style={{ display: "inline", marginRight: "4px" }} />
                      {group.memberCount || 0} members
                    </span>
                    <span>
                      <MessageCircle
                        size={14}
                        style={{ display: "inline", marginRight: "4px" }}
                      />
                      {group.messageCount || 0} messages
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: "15px",
                    }}
                  >
                    Created by {group.createdByName}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {isUserInGroup(group.groupId) ? (
                      <>
                        <button
                          className="upload-btn"
                          onClick={() => navigate(`/groups/${group.groupId}/chat`)}
                          style={{ flex: 1 }}
                        >
                          <MessageCircle size={16} /> Open Chat
                        </button>
                        <button
                          onClick={() => handleLeaveGroup(group.groupId)}
                          style={{
                            padding: "8px 15px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          Leave
                        </button>
                      </>
                    ) : (
                      <button
                        className="upload-btn"
                        onClick={() => handleJoinClick(group.groupId)}
                        style={{ width: "100%" }}
                      >
                        <Plus size={16} /> Join Group
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowCreateModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "30px",
                width: "90%",
                maxWidth: "500px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ margin: 0 }}>Create Study Group</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                >
                  <XCircle size={24} color="#64748b" />
                </button>
              </div>
              <form onSubmit={handleCreateGroup}>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={newGroup.chatName}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, chatName: e.target.value })
                    }
                    placeholder="Enter group name"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, description: e.target.value })
                    }
                    placeholder="Describe your study group..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newGroup.isVerified}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, isVerified: e.target.checked })
                      }
                    />
                    <span style={{ fontSize: "14px" }}>
                      Request verification (admin approval required)
                    </span>
                  </label>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: "10px 20px",
                      background: "#f1f5f9",
                      color: "#64748b",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="upload-btn"
                    style={{ padding: "10px 20px" }}
                  >
                    Create Group
                  </button>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Group Password (Optional)
                  </label>
                  <input
                    type="text"
                    value={newGroup.password}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, password: e.target.value })
                    }
                    placeholder="Enter password (course code or instructor name)"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                    }}
                  />
                  <p style={{ fontSize: "12px", color: "#64748b", marginTop: "5px" }}>
                    Users will need this password to join the group
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: "10px 20px",
                      background: "#f1f5f9",
                      color: "#64748b",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="upload-btn"
                    style={{ padding: "10px 20px" }}
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => {
              setShowPasswordModal(false);
              setSelectedGroupId(null);
              setJoinPassword("");
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "30px",
                width: "90%",
                maxWidth: "400px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: "20px" }}>Enter Group Password</h2>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "15px" }}>
                This group is password protected. Please enter the password (course code or instructor name).
              </p>
              <input
                type="text"
                value={joinPassword}
                onChange={(e) => setJoinPassword(e.target.value)}
                placeholder="Enter password"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleJoinGroup();
                  }
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
                autoFocus
              />
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setSelectedGroupId(null);
                    setJoinPassword("");
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinGroup}
                  className="upload-btn"
                  style={{ padding: "10px 20px" }}
                >
                  Join Group
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

