package com.ross.theovalguide.repo;

import com.ross.theovalguide.model.Advice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdviceRepository extends JpaRepository<Advice, UUID> {
    List<Advice> findTop20ByCourseClassIdOrderByCreatedAtDesc(UUID classId);

}