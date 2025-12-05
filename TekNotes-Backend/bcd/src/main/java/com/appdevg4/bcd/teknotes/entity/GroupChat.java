package com.appdevg4.bcd.teknotes.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "group_chats")
public class GroupChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Integer groupId;

    @Column(name = "chat_name", nullable = false, length = 255)
    private String chatName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified;

    @Column(name = "password", length = 255)
    private String password;

    @ManyToOne(optional = false)
    @JoinColumn(name = "created_by_user_id")
    @JsonIgnoreProperties({"bookmarks", "reviews", "password", "hibernateLazyInitializer", "handler"})
    private User createdBy;

    @OneToMany(mappedBy = "groupChat", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"groupChat", "hibernateLazyInitializer", "handler"})
    private List<UserChat> members = new ArrayList<>();

    @OneToMany(mappedBy = "groupChat", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"groupChat", "hibernateLazyInitializer", "handler"})
    private List<ChatMessage> messages = new ArrayList<>();

    @OneToMany(mappedBy = "groupChat", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"groupChat", "hibernateLazyInitializer", "handler"})
    private List<SharedFile> sharedFiles = new ArrayList<>();

    public GroupChat() {
        this.createdAt = LocalDateTime.now();
        this.isVerified = false;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public List<UserChat> getMembers() {
        return members;
    }

    public void setMembers(List<UserChat> members) {
        this.members = members;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }

    public List<SharedFile> getSharedFiles() {
        return sharedFiles;
    }

    public void setSharedFiles(List<SharedFile> sharedFiles) {
        this.sharedFiles = sharedFiles;
    }
}

