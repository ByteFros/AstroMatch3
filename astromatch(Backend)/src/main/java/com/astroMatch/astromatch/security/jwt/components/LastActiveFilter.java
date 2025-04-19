package com.astroMatch.astromatch.security.jwt.components;

import com.astroMatch.astromatch.repository.UserRepository;
import com.astroMatch.astromatch.security.jwt.JwtUtil;
import com.astroMatch.astromatch.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class LastActiveFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;

    public LastActiveFilter(JwtUtil jwtUtil,
                            CustomUserDetailsService userDetailsService,
                            UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.validateToken(token, userDetailsService.loadUserByUsername(jwtUtil.extractUsername(token)))) {
                String username = jwtUtil.extractUsername(token);
                userRepository.findByUsername(username).ifPresent(user -> {
                    user.setLastActive(LocalDateTime.now());
                    userRepository.save(user);
                });
            }
        }
        chain.doFilter(req, res);
    }
}
