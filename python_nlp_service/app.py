from fastapi import FastAPI, UploadFile, File, Form
import shutil
import json
import os

from resume_parser import extract_resume_text, extract_experience
from skill_extractor import extract_skills
from recommender import recommend_jobs

app = FastAPI()


# -----------------------------
# Resume based recommendation
# -----------------------------
@app.post("/recommend/resume")
async def recommend_resume(
        resume: UploadFile = File(...),
        jobs: str = Form(...),
        experience: int = Form(0),
        location: str = Form("")
):
    print("🚀 RESUME API HIT")

    try:
        # -----------------------------
        # Parse jobs safely
        # -----------------------------
        if isinstance(jobs, str):
            try:
                jobs = json.loads(jobs)
            except Exception as e:
                print("❌ Failed to parse jobs:", e)
                jobs = []

        print("Jobs received:", len(jobs))

        # -----------------------------
        # Save resume temporarily
        # -----------------------------
        file_location = f"temp_{resume.filename}"

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)

        # -----------------------------
        # Extract resume data
        # -----------------------------
        resume_text = extract_resume_text(file_location, resume.filename)

        resume_skills = extract_skills(resume_text)

        # 🔥 NEW: Extract experience automatically
        extracted_exp = extract_experience(resume_text)

        # Priority: user input > extracted
        final_experience = experience if experience > 0 else extracted_exp

        print("🔥 Skills:", resume_skills)
        print("🔥 Extracted Experience:", extracted_exp)

        # -----------------------------
        # Recommendation
        # -----------------------------
        results = recommend_jobs(
            resume_text,
            resume_skills,
            jobs,
            final_experience,
            location
        )

        # -----------------------------
        # Format response
        # -----------------------------
        final_results = []

        for job in results:
            if isinstance(job, dict):
                job_id = job.get("jobId") or job.get("id")
                if job_id:
                    final_results.append({"jobId": job_id})

        print("🔥 FINAL RESULT:", final_results)

        # -----------------------------
        # Clean temp file
        # -----------------------------
        if os.path.exists(file_location):
            os.remove(file_location)

        return {"recommendedJobs": final_results}

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"status": "error", "message": str(e)}


# -----------------------------
# Manual skill recommendation
# -----------------------------
@app.post("/recommend/manual")
async def recommend_manual(data: dict):
    print("🚀 MANUAL API HIT")

    try:
        skills = data.get("skills", [])
        jobs = data.get("jobs", [])
        experience = data.get("experience", 0)
        location = data.get("location", "")

        resume_text = " ".join(skills) * 3

        results = recommend_jobs(
            resume_text,
            skills,
            jobs,
            experience,
            location
        )

        final_results = []

        for job in results:
            if isinstance(job, dict):
                job_id = job.get("jobId") or job.get("id")
                if job_id:
                    final_results.append({"jobId": job_id})

        print("🔥 FINAL RESULT:", final_results)

        return {"recommendedJobs": final_results}

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"status": "error", "message": str(e)}