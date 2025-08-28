package com.ross.theovalguide.service;

import com.ross.theovalguide.DTOS.*;
import com.ross.theovalguide.model.Advice;
import com.ross.theovalguide.model.Note;
import com.ross.theovalguide.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassQueryService {

    private final CourseClassRepository classes;
    private final ReviewRepository reviews;
    private final ReviewTagRepository reviewTags;
    private final ClassProfessorRepository classProfs;
    private final AdviceRepository adviceRepo;
    private final NoteRepository noteRepo;

    /**
     * ENTRYPOINT used by controller → lookup for code variants
     */
    @Transactional(readOnly = true)
    public ClassResponse getClassByCode(String code) {
        // First try exact case-insensitive
        var opt = classes.findByCodeIgnoreCase(code);

        // then try normalized remove spaces both sides → handles CS2201 vs CS 2201
        if (opt.isEmpty()) {
            opt = classes.findByCodeNormalized(code);
        }

        // then if the incoming code is smushed (letters+digits), add a space: CS2201 -> CS 2201
        if (opt.isEmpty()) {
            String spaced = code.replaceAll("(?i)^([a-z]+)\\s*([0-9].*)$", "$1 $2");
            if (!spaced.equals(code)) {
                opt = classes.findByCodeIgnoreCase(spaced);
            }
        }

        var entity = opt.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return buildClassResponse(entity.getId());
    }

    /**
     * Helper that runs inside the active transaction started by the entrypoint.
     */
    private ClassResponse buildClassResponse(UUID id) {
        var c = classes.findById(id).orElseThrow();

        // Difficulty buckets (5..1)
        Map<Integer, Long> bucketMap = new HashMap<>();
        reviews.difficultyBucketsForClass(id).forEach(row -> {
            Integer diff = (Integer) row[0];
            Long cnt = (Long) row[1];
            if (diff != null) bucketMap.put(diff, cnt);
        });
        List<LabelCountDto> difficultyBuckets = new ArrayList<>();
        for (int i = 5; i >= 1; i--) {
            difficultyBuckets.add(new LabelCountDto(String.valueOf(i), bucketMap.getOrDefault(i, 0L)));
        }

        // Professors for this class
        var profBriefs = classProfs.professorsForClass(id).stream()
                .map(row -> new ClassProfessorBriefDto(
                        row[0].toString(),           // professor id
                        (String) row[1],             // professor name
                        (BigDecimal) row[2]          // overall (nullable)
                ))
                .collect(Collectors.toList());

        // Tags (top)
        var tags = reviewTags.topTagsForClass(id).stream()
                .map(row -> new TagDto(row[0].toString(), (String) row[1]))
                .collect(Collectors.toList());

        // Advice (no upvotes column in schema -> return 0)
        var advices = adviceRepo.findTop20ByCourseClassIdOrderByCreatedAtDesc(id).stream()
                .map(this::toAdvice)
                .collect(Collectors.toList());

        // Notes & preview (title derived from file name)
        var notes = noteRepo.findTop20ByCourseClassIdOrderByCreatedAtDesc(id).stream()
                .map(Note::getFileUrl)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        int noteCount = (int) noteRepo.countByCourseClassId(id);
        var samples = noteRepo.findTop20ByCourseClassIdOrderByCreatedAtDesc(id).stream()
                .limit(5)
                .map(n -> new NotesPreviewDto.Sample(
                        n.getId().toString(),
                        deriveTitleFromUrl(n.getFileUrl())
                ))
                .collect(Collectors.toList());

        return new ClassResponse(
                c.getId().toString(),
                c.getCode(),
                c.getTitle(),
                c.getDepartment(),
                c.getUniversity(),
                c.getDifficultyAvg(),
                c.getTotalRatings(),
                List.of(),                               // gradeBuckets not modeled -> empty
                difficultyBuckets,
                profBriefs,
                tags,
                null,                           // summary (later if you like)
                advices,
                notes,
                new NotesPreviewDto(noteCount, samples)
        );
    }

    private ClassResponse.AdviceDto toAdvice(Advice a) {
        String author = a.getUser() != null ? a.getUser().getUsername() : "anonymous";
        String date = DateTimeFormatter.ISO_LOCAL_DATE
                .format(a.getCreatedAt().atZone(java.time.ZoneOffset.UTC));
        return new ClassResponse.AdviceDto(
                a.getId().toString(),
                author,
                date,
                a.getText(),
                0
        );
    }

    private String deriveTitleFromUrl(String url) {
        if (url == null || url.isBlank()) return "Attachment";
        int slash = url.lastIndexOf('/');
        String file = slash >= 0 ? url.substring(slash + 1) : url;
        return file.replace('-', ' ');
    }
}