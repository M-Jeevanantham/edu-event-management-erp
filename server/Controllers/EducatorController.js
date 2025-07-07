import User from '../Models/User.js';
import asyncHandler from 'express-async-handler';
import Event from '../Models/eventsModel.js'
import mongoose from 'mongoose';
import Feedback from '../Models/feedbackModel.js';
import EventRequest from '../Models/eventRequestModel.js';
import ResourceRequest  from '../Models/resourceRequestModel.js';


export const getAllEducators = asyncHandler(async (req, res) => {
  if (req.user.role !== 'institution') {
    res.status(403);
    throw new Error('Only institutions can view educators');
  }

  const educators = await User.find({ role: 'educator' }).select('-password');
  res.status(200).json(educators);
});

export const assignEducatorToEvent = asyncHandler(async (req, res) => {
  const { eventId, educatorId } = req.body;

  if (req.user.role !== 'institution') {
    res.status(403);
    throw new Error('Only institutions can assign educators');
  }

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const educator = await User.findById(educatorId);
  if (!educator || educator.role !== 'educator') {
    res.status(400);
    throw new Error('Invalid educator');
  }

  event.assignedEducator = {
    educator: educatorId,
    status: 'pending',
    requestedAt: new Date()
  };

  await event.save();

  res.status(200).json({ message: 'Educator assignment request sent', event });
});
// controllers/educatorController.js

export const getPendingAssignments = asyncHandler(async (req, res) => {
  if (req.user.role !== 'educator') {
    res.status(403);
    throw new Error('Only educators can view assignments');
  }

  const assignments = await Event.find({
    'assignedEducator.educator': req.user._id,
    'assignedEducator.status': 'pending'
  }).populate('createdBy', 'name email') 
    .select('title date location assignedEducator'); 

  res.status(200).json({ pendingAssignments: assignments });
});

export const respondToEventAssignment = asyncHandler(async (req, res) => {
  const { eventId, status } = req.body;

  // 1. Validate event ID
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  // 2. Validate status
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be "accepted" or "rejected"' });
  }

  // 3. Ensure only educators can respond
  if (req.user.role !== 'educator') {
    return res.status(403).json({ message: 'Only educators can respond to assignments' });
  }

  // 4. Find event and populate assigned educator
  const event = await Event.findById(eventId).populate('assignedEducator.educator', 'name email');

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // 5. Verify assigned educator matches current user
  if (
    !event.assignedEducator ||
    !event.assignedEducator.educator ||
    event.assignedEducator.educator._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'You are not assigned to this event' });
  }

  // 6. Update response status and timestamp
  event.assignedEducator.status = status;
  event.assignedEducator.respondedAt = new Date();
  await event.save();

  // 7. Re-fetch event to get updated educator info populated
  const updatedEvent = await Event.findById(eventId).populate('assignedEducator.educator', 'name email');

  res.status(200).json({
    message: `You have successfully ${status} the event assignment.`,
    eventId: updatedEvent._id,
    assignedEducator: updatedEvent.assignedEducator
  });
});


export const completeEventWithFeedback = asyncHandler(async (req, res) => {
  const { eventId, feedbacks } = req.body;

  // 1. Validate event
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });

  // 2. Check educator permission
  if (
    !event.assignedEducator ||
    event.assignedEducator.educator.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "You are not assigned to this event" });
  }

  // 3. Validate feedbacks array
  if (!Array.isArray(feedbacks)) {
    return res.status(400).json({ message: "Feedbacks must be an array" });
  }

  const savedFeedbackIds = [];

  for (const fb of feedbacks) {
    const { student, rating, comment } = fb;

    if (!student || typeof rating !== "number") {
      return res.status(400).json({ message: "Invalid feedback format" });
    }

    const newFeedback = await Feedback.create({
      event: eventId,
      student,
      rating,
      comment,
    });

    savedFeedbackIds.push(newFeedback._id);
  }

  // 4. Update event status and feedbacks
  event.status = "completed";
  event.feedbacks = [...event.feedbacks, ...savedFeedbackIds];
  await event.save();

  // 5. Update event request status (assuming a separate EventRequest collection)
  await EventRequest.updateMany(
    { event: eventId },
    { $set: { status: "completed" } }
  );

  res.status(200).json({
    message: "Event marked as completed and feedback submitted",
    feedbackCount: savedFeedbackIds.length,
    eventId: event._id,
  });
});


// GET /api/educator/feedbacks
export const getEducatorFeedbacks = asyncHandler(async (req, res) => {
  // 1. Verify educator
  if (req.user.role !== 'educator') {
    return res.status(403).json({ message: 'Only educators can view feedbacks' });
  }

  // 2. Find completed events where educator is assigned
  const events = await Event.find({
    'assignedEducator.educator': req.user._id,
    status: 'completed',
  }).populate({
    path: 'feedbacks',
    populate: {
      path: 'student',
      select: 'name email', // Optional: show student's name/email
    }
  });

  // 3. Format response
  const result = events.map(event => ({
    eventId: event._id,
    title: event.title,
    feedbacks: event.feedbacks.map(fb => ({
      student: fb.student,
      rating: fb.rating,
      comment: fb.comment,
      createdAt: fb.createdAt,
    }))
  }));

  res.status(200).json(result);
});

// GET /api/educator/completed-events
export const getCompletedEventsForEducator = asyncHandler(async (req, res) => {
  if (req.user.role !== 'educator') {
    return res.status(403).json({ message: 'Only educators can access this endpoint' });
  }

  const completedEvents = await Event.find({
    'assignedEducator.educator': req.user._id,
    status: 'completed'
  }).select('title date location description');

  res.status(200).json({
    total: completedEvents.length,
    events: completedEvents
  });
});


export const requestEventByEducator = asyncHandler(async (req, res) => {
  const { title, date, description, location, capacity } = req.body;

  if (req.user.role !== 'educator') {
    return res.status(403).json({ message: 'Only educators can request events' });
  }

  const newRequest = await EventRequest.create({
    requestedBy: req.user._id,
    role: 'educator',
    title,
    date,
    description,
    location,
    capacity
  });

  res.status(201).json({
    message: 'Event request submitted successfully',
    request: newRequest
  });
});


export const requestAdditionalResources = asyncHandler(async (req, res) => {
  const { eventId, requestedResources } = req.body;

  if (req.user.role !== 'educator') {
    return res.status(403).json({ message: 'Only educators can request resources' });
  }

  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  // Validate educator assignment
  if (!event.assignedEducator || event.assignedEducator.educator.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You are not assigned to this event' });
  }

  const resourceRequest = await ResourceRequest.create({
    event: eventId,
    educator: req.user._id,
    requestedResources,
  });

  res.status(201).json({
    message: 'Resource request submitted successfully',
    requestId: resourceRequest._id
  });
});


export const markAttendance = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { attendances } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const educatorId = req.user._id.toString();
  if (
    !event.assignedEducator ||
    event.assignedEducator.educator.toString() !== educatorId
  ) {
    return res.status(403).json({ message: 'You are not assigned to this event' });
  }

  if (!Array.isArray(attendances) || attendances.length === 0) {
    return res.status(400).json({ message: 'Attendance data is missing or invalid' });
  }

  const attendanceMap = new Map(
    attendances.map(({ studentId, present }) => [studentId.toString(), !!present])
  );

  // Check for students whose attendance is already marked
  const alreadyMarkedStudents = event.registeredStudentsAttendance.filter(
    (record) => record.marked && attendanceMap.has(record.student.toString())
  ).map((record) => record.student.toString());

  if (alreadyMarkedStudents.length > 0) {
    return res.status(400).json({
      message: 'Attendance already marked for some students',
      alreadyMarked: alreadyMarkedStudents,
    });
  }

  // Filter out any duplicates and add fresh entries
  const updatedAttendance = [...event.registeredStudentsAttendance];

  event.approvedStudents.forEach((studentId) => {
    const studentIdStr = studentId.toString();
    if (attendanceMap.has(studentIdStr)) {
      const present = attendanceMap.get(studentIdStr);
      updatedAttendance.push({
        student: studentId,
        present,
        marked: true,
      });
    }
  });

  event.registeredStudentsAttendance = updatedAttendance;
  await event.save();

  res.status(200).json({
    message: 'Attendance marked successfully',
    eventId: event._id,
    attendanceMarkedFor: attendanceMap.size,
  });
});


export const getAssignedEvents = asyncHandler(async (req, res) => {
  if (req.user.role !== "educator") {
    return res.status(403).json({ message: "Access denied: Educator only." });
  }

  const educatorId = req.user.id;

  const assignedEvents = await Event.find({
    "assignedEducator.educator": educatorId,
    "assignedEducator.status": "pending",
  }).select("title date time location assignedEducator");

  res.status(200).json(assignedEvents);
});


export const approveStudent = async (req, res) => {
  const { eventId } = req.params;
  const { studentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid studentId" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if student is registered
    if (!event.registeredStudents.includes(studentId)) {
      return res.status(404).json({ message: "Student not registered for this event" });
    }

    // Check if already approved
    if (event.approvedStudents.includes(studentId)) {
      return res.status(400).json({ message: "Student already approved" });
    }

    // Approve student
    event.approvedStudents.push(studentId);
    await event.save();

    res.json({ message: "Student approved successfully" });
  } catch (error) {
    console.error("Error approving student:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getRegisteredStudentsForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId)
    .populate('registeredStudents', 'name email')
    .populate('registeredStudentsAttendance.student', 'name email');

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const userId = req.user._id.toString();
  const isInstitution = req.user.role === 'institution' && event.createdBy.toString() === userId;
  const isAssignedEducator = req.user.role === 'educator' && event.assignedEducator?.educator?.toString() === userId;

  if (!isInstitution && !isAssignedEducator) {
    return res.status(403).json({ message: 'You are not authorized to view this data' });
  }

  // Get list of approved student IDs
  const approvedIds = new Set(event.approvedStudents.map((id) => id.toString()));

  // Optionally: rejectedIds (if added in schema)
  // const rejectedIds = new Set(event.rejectedStudents.map(id => id.toString()));

  const studentData = event.registeredStudents.map((student) => {
    const id = student._id.toString();
    let status = 'Pending';
    if (approvedIds.has(id)) status = 'Approved';
    // else if (rejectedIds.has(id)) status = 'Rejected';
    return {
      _id: student._id,
      name: student.name,
      email: student.email,
      status,
    };
  });

  res.status(200).json({
    eventId: event._id,
    title: event.title,
    registeredStudents: studentData,
  });
});


export const getAssignedEventDetails = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);

  if (!event) return res.status(404).json({ message: "Event not found" });

  const userId = req.user._id.toString();
  const isAssignedEducator = req.user.role === "educator" && event.assignedEducator?.educator?.toString() === userId;
  if (!isAssignedEducator) return res.status(403).json({ message: "Not authorized" });

  res.status(200).json(event);
});

export const getApprovedStudents = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId)
    .populate('registeredStudentsAttendance.student', 'name email');

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (
    req.user.role === 'educator' &&
    event.assignedEducator?.educator?.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: 'You are not authorized to view this data' });
  }

  res.status(200).json({
    approvedStudents: event.registeredStudentsAttendance,
  });
});

// route: GET /api/institution/event-requests/:id
export const getSingleEventRequest = asyncHandler(async (req, res) => {
  const request = await EventRequest.findById(req.params.id)
    .populate("requestedResources.resource", "name")
    .populate("requestedBy", "name email");

  if (!request) {
    res.status(404);
    throw new Error("Event request not found");
  }

  res.status(200).json(request);
});
