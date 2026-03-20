import os
import json

base_dir = r"c:\Users\PC\Gate67\Fabrica de Videos"
skills_dir = os.path.join(base_dir, ".agents", "skills", "remotion")

with open(r"C:\Users\PC\.gemini\antigravity\brain\04a54ce3-755c-481c-b727-c23d61d78630\browser\scratchpad_zhm8exmq.md", "r", encoding="utf-8") as f:
    content = f.read()
    skills_data = json.loads(content)

# Root files
if "AGENTS.md" in skills_data:
    with open(os.path.join(base_dir, "AGENTS.md"), "w", encoding="utf-8") as f:
        f.write(skills_data["AGENTS.md"])

if "CLAUDE.md" in skills_data:
    with open(os.path.join(base_dir, "CLAUDE.md"), "w", encoding="utf-8") as f:
        f.write(skills_data["CLAUDE.md"])

# Skills
for skill_name, skill_content in skills_data.items():
    if skill_name in ["AGENTS.md", "CLAUDE.md"]:
        continue
    
    skill_path = os.path.join(skills_dir, skill_name)
    os.makedirs(skill_path, exist_ok=True)
    with open(os.path.join(skill_path, "SKILL.md"), "w", encoding="utf-8") as f:
        f.write(skill_content)

print("Skills created successfully.")
