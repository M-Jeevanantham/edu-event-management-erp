import Registration from '../Models/Registration.js';
import User from '../Models/User.js';
import Event from '../Models/eventsModel.js'
// import EventRequest from '../Models/resourceRequestModel.js'
import asyncHandler from 'express-async-handler';
import EventRequest from '../Models/eventRequestModel.js';
import ResourceRequest from '../Models/resourceModel.js'



export const getAllEvents = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const events = await Event.find({
    status: "upcoming",
    $or: [
      { registeredStudents: { $exists: false } },
      { registeredStudents: { $size: 0 } },
      { registeredStudents: { $ne: studentId } },
    ],
  })
    .populate("assignedEducator.educator", "name email") // populate educator details
    .populate("assignedResources.resource", "name")       // populate resources if needed
    .sort({ date: 1 }); // Optional: sort by upcoming date

  res.status(200).json(events);
});

export const getRegisteredEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ registeredStudents: req.user._id });
  res.status(200).json(events);
});

export const submitFeedback = asyncHandler(async (req, res) => {
  const { eventId, rating, comment } = req.body;

  const event = await Event.findById(eventId);
  if (!event || !event.registeredStudents.includes(req.user._id)) {
    res.status(400);
    throw new Error('You are not registered for this event');
  }

  const feedback = await Feedback.create({
    event: eventId,
    student: req.user._id,
    rating,
    comment,
  });

  event.feedbacks.push(feedback._id);
  await event.save();

  res.status(201).json({ message: 'Feedback submitted', feedback });
});

export const getEventStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id)
    .populate('assignedEducator.educator', 'name')
    .populate('assignedResources.resource', 'name');

  if (!event || !event.registeredStudents.includes(req.user._id)) {
    res.status(403);
    throw new Error('You are not registered for this event');
  }

  res.status(200).json({
    title: event.title,
    status: event.status,
    educator: event.assignedEducator.educator,
    assignedResources: event.assignedResources,
    date: event.date,
    location: event.location,
  });
});


export const updateRegistrationStatus = async (req, res) => {
  const { registrationId } = req.params;
  const { status } = req.body; // should be either 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const registration = await Registration.findById(registrationId).populate('student', 'name email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;
    await registration.save();

    res.status(200).json({
      message: `Registration ${status} successfully`,
      student: registration.student,
      event: registration.event,
      status: registration.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating registration', error: error.message });
  }
};

export const registerForEvent = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { eventId } = req.body;

  // Validate input
  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Check capacity
  if (event.registeredStudents.length >= event.capacity) {
    return res.status(400).json({ message: "Event has reached full capacity" });
  }

  // Check duplicate registration
  const alreadyRegistered = await Registration.findOne({
    event: eventId,
    student: studentId,
  });
  if (alreadyRegistered) {
    return res.status(400).json({ message: "You are already registered for this event" });
  }

  // Create registration record
  const registration = await Registration.create({
    event: eventId,
    student: studentId,
  });

  // Add student to event's registeredStudents array (preventing duplicates)
  if (!event.registeredStudents.includes(studentId)) {
    event.registeredStudents.push(studentId);
    await event.save();
  }

  res.status(201).json({
    message: "✅ Registration successful",
    registration,
  });
});


export const requestNewEvent = asyncHandler(async (req, res) => {
  const { title, description, preferredDate, requestedResources = [] } = req.body;

  if (!title || !preferredDate) {
    return res.status(400).json({ message: "Title and Preferred Date are required." });
  }

  const request = await EventRequest.create({
    title,
    description,
    preferredDate,
    requestedResources, // Array of { resourceId, count }
    requestedBy: req.user._id,
    role: req.user.role, // typically 'student'
  });

  res.status(201).json({
    message: "Event and resource request submitted successfully.",
    request,
  });
});


export const requestNewEventWithResources = asyncHandler(async (req, res) => {
  const { title, description, preferredDate, requestedResources } = req.body;

  // Validation
  if (!title || !preferredDate || !Array.isArray(requestedResources) || requestedResources.length === 0) {
    res.status(400);
    throw new Error("Title, preferred date, and at least one resource are required.");
  }

  // Validate and transform resource array
  const transformedResources = [];

  for (const item of requestedResources) {
    if (
      !item ||
      typeof item !== "object" ||
      !item.resourceId ||
      typeof item.count !== "number" ||
      item.count <= 0
    ) {
      console.log("Invalid resource entry:", item);
      res.status(400);
      throw new Error("Each resource must have a valid resource ID and quantity.");
    }

    transformedResources.push({
      resource: item.resourceId,
      quantity: item.count,
    });
  }

  // Create the event request document
  const newRequest = await EventRequest.create({
    requestedBy: req.user._id,
    title,
    description,
    preferredDate,
    requestedResources: transformedResources,
    status: "pending", // default
  });
  console.log(newRequest)
  res.status(201).json({
    message: "✅ Event and resource request submitted successfully.",
    request: newRequest,
  });
});
// controllers/studentController.js

// controllers/studentController.js
export const getMyEventRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requests = await EventRequest.find({ requestedBy: userId })
    .populate("requestedResources.resource", "name")
    .populate("approvedEducator", "name email contact") // ✅ Add this line
    .sort({ createdAt: -1 });

  res.status(200).json(requests);
});

export const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const studentId = req.user._id;

  const event = await Event.findById(eventId)
    .populate('assignedEducator.educator', 'name email')
    .populate('assignedResources.resource', 'name');

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  // Optional: prevent access if already registered
  // if (event.registeredStudents.includes(studentId)) {
  //   res.status(400);
  //   throw new Error("You are already registered for this event");
  // }

  res.status(200).json({
    _id: event._id,
    title: event.title,
    description: event.description,
    date: event.date,
    location: event.location,
    capacity: event.capacity,
    educator: event.assignedEducator?.educator,
    assignedResources: event.assignedResources,
  });
});