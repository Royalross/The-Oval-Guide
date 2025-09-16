package com.ross.theovalguide.repo;

import com.ross.theovalguide.model.SessionToken;
import com.ross.theovalguide.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SessionTokenRepository extends JpaRepository<SessionToken, UUID> {
    Optional<SessionToken> findByTokenHash(String tokenHash);

    long deleteByUser(UserAccount user);

    List<SessionToken> findAllByUser(UserAccount user);
}
