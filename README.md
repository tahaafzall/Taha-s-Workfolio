# Taha's Workpolio

An animated, single-page portfolio site — charcoal theme, 3D hero, glass cards, scroll animations. Plain HTML/CSS/JS, no build step.

## Files
```
index.html       → page structure & content
styles.css        → all styling (charcoal + single accent theme)
script.js         → 3D hero scene, cursor, animations, interactions
resume-data.js    → your resume embedded as base64 (makes the download button work with zero setup)
assets/
  Taha_Afzal_Resume.pdf  → your resume (kept here too, for reference / re-embedding later)
```

## Host it on GitHub Pages (free)

1. **Create a GitHub account** at github.com if you don't have one already.
2. **Create a new repository** — click the `+` in the top right → **New repository**. Name it something like `taha-workpolio`. Keep it **Public**. Don't initialize with a README (we already have one).
3. **Upload the files**:
   - Easiest way: on the new repo's page, click **uploading an existing file**, then drag in `index.html`, `styles.css`, `script.js`, `resume-data.js`, `README.md`, and the `assets` folder (with the PDF inside). Commit the upload.
   - Or, if you have `git` installed:
     ```bash
     cd taha-site
     git init
     git add .
     git commit -m "Initial portfolio site"
     git branch -M main
     git remote add origin https://github.com/tahaafzall/taha-workpolio.git
     git push -u origin main
     ```
4. In the repo, go to **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
7. Wait about a minute — GitHub will show a live URL like:
   `https://tahaafzall.github.io/taha-workpolio/`

That's the link to put on your CV, LinkedIn, and job applications.

## Making future edits
- **Content** (jobs, skills, certs, wording): edit directly inside `index.html` — everything is plain HTML you can find and change.
- **Colors / spacing / fonts**: edit `styles.css` — the whole palette is defined once at the top under `:root`.
- **Resume file**: if you update your resume, replace `assets/Taha_Afzal_Resume.pdf`, then re-generate `resume-data.js` (or just tell me and I'll regenerate it for you) so the download button matches the new file.
- **3D hero / animations / cursor**: all in `script.js`.

After editing, commit and push (or re-upload the changed file on github.com) — Pages redeploys automatically within a minute or two.

## Notes for next steps
- A projects/write-ups section once you have security-related projects (TryHackMe rooms, CTFs, a home-lab SIEM setup)
- A custom domain pointed at GitHub Pages
- Analytics (e.g. Plausible) to see who's viewing the site
