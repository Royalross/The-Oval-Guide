package com.ross.theovalguide.repo;

import com.ross.theovalguide.model.PasswordResetToken;
import com.ross.theovalguide.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    long deleteByUser(UserAccount user);

    List<PasswordResetToken> findAllByUser(UserAccount user);
}
