package com.ross.theovalguide.repo;

import com.ross.theovalguide.model.CourseClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CourseClassRepository extends JpaRepository<CourseClass, UUID> {

    Optional<CourseClass> findByCodeIgnoreCase(String code);

    // Fuzzy search used by SearchService, handles code/title/department/university
    @Query("""
              select c from CourseClass c
              where
                upper(c.code) like upper(concat('%', :q, '%'))
                or upper(replace(c.code, ' ', '')) like upper(concat('%', :qNoSpace, '%'))
                or upper(c.title) like upper(concat('%', :q, '%'))
                or upper(c.department) like upper(concat('%', :q, '%'))
                or upper(c.university) like upper(concat('%', :q, '%'))
            """)
    Page<CourseClass> searchClasses(
            @Param("q") String q,
            @Param("qNoSpace") String qNoSpace,
            Pageable pageable
    );

    // Normalized exact match for codes ignoring spaces (CS2201 vs CS 2201)
    @Query(value = """
            select *
            from classes c
            where upper(replace(c.code, ' ', '')) = upper(replace(:code, ' ', ''))
            limit 1
            """, nativeQuery = true)
    Optional<CourseClass> findByCodeNormalized(@Param("code") String code);


    // loose, space-insensitive exact match
    @org.springframework.data.jpa.repository.Query(value = """
              select * from classes c
              where upper(replace(c.code, ' ', '')) = upper(replace(:code, ' ', ''))
              limit 1
            """, nativeQuery = true)
    java.util.Optional<com.ross.theovalguide.model.CourseClass> findFirstByCodeLoose(
            @org.springframework.data.repository.query.Param("code") String code
    );
}