# MiiTempReader

This script reads the temperature and humidity values from the Xiaomi "Temperature and Humidity Monitor 2" Aka. LYWSD03MMC aka. MiaoMiaoCe without any alternative firmware.

I found a bunch of python implementations, but not many NodeJs ones.

The code use the Node-BLE library what have some permission setup need before use, make sure you installed it correctly.
https://www.npmjs.com/package/node-ble

Also make sure you update the Bluetooth MAC address (XX:XX:XX:XX:XX:XX) in line 11 of your device, duh.

That's it.