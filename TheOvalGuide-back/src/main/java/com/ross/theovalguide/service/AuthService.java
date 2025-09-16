package com.ross.theovalguide.service;

import com.ross.theovalguide.model.PasswordResetToken;
import com.ross.theovalguide.model.SessionToken;
import com.ross.theovalguide.model.UserAccount;
import com.ross.theovalguide.repo.PasswordResetTokenRepository;
import com.ross.theovalguide.repo.SessionTokenRepository;
import com.ross.theovalguide.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private static final Duration SESSION_DURATION = Duration.ofDays(30);
    private static final Duration PASSWORD_RESET_DURATION = Duration.ofHours(2);

    private final UserRepository userRepository;
    private final SessionTokenRepository sessionTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public LoginSuccess login(String login, String password) {
        String lookup = login == null ? "" : login.trim();
        if (lookup.isEmpty()) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid email/username or password");
        }

        UserAccount user = findByLogin(lookup)
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Invalid email/username or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid email/username or password");
        }

        sessionTokenRepository.deleteByUser(user);

        String rawToken = generateToken();
        String tokenHash = hashToken(rawToken);

        SessionToken sessionToken = new SessionToken();
        sessionToken.setUser(user);
        sessionToken.setTokenHash(tokenHash);
        sessionToken.setExpiresAt(Instant.now().plus(SESSION_DURATION));
        sessionTokenRepository.save(sessionToken);

        return new LoginSuccess(rawToken, SESSION_DURATION);
    }

    @Transactional
    public UserAccount register(String username, String email, String rawPassword) {
        String normalizedUsername = username == null ? "" : username.trim();
        String normalizedEmail = email == null ? "" : email.trim();
        if (!normalizedEmail.isEmpty()) {
            normalizedEmail = normalizedEmail.toLowerCase(Locale.ROOT);
        }

        if (normalizedUsername.isEmpty()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (normalizedEmail.isEmpty()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        if (userRepository.findByUsernameIgnoreCase(normalizedUsername).isPresent()) {
            throw new AuthException(HttpStatus.CONFLICT, "Username already in use");
        }
        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new AuthException(HttpStatus.CONFLICT, "Email already in use");
        }

        UserAccount account = new UserAccount();
        account.setUsername(normalizedUsername);
        account.setEmail(normalizedEmail);
        account.setPasswordHash(passwordEncoder.encode(rawPassword));

        return userRepository.save(account);
    }

    @Transactional
    public Optional<String> initiatePasswordReset(String email) {
        String normalizedEmail = email == null ? "" : email.trim();
        if (!normalizedEmail.isEmpty()) {
            normalizedEmail = normalizedEmail.toLowerCase(Locale.ROOT);
        }
        if (normalizedEmail.isEmpty()) {
            return Optional.empty();
        }

        return userRepository.findByEmailIgnoreCase(normalizedEmail)
                .map(this::createResetTokenForUser);
    }

    @Transactional
    public void updatePassword(String rawToken, String newPassword) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Reset token is required");
        }

        String tokenHash = hashToken(rawToken);
        PasswordResetToken token = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new AuthException(HttpStatus.BAD_REQUEST, "Reset link is invalid or expired"));

        if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Reset link is invalid or expired");
        }

        UserAccount user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        sessionTokenRepository.deleteByUser(user);

        token.setUsed(true);
        token.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(token);
    }

    private Optional<UserAccount> findByLogin(String login) {
        Optional<UserAccount> byUsername = userRepository.findByUsernameIgnoreCase(login);
        if (byUsername.isPresent()) {
            return byUsername;
        }
        return userRepository.findByEmailIgnoreCase(login);
    }

    private String createResetTokenForUser(UserAccount user) {
        passwordResetTokenRepository.deleteByUser(user);

        String rawToken = generateToken();
        String tokenHash = hashToken(rawToken);

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setTokenHash(tokenHash);
        token.setExpiresAt(Instant.now().plus(PASSWORD_RESET_DURATION));
        passwordResetTokenRepository.save(token);

        return rawToken;
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 MessageDigest not available", e);
        }
    }

    public record LoginSuccess(String token, Duration ttl) {
    }

    public static class AuthException extends RuntimeException {
        private final HttpStatus status;

        public AuthException(HttpStatus status, String message) {
            super(message);
            this.status = status;
        }

        public HttpStatus getStatus() {
            return status;
        }
    }
}
