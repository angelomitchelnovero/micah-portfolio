# Micah B. Guevarra - Portfolio Website Specification

## 1. Project Overview

- **Project Name**: Micah B. Guevarra Portfolio
- **Type**: Single-page portfolio website
- **Core Functionality**: Showcase VA services, corporate experience, and ESL teaching expertise to attract Filipino employers
- **Target Users**: Filipino employers on OnlineJobs.ph looking to hire a reliable Virtual Assistant

---

## 2. UI/UX Specification

### Layout Structure

**Sections (in order):**
1. **Navigation** - Fixed top navbar with smooth scroll links
2. **Hero** - Full viewport intro with name, title, and CTA
3. **About** - Brief introduction and professional summary
4. **Services** - Three core service offerings
5. **Experience** - Timeline of work history
6. **Skills** - Visual skill tags
7. **Testimonials** - Client recommendations
8. **Contact** - Contact form and social links
9. **Footer** - Copyright and quick links

**Responsive Breakpoints:**
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (two columns where applicable)
- Desktop: > 1024px (full layout)

### Visual Design

**Color Palette:**
- Primary: `#1A1A2E` (Deep navy - trust, professionalism)
- Secondary: `#16213E` (Dark blue - corporate)
- Accent: `#E94560` (Coral red - friendly, approachable)
- Light: `#F8F9FA` (Off-white - clean background)
- Text Primary: `#1A1A2E`
- Text Secondary: `#6B7280`
- White: `#FFFFFF`

**Typography:**
- Headings: "Playfair Display" (serif, elegant, approachable)
- Body: "Source Sans 3" (sans-serif, clean, readable)
- Sizes:
  - H1: 3.5rem (hero)
  - H2: 2.5rem (section titles)
  - H3: 1.5rem (card titles)
  - Body: 1rem
  - Small: 0.875rem

**Spacing System:**
- Section padding: 100px vertical, 5% horizontal
- Card padding: 32px
- Element gaps: 24px standard, 16px tight, 48px loose

**Visual Effects:**
- Subtle box shadows on cards: `0 4px 24px rgba(26, 26, 46, 0.08)`
- Hover lift on cards: translateY(-8px)
- Smooth transitions: 0.3s ease
- Accent color underlines on headings

### Components

**Navigation:**
- Logo/Name on left
- Links on right (About, Services, Experience, Contact)
- Mobile: Hamburger menu
- States: Active link has accent underline

**Hero Section:**
- Large greeting: "Hi, I'm Micah"
- Title: "Your Reliable Virtual Assistant"
- Subtitle describing value proposition
- Two CTAs: "View My Work" (primary), "Get in Touch" (outline)

**Service Cards:**
- Icon
- Service title
- Brief description (2-3 lines)
- Hover: lift + shadow increase

**Experience Timeline:**
- Vertical timeline with cards
- Year badge, company, role, description

**Skill Tags:**
- Pill-shaped tags
- Categories: Tools, Skills, Languages

**Testimonial Cards:**
- Quote text
- Client name and company

**Contact Form:**
- Name, Email, Message fields
- Submit button with accent color
- Social links

---

## 3. Functionality Specification

### Core Features

1. **Smooth Scroll Navigation** - Clicking nav links smoothly scrolls to sections
2. **Mobile Responsive Menu** - Hamburger toggle for mobile nav
3. **Contact Form** - Form validation (client-side), success message on submit
4. **Scroll Animations** - Elements fade in as they enter viewport
5. **Social Links** - Clickable links

### Content

**Hero:**
- "Hi, I'm Micah B. Guevarra"
- "Your Reliable Virtual Assistant + Corporate Professional + ESL Teacher"
- "Helping businesses thrive with organized, efficient, and friendly support."

**About:**
- Brief intro about being a dedicated professional with diverse background

**Services:**
1. **Virtual Assistant Services** - Administrative tasks, email management, calendar scheduling, data entry, research
2. **Corporate Support** - Document preparation, meeting coordination, project assistance
3. **ESL Teaching** - English language tutoring, conversation practice, business English

**Skills:**
- Tools: Google Workspace, Microsoft Office, Slack, Trello, Asana, Zoom, Canva
- Skills: Email Management, Calendar Management, Data Entry, Research, Customer Service
- Languages: English (Native), Filipino/Tagalog (Native)

---

## 4. Acceptance Criteria

- [ ] Page loads without errors
- [ ] All sections visible and properly styled
- [ ] Navigation links scroll smoothly to correct sections
- [ ] Mobile menu works on small screens
- [ ] Contact form validates required fields
- [ ] Responsive design works on all breakpoints
- [ ] All fonts load correctly
- [ ] Color scheme matches spec
- [ ] Hover effects work on interactive elements
- [ ] No console errors
