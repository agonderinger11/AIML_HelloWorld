# Portfolio Page Specification

## Project Overview
A single-page portfolio website featuring an interactive gradient background that responds to mouse movement.

## Features
- **Name Display**: Prominently displays "Austin Gonderinger"
- **Greeting**: A brief, welcoming message
- **Interactive Gradient**: Background gradient that shifts and moves with cursor position
- **Responsive Design**: Works on various screen sizes

## Technical Requirements

### HTML (index.html)
- HTML5 document structure
- Semantic markup
- External CSS and JS file links

### CSS (style.css)
- Full-viewport gradient background using CSS custom properties
- Centered content layout with flexbox
- Modern typography
- Smooth gradient transitions

### JavaScript (script.js)
- Mouse move event listener on document
- Calculate cursor X/Y position as viewport percentage
- Update CSS custom properties (`--mouse-x`, `--mouse-y`)
- Radial gradient follows cursor position

## File Structure
```
portfolio/
├── index.html
├── style.css
├── script.js
└── spec.md
```

## Deployment (GitHub Pages)
1. Create a new GitHub repository
2. Push all files to the `main` branch
3. Go to repository Settings > Pages
4. Set Source to "Deploy from a branch"
5. Select `main` branch and `/ (root)` folder
6. Save and wait for deployment
7. Access site at `https://<username>.github.io/<repo-name>/`

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
