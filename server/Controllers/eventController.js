// controllers/eventController.js
import Event from '../Models/eventsModel.js';
import asyncHandler from 'express-async-handler';
import EventRequest from '../Models/eventRequestModel.js';
import ResourceRequest from '../Models/resourceRequestModel.js';
import Resource from '../Models/resourceModel.js';


export const registerForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const alreadyRegistered = event.registeredStudents.includes(userId);
  if (alreadyRegistered) {
    res.status(400);
    throw new Error('You have already registered for this event');
  }

  const remainingSeats = event.capacity - event.registeredStudents.length;

  if (remainingSeats <= 0) {
    res.status(400);
    throw new Error('No seats available');
  }

  event.registeredStudents.push(userId);
  await event.save();

  res.status(200).json({
    message: 'Successfully registered for the event',
    remainingSeats: event.capacity - event.registeredStudents.length,
  });
});
export const getInstitutionEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event details:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    date,
    description,
    capacity,
    location,
    educatorId,
    assignedResources = []
  } = req.body;

  if (req.user.role !== 'institution') {
    res.status(403);
    throw new Error('Only institutions can create events');
  }

  if (!title || !date || !capacity || !location) {
    res.status(400);
    throw new Error('Please provide title, date, capacity, and location');
  }

  const resourceUpdates = [];

  // Handle resource assignment and update stock
  const transformedResources = [];
  for (const res of assignedResources) {
    const resource = await Resource.findById(res.resourceId);
    if (!resource) {
      res.status(404);
      throw new Error(`Resource not found: ${res.resourceId}`);
    }

    if (resource.available < res.quantity) {
      res.status(400);
      throw new Error(`Not enough availability for resource: ${resource.name}`);
    }

    // Deduct quantity
    resource.available -= res.quantity;
    resourceUpdates.push(resource.save());

    transformedResources.push({
      resource: res.resourceId,
      quantity: res.quantity
    });
  }

  const eventData = {
    title,
    date,
    description,
    capacity,
    location,
    createdBy: req.user._id,
    assignedResources: transformedResources,
  };

  if (educatorId) {
    eventData.assignedEducator = {
      educator: educatorId,
      status: "pending",
      requestedAt: new Date()
    };
  }

  const event = await Event.create(eventData);

  // Save all resource updates in parallel
  await Promise.all(resourceUpdates);

  res.status(201).json({
    message: '✅ Event created and resources updated successfully',
    event
  });
});
// GET /api/institution/events/resources
export const getAllocatedResources = asyncHandler(async (req, res) => {
  if (req.user.role !== "institution") {
    res.status(403);
    throw new Error("Only institutions can access this");
  }

  // Find events created by the institution and populate assignedResources.resource
  const events = await Event.find({ createdBy: req.user._id })
    .populate("assignedResources.resource")
    .select("title assignedResources");

  const allocatedResources = [];

  for (const event of events) {
    for (const assigned of event.assignedResources) {
      if (assigned.resource) {
        allocatedResources.push({
          resourceId: assigned.resource._id,
          name: assigned.resource.name,
          type: assigned.resource.type,
          quantityAllocated: assigned.quantity,
          eventTitle: event.title,
        });
      }
    }
  }

  res.status(200).json({ resources: allocatedResources });
});

export const getInstitutionEvents = asyncHandler(async (req, res) => {
  if (req.user.role !== 'institution') {
    res.status(403);
    throw new Error('Only institutions can view their events');
  }

  const events = await Event.find({ createdBy: req.user._id })
    .populate('assignedResources.resource')              // Populate resources
    .populate('registeredStudents', 'name email')        // Populate registered students (with name & email)
    .populate('assignedEducator.educator', 'name email'); // Optional: show assigned educator details

  res.status(200).json(events);
});
export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to update this event');
  }

  const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(updatedEvent);
});
export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to delete this event');
  }

  await event.deleteOne();
  res.status(200).json({ message: 'Event deleted successfully' });
});

export const getEventRequestsForInstitution = asyncHandler(async (req, res) => {
  if (req.user.role !== 'institution') {
    return res.status(403).json({ message: 'Only institutions can view event requests' });
  }

  // 🔁 Update here: status must be lowercase 'pending'
  const requests = await EventRequest.find({ status: 'pending' })
    .populate({
      path: 'requestedBy',
      select: '-password',
    })
    .populate('requestedResources.resource', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(requests);
});



export const getAllResourceRequests = asyncHandler(async (req, res) => {
  if (req.user.role !== 'institution') {
    return res.status(403).json({ message: 'Only institutions can view resource requests' });
  }

  const requests = await ResourceRequest.find()
    .populate('event', 'title')
    .populate('educator', 'name email')
    .populate('requestedResources.resource', 'name available');

  res.status(200).json(requests);
});

export const respondToResourceRequest = asyncHandler(async (req, res) => {
  const { requestId, decision } = req.body; // decision: 'approved' | 'rejected'

  if (req.user.role !== 'institution') {
    return res.status(403).json({ message: 'Only institutions can approve/reject resource requests' });
  }

  const request = await ResourceRequest.findById(requestId)
    .populate('requestedResources.resource');

  if (!request) return res.status(404).json({ message: 'Resource request not found' });
  if (request.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });

  request.status = decision;
  request.reviewedAt = new Date();

  if (decision === 'approved') {
    const event = await Event.findById(request.event);

    // Add each resource if available
    for (const item of request.requestedResources) {
      const resource = await Resource.findById(item.resource._id);

      if (!resource || resource.available < item.quantity) {
        return res.status(400).json({
          message: `Not enough availability for ${item.resource.name}`
        });
      }

      // Deduct availability
      resource.available -= item.quantity;
      await resource.save();

      // If resource already assigned, increase quantity
      const existing = event.assignedResources.find(
        (r) => r.resource.toString() === item.resource._id.toString()
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        event.assignedResources.push({
          resource: item.resource._id,
          quantity: item.quantity
        });
      }
    }

    await event.save();
  }

  await request.save();
  res.status(200).json({ message: `Request ${decision} successfully.` });
});


// controllers/institutionController.js


export const approveEventRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await EventRequest.findById(requestId);
  if (!request) {
    res.status(404);
    throw new Error("Event request not found");
  }

  // Update status only
  request.status = "approved";
  await request.save();

  res.status(200).json({ message: "Request approved successfully" });
});


// Reject Event Request
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await EventRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected successfully" });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
