#ifndef IncubatorStepper_h
#define IncubatorStepper_h

#include <AccelStepper.h>
#include <Arduino.h>
#include <NTPClient.h>

class IncubatorStepper {
  public:
    IncubatorStepper(int step, int dir);
    void loop();
    void setInterval(time_t interval);
    void setSteps(unsigned int steps);
    void setMaxSpeed(float speed);
    void setAcceleration(float acceleration);
  
  private:
    AccelStepper _stepper;
    time_t _interval;
    unsigned int _steps;
    bool _checkInterval();
    bool _checkShouldReturn();
};

#endif