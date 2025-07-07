// routes/registrationRoutes.js
import express from 'express';
import { updateRegistrationStatus ,registerForEvent, getAllEvents, getRegisteredEvents, submitFeedback, getEventStatus, requestNewEventWithResources,  getMyEventRequests, getEventById} from '../Controllers/registrationController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { getAvailableResources } from '../Controllers/resourceController.js';

const router = express.Router();

router.patch('/:registrationId/status', protect, updateRegistrationStatus);
router.post('/register', protect, registerForEvent);
router.get('/events',protect,getAllEvents);
router.get('/events/registered',protect,getRegisteredEvents);
router.post('/events/feedback',submitFeedback);
router.post('/request-event',protect,requestNewEventWithResources);
router.get('/events-update',protect,getEventStatus);
router.get('/resources',protect,getAvailableResources);
router.get('/my-requests',protect,getMyEventRequests)
router.get('/event/:eventId', protect, getEventById);

export default router;
