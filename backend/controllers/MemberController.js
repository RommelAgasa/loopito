import jwt from 'jsonwebtoken';
import Member from '../models/Member.js';
import { connectToDatabase } from '../db/db.js';
import { generateToken, verifyToken } from '../middleware/auth.js';

/**
 * verify member
 */
export const verifyMember = async (req, res) => {
  const { firstname, lastname } = req.body;

  try {
    await connectToDatabase();

    if (!firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required',
      });
    }

    const member = await Member.findOne({
      firstname: { $regex: new RegExp(`^${firstname}$`, 'i') },
      lastname: { $regex: new RegExp(`^${lastname}$`, 'i') },
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    // Generate JWT only if member exists
    const token = generateToken(member);

    res.json({
      success: true,
      member,
      token
    });
  } catch (err) {
    console.error('Verify member error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to verify member',
    });
  }
};


/**
 * Get all members
 */
export const getMembers = async (req, res) => {
  try {
    await connectToDatabase();
    
    // Populate pickMember
    const members = await Member.find()
                  .populate('pickMember', 'firstname lastname')
                  .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      members,
    });
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Add a new member
 */
export const addMember = async (req, res) => {
  const { firstname, lastname } = req.body;

  try {
    await connectToDatabase(); // Ensure DB connection

    if (!firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required',
      });
    }

    const member = await Member.create({
      firstname,
      lastname,
      hasPick: 0,
      isPick: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      member,
    });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Update a member
 */
export const updateMember = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname} = req.body;

  try {
    await connectToDatabase(); // Ensure DB connection

    if (!firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required',
      });
    }

    const member = await Member.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.json({
      success: true,
      message: 'Member updated successfully',
      member,
    });
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Delete a member
 */
export const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    await connectToDatabase(); // Ensure DB connection

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully',
    });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Update member pick status
 */
export const updateMemberPickStatus = async (req, res) => {
  const { id } = req.params;
  const { hasPick, isPick, pickMember } = req.body;

  try {
    await connectToDatabase(); 

    const member = await Member.findByIdAndUpdate(
      id,
      {
        ...(hasPick !== undefined && { hasPick }),
        ...(isPick !== undefined && { isPick }),
        ...(pickMember && { pickMember }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.json({
      success: true,
      message: 'Member pick status updated',
      member,
    });
  } catch (err) {
    console.error('Update member pick status error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

