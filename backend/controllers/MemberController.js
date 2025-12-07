import Member from '../models/Member.js';

// Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
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

// Add member
export const addMember = async (req, res) => {
  const { firstname, lastname } = req.body;
  
  try {
    // Validate input
    if (!firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required',
      });
    }

    // Create new member
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

// Update member
export const updateMember = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, hasPick, isPick } = req.body;

  try {
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
        hasPick: hasPick !== undefined ? hasPick : 0,
        isPick: isPick !== undefined ? isPick : 0,
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

// Delete member
export const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
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

// Update member pick status
export const updateMemberPickStatus = async (req, res) => {
  const { id } = req.params;
  const { hasPick, isPick } = req.body;

  try {
    const member = await Member.findByIdAndUpdate(
      id,
      { 
        hasPick: hasPick !== undefined ? hasPick : undefined,
        isPick: isPick !== undefined ? isPick : undefined,
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