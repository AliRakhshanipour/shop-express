const { request, response } = require('express');
const { User, Otp } = require('../user/user.model');
const { StatusCodes } = require('http-status-codes');
const createHttpError = require('http-errors');

async function sendOtpHandler(req = request, res = response, next) {
 try {
  const { mobile } = req.body;
  const code = Math.floor(Math.random() * 9000) + 1000; // Generate a 4-digit OTP

  let user = await User.findOne({ where: { mobile } });

  if (!user) {
   user = await User.create({ mobile });
  }

  const existingOtp = await Otp.findOne({ where: { userId: user.id } });

  if (existingOtp) {
   const currentTime = new Date();
   if (currentTime < existingOtp.expires_in) {
    return res.status(StatusCodes.BAD_REQUEST).json({
     message: 'Please try again in 1 minute. An OTP has already been sent.',
    });
   }
   await existingOtp.update({
    code,
    expires_in: new Date(Date.now() + 1000 * 60),
   });
  } else {
   await Otp.create({
    code,
    expires_in: new Date(Date.now() + 1000 * 60),
    userId: user.id,
   });
  }

  return res.status(StatusCodes.OK).json({
   message: 'OTP sent successfully',
   code,
  });
 } catch (error) {
  next(error);
 }
}

async function checkOtpHandler(req = request, res = response, next) {
 try {
  const { mobile, code } = req.body;

  const user = await User.findOne({ where: { mobile } });
  if (!user) {
   throw createHttpError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const otp = await Otp.findOne({ where: { userId: user.id } });
  if (!otp) {
   throw createHttpError(StatusCodes.NOT_FOUND, 'OTP not found');
  }

  const currentTime = new Date();
  if (currentTime > otp.expires_in) {
   throw createHttpError(StatusCodes.BAD_REQUEST, 'OTP has expired');
  }

  if (otp.code !== code) {
   throw createHttpError(StatusCodes.BAD_REQUEST, 'Invalid OTP code');
  }

  return res.status(StatusCodes.OK).json({
   message: 'OTP verified successfully',
  });
 } catch (error) {
  next(error);
 }
}

module.exports = {
 sendOtpHandler,
 checkOtpHandler,
};
