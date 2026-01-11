import { Request, Response } from 'express';
import Routine from '../models/Routine.model';
import { AuthRequest } from '../types/auth.types';

/**
 * Get all routines for logged-in advisor
 * GET /api/routines
 */
export const getRoutines = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Build query
    const query: any = { advisor_id: advisorId };

    // Filter by semester if provided
    if (req.query.semester) {
      query.semester = req.query.semester;
    }

    // Filter by academic year if provided
    if (req.query.academic_year) {
      query.academic_year = req.query.academic_year;
    }

    // Fetch routines
    const routines = await Routine.find(query).sort({ semester: 1, academic_year: 1 });

    // Filter by day if provided (since day is in entries array)
    let filteredRoutines = routines;
    if (req.query.day) {
      filteredRoutines = routines.map(routine => {
        const filteredEntries = routine.entries.filter(
          entry => entry.day.toLowerCase() === (req.query.day as string).toLowerCase()
        );
        return {
          ...routine.toObject(),
          entries: filteredEntries
        };
      }).filter(routine => routine.entries.length > 0);
    }

    res.status(200).json({
      status: 'success',
      data: filteredRoutines,
      message: 'Routines retrieved successfully'
    });
  } catch (error: any) {
    console.error('Get routines error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch routines',
      error: error.message
    });
  }
};

/**
 * Get single routine by ID
 * GET /api/routines/:id
 */
export const getRoutineById = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const routineId = req.params.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Find routine with security check
    const routine = await Routine.findOne({
      _id: routineId,
      advisor_id: advisorId
    });

    if (!routine) {
      res.status(404).json({
        status: 'error',
        message: 'Routine not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: routine,
      message: 'Routine retrieved successfully'
    });
  } catch (error: any) {
    console.error('Get routine error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch routine',
      error: error.message
    });
  }
};

/**
 * Create new routine
 * POST /api/routines
 */
export const createRoutine = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    const { semester, academic_year, entries } = req.body;

    // Validate required fields
    if (!semester || !academic_year) {
      res.status(400).json({
        status: 'error',
        message: 'semester and academic_year are required'
      });
      return;
    }

    // Create routine
    const routine = new Routine({
      advisor_id: advisorId,
      semester,
      academic_year,
      entries: entries || []
    });

    await routine.save();

    res.status(201).json({
      status: 'success',
      data: routine,
      message: 'Routine created successfully'
    });
  } catch (error: any) {
    console.error('Create routine error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create routine',
      error: error.message
    });
  }
};

/**
 * Update routine
 * PUT /api/routines/:id
 */
export const updateRoutine = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const routineId = req.params.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Find routine with security check
    const routine = await Routine.findOne({
      _id: routineId,
      advisor_id: advisorId
    });

    if (!routine) {
      res.status(404).json({
        status: 'error',
        message: 'Routine not found'
      });
      return;
    }

    // Update allowed fields
    const allowedUpdates = ['semester', 'academic_year', 'entries'];
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (routine as any)[key] = req.body[key];
      }
    });

    await routine.save();

    res.status(200).json({
      status: 'success',
      data: routine,
      message: 'Routine updated successfully'
    });
  } catch (error: any) {
    console.error('Update routine error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update routine',
      error: error.message
    });
  }
};

/**
 * Delete routine
 * DELETE /api/routines/:id
 */
export const deleteRoutine = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const routineId = req.params.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Find and delete routine with security check
    const routine = await Routine.findOneAndDelete({
      _id: routineId,
      advisor_id: advisorId
    });

    if (!routine) {
      res.status(404).json({
        status: 'error',
        message: 'Routine not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: true,
      message: 'Routine deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete routine error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete routine',
      error: error.message
    });
  }
};

/**
 * Add entry to routine
 * POST /api/routines/:id/entries
 */
export const addRoutineEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const routineId = req.params.id;

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Find routine with security check
    const routine = await Routine.findOne({
      _id: routineId,
      advisor_id: advisorId
    });

    if (!routine) {
      res.status(404).json({
        status: 'error',
        message: 'Routine not found'
      });
      return;
    }

    // Validate entry
    const { day, time, course_code, course_name, room, type } = req.body;
    if (!day || !time || !course_code || !course_name || !room || !type) {
      res.status(400).json({
        status: 'error',
        message: 'All entry fields are required: day, time, course_code, course_name, room, type'
      });
      return;
    }

    // Add entry
    routine.entries.push({
      day,
      time,
      course_code,
      course_name,
      room,
      type
    });

    await routine.save();

    res.status(200).json({
      status: 'success',
      data: routine,
      message: 'Entry added to routine successfully'
    });
  } catch (error: any) {
    console.error('Add routine entry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add entry',
      error: error.message
    });
  }
};

/**
 * Remove entry from routine
 * DELETE /api/routines/:id/entries/:entryIndex
 */
export const removeRoutineEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const advisorId = (req as unknown as AuthRequest).advisor?.id;
    const routineId = req.params.id;
    const entryIndex = parseInt(req.params.entryIndex);

    if (!advisorId) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
      return;
    }

    // Find routine with security check
    const routine = await Routine.findOne({
      _id: routineId,
      advisor_id: advisorId
    });

    if (!routine) {
      res.status(404).json({
        status: 'error',
        message: 'Routine not found'
      });
      return;
    }

    // Validate index
    if (isNaN(entryIndex) || entryIndex < 0 || entryIndex >= routine.entries.length) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid entry index'
      });
      return;
    }

    // Remove entry
    routine.entries.splice(entryIndex, 1);
    await routine.save();

    res.status(200).json({
      status: 'success',
      data: routine,
      message: 'Entry removed from routine successfully'
    });
  } catch (error: any) {
    console.error('Remove routine entry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to remove entry',
      error: error.message
    });
  }
};
