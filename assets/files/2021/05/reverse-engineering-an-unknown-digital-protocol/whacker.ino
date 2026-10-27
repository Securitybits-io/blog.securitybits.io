#include <SoftwareSerial.h>

#define MAXPINS 12
#define PEAKDELAY 30
#define BAUDRATE 19200
#define SER_TX 18
#define SER_RX 19
#define PIN_READ 13
#define PIN_MONITOR 14

int state = 0;
int peak_count;
int peak_state;
int top_level = 1;
int current_level = 1;

char inData;
String strBuf;
String str;
unsigned long peak_start = 0;

String pins_used[12] = {"[ ]","[ ]","[ ]","[ ]","[ ]","[ ]","[ ]","[ ]","[ ]","[ ]","[ ]","[ ]"};
int candidates[6] = {2, 2, 2, 2, 2, 2};
int pins[6] = {0, 0, 0, 0, 0, 0};

SoftwareSerial target(SER_RX, SER_TX);

void setup() {
  Serial.begin(BAUDRATE);

  pinMode(PIN_READ, INPUT);
  pinMode(PIN_MONITOR, OUTPUT);
  digitalWrite(PIN_MONITOR, LOW);

  for (int i=2;i<MAXPINS+1;i++){
    pinMode(i, OUTPUT);
    digitalWrite(i, LOW);
    }

  Serial.println("Ready");
  target.begin(19200);
}

void set_used_pins(int pin){
  if (pins_used[pin-1] == "[ ]")
    pins_used[pin-1] = "[*]";
  }

void print_status(){
  for (int i=0;i<2;i++) Serial.println("\r");
  Serial.print("Used Pins: ");
  for (int i=0;i<12;i++){
    Serial.print(pins_used[i]);
    Serial.print(" ");
  }
  Serial.println("\r");
  Serial.println("------------------");
  Serial.print("Peaks: 1 2 3 4 5 6  ");
  Serial.print("| Level: ");
  Serial.println(current_level);
  Serial.print("Pins : ");

  for (int i=0;i<6;i++){
    Serial.print(pins[i]);
    Serial.print(" ");
    }

  Serial.print(" | Top: ");
  Serial.print(top_level);
  Serial.println("/50");
}

void peak(int pin){
    digitalWrite(pin, HIGH);
    delay(PEAKDELAY);
    digitalWrite(pin, LOW);
  }

void whack(int pin){
    digitalWrite(PIN_MONITOR, HIGH);
    if (pins[pin] != 0) {
      peak(pins[pin]);
    } else {
      peak(candidates[pin]);
    }
    digitalWrite(PIN_MONITOR, LOW);
  }

void hit(){
    if (pins[peak_state] == 0){
        int candidate = candidates[peak_state];
        set_used_pins(candidate);
        pins[peak_state] = candidate;
      }
    print_status();
    current_level++;
    if (current_level > top_level)
      top_level++;
  }

void miss(){
    candidates[peak_state] = candidates[peak_state] + 1;

    if (candidates[peak_state] > 12){
      Serial.println("INVALID PIN.... Resetting to 2");
      candidates[peak_state] = 2;
    }

    print_status();
    current_level = 0;
  }

void loop() {
  while(target.available()){
    inData = target.read();
    strBuf += inData;
    }

  if (strBuf.endsWith(F("\n"))){
    strBuf.trim();
    if (strBuf.length() > 0) { str = strBuf; }
    strBuf = "";
    }

  if (str.indexOf(F("missed")) >= 0) {
    miss();
    str = "";
    target.write("\r");

  } else if (str.indexOf(F("whacked")) >= 0) {
    hit();
    str = "";

  } else if (str.indexOf(F("When you are ready")) >= 0) {
    Serial.println("Start the game");
    delay(500);
    print_status();
    str = "";
    target.write("\r");
  }

  int value = digitalRead(PIN_READ);
  if (value != state){
    state = value;
    if (state == 1){
      peak_start = millis();
      peak_count++;
      }
    }

  if (state == 0 && peak_start && peak_start + 100 < millis()){
    peak_state = peak_count - 1;
    whack(peak_state);
    peak_start = 0;
    peak_count = 0;
    }
}
