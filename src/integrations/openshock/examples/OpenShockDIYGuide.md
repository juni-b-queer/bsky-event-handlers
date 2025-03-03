# OpenShock and Shock Bot setup guide

## Steps
 - [OpenShock setup](#openshock-setup)
   - [Parts](#parts)
   - [Hardware assembly](#hardware-assembly)
   - [Flashing firmware](#flashing-firmware)
   - [Adding the hub to your OpenShock account](#adding-the-hub-to-your-account)
   - [Pairing a shocker](#pairing-a-shocker)
 - [Bot Setup](#bot-setup)
   - [Jetstream setup](#jetstream-setup)
   - [Docker setup](#docker-setup)
   - [Build and configure locally](#build-and-configure-locally)

## OpenShock setup

### Parts
**Microcontroller** - You’ll need a wifi enabled microcontroller, I recommend the [Seeed XIAO ESP32S3](https://www.seeedstudio.com/XIAO-ESP32S3-p-5627.html) and will be using it for the tutorial, but Openshock has a list of other [compatible devices](https://wiki.openshock.org/hardware/boards/).

**RF Transmitter** - The shockers are controlled on the 433Mhz radio frequency, so you’ll need a transmitter. Open shock recommends [this transmitter/receiver kit](https://www.aliexpress.us/item/2251832634295432.html), though you’ll only need the transmitter. I will be using [this type of transmitter](https://www.aliexpress.us/item/3256804672385982.html) for the tutorial, but any generic 433Mhz transmitter should work.

**Shockers** - [These are the shockers](https://www.aliexpress.us/item/3256804946732233.html) recommended by openshock. I recommend the 3 pack, because it's a better deal.

### Hardware assembly

Either on a breadboard or soldered,
- Connect VCC to the 3V3 rail of the microcontroller 
- Connect GND to GND of the microcontroller 
- Connect the Data pin to GPIO2 (D1) of the microcontroller

![Wiring diagram of the above connection description](./board_wiring_diagram.png)


### Flashing firmware
(*Work in progress*)

[//]: # (idk if i really need to or want to do more here. as i was working on the other sections i realized i'm just rewriting existing guides)

- Plug in the microcontroller and use [this web based Flash Tool](https://next.openshock.app/flashtool)
- For more information, see the [OpenShock guide](https://wiki.openshock.org/guides/openshock-how-to-flash-your-board/#what-you-need)
### Adding the hub to your account

For the following steps, you'll need your smartphone and an OpenShock account. You should have the [dashboard](https://openshock.app/#/dashboard/home) open on a computer (or device other than your phone).

- Ensure the device is plugged in and powered on
- On your phone, connect to the Wi-Fi network named similar to `OpenShock-XX:XX:XX:XX:XX:XX`
  - If your phone complains about it not having internet, choose the option to connect anyway 
- Open your phone web browser and go to `10.10.10.10`
- Connect to your Wi-Fi
  - Find your Wi-Fi network in the mobile UI and press the green button next to it
  - Type in your Wi-Fi password and press submit
- In the mobile UI, enter the number 2 if a different number is prefilled, the press the Set button
- Pair the hub
  - On the OpenShock dashboard, go to the [Hubs](https://openshock.app/#/dashboard/devices) tab
  - At the bottom right, click the green + button
  - A new hub will appear in your account. On the right of the new shocker, click the 3 dots button, and in the dropdown menu, click pair.
  - In the browser on your phone, enter the pair code in the field and click Pair

If it all worked, there should be a green status icon next to the new hub!



### Pairing a shocker
- In the Openshock dashboard, go to Shockers, click the green + icon. Select the new hub, give the shocker  a name, and save it.
- With your physical shocker device, hold the power button until it beeps and flashes rapidly.
- Back on the dashboard, click the vibrate button on the new shocker. This should cause your shocker to vibrate, and thus be paired.


### Get an API key

## Bot setup 
***The bot is a work in progress*** 
See the setup README [here](https://github.com/juni-b-queer/bsky-shock-bot)