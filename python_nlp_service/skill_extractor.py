import spacy
from spacy.matcher import PhraseMatcher
from rapidfuzz import fuzz

nlp = spacy.load("en_core_web_sm")

SKILL_DATABASE = [
    "java","spring","spring boot","springboot","hibernate","microservices","rest api",
    "python","flask","django",
    "javascript","typescript","nodejs","node.js","express",
    "react","angular","vue",
    "html","css","bootstrap",
    "mysql","postgresql","mongodb","oracle","sql",
    "aws","azure","gcp",
    "docker","kubernetes",
    "git","github",
    "linux","bash",
    "tensorflow","pytorch","machine learning","deep learning",
    "pandas","numpy","scikit-learn",
    "c","c++","c#",".net"
]

SKILL_NORMALIZATION = {
    "nodejs": "node.js",
    "node js": "node.js",
    "js": "javascript",
    "ml": "machine learning",
    "dl": "deep learning",
    "springboot": "spring boot",
    "spring boot": "spring boot",
    "reactjs": "react",
    "react.js": "react"
}

matcher = PhraseMatcher(nlp.vocab)
patterns = [nlp(skill) for skill in SKILL_DATABASE]
matcher.add("SKILLS", patterns)


def extract_skills_section(text):
    text = text.lower()

    keywords = ["skills", "technical skills", "technologies"]

    for keyword in keywords:
        index = text.find(keyword)
        if index != -1:
            return text[index:index+600]

    return text


def detect_skills_nlp(text):
    doc = nlp(text)
    matches = matcher(doc)

    return [doc[start:end].text.lower() for _, start, end in matches]


def normalize_skills(skills):
    normalized = []

    for skill in skills:
        skill = skill.lower().strip()
        normalized.append(SKILL_NORMALIZATION.get(skill, skill))

    return list(set(normalized))


def extract_skills(resume_text):
    resume_text = resume_text.lower()

    section_skills = detect_skills_nlp(extract_skills_section(resume_text))
    global_skills = detect_skills_nlp(resume_text)

    all_skills = section_skills + global_skills

    final_skills = normalize_skills(all_skills)

    print("🔥 RESUME SKILLS:", final_skills)

    return final_skills


def fuzzy_skill_match(resume_skills, job_skills):

    matched = []

    for jskill in job_skills:
        j_clean = jskill.lower().replace(" ", "")

        for rskill in resume_skills:
            r_clean = rskill.lower().replace(" ", "")

            if j_clean == r_clean:
                matched.append(jskill)
                break

            if fuzz.ratio(j_clean, r_clean) > 70:
                matched.append(jskill)
                break

    print("🔥 MATCHED:", matched)

    return list(set(matched))