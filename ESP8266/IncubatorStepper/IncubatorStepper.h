#ifndef IncubatorStepper_h
#define IncubatorStepper_h

#include <AccelStepper.h>
#include <NTPClient.h>

class IncubatorStepper {
  public:
    IncubatorStepper(int step, int dir, NTPClient timeClient);
    void loop();
    void setInterval(time_t interval);
    void setSteps(unsigned int steps);
    void setMaxSpeed(float speed);
    void setAcceleration(float acceleration);
  
  private:
    AccelStepper _stepper;
    NTPClient* _timeClient;
    time_t _interval;
    unsigned int _steps;
    bool _checkInterval();
    bool _checkShouldReturn();
};

#endif