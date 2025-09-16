package com.ross.theovalguide.repo;

import com.ross.theovalguide.model.ClassProfessor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ClassProfessorRepository extends JpaRepository<ClassProfessor, UUID> {
    @Query("""
            select cp.professor.id, cp.professor.slug, cp.professor.name, cp.professor.overallRating
            from ClassProfessor cp
            where cp.courseClass.id = :classId
            """)
    List<Object[]> professorsForClass(UUID classId);

}