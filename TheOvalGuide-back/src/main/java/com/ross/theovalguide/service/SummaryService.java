package com.ross.theovalguide.service;

import com.ross.theovalguide.DTOS.ClassProfessorBriefDto;
import com.ross.theovalguide.DTOS.ClassResponse;
import com.ross.theovalguide.DTOS.LabelCountDto;
import com.ross.theovalguide.DTOS.ProfessorResponse;
import com.ross.theovalguide.DTOS.ReviewItemDto;
import com.ross.theovalguide.DTOS.SummaryResponse;
import com.ross.theovalguide.DTOS.TagDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SummaryService {

    private final ClassQueryService classQueryService;
    private final ProfessorQueryService professorQueryService;

    @Transactional(readOnly = true)
    public SummaryResponse summarizeClass(String code) {
        ClassResponse data = classQueryService.getClassByCode(code);
        String summary = buildClassSummary(data);
        return new SummaryResponse(summary);
    }

    @Transactional(readOnly = true)
    public SummaryResponse summarizeProfessor(String slug) {
        ProfessorResponse data = professorQueryService.getProfessorBySlug(slug);
        String summary = buildProfessorSummary(data);
        return new SummaryResponse(summary);
    }

    private String buildClassSummary(ClassResponse data) {
        List<String> sentences = new ArrayList<>();

        String code = safe(data.code());
        String title = safe(data.title());
        String department = safe(data.department());
        String university = safe(data.university());

        StringBuilder intro = new StringBuilder();
        if (!code.isEmpty()) {
            intro.append(code);
        }
        if (!title.isEmpty()) {
            if (intro.length() > 0) {
                intro.append(" — ");
            }
            intro.append(title);
        }
        if (intro.length() == 0) {
            intro.append("This course");
        }
        intro.append(" is offered by the ");
        intro.append(!department.isEmpty() ? department : "department");
        intro.append(" department at ");
        intro.append(!university.isEmpty() ? university : "the university");
        intro.append(".");
        sentences.add(intro.toString());

        int totalRatings = data.totalRatings();
        BigDecimal difficulty = data.difficulty();
        if (totalRatings > 0) {
            if (difficulty != null) {
                sentences.add(String.format(Locale.US,
                        "Students report an average difficulty of %s/5 based on %d rating%s.",
                        formatOneDecimal(difficulty),
                        totalRatings,
                        plural(totalRatings)));
            } else {
                sentences.add(String.format(Locale.US,
                        "Students have submitted %d difficulty rating%s so far.",
                        totalRatings,
                        plural(totalRatings)));
            }
        } else {
            sentences.add("We have not collected enough difficulty ratings yet.");
        }

        Optional<LabelCountDto> commonDifficulty = data.difficultyBuckets().stream()
                .filter(b -> b.count() > 0)
                .max(Comparator.comparingLong(LabelCountDto::count));
        commonDifficulty.ifPresent(bucket -> sentences.add(String.format(Locale.US,
                "The most common response marks the course as a %s on the difficulty scale.",
                bucket.label())));

        List<String> tagLabels = data.tags().stream()
                .map(TagDto::label)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .limit(3)
                .collect(Collectors.toList());
        if (!tagLabels.isEmpty()) {
            sentences.add("Popular tags include " + joinList(tagLabels) + ".");
        }

        List<String> professorNames = data.professors().stream()
                .map(ClassProfessorBriefDto::name)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .limit(3)
                .collect(Collectors.toList());
        if (!professorNames.isEmpty()) {
            sentences.add("Recent instructors include " + joinList(professorNames) + ".");
        }

        int adviceCount = data.advices() == null ? 0 : data.advices().size();
        if (adviceCount > 0) {
            sentences.add(String.format(Locale.US,
                    "Students have shared %d piece%s of advice for this class.",
                    adviceCount,
                    plural(adviceCount)));
        }

        String summary = joinSentences(sentences);
        return summary.isBlank() ? "We’ll add a summary once we have more feedback." : summary;
    }

    private String buildProfessorSummary(ProfessorResponse data) {
        List<String> sentences = new ArrayList<>();

        String name = safe(data.name());
        String department = safe(data.department());
        String university = safe(data.university());

        StringBuilder intro = new StringBuilder();
        if (!name.isEmpty()) {
            intro.append(name);
        } else {
            intro.append("This professor");
        }
        if (!department.isEmpty() || !university.isEmpty()) {
            intro.append(" teaches");
            if (!department.isEmpty()) {
                intro.append(" in the ").append(department).append(" department");
            }
            if (!university.isEmpty()) {
                if (!department.isEmpty()) {
                    intro.append(" at ");
                } else {
                    intro.append(" at ");
                }
                intro.append(university);
            }
        } else {
            intro.append(" teaches at our university");
        }
        intro.append(".");
        sentences.add(intro.toString());

        int totalRatings = data.totalRatings();
        BigDecimal overall = data.overall();
        if (totalRatings > 0 && overall != null) {
            sentences.add(String.format(Locale.US,
                    "Students have submitted %d rating%s with an average score of %s/5.",
                    totalRatings,
                    plural(totalRatings),
                    formatOneDecimal(overall)));
        } else if (totalRatings > 0) {
            sentences.add(String.format(Locale.US,
                    "Students have submitted %d rating%s so far.",
                    totalRatings,
                    plural(totalRatings)));
        } else {
            sentences.add("We have not collected enough ratings yet to calculate an average score.");
        }

        Optional<LabelCountDto> commonRating = data.buckets().stream()
                .filter(b -> b.count() > 0)
                .max(Comparator.comparingLong(LabelCountDto::count));
        commonRating.ifPresent(bucket -> sentences.add(String.format(Locale.US,
                "Most reviews award a %s out of 5.",
                bucket.label())));

        List<String> tagLabels = data.tags().stream()
                .map(TagDto::label)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .limit(3)
                .collect(Collectors.toList());
        if (!tagLabels.isEmpty()) {
            sentences.add("Common feedback highlights " + joinList(tagLabels) + ".");
        }

        List<ReviewItemDto> reviews = data.reviews();
        int reviewCount = reviews == null ? 0 : reviews.size();
        if (reviewCount > 0) {
            Map<String, Long> courseFrequency = reviews.stream()
                    .map(ReviewItemDto::course)
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.groupingBy(s -> s, Collectors.counting()));
            String topCourse = courseFrequency.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(null);

            StringBuilder reviewSentence = new StringBuilder();
            reviewSentence.append(String.format(Locale.US,
                    "We have %d recent review%s on file",
                    reviewCount,
                    plural(reviewCount)));
            if (topCourse != null) {
                reviewSentence.append(", with many referencing ").append(topCourse);
            }
            reviewSentence.append(".");
            sentences.add(reviewSentence.toString());
        }

        String summary = joinSentences(sentences);
        return summary.isBlank() ? "We’ll add a summary once we have more feedback." : summary;
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    private String formatOneDecimal(BigDecimal value) {
        if (value == null) return "";
        DecimalFormat df = new DecimalFormat("0.0");
        df.setRoundingMode(RoundingMode.HALF_UP);
        return df.format(value);
    }

    private String joinList(List<String> values) {
        if (values.isEmpty()) return "";
        if (values.size() == 1) return values.get(0);
        if (values.size() == 2) return values.get(0) + " and " + values.get(1);
        String allButLast = String.join(", ", values.subList(0, values.size() - 1));
        return allButLast + ", and " + values.get(values.size() - 1);
    }

    private String joinSentences(List<String> sentences) {
        return sentences.stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining(" "));
    }

    private String plural(long count) {
        return count == 1 ? "" : "s";
    }
}
