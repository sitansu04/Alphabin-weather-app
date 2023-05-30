const express = require("express");

const ipSave = async (req, res, next) => {
  try {
    const ip = req.socket.remoteAddress;
    req.body.ip = ip;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  ipSave,
};
