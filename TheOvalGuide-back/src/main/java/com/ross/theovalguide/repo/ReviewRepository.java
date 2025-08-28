package com.ross.theovalguide.repo;

import com.ross.theovalguide.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    // buckets for PROFESSOR ratings (5..1)
    @Query("""
            select r.rating as rating, count(r) as cnt
            from Review r
            where r.professor.id = :profId
            group by r.rating
            """)
    List<Object[]> ratingBucketsForProfessor(@Param("profId") UUID profId);

    // buckets for CLASS difficulty (5..1)
    @Query("""
            select r.difficulty as diff, count(r) as cnt
            from Review r
            where r.courseClass.id = :classId and r.difficulty is not null
            group by r.difficulty
            """)
    List<Object[]> difficultyBucketsForClass(@Param("classId") UUID classId);

    // aggregates used by ReviewService
    @Query("select avg(r.rating) from Review r where r.professor.id = :profId")
    Double avgRatingForProfessor(@Param("profId") UUID profId);

    @Query("select count(r) from Review r where r.professor.id = :profId")
    long countForProfessor(@Param("profId") UUID profId);

    @Query("select avg(r.difficulty) from Review r where r.courseClass.id = :classId and r.difficulty is not null")
    Double avgDifficultyForClass(@Param("classId") UUID classId);

    @Query("select count(r) from Review r where r.courseClass.id = :classId")
    long countForClass(@Param("classId") UUID classId);

    @Query("""
            select r
            from Review r
            left join fetch r.courseClass c
            where r.professor.id = :profId
            order by r.createdAt desc
            """)
    List<Review> findByProfessorIdWithClass(UUID profId);


}