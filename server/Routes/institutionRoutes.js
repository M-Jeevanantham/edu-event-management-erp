// routes/institutionRoutes.js
import express from "express";
import {
  createEvent,
  getInstitutionEvents,
  updateEvent,
  deleteEvent,
  getEventRequestsForInstitution,
  getAllResourceRequests,
  respondToResourceRequest,
  getInstitutionEventById,
  getAllocatedResources,
  rejectRequest,
  approveEventRequest,
} from "../Controllers/eventController.js";
import {
  createResource,
  getAvailableResources,
  assignResourcesToEvent,
} from "../Controllers/resourceController.js";
import { protect } from "../Middleware/authMiddleware.js";
import {
  getAllEducators,
  assignEducatorToEvent,
  getSingleEventRequest,
} from "../Controllers/EducatorController.js";
const router = express.Router();

router.post("/events", protect, createEvent);
router.get("/events", protect, getInstitutionEvents);
router.get("/events/:id", protect, getInstitutionEventById);
router.put("/events/:id", protect, updateEvent);
router.delete("/events/:id", protect, deleteEvent);
router.post("/resources", protect, createResource);
// routes/institutionRoutes.js
router.get("/resources/allocated", protect, getAllocatedResources);

router.get("/resources", protect, getAvailableResources);
// routes/institutionRoutes.js
router.post("/resources/assign", protect, assignResourcesToEvent);
// routes/institutionRoutes.js
router.get("/educators", protect, getAllEducators);
// routes/institutionRoutes.js
router.post("/events/assign-educator", protect, assignEducatorToEvent);

router.get("/event-requests", protect, getEventRequestsForInstitution);
router.get("/resource-requests", protect, getAllResourceRequests);
router.post("/resource-requests/respond", protect, respondToResourceRequest);
router.get("/event-requests/:id", getSingleEventRequest);
router.post("/event-approve/:requestId", approveEventRequest);
router.post("/event-reject/:requestId", rejectRequest);
export default router;
