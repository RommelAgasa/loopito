import Passcode from '../models/Passcode.js';

// Create a new passcode
export const createPasscode = async (req, res) => {
  try {
    const { code, expirationDays } = req.body;

    if (!code || !expirationDays) {
      return res.status(400).json({
        success: false,
        message: 'Passcode and expiration days are required',
      });
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + parseInt(expirationDays));

    const passcode = new Passcode({
      code,
      dateCreated: new Date(),
      validityDay: expirationDate.toISOString(),
      status: 1, // 1 = active, 0 = inactive/used
    });

    await passcode.save();

    res.status(201).json({
      success: true,
      message: 'Passcode created successfully',
      passcode: {
        _id: passcode._id,
        code: '••••••••', // Don't send actual code back
        expirationDate: passcode.validityDay,
        status: passcode.status,
      },
    });
  } catch (err) {
    console.error('Create passcode error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create passcode',
    });
  }
};

// Get all passcodes
export const getAllPasscodes = async (req, res) => {
  try {
    const passcodes = await Passcode.find().sort({ dateCreated: -1 });

    const formattedPasscodes = passcodes.map(p => ({
      _id: p._id,
      code: '••••••••', // Don't expose actual codes
      expirationDate: p.validityDay,
      status: p.status,
      dateCreated: p.dateCreated,
    }));

    res.json({
      success: true,
      passcodes: formattedPasscodes,
    });
  } catch (err) {
    console.error('Get passcodes error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch passcodes',
    });
  }
};

// Delete a passcode
export const deletePasscode = async (req, res) => {
  try {
    const { id } = req.params;

    const passcode = await Passcode.findByIdAndDelete(id);

    if (!passcode) {
      return res.status(404).json({
        success: false,
        message: 'Passcode not found',
      });
    }

    res.json({
      success: true,
      message: 'Passcode deleted successfully',
    });
  } catch (err) {
    console.error('Delete passcode error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete passcode',
    });
  }
};

// Verify a passcode (for signup/login)
export const verifyPasscode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Passcode is required',
      });
    }

    const passcode = await Passcode.findOne({ code });

    if (!passcode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid passcode',
      });
    }

    const now = new Date();
    const expirationDate = new Date(passcode.validityDay);

    if (now > expirationDate) {
      return res.status(401).json({
        success: false,
        message: 'Passcode has expired',
      });
    }

    if (passcode.status === 0) {
      return res.status(401).json({
        success: false,
        message: 'Passcode has been used',
      });
    }

    res.json({
      success: true,
      message: 'Passcode is valid',
    });
  } catch (err) {
    console.error('Verify passcode error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to verify passcode',
    });
  }
};