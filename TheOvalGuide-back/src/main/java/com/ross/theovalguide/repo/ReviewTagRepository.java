package com.ross.theovalguide.repo;

import com.ross.theovalguide.model.ReviewTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReviewTagRepository extends JpaRepository<ReviewTag, java.util.UUID> {

    // top tags for a professor
    @Query("""
            select t.id, upper(t.label), count(rt)
            from ReviewTag rt
              join rt.tag t
              join rt.review r
            where r.professor.id = :profId
            group by t.id, t.label
            order by count(rt) desc
            """)
    List<Object[]> topTagsForProfessor(@Param("profId") UUID profId);

    // top tags for a class
    @Query("""
            select t.id, upper(t.label), count(rt)
            from ReviewTag rt
              join rt.tag t
              join rt.review r
            where r.courseClass.id = :classId
            group by t.id, t.label
            order by count(rt) desc
            """)
    List<Object[]> topTagsForClass(@Param("classId") UUID classId);

    // tags for a given review
    @Query("""
            select upper(rt.tag.label)
            from ReviewTag rt
            where rt.review.id = :reviewId
            """)
    List<String> labelsForReview(@Param("reviewId") UUID reviewId);
}