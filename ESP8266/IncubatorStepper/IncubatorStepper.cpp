#include <AccelStepper.h>
#include <IncubatorStepper.h>
#include <NTPClient.h>

IncubatorStepper::IncubatorStepper(int step, int dir, NTPClient timeClient) {
  this->_stepper = AccelStepper(AccelStepper::DRIVER, step, dir);
  this->_timeClient = &timeClient;
}

void IncubatorStepper::loop() {
  if (this->_checkInterval()) {
    this->_stepper.moveTo(this->_steps);
  }

  if (this->_checkShouldReturn()) {
    this->_stepper.moveTo(0);
  }

  if (this->_stepper.distanceToGo() != 0) {
    this->_stepper.run();
  }
}

void IncubatorStepper::setInterval(time_t interval) {
  this->_interval = interval;
}

void IncubatorStepper::setSteps(unsigned int steps) {
  this->_steps = steps;
}

void IncubatorStepper::setMaxSpeed(float speed) {
  this->_stepper.setMaxSpeed(speed);
}

void IncubatorStepper::setAcceleration(float acceleration) {
  this->_stepper.setAcceleration(acceleration);
}

bool IncubatorStepper::_checkShouldReturn() {
  return this->_stepper.currentPosition() == this->_steps;
}

bool IncubatorStepper::_checkInterval() {
  static time_t lastTime = 0;
  const time_t cur = this->_timeClient->getEpochTime();
  const time_t diff = cur - lastTime;

  if (lastTime == 0) {
    lastTime = cur;
  }

  if (diff < this->_interval) {
    return false;
  }

  lastTime = cur;
  return true;
}