from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from skill_extractor import fuzzy_skill_match


def normalize_skill(skill):
    if not skill:
        return ""

    skill = skill.lower().strip()
    skill = skill.replace(" ", "")

    corrections = {
        "pyhton": "python",
        "tensor flow": "tensorflow",
        "rest apis": "restapi",
        "spring boot": "springboot"
    }

    return corrections.get(skill, skill)


def recommend_jobs(resume_text, resume_skills, jobs, experience, location):

    print("🔥 FUNCTION CALLED 🔥")

    resume_text = (resume_text or "").lower()
    resume_skills = [normalize_skill(s) for s in (resume_skills or [])]

    print("Normalized Skills:", resume_skills)

    # ---------------------------
    # Filter jobs
    # ---------------------------
    filtered_jobs = []

    for job in jobs:
        job_id = job.get("id")

        if not job_id:
            continue

        min_exp = job.get("minExperience", 0)
        max_exp = job.get("maxExperience", 100)

        if experience < min_exp or experience > max_exp:
            continue

        if location:
            job_loc = (job.get("location", "") or "").lower()
            user_loc = location.lower()

            if user_loc not in job_loc and job_loc not in user_loc:
                print("Location mismatch, but not removing job")

        filtered_jobs.append(job)

    print("Filtered jobs:", len(filtered_jobs))

    if not filtered_jobs:
        return []

    # ---------------------------
    # Lightweight text similarity
    # ---------------------------
    resume_doc = " ".join(resume_skills) + " " + resume_text

    job_docs = []

    for job in filtered_jobs:
        job_text = (
            (job.get("description", "") or "") + " " +
            " ".join(job.get("skills", []) or [])
        ).lower()

        job_docs.append(job_text)

    try:
        documents = [resume_doc] + job_docs

        vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            max_features=5000
        )

        embeddings = vectorizer.fit_transform(documents)

        resume_embedding = embeddings[0]
        job_embeddings = embeddings[1:]

        similarities = cosine_similarity(
            resume_embedding,
            job_embeddings
        )[0]

    except Exception as e:
        print("❌ Similarity calculation failed:", str(e))
        similarities = [0.0] * len(filtered_jobs)

    print("Similarity:", similarities)

    # ---------------------------
    # Ranking
    # ---------------------------
    results = []

    for i, job in enumerate(filtered_jobs):

        job_id = job.get("id")

        job_skills = [
            normalize_skill(s)
            for s in (job.get("skills", []) or [])
        ]

        matched_skills = fuzzy_skill_match(
            resume_skills,
            job_skills
        )

        total_skills = len(job_skills)

        similarity_score = float(similarities[i])

        skill_ratio = (
            len(matched_skills) / total_skills
            if total_skills > 0
            else 0
        )

        score = (
            (0.7 * similarity_score) +
            (0.3 * skill_ratio)
        )

        print(f"Job {job_id}")
        print("Matched:", matched_skills)
        print("Score:", score)

        # ---------------------------
        # Strict filtering
        # ---------------------------
        if len(matched_skills) == 0 and similarity_score < 0.25:
            continue

        if score < 0.2:
            continue

        results.append({
            "jobId": job_id,
            "score": round(score, 4),
            "similarity": round(similarity_score, 4),
            "matchedSkills": matched_skills,
            "matchedSkillCount": len(matched_skills),
            "totalRequiredSkills": total_skills
        })

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    print("Final Results:", results)

    return results[:5]