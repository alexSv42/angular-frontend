
Mykhailo Riabets
Attachments
10:04 AM (14 minutes ago)
to me

GOAL

Create a single-page web application using the latest Angular version that displays and manages a list of users loaded from a local JSON file. The task focuses on reactive thinking, data handling, and UI state management. Visual design is not important.

────────────────────────────────────────

INPUT DATA
You will be provided with a file:

 

/assets/mock_data.json

 

The file contains:

- users – list of 1000 users

- dictionaries:

  - positions

  - levels

  - tech

  - employmentTypes

 

Users reference dictionary items by ID (for example: positionId, levelId, primaryTechId).

────────────────────────────────────────

FUNCTIONAL REQUIREMENTS
 

1. APPLICATION SETUP

- Create a new Angular SPA (latest version).

- Use standalone components.

- Load data using HttpClient from /assets/mock_data.json.

────────────────────────────────────────

2. DATA PREPARATION

- Load the JSON file only once.

- Build lookup maps for dictionaries to resolve readable values:

  - position name

  - level name

  - primary technology name

  - employment type name

- Avoid recalculating these mappings on every render.

────────────────────────────────────────

3. USERS TABLE

Display a table with at least the following columns:

- Full name

- Email

- Position

- Level

- Primary technology

- Employment type

- Age

- Monthly salary (EUR)

────────────────────────────────────────

4. FILTERS PANEL (ABOVE THE TABLE)

 

TEXT FILTERS 

- Name search (matches first name OR last name, single input)

- Email search

 

Note:

Even though data is local, filtering should be treated as an asynchronous request.

────────────────────────────────────────

MULTI-SELECT FILTERS

Use dropdowns or multi-select controls for:

- Position

- Technology

  - A user matches if primary technology OR any secondary technology matches

- Level

- Employment type

 

Rules:

- Changing any filter resets pagination or infinite scroll state.

────────────────────────────────────────

5. SORTING

- Sorting by one column at a time.

- Clicking a column header toggles ascending / descending order.

- Must include sorting for:

  - salary

  - age

  - name

  - email

────────────────────────────────────────

6. RESULT DISPLAY MODES

Add a UI toggle to switch between two modes.

 

MODE A – CLASSIC PAGINATION

- Fixed page size: 20

- Show:

  - current page

  - total results count

- Previous / Next controls are sufficient.

 

MODE B – INFINITE SCROLL

- Load initial 20 users.

- Load next chunk when scrolling near the bottom.

- Prevent duplicate loads while loading.

- Stop loading when no more data is available.

 

Preferred:

- IntersectionObserver sentinel

 

Acceptable:

- Scroll event with throttling

────────────────────────────────────────

7. UX STATES

- Loading state

- Empty results state

- Basic error handling for failed data load

 

Styling can be minimal OR just UI library default components.

────────────────────────────────────────

TECHNICAL EXPECTATIONS

- State handling and management.

- Combine filters, sorting, and paging in a clean reactive pipeline.

- Avoid heavy logic in templates.

- Clean up subscriptions and observers properly.

────────────────────────────────────────

CONSTRAINTS

- No backend.

- No authentication.

- Focus on correctness and code clarity.

────────────────────────────────────────

DELIVERABLES

- Working Angular application.

- Readable, logically structured code.

- Short README explaining:

  - how to run the application

  - what was implemented

────────────────────────────────────────

BONUS (OPTIONAL, IF TIME ALLOWS)

- Persist filters and mode in URL query parameters

OR

- Add a small unit test for filtering or sorting logic.

────────────────────────────────────────

EVALUATION CRITERIA

- Data modeling and transformation approach

- Reactive programming quality

- Correct handling of pagination and infinite scroll

- Code readability and maintainability

- Overall problem-solving approach under time constraints