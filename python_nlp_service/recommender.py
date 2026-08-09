# # from sklearn.feature_extraction.text import TfidfVectorizer
# # from sklearn.metrics.pairwise import cosine_similarity
# # from skill_extractor import fuzzy_skill_match


# # def recommend_jobs(resume_text, resume_skills, jobs, experience, location):

# #     print("🔥 FUNCTION CALLED 🔥")

# #     filtered_jobs = []

# #     # ---------------------------
# #     # Step 1: Filter Jobs
# #     # ---------------------------
# #     for job in jobs:
# #         min_exp = job.get("minExperience", 0)
# #         max_exp = job.get("maxExperience", 100)

# #         # Experience filter
# #         if experience < min_exp or experience > max_exp:
# #             continue

# #         # Location filter
# #         if location:
# #             if location.lower() not in job.get("location", "").lower():
# #                 continue

# #         filtered_jobs.append(job)

# #     print("Filtered jobs:", len(filtered_jobs))

# #     # ✅ Fallback if no jobs after filtering
# #     if not filtered_jobs:
# #         print("⚠️ No jobs after filtering → returning fallback")
# #         return [{"jobId": job.get("id")} for job in jobs[:5]]

# #     # ---------------------------
# #     # Step 2: TF-IDF
# #     # ---------------------------
# #     # ✅ BOOST skills importance
# #     documents = [" ".join(resume_skills) + " " + resume_text]

# #     for job in filtered_jobs:
# #         job_text = job.get("description", "") + " " + " ".join(job.get("skills", []))
# #         documents.append(job_text)

# #     vectorizer = TfidfVectorizer(stop_words="english")
# #     tfidf_matrix = vectorizer.fit_transform(documents)

# #     resume_vector = tfidf_matrix[0:1]
# #     job_vectors = tfidf_matrix[1:]

# #     similarities = cosine_similarity(resume_vector, job_vectors)[0]

# #     print("Similarity:", similarities)

# #     # ---------------------------
# #     # Step 3: Ranking
# #     # ---------------------------
# #     results = []

# #     for i, job in enumerate(filtered_jobs):

# #         job_skills = job.get("skills", [])

# #         matched_skills = fuzzy_skill_match(resume_skills, job_skills)

# #         total_skills = len(job_skills)

# #         # Safe calculation
# #         skill_ratio = len(matched_skills) / total_skills if total_skills > 0 else 0

# #         similarity_score = similarities[i]

# #         # ✅ Balanced scoring
# #         score = (0.6 * similarity_score) + (0.4 * skill_ratio)

# #         results.append({
# #             "jobId": job.get("id"),
# #             "score": round(score, 4),
# #             "similarity": round(similarity_score, 4),
# #             "matchedSkills": matched_skills,
# #             "matchedSkillCount": len(matched_skills),
# #             "totalRequiredSkills": total_skills
# #         })

# #     # ---------------------------
# #     # Step 4: Sort
# #     # ---------------------------
# #     results.sort(key=lambda x: x["score"], reverse=True)

# #     print("Results:", results)

# #     # ---------------------------
# #     # Step 5: SMART FALLBACK (CRITICAL FIX)
# #     # ---------------------------

# #     # Case 1: Somehow empty
# #     if len(results) == 0:
# #         print("⚠️ No results → fallback")
# #         return [{"jobId": job.get("id")} for job in filtered_jobs[:5]]

# #     # Case 2: Scores too low → still return jobs
# #     top_results = results[:5]

# #     if all(r["score"] < 0.05 for r in top_results):
# #         print("⚠️ Low scores → returning fallback jobs")
# #         return [{"jobId": job.get("id")} for job in filtered_jobs[:5]]

# #     # Case 3: Normal case
# #     return top_results
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# from skill_extractor import fuzzy_skill_match


# def recommend_jobs(resume_text, resume_skills, jobs, experience, location):

#     print("🔥 FUNCTION CALLED 🔥")

#     filtered_jobs = []

#     # ---------------------------
#     # Step 1: Filter Jobs
#     # ---------------------------
#     for job in jobs:
#         min_exp = job.get("minExperience", 0)
#         max_exp = job.get("maxExperience", 100)

#         # Experience filter
#         if experience < min_exp or experience > max_exp:
#             continue

#         # Location filter
#         if location:
#             if location.lower() not in job.get("location", "").lower():
#                 continue

#         filtered_jobs.append(job)

#     print("Filtered jobs:", len(filtered_jobs))

#     # ✅ Fallback if no jobs after filtering
#     if not filtered_jobs:
#         print("⚠️ No jobs after filtering → returning fallback")
#         return [{"jobId": job.get("id")} for job in jobs[:5]]

#     # ---------------------------
#     # Step 2: TF-IDF
#     # ---------------------------
#     # ✅ BOOST skills importance
#     documents = [" ".join(resume_skills) + " " + resume_text]

#     for job in filtered_jobs:
#         job_text = job.get("description", "") + " " + " ".join(job.get("skills", []))
#         documents.append(job_text)

#     vectorizer = TfidfVectorizer(stop_words="english")
#     tfidf_matrix = vectorizer.fit_transform(documents)

#     resume_vector = tfidf_matrix[0:1]
#     job_vectors = tfidf_matrix[1:]

#     similarities = cosine_similarity(resume_vector, job_vectors)[0]

#     print("Similarity:", similarities)

#     # ---------------------------
#     # Step 3: Ranking
#     # ---------------------------
#     results = []

#     for i, job in enumerate(filtered_jobs):

#         job_skills = job.get("skills", [])

#         matched_skills = fuzzy_skill_match(resume_skills, job_skills)

#         total_skills = len(job_skills)

#         # Safe calculation
#         skill_ratio = len(matched_skills) / total_skills if total_skills > 0 else 0

#         similarity_score = similarities[i]

#         # ✅ Balanced scoring
#         score = (0.6 * similarity_score) + (0.4 * skill_ratio)

#         results.append({
#             "jobId": job.get("id"),
#             "score": round(score, 4),
#             "similarity": round(similarity_score, 4),
#             "matchedSkills": matched_skills,
#             "matchedSkillCount": len(matched_skills),
#             "totalRequiredSkills": total_skills
#         })

#     # ---------------------------
#     # Step 4: Sort
#     # ---------------------------
#     results.sort(key=lambda x: x["score"], reverse=True)

#     print("Results:", results)

#     # ---------------------------
#     # Step 5: SMART FALLBACK (CRITICAL FIX)
#     # ---------------------------

#     # Case 1: Somehow empty
#     if len(results) == 0:
#         print("⚠️ No results → fallback")
#         return [{"jobId": job.get("id")} for job in filtered_jobs[:5]]

#     # Case 2: Scores too low → still return jobs
#     top_results = results[:5]

#     if all(r["score"] < 0.05 for r in top_results):
#         print("⚠️ Low scores → returning fallback jobs")
#         return [{"jobId": job.get("id")} for job in filtered_jobs[:5]]

#     # Case 3: Normal case
#     return top_results
from sentence_transformers import SentenceTransformer, util
from skill_extractor import fuzzy_skill_match

model = SentenceTransformer('all-MiniLM-L6-v2')


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
                print("Location mismatch , but not removing job")

        filtered_jobs.append(job)

    print("Filtered jobs:", len(filtered_jobs))

    if not filtered_jobs:
        return []

    # ---------------------------
    # Semantic similarity
    # ---------------------------
    resume_doc = " ".join(resume_skills) + " " + resume_text

    job_docs = []
    for job in filtered_jobs:
        job_text = (
            (job.get("description", "") or "") + " " +
            " ".join(job.get("skills", []) or [])
        ).lower()
        job_docs.append(job_text)

    resume_embedding = model.encode(resume_doc, convert_to_tensor=True)
    job_embeddings = model.encode(job_docs, convert_to_tensor=True)

    similarities = util.cos_sim(resume_embedding, job_embeddings)[0].cpu().numpy()

    print("Similarity:", similarities)

    # ---------------------------
    # Ranking
    # ---------------------------
    results = []

    for i, job in enumerate(filtered_jobs):

        job_id = job.get("id")

        job_skills = [
            normalize_skill(s) for s in (job.get("skills", []) or [])
        ]

        matched_skills = fuzzy_skill_match(resume_skills, job_skills)

        total_skills = len(job_skills)
        similarity_score = float(similarities[i])

        skill_ratio = len(matched_skills) / total_skills if total_skills > 0 else 0

        score = (0.7 * similarity_score) + (0.3 * skill_ratio)

        print(f"Job {job_id}")
        print("Matched:", matched_skills)
        print("Score:", score)

        # 🔥 Strict filtering
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

    results.sort(key=lambda x: x["score"], reverse=True)

    print("Final Results:", results)

    return results[:5]