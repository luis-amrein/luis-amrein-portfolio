# Bookshelf design decision

Selected design: Art press, using the stacked arrangement. The books touch directly, have flat side cuts and horizontal spine curvature, and pull straight forward to viewport width. No shelf background, pages, tilt, collection labels or comparison controls remain.

The comparative prototypes are preserved in Git history on this branch (4daa630). Current implementation is in BookProjects.tsx and book-projects.css.

Animation correction: each activation receives a newer paint order, above any other book that is still returning. Its order is retained until the spring reaches the exact resting position. Hover and focus are tracked independently so one input cannot cancel the other. Reduced motion cancels any pending spring and restores the correct order immediately.

Run pnpm dev --background. Review on the homepage or /portfolio/work/ before publication.

Each project now has its own Bauhaus composition: split disc and bars, triangles and circle, nested portals, modular semicircles, stairs, concentric circles, and a circle/square rhythm. Artwork and palette are keyed by project ID, so filtering and the featured list preserve each book’s identity.
