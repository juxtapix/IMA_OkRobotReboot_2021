int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);    // sets the pin as output
  Serial.begin(9600);        // initialize serial communications
}
 
void loop() {
 // send data only when you receive data:
 if (Serial.available() > 0) {
   // read the incoming data:
   int inByte = Serial.read(); 
   
   if (inByte == 1) {
     digitalWrite(ledPin, HIGH);  // LED on
   } else {
     digitalWrite(ledPin, LOW);   // LED off
   }
   // print received bytes
   Serial.print("Received: ");
   Serial.println(inByte);       
   delay(100);                   
 }
}
