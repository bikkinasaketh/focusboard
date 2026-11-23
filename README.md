# FocusBoard

FocusBoard is a responsive task-management dashboard built for the MobileFirst assessment. It uses React, Vite, JavaScript, React Hooks, CSS, Lucide React icons, and browser `localStorage`.

## Features

- Dashboard overview with live total, in-progress, completed, and completion-rate statistics
- Six starter tasks on a first visit
- Create and edit tasks using a shared form
- Delete tasks with a confirmation prompt
- Update each task to **To do**, **In progress**, or **Completed** directly from its row
- Case-insensitive, partial title search
- Combined status and priority filters, plus a clear-filters control
- Three-slide Focus Notes carousel with previous/next and direct indicators
- Task persistence across refreshes using `localStorage`
- Responsive desktop, tablet, and mobile layouts
- Semantic controls, accessible labels, keyboard focus indicators, and reduced-motion support

## Technology

- React 18
- Vite 6
- JavaScript (ES6+)
- CSS3
- React Hooks (`useState`, `useEffect`, `useMemo`)
- Lucide React
- Browser `localStorage`

## Run locally

1. Install Node.js LTS.
2. Download or clone this repository.
3. Open the project folder in a terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in the `dist` directory.

## State management and persistence

The task collection is held in React state with `useState`. Create, edit, delete, and status-change operations update that state. The visible list is derived with `useMemo` from the full task collection and the current search, status, and priority selections. Dashboard statistics are calculated from the full task collection, not from filtered results. An effect synchronizes the full task collection to `localStorage` under the key `focusboard-tasks`; saved data is loaded on startup, and starter data is used only when no usable saved array exists.

The active Focus Notes slide, form visibility, form values, and filter selections are also managed with React state.

## Responsive verification checklist

Test the running application at these viewport widths in browser developer tools:

- **1440px:** sidebar and main dashboard side by side; four overview cards; task list and notes column.
- **768px:** content reflows without horizontal overflow.
- **390px:** mobile navigation drawer, stacked cards, readable task details, and usable form controls.

Also verify create, edit, delete, all three status changes, combined search/filters, carousel controls, and persistence after a browser refresh.

## Submission links

- GitHub repository: _Add your public repository URL before submission._
- Live application: _Add your deployed HTTPS URL before submission._

## Design reference

Use the company's supplied Figma file as the visual source of truth. The illustrative images in the assignment reference guide are not a replacement for the Figma frames.
