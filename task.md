Act as an expert front-end developer and UI/UX designer. I need you to build a robust, highly performant, and responsive client-side web application for managing academic deadlines and to-dos. 

Please provide the complete, functional code separated into three files: `index.html`, `styles.css`, and `script.js`.

### Core Architecture & UI/UX Requirements
1. **Views:** The app must have a toggle to switch seamlessly between a "Calendar View" (default, standard monthly grid) and a "List View" (chronological list of upcoming tasks). 
2. **Subject Categories & Color-Coding:** - Pre-populate the app with these default subjects, each with a distinct, modern hex color code: CompSys, ProjMan, HCI, SysInt, Analytics, E-Commerce.
   - Allow the user to add new subjects and pick a color for them.
   - Tasks must visually display this color-coding in both the Calendar and List views.
3. **Task Types:** Users need to distinguish between a "To-Do" and a "Due Date" (e.g., using a small icon or a badge).
4. **Header/Greeting:** Include a clean header at the top that says "Welcome back, John Darev" along with the View Toggle, a Search Bar, and a Filter dropdown.

### Interaction & Functionality (Calendar View)
1. **Click-to-Open Modal:** Clicking on any day square in the calendar must open a centered modal overlay.
2. **Modal Content:** - Display the selected date at the top.
   - Show a list of all items (to-dos and dues) for that specific day.
   - Include an intuitive "Add New Task" form inside the modal containing: Task Title (text), Type (radio: To-Do or Due), Subject (dropdown), and Description (textarea).
3. **CRUD Operations:** Inside the modal, users must be able to Edit or Delete existing tasks. Clicking "Delete" must trigger a confirmation prompt before removing the item.

### Search, Filter, & Data
1. **Filtering & Searching:** - A live search bar to query task titles and descriptions as the user types.
   - A filter dropdown to view tasks by specific Subject or Type (To-do vs. Due Date).
   - These should update both the Calendar and List views dynamically without page reloads.
2. **Data Persistence:** Use the browser's `localStorage` to save all tasks, subjects, and colors so data is retained upon page refresh.

### Polish, Performance, & Responsiveness (CRITICAL)
1. **Animations & Transitions:** - Modal should have a smooth fade-in and scale-up effect.
   - View switching (Calendar to List) should use a sliding or fading transition.
   - Add subtle hover states (color slight darkening, slight scale/transform) for buttons, calendar day cells, and task items.
2. **Efficient Loading & Rendering:** - Use event delegation for the calendar grid clicks to save memory.
   - Re-render only the necessary parts of the DOM when a task is added or deleted, avoiding full calendar re-draws when possible.
   - Keep CSS and JS lightweight and optimized.
3. **Responsive Design:** - Use CSS Grid/Flexbox with mobile-first media queries.
   - On small screens, the calendar grid should adapt gracefully (e.g., shrinking text, hiding descriptions, or switching to a card-based layout).
   - Ensure all buttons, modal inputs, and touch targets are adequately sized for mobile devices.
4. **Validation & User Feedback (Toasts):** - Prevent form submissions with empty titles or unselected subjects, highlighting missing fields in red.
   - Implement a clean, animated toast notification system (sliding in from bottom/side) for feedback like: "Task added successfully," "Task deleted," etc.