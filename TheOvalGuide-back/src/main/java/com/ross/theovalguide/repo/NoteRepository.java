package com.ross.theovalguide.repo;

import com.ross.theovalguide.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, UUID> {
    List<Note> findTop20ByCourseClassIdOrderByCreatedAtDesc(UUID classId);

    long countByCourseClassId(UUID classId);
}