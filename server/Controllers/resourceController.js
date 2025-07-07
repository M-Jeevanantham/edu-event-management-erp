import Resource from '../Models/resourceModel.js';
import asyncHandler from 'express-async-handler';
import Event from '../Models/eventsModel.js';
import mongoose from 'mongoose';
// POST /api/institution/resources
export const createResource = asyncHandler(async (req, res) => {
  const { name, type, description, total, available } = req.body;

  if (!name || !type || total == null || available == null) {
    res.status(400);
    throw new Error('All required fields must be provided');
  }

  const resource = await Resource.create({ name, type, description, total, available });

  res.status(201).json({ message: 'Resource created successfully', resource });
});

export const getAvailableResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find(); // You can filter by availability if needed
  res.status(200).json(resources);
});
export const assignResourcesToEvent = asyncHandler(async (req, res) => {
  const { eventId, resources } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Convert current assignments to Map for lookup
  const existingResourcesMap = new Map();
  event.assignedResources.forEach((res) => {
    existingResourcesMap.set(res.resource.toString(), res.quantity);
  });

  for (const item of resources) {
    const { resourceId, quantity } = item;

    if (
      !mongoose.Types.ObjectId.isValid(resourceId) ||
      typeof quantity !== 'number' ||
      quantity <= 0
    ) {
      return res.status(400).json({ message: 'Invalid resource data' });
    }

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: `Resource ${resourceId} not found` });
    }

    const previouslyAssignedQty = existingResourcesMap.get(resourceId) || 0;
    const difference = quantity - previouslyAssignedQty;

    // If increasing the quantity, ensure enough availability
    if (difference > 0 && resource.available < difference) {
      return res.status(400).json({
        message: `Not enough availability for resource "${resource.name}". Available: ${resource.available}, Requested Additional: ${difference}`,
      });
    }

    // Update availability (increase or decrease based on difference)
    resource.available -= difference;
    await resource.save();

    // Update Map with new quantity
    existingResourcesMap.set(resourceId, quantity);
  }

  // Final update to event resources
  event.assignedResources = Array.from(existingResourcesMap.entries()).map(
    ([resourceId, quantity]) => ({
      resource: resourceId,
      quantity,
    })
  );

  await event.save();

  res.status(200).json({
    message: 'Resources assigned or updated successfully',
    event,
  });
});