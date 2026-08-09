import fitz
import docx
import re


def extract_text_from_pdf(file_path):
    text = ""
    doc = fitz.open(file_path)

    for page in doc:
        text += page.get_text()

    return text


def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = []

    for para in doc.paragraphs:
        text.append(para.text)

    return "\n".join(text)


def extract_resume_text(file_path, filename):

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_path)

    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_path)

    else:
        raise ValueError("Unsupported file format")


# 🔥 NEW: Extract experience from resume text
def extract_experience(text):
    text = text.lower()

    matches = re.findall(r'(\d+)\+?\s*(years|yrs)', text)

    if not matches:
        return 0

    years = [int(m[0]) for m in matches]

    return max(years)