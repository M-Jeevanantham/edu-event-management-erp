import express from 'express';
import { protect } from '../Middleware/authMiddleware.js';
import { approveStudent,  completeEventWithFeedback, getApprovedStudents, getAssignedEventDetails, getAssignedEvents, getCompletedEventsForEducator, getEducatorFeedbacks, getPendingAssignments ,getRegisteredStudentsForEvent,markAttendance,requestAdditionalResources,requestEventByEducator,respondToEventAssignment } from '../Controllers/EducatorController.js';

const router = express.Router();

router.get('/assignments/pending', protect, getPendingAssignments);
router.post('/event-response',protect,respondToEventAssignment);
router.post('/event/complete',protect,completeEventWithFeedback);
router.get('/feedbacks',protect,getEducatorFeedbacks);
router.get('/event/assigned',protect,getAssignedEvents);
router.get('/event/:eventId',protect,getAssignedEventDetails);
router.get('/completed-events',protect,getCompletedEventsForEducator);
router.post('/event-request', protect, requestEventByEducator);
router.post('/resource-request', protect, requestAdditionalResources);
router.post('/:eventId/attendance',protect,markAttendance);
router.get('/:eventId/registered-students', protect, getRegisteredStudentsForEvent);
router.post("/approved-student/:eventId",protect,approveStudent);
router.get('/approved-student/:eventId',protect,getApprovedStudents);
export default router;



/**
 * 
 * 
 * 
 * 
 */