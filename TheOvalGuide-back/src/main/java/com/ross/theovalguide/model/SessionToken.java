package com.ross.theovalguide.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "session_tokens")
public class SessionToken extends BaseEntity {

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, columnDefinition = "uuid")
    private UserAccount user;

    @Column(name = "token_hash", columnDefinition = "text", nullable = false, unique = true)
    private String tokenHash;

    @Column(name = "expires_at", columnDefinition = "timestamptz", nullable = false)
    private Instant expiresAt;
}
